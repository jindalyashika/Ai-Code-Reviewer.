// ai.service.js:
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// Removed systemInstruction completely - using basic model only
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

async function generateContent(code) {
  // Moved all instructions to the prompt instead
  const prompt = `You are a Senior Code Reviewer with 7+ years experience. Provide clear, actionable feedback using this format:

1. QUICK SUMMARY - Brief overview
2. DETAILED ANALYSIS - Tag issues as CRITICAL, HIGH, MEDIUM, or LOW
3. RECOMMENDED FIX - Code snippets with comments
4. KEY IMPROVEMENTS - Summary

Use Markdown and code blocks. Focus on code quality, performance, security, best practices, and maintainability. Be direct and constructive.

Review this code:
${code}`;

  const result = await model.generateContent(prompt);
  console.log(result.response.text())
  return result.response.text();
}

module.exports = generateContent