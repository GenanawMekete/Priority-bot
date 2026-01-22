import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config.js";

const app = express();
app.use(express.json());

const bot = new TelegramBot(BOT_TOKEN);

app.post("/telegram", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

export default app;
