
import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json({ limit: "20kb" }));

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

app.get("/", (_req, res) => {
  res.send("RIMON AI Backend is running!");
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "RIMON AI"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return res.status(400).json({
        error: "Please provide a message under 4000 characters."
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message.trim()
    });

    res.json({
      reply: result.text ?? "I could not generate a response."
    });
  } catch (error) {
    console.error("Gemini request failed:", error.message);

    res.status(502).json({
      error: "AI request failed. Please try again."
    });
  }
});

const port = process.env.PORT || 8787;

app.listen(port, "0.0.0.0", () => {
  console.log(`RIMON AI running on port ${port}`);
});
