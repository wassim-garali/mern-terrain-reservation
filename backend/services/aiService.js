const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.chatWithAI = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Erreur Gemini:", error.message);
    throw new Error("Erreur lors de la communication avec l'IA");
  }
};


