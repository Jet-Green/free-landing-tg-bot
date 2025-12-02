// тут все запросы в ловабл функциями, ООП не нужно делать
// vercel-deploy.js
export const Vercel = {
  /**
   * Деплой сайта на Vercel
   * @param {string} vercelToken - Токен Vercel
   * @param {string} siteName - Имя сайта
   * @param {object} siteData - Данные сайта
   * @param {string} siteData.html - HTML код
   * @returns {Promise<string|null>} URL сайта или null при ошибке
   */
  async deployToVercel(vercelToken, siteName, siteData) {
    try {
      const simpleHtml = siteData.html;
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

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Ошибка от Vercel:", JSON.stringify(data, null, 2));
        return null;
      }

      console.log("✅ Сайт успешно задеплоен!");
      console.log(`🌐 URL: https://${data.url}`);
      console.log(`📊 ID деплоя: ${data.id}`);

      // Возвращаем данные для дальнейшего использования
      return {
        url: data.url,
        id: data.id,
        projectId: data.projectId,
        fullData: data,
      };
    } catch (error) {
      console.error("❌ Ошибка:", error.message);
      return null;
    }
  },

  /**
   * Настройка проекта Vercel
   * @param {string} vercelToken - Токен Vercel
   * @param {string} projectId - ID проекта
   * @param {object} settings - Настройки проекта
   * @returns {Promise<object|null>} Результат обновления
   */
  async setProjectSettings(vercelToken, projectId, settings = {}) {
    try {
      if (!projectId) {
        console.log("⚠️ Нет projectId для настройки");
        return null;
      }

      // По умолчанию отключаем защиту
      const defaultSettings = {
        ssoProtection: null,
        ...settings,
      };

      console.log("🛠️ Настраиваю проект...");

      const projectRes = await fetch(
        `https://api.vercel.com/v9/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(defaultSettings),
        }
      );

      const projectData = await projectRes.json();

      if (projectRes.ok) {
        console.log("✅ Настройки проекта обновлены");
        return projectData;
      } else {
        console.error("❌ Ошибка настройки проекта:", projectData);
        return null;
      }
    } catch (error) {
      console.error("⚠️ Ошибка настройки проекта:", error.message);
      return null;
    }
  },

  /**
   * Полный процесс деплоя с настройками
   * @param {string} vercelToken - Токен Vercel
   * @param {string} siteName - Имя сайта
   * @param {string} htmlContent - HTML код
   * @param {object} projectSettings - Дополнительные настройки проекта
   * @returns {Promise<string|null>} URL сайта
   */
  async deployWithSettings(
    vercelToken,
    siteName,
    htmlContent,
    projectSettings = {}
  ) {
    try {
      // 1. Деплой сайта
      const deployResult = await this.deployToVercel(vercelToken, siteName, {
        html: htmlContent,
      });

      if (!deployResult) {
        return null;
      }

      // 2. Если есть projectId, настраиваем проект
      if (deployResult.projectId) {
        await this.setProjectSettings(
          vercelToken,
          deployResult.projectId,
          projectSettings
        );
      }

      return `https://${deployResult.url}`;
    } catch (error) {
      console.error("❌ Ошибка полного процесса деплоя:", error.message);
      return null;
    }
  },

  /**
   * Создание базового HTML сайта
   * @param {string} title - Заголовок сайта
   * @param {string} content - Основной контент
   * @returns {string} HTML код
   */
  createBasicSite(title, content) {
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .content {
            color: #666;
            line-height: 1.6;
            font-size: 18px;
        }
        .footer {
            margin-top: 30px;
            color: #888;
            font-size: 14px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div class="content">${content}</div>
        <div class="footer">
            Сайт создан автоматически • ${new Date().toLocaleDateString(
              "ru-RU"
            )}
        </div>
    </div>
</body>
</html>`;
  },

  /**
   * Быстрый деплой с генерацией HTML
   * @param {string} vercelToken - Токен Vercel
   * @param {string} prompt - Описание сайта для заголовка
   * @param {string} content - Контент сайта
   * @returns {Promise<string|null>} URL сайта
   */
  async quickDeploy(vercelToken, prompt, content) {
    const siteName = `site-${Date.now().toString(36)}`;
    const html = this.createBasicSite(prompt, content);

    return await this.deployWithSettings(vercelToken, siteName, html, {
      ssoProtection: null,
    });
  },
};

// Экспорт по умолчанию
export default Vercel;
