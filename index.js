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
      `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`
    );

    const price = parseFloat(response.data.data.price).toFixed(2);
    ctx.reply(`${input.toUpperCase()} Price: $${price}`);
  } catch (err) {
    console.log('Price fetch error:', err.message);
    console.log('Full error:', JSON.stringify(err.response?.data));
    ctx.reply('Error fetching price ❌');
  }
});

bot.command('test', async (ctx) => {
  try {
    const response = await axios.get(
      'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT'
    );
    ctx.reply(JSON.stringify(response.data));
  } catch (err) {
    ctx.reply(`Error: ${err.message}`);
  }
});

bot.launch();
console.log("Bot running...");

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));