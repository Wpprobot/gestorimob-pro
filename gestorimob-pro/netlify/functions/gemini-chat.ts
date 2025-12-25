import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-2.0-flash";

interface ChatRequestBody {
  message: string;
  history: { role: string; parts: any[] }[];
  images?: string[];
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
    const body: ChatRequestBody = JSON.parse(event.body || "{}");
    const { message, history = [], images = [] } = body;

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    // Build the conversation contents
    const contents = history.map((h) => ({
      role: h.role,
      parts: h.parts,
    }));

    // Build user parts with message and optional images
    const userParts: any[] = [{ text: message }];

    for (const img of images) {
      const base64Data = img.split(",")[1] || img;
      userParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    contents.push({ role: "user", parts: userParts });

    // Call Gemini API
    const response = await fetch(
      `${API_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "Failed to generate response",
        }),
      };
    }

    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Desculpe, não consegui gerar uma resposta.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ response: aiResponse }),
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
