require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy endpoint for 1inch API
app.post('/api/proxy/swap', async (req, res) => {
  const { chainId, params } = req.body;
  const apiUrl = `https://api.1inch.dev/swap/v5.2/${chainId}/swap`;

  try {
    const url = `${apiUrl}?` + new URLSearchParams(params).toString();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_1INCH_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Proxy endpoint for 1inch Quote API
app.post('/api/proxy/quote', async (req, res) => {
  const { chainId, params } = req.body;
  const apiUrl = `https://api.1inch.dev/swap/v5.2/${chainId}/quote`;

  try {
    const url = `${apiUrl}?` + new URLSearchParams(params).toString();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_1INCH_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
