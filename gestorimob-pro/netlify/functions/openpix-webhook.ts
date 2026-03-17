import { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// Use service key if set, otherwise fall back to the anon key (RLS is disabled on payments table)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://umuazkklbwvoxwbyraxi.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdWF6a2tsYnd2b3h3YnlyYXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDU4NDYsImV4cCI6MjA4MTEyMTg0Nn0.emBkqMb456D-yYXweqVPSLfxtwMR3_AcUD4QcDVP1hY";
const OPENPIX_APP_ID = process.env.OPENPIX_APP_ID || "";

// Woovi/OpenPix sends a webhook with this event name when a PIX is received
const CHARGE_COMPLETED_EVENT = "OPENPIX:CHARGE_COMPLETED";

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validate the webhook signature from OpenPix
  // They send x-webhook-signature with a value derived from their App ID
  const signature = event.headers["x-webhook-signature"] || event.headers["x-plugin-signature"];
  if (OPENPIX_APP_ID && signature !== OPENPIX_APP_ID) {
    console.warn("⚠️ Webhook signature mismatch — possible unauthorized request");
    // In production you may want to block this; for now we log and continue
  }

  try {
    const body = JSON.parse(event.body || "{}");
    console.log("📨 OpenPix webhook received:", JSON.stringify(body, null, 2));

    const eventType = body.event || body.type;

    if (eventType === "webhook_test") {
      // Woovi sends this when the user clicks 'Test Webhook' in their panel
      console.log("✅ Received Woovi Webhook Test");
      return { statusCode: 200, body: JSON.stringify({ success: true, message: "Webhook is working correctly!" }) };
    }

    if (eventType !== CHARGE_COMPLETED_EVENT) {
      // Not a payment completed event — ignore silently but return 200 so Woovi doesn't retry
      return { statusCode: 200, body: JSON.stringify({ ignored: true, eventType }) };
    }

    const charge = body.charge || body.pixQrCode || {};
    const pixValue = charge.value; // value in cents
    const pixTransactionId = charge.transactionID || charge.correlationID || charge.endToEndId;
    const pixComment = charge.comment || charge.additionalInfo || "";
    const amountBRL = typeof pixValue === "number" ? pixValue / 100 : parseFloat(pixValue || "0") / 100;
    const receivedAt = charge.paidAt || new Date().toISOString();

    if (!amountBRL || amountBRL <= 0) {
      return { statusCode: 200, body: JSON.stringify({ ignored: true, reason: "zero_amount" }) };
    }

    // Build a Payment record — we'll try to match the closest property by rent amount
    // The locadora can also configure a correlationID in the PIX charge for auto-matching
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Load all properties to try to match by rent amount
    const { data: propRows, error: propErr } = await supabase
      .from("properties")
      .select("id, data");

    if (propErr) {
      console.error("Failed to load properties:", propErr.message);
    }

    let matchedPropertyId = "";
    let matchedTenantId = "";

    // The payer name from Woovi's payload
    const payerName = (charge.customer?.name || charge.payer?.name || "").toLowerCase();
    
    // First: Load all tenants to attempt a name match
    const { data: tenantRows, error: tenantErr } = await supabase
      .from("tenants")
      .select("id, data");
      
    if (tenantErr) {
        console.error("Failed to load tenants:", tenantErr.message);
    }
    
    let foundTenantByPayer = null;
    if (tenantRows && tenantRows.length > 0 && payerName) {
        // Try to match the payer name to a tenant name
        foundTenantByPayer = tenantRows.find((row: any) => {
            const tName = (row.data.name || "").toLowerCase();
            // Match if the payer name contains the tenant's first/last name or vice versa
            return tName && (payerName.includes(tName) || tName.includes(payerName));
        });
    }

    if (propRows && propRows.length > 0) {
      if (foundTenantByPayer) {
         // Found tenant by name! Find which property they are currently renting
         matchedTenantId = foundTenantByPayer.id;
         const prop = propRows.find((row: any) => row.data.currentTenantId === matchedTenantId);
         if (prop) {
            matchedPropertyId = prop.id;
            console.log(`🎯 Matched PIX exactly by Payer Name: ${foundTenantByPayer.data.name} -> Prop: ${prop.data.nickname}`);
         }
      } else {
          // Fallback: Find the property whose rent amount is closest to the PIX amount
          const match = propRows.reduce((best: any, row: any) => {
            const prop = row.data;
            const diff = Math.abs((prop.rentAmount || 0) - amountBRL);
            const bestDiff = Math.abs((best?.data?.rentAmount || 0) - amountBRL);
            return diff < bestDiff ? row : best;
          }, propRows[0]);
    
          const matchedProp = match?.data;
          // Only match if within 5% of the rent amount (to avoid false matches)
          if (matchedProp && Math.abs(matchedProp.rentAmount - amountBRL) / matchedProp.rentAmount < 0.05) {
            matchedPropertyId = matchedProp.id || match.id;
            matchedTenantId = matchedProp.currentTenantId || "";
            console.log(`🎯 Matched PIX by Rent Amount Fallback: R$${amountBRL} -> Prop: ${matchedProp.nickname}`);
          }
      }
    }

    const payment = {
      id: pixTransactionId || `pix-${Date.now()}`,
      propertyId: matchedPropertyId,
      tenantId: matchedTenantId,
      amount: amountBRL,
      date: receivedAt,
      paid: true,
      type: "rent",
      source: "pix_auto",
      pixTransactionId,
      observation: pixComment ? `PIX automático: ${pixComment}` : "Pagamento PIX automático detectado"
    };

    // Save to Supabase payments table
    const { error: insertErr } = await supabase
      .from("payments")
      .upsert({ id: payment.id, data: payment }, { onConflict: "id" });

    if (insertErr) {
      console.error("❌ Failed to save payment:", insertErr.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to save payment", details: insertErr.message })
      };
    }

    console.log(`✅ PIX payment recorded: R$${amountBRL} - Property: ${matchedPropertyId || "unmatched"}`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, paymentId: payment.id, amount: amountBRL, matchedProperty: matchedPropertyId })
    };
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: error.message })
    };
  }
};
