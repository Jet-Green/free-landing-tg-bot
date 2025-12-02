export const GroqAI = {
  async ask(prompt, token) {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || "gsk_xxx"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // или "mixtral-8x7b-32768"
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );
    return await response.json();
  },
};

export default GroqAI;
