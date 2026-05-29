require('dotenv').config();
const http = require('http');
const { Telegraf } = require('telegraf');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end('Bot is running')).listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

const bot = new Telegraf(process.env.BOT_TOKEN);

const coinMap = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
  bnb: 'binance-coin',
  ton: 'toncoin'
};
bot.start((ctx) => {
  ctx.reply('I am Active 🚀');
});

bot.hears('hi', (ctx) => {
  ctx.reply('Wag Wan');
});

bot.command('price', async (ctx) => {
  try {
    const input = ctx.message.text.split(' ')[1];
    if (!input) return ctx.reply('Usage: /price btc');

    const coinId = coinMap[input.toLowerCase()];
    if (!coinId) return ctx.reply('Coin not supported yet ❌');

    const response = await axios.get(
      `https://api.coincap.io/v2/assets/${coinId}`
    );

    const price = parseFloat(response.data.data.priceUsd).toFixed(2);
    ctx.reply(`${input.toUpperCase()} Price: $${price}`);
  } catch (err) {
    ctx.reply('Error fetching price ❌');
  }
});

bot.launch();
console.log("Bot running...");

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));