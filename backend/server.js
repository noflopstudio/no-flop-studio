import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 10000;

const apiKey = process.env.GEMINI_API_KEY;

/* ==========================================
   MÉMOIRE
========================================== */
const memory = {};

/* ==========================================
   PROMPT YELOX CORE
========================================== */
function getSystemPrompt(mode) {
    return `
Tu es YELOX CORE, intelligence de No Flop Studio.

STYLE :
- humain, fluide, naturel
- business & digital mindset
- réponse claire

MODE : ${mode}

RÈGLES :
- rapide = court et efficace
- détaillé = structuré et pédagogique
`;
}

/* ==========================================
   ROUTE HOME
========================================== */
app.get("/", (req, res) => {
    res.json({
        status: "YELOX CORE ONLINE (GEMINI)",
        version: "3.0"
    });
});

/* ==========================================
   CHAT GEMINI
========================================== */
app.post("/api/chat", async (req, res) => {
    try {
        const { message, mode = "rapide", sessionId = "default" } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message manquant" });
        }

        if (!memory[sessionId]) {
            memory[sessionId] = [];
        }

        memory[sessionId].push({ role: "user", content: message });

        const fullPrompt = `
${getSystemPrompt(mode)}

Historique :
${memory[sessionId]
                .map(m => `${m.role}: ${m.content}`)
                .join("\n")}

Utilisateur: ${message}
`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [{ text: fullPrompt }]
                    }
                ]
            }
        );

        const reply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Aucune réponse IA";

        memory[sessionId].push({ role: "assistant", content: reply });

        return res.json({
            reply,
            mode
        });

    } catch (error) {
        console.log("YELOX ERROR:", error.response?.data || error.message);

        return res.status(500).json({
            error: "Erreur serveur YELOX CORE (Gemini)"
        });
    }
});

/* ==========================================
   START
========================================== */
app.listen(PORT, () => {
    console.log(`🚀 YELOX CORE RUNNING ON PORT ${PORT} (GEMINI)`);
});