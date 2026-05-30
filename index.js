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
  btc: 'BTC-USDT',
  eth: 'ETH-USDT',
  sol: 'SOL-USDT',
  bnb: 'BNB-USDT',
  ton: 'TON-USDT'
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

    const symbol = coinMap[input.toLowerCase()];
    if (!symbol) return ctx.reply('Coin not supported yet ❌');

    const response = await axios.get(
      `https://api.kucoin.com/api/v1/market/stats?symbol=${symbol}`
    );

    const data = response.data.data;
    const price = parseFloat(data.last).toFixed(2);
    const change = parseFloat(data.changeRate * 100).toFixed(2);
    const emoji = change >= 0 ? '🟢' : '🔴';

    ctx.reply(
      `${input.toUpperCase()} Price: $${price}\n${emoji} 24h Change: ${change}%`
    );
  } catch (err) {
    console.log('Price fetch error:', err.message);
    ctx.reply('Error fetching price ❌');
  }
});

bot.launch();
console.log("Bot running...");

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));