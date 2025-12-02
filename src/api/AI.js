import GroqAI from "./GroqAI.js";

export const AI = {
  async ask(prompt, token) {
    return await GroqAI.ask(prompt, token);
  },
};

export default AI;
