require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

async function testAI() {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const result = await model.generateContent("Bonjour !");
    console.log("Réponse Gemini :", result.response.text());
  } catch (error) {
    console.error("Erreur Gemini :", error.message);
  }
}

testAI();
