import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1/models";
const MODEL = "gemini-1.5-flash";

interface ChatRequestBody {
  message: string;
  history: { role: string; parts: any[] }[];
  images?: string[];
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
    const body = req.body as ChatRequestBody;
    const { message, history = [], images = [] } = body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
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
      return res.status(response.status).json({
        error: data.error?.message || "Failed to generate response",
      });
    }

    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Desculpe, não consegui gerar uma resposta.";

    return res.status(200).json({ response: aiResponse });
  } catch (error: any) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
