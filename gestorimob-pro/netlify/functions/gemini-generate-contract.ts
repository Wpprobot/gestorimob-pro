import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1/models";
const MODEL = "gemini-1.5-flash";

interface GenerateContractRequestBody {
  details: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Check if API key is configured
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable not set");
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server configuration error. Please contact administrator.",
      }),
    };
  }

  try {
    const body: GenerateContractRequestBody = JSON.parse(event.body || "{}");
    const { details } = body;

    if (!details) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Contract details are required" }),
      };
    }

    const contractPrompt = `Elabore um contrato de aluguel residencial completo e juridicamente válido segundo as leis brasileiras. 
Utilize os seguintes dados: ${details}. 
Inclua cláusulas sobre pagamento, vistoria, rescisão, multa e foro.`;

    // Call Gemini API
    const response = await fetch(
      `${API_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: contractPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Contract Error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "Failed to generate contract",
        }),
      };
    }

    const contract =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Erro ao gerar contrato.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contract }),
    };
  } catch (error: any) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
