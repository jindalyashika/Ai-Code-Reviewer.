const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateContent(code) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a Senior Code Reviewer with 7+ years experience. Provide clear, actionable feedback using this format:
1. QUICK SUMMARY
2. DETAILED ANALYSIS - Tag issues as CRITICAL, HIGH, MEDIUM, or LOW
3. RECOMMENDED FIX - Code snippets with comments
4. KEY IMPROVEMENTS
Use Markdown and code blocks.`
      },
      {
        role: "user",
        content: `Review this code:\n${code}`
      }
    ]
  });

  return response.choices[0].message.content;
}

module.exports = generateContent;