import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchAIResponse(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4", // veya gpt-3.5-turbo
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "❌ Yanıt alınamadı.";
  } catch (err) {
    console.error("AI API Hatası:", err);
    return "❌ AI sistemiyle iletişim kurulamadı.";
  }
}
