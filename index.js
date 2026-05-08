const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration de l'IA (Utilise la variable d'environnement de Render)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route pour le chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Tu es YELOX, l'assistant expert en marketing et branding pour No Flop Studio à Abidjan." },
                { role: "user", content: message }
            ],
        });

        // On envoie bien la réponse sous forme d'objet JSON
        res.json({ message: completion.choices[0].message.content });

    } catch (error) {
        console.error("Erreur OpenAI:", error);
        res.status(500).json({ error: "Erreur lors de la communication avec l'IA" });
    }
});

// COMMANDE CRUCIALE POUR RENDER : Utiliser le port dynamique
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Le Noyau YELOX est prêt sur le port ${PORT}`);
});