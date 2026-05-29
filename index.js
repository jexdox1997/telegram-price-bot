require('dotenv').config();

const { Telegraf } = require('telegraf');

const axios = require('axios');
const bot = new Telegraf(process.env.BOT_TOKEN);

/**
 * Simple coin name mapping (we’ll improve later)
 */
const coinMap = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
  bnb: 'binancecoin',
  ton: 'the-open-network'
};

bot.start((ctx) => {
  ctx.reply('I am Active 🚀');
});

bot.hears('hi', (ctx) => {
  ctx.reply('Wag Wan');
});

/**
 * NEW: dynamic price command
 * Usage: /price btc
 */
bot.command('price', async (ctx) => {
  try {
    const input = ctx.message.text.split(' ')[1]; // get "btc"

    if (!input) {
      return ctx.reply('Usage: /price btc');
    }

    const coinId = coinMap[input.toLowerCase()];

    if (!coinId) {
      return ctx.reply('Coin not supported yet ❌');
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );

    const price = response.data[coinId].usd;

    ctx.reply(`${input.toUpperCase()} Price: $${price}`);
  } catch (err) {
    ctx.reply('Error fetching price ❌');
  }
});

bot.launch();
console.log("Bot running...");

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));