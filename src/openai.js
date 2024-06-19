// import Groq from "groq-sdk";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.AI_APIKEY,
});

export async function callAI(prop) {
  const chatCompletion = await getGroqChatCompletion(prop);
  // Print the completion returned by the LLM.
  return chatCompletion.choices[0]?.message?.content || "";
}

async function getGroqChatCompletion(prop) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "あなたは日本人の日本語の先生です。日本語で話します。学生と話して、学生の日本語が間違ったら、修正します。",
      },
      {
        role: "user",
        content: prop,
      },
    ],
    model: "llama3-8b-8192",
  });
}

// module.exports = { callAI };
