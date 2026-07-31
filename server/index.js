const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message is required.",
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: message,
        });

        res.json({
            reply: response.text,
        });
    } catch (error) {
        console.error("Gemini API error:", error);

        res.status(500).json({
            error: "Failed to get a response from Gemini.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`ChefAI server running on http://localhost:${PORT}`);
});