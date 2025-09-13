// backend/utils/bot.js
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AI_ENABLED = (process.env.AI_ENABLED || 'false') === 'true';

let OpenAI;
if (AI_ENABLED && OPENAI_API_KEY) {
  const { OpenAI: OpenAIClient } = require('openai');
  OpenAI = new OpenAIClient({ apiKey: OPENAI_API_KEY });
}

async function getBotReply(userMessage) {
  if (AI_ENABLED && OpenAI) {
    try {
      const resp = await OpenAI.chat.completions.create({
        model: "gpt-4o-mini", // user can change to whichever model they have access to
        messages: [{ role: "user", content: `You are a friendly assistant. Reply concisely to: ${userMessage}` }],
        max_tokens: 150
      });
      const text = resp.choices?.[0]?.message?.content || "Sorry, I couldn't form a reply.";
      return text.trim();
    } catch (err) {
      console.error("OpenAI error:", err?.message || err);
      return `Bot error: fallback reply to "${userMessage}"`;
    }
  } else {
    // fallback simple logic: echo + small transformation
    return `Bot: I got your message — "${userMessage.slice(0, 120)}"`;
  }
}

module.exports = { getBotReply };
