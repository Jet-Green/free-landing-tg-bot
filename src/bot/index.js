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

    const getPrompt =
      "Введите какой вам нужен сайт, распишите основные разделы, можете добавить референсные картинки";
    const hiMessage = "Hi";
    const commandSiteCreate = "Создать ещё один сайт";
    const reply_markup = {
      keyboard: [[commandSiteCreate]],
      resize_keyboard: true, // Подгонять под размер экрана
      one_time_keyboard: false, // Не скрывать после нажатия
      selective: false, // Показывать всем в чате
    };
    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const text = msg.text || "";
      const photoArray = msg.photo;

      if (!userSessions.has(userId)) {
        userSessions.set(userId, { prompt: "", images: [], state: true });
      }
      const session = userSessions.get(userId);

      if (text === "/start") {
        let sentMsg = await bot.sendMessage(chatId, hiMessage, {
          reply_markup: reply_markup,
        });
        await bot.sendMessage(chatId, getPrompt);
        session.state = true;
        return;
      }
      if (text === commandSiteCreate) {
        session.state = true;
        await bot.sendMessage(chatId, getPrompt);
        return;
      }
      if (photoArray && photoArray.length > 0) {
        const fileId = photoArray[photoArray.length - 1].file_id;
        try {
          const fileLink = await bot.getFileLink(fileId);
          if (!session.images.includes(fileLink)) {
            session.images.push(fileLink);
          }
          await bot.sendMessage(chatId, "");
        } catch (err) {
          //console.error("Не удалось получить ссылку на фото:", err.message);
        }
      }
      const { images, state } = session;
      if (state) {
        const link = Lovable.getLink(text || "Create a landing page", images);
        session.images = [];
        let sentMsg = await bot.sendMessage(
          chatId,
          `[ваш сайт почти готов](${link})`,
          {
            parse_mode: "MarkdownV2",
          }
        );
        session.state = false;
        // await bot.sendMessage(
        //   chatId,
        //   "Можете также создать дополнительный сайт",
        //   {
        //     reply_markup: reply_markup,
        //   }
        // );
      }
    });

    console.log("✅ Бот запущен и ждёт сообщения...");
  },
};
export default Bot;
