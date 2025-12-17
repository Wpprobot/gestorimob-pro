import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1/models";
const MODEL = "gemini-1.5-flash";

interface ImageRequestBody {
  base64Image: string;
  prompt: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Check if API key is configured
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable not set");
    return res.status(500).json({
      error: "Server configuration error. Please contact administrator.",
    });
  }

  try {
    const body = req.body as ImageRequestBody;
    const { base64Image, prompt } = body;

    if (!base64Image || !prompt) {
      return res.status(400).json({ error: "Image and prompt are required" });
    }

    // Extract base64 data (remove data:image/...;base64, prefix if present)
    const base64Data = base64Image.split(",")[1] || base64Image;

    // Build request for Gemini Vision
    const contents = [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
        ],
      },
    ];

    // Call Gemini API with image and prompt
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
      console.error("Gemini Vision Error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Failed to analyze image",
      });
    }

    const analysis =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não foi possível analisar a imagem.";

    return res.status(200).json({ analysis });
  } catch (error: any) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
