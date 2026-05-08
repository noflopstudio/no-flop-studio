import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Le message est vide." });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu es YELOX, l'expert technique de No Flop Studio." },
        { role: "user", content: message }
      ],
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Erreur IA", details: error.message });
  }
});

export default app;

// 3. IMPORTANT : Pour Vercel, on n'utilise PAS app.listen en production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`✅ Serveur local actif sur le port ${PORT}`);
  });
}

// 4. L'EXPORTATION INDISPENSABLE
export default app;