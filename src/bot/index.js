import { config } from "../config/env.js";
import Lovable from "../api/lovable.js";
import TelegramBot from "node-telegram-bot-api";
// вся логика для бота
const botToken = config.tgBotToken;

// Создаём бота в режиме polling (опрос)
const bot = new TelegramBot(botToken, { polling: true });

export const Bot = {
  runBot: function () {
    const userSessions = new Map();

    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const text = msg.text || "";
      const photoArray = msg.photo;

      if (!userSessions.has(userId)) {
        userSessions.set(userId, { prompt: "", images: [] });
      }
      const session = userSessions.get(userId);

      if (photoArray && photoArray.length > 0) {
        const fileId = photoArray[photoArray.length - 1].file_id;
        try {
          const fileLink = await bot.getFileLink(fileId);
          if (!session.images.includes(fileLink)) {
            session.images.push(fileLink);
          }
          await bot.sendMessage(chatId, "✅ Картинка добавлена!");
        } catch (err) {
          console.error("Не удалось получить ссылку на фото:", err.message);
        }
        return;
      }

      if (text === "/start") {
        await bot.sendMessage(
          chatId,
          "Отправьте описание лендинга и изображения, затем вызовите /build для создания сайта \n или /clear для очистки"
        );
        return;
      }
      if (text === "/clear") {
        await bot.sendMessage(chatId, "Промпт очищен!");
        return;
      }
      if (text === "/build") {
        const { prompt, images } = session;
        if (!prompt && images.length === 0) {
          await bot.sendMessage(
            chatId,
            "Сначала отправьте описание и/или изображения."
          );
          return;
        }
        const link = Lovable.getLink(prompt || "Create a landing page", images);
        await bot.sendMessage(chatId, "Вот ваша ссылка на сайт -- " + link);
        return;
      }

      if (!text.startsWith("/")) {
        if (session.prompt != "") {
          session.prompt = text;
          await bot.sendMessage(chatId, "✅ Описание сохранено!");
        } else {
          session.prompt = text;
          await bot.sendMessage(chatId, "✅ Описание перезаписано!");
        }
      }
    });

    console.log("✅ Бот запущен и ждёт сообщения...");
  },
};
export default Bot;
