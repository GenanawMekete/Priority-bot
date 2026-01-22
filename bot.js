import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN, WEBAPP_URL } from "./config.js";
import fetch from "node-fetch";

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  if (!text || text.length < 50) return; // ignore normal chats

  try {
    const res = await fetch("https://YOUR-RENDER-BACKEND.onrender.com/api/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramId: userId.toString(), text })
    });

    const data = await res.json();

    if (data.success) {
      bot.sendMessage(chatId,
        `✅ Deposit successful!\n\n` +
        `Provider: ${data.provider}\n` +
        `Amount: ${data.amount} ETB\n` +
        `New balance: ${data.newBalance} ETB`
      );
    } else {
      bot.sendMessage(chatId, `❌ ${data.error}`);
    }

  } catch (e) {
    bot.sendMessage(chatId, "❌ Deposit verification failed. Try again.");
  }
});
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
