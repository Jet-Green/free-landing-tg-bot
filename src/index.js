import AI from "./api/AI.js";
import Vercel from "./api/vercel.js";
import "./config/env.js";
// тут запустить бота

console.log(config);

// Запуск
async function main() {
  const vercelToken = config.vercelApiToken;

  if (!vercelToken) {
    console.error("❌ Установите VERCEL_TOKEN");
    console.log("💡 Получите токен: https://vercel.com/account/tokens");
    return;
  }
  const siteName = `static-1764674288934`;
  let projectId = "prj_vjjgxzFe980I1LaQT5y6bYUqEyxd";

  console.log(`🚀 Деплоим "${siteName}"...`);

  const prompt = `Generate a complete HTML5 webpage. Output ONLY the raw HTML code with embedded CSS, nothing else. Do not include any explanations, markdown formatting, backticks, \`\`\`html tags, or any additional text before or after the HTML code. Requirements:

- Create a modern responsive layout
- Include a header with navigation menu
- Create a main content section
- Add a footer
- Include all necessary meta tags and viewport settings
- Use semantic HTML elements throughout
- Add placeholder content (lorem ipsum is fine)
- Embed CSS within <style> tags in the <head>
- The output should be valid HTML that can be directly copied and saved as .html file
- You also can use script

this website must be to-do tasks`;
  let answer = await AI.ask(prompt, config.groqAIToken);
  try {
    console.log(answer.choices[0].message.content);
    const defaultSettings = {
      ssoProtection: null,
    };
    let url = await Vercel.deployWithSettings(
      config.vercelApiToken,
      "neurosite2",
      answer.choices[0].message.content,
      defaultSettings
    );

    if (url) {
      console.log(`\n🎉 Откройте: ${url}`);
    }
  } catch (error) {
    console.log(error);
    console.log(answer);
  }
}

//main();
