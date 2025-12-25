import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-2.0-flash";

interface AnalyzeImageRequestBody {
  base64Image: string;
  prompt: string;
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
    const body: AnalyzeImageRequestBody = JSON.parse(event.body || "{}");
    const { base64Image, prompt } = body;

    if (!base64Image || !prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "base64Image and prompt are required",
        }),
      };
    }

    // Extract base64 data (remove data URL prefix if present)
    const base64Data = base64Image.split(",")[1] || base64Image;

    // Call Gemini API with image and prompt
    const response = await fetch(
      `${API_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data,
                  },
                },
                { text: prompt },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Vision Error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: data.error?.message || "Failed to analyze image",
        }),
      };
    }

    const analysis =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível analisar a imagem.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ analysis }),
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
