const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api/cryptos', async (req, res) => {
  try {
    // CoinGecko endpoint to fetch market data for coins
    // This fetches coins data sorted by market cap in descending order.
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false
      }
    });
    
    // Map and format only the required details
    const cryptos = response.data.map(coin => ({
      id: coin.id,
      name: coin.name,
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume
    }));

    res.json({ cryptos });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
