// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;

app.use(cors());

app.get('/api/solana/:programId', async (req, res) => {
  try {
    const programId = req.params.programId;
    const response = await axios.get(`https://api.solscan.io/account/${programId}`, {
      headers: {
        'Accept': 'application/json',
        'Token': process.env.SOLSCAN_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Solana program' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});