require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const cors    = require('cors');          // ← new
const app     = express();
const PORT    = 3000;
const API_KEY = process.env.API_KEY;

app.use(cors());                          // ← allow all origins (or pass options)
app.use(express.json());

app.post('/api/generateContent', async (req, res) => {
  try {
    const { prompt } = req.body;

    const gRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json(gRes.data);
  } catch (err) {
    console.error('[Proxy error]', err.response?.data || err.message);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

app.listen(PORT, () =>
  console.log(`🔐 Gemini proxy listening on http://localhost:${PORT}`)
);
