import "./config/env.js";
// тут запустить бота

console.log(config);

async function deployToVercel(vercelToken, siteName, SiteData) {
  try {
    const simpleHtml = SiteData.simpleHtml;
    const response = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: siteName,
        files: [
          {
            file: "index.html",
            data: simpleHtml,
          },
        ],
        projectSettings: {
          framework: null,
          outputDirectory: ".",
        },
        target: "production",
      }),
    });

    // const data = await response.json();
    console.log(projectId);

    if (!response.ok) {
      console.error("❌ Ошибка от Vercel:", JSON.stringify(data, null, 2));
      return null;
    }

    console.log("✅ Сайт успешно задеплоен!");
    console.log(`🌐 URL: https://${data.url}`);
    console.log(`📊 ID деплоя: ${data.id}`);

    return data.url;
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    return null;
  }
}
async function SetProjectSettings(projectId, settings) {
  //Потом поменять
  settings = JSON.stringify({
    ssoProtection: null,
  });

  if (projectId) {
    console.log("2. Отключаю защиту проекта...");
    try {
      const projectRes = await fetch(
        `https://api.vercel.com/v9/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: settings,
        }
      );

      const projectData = await projectRes.json();
      console.log(
        projectRes.ok ? "✅ Защита отключена" : "⚠️ Не удалось отключить"
      );
    } catch (e) {
      console.log("⚠️ Не удалось обновить настройки проекта");
    }
  }
}
// Запуск
async function main() {
  const vercelToken = config.vercelToken;

  if (!vercelToken) {
    console.error("❌ Установите VERCEL_TOKEN");
    console.log("💡 Получите токен: https://vercel.com/account/tokens");
    return;
  }
  //Пока что только html
  const simpleHtml = `<!DOCTYPE html>
        <html>
        <head>
            <title>✅ Vercel Test</title>
            <style>
                body {
                    font-family: Arial;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: red;
                }
            </style>
        </head>
        <body>
            <h1>✅ Vercel работает!</h1>
            <p>Время: ${new Date().toLocaleString()}</p>
        </body>
        </html>`;
  //Сайт пока один
  const siteName = `static-1764674288934`;
  let projectId = "prj_vjjgxzFe980I1LaQT5y6bYUqEyxd";

  console.log(`🚀 Деплоим "${siteName}"...`);
  let siteData = {
    simpleHtml: simpleHtml,
  };
  //const url = await deployToVercel(vercelToken, siteName, siteData);

  if (url) {
    console.log(`\n🎉 Откройте: https://${url}`);
  }
}

main();
