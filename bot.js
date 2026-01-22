import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN, WEBAPP_URL } from "./config.js";

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// START COMMAND
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const text = `🎯 Welcome to Beteseb Bingo\n\n` +
    `• Free bonus: 10 ETB\n` +
    `• Bet per round: 10 ETB\n` +
    `• Derash: 80% to players\n\n` +
    `Press PLAY to join the game 👇`;

  bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "▶️ PLAY BINGO",
          web_app: {
            url: `${WEBAPP_URL}?tgId=${userId}`
          }
        }
      ]]
    }
  });
});

// BALANCE COMMAND
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const res = await fetch(`${process.env.BACKEND_URL}/wallet/${userId}`);
  const data = await res.json();

  bot.sendMessage(chatId, `💰 Your balance: ${data.balance} ETB`);
});

// DEPOSIT (placeholder)
bot.onText(/\/deposit/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId,
    `Select deposit method:`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📱 Telebirr", callback_data: "telebirr" }],
          [{ text: "🏦 CBE Birr", callback_data: "cbe" }]
        ]
      }
    }
  );
});

// HANDLE METHOD SELECTION
bot.on("callback_query", async (q) => {
  const chatId = q.message.chat.id;

  if (q.data === "telebirr") {
    bot.sendMessage(chatId,
      `📱 Telebirr Deposit\n\n` +
      `Send money to:\n` +
      `👉 09XXXXXXXX\n\n` +
      `Then copy & paste the FULL SMS text here.`
    );
  }

  if (q.data === "cbe") {
    bot.sendMessage(chatId,
      `🏦 CBE Birr Deposit\n\n` +
      `Send money to:\n` +
      `👉 09XXXXXXXX\n\n` +
      `Then copy & paste the FULL SMS text here.`
    );
  }
});

export default bot;
