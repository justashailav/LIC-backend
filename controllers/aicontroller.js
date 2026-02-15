import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        { role: "system", content: "You are an LIC insurance assistant." },
        { role: "user", content: message }
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "AI failed" });
  }
};
