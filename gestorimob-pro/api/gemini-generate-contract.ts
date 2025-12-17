import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1/models";
const MODEL = "gemini-1.5-flash";

interface ContractRequestBody {
  details: string;
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
    const body = req.body as ContractRequestBody;
    const { details } = body;

    if (!details) {
      return res.status(400).json({ error: "Contract details are required" });
    }

    // Build request for contract generation
    const contents = [
      {
        role: "user",
        parts: [{ text: details }],
      },
    ];

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
      console.error("Gemini Contract Error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Failed to generate contract",
      });
    }

    const contract =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Erro ao gerar contrato.";

    return res.status(200).json({ contract });
  } catch (error: any) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
