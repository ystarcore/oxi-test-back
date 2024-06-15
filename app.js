import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TIKTOK_ACCESS_TOKEN_ENDPOINT = 'https://open.tiktokapis.com/v2/oauth/token';
const PORT = process.env.PORT || 3333;

app.post('/proxy/token', async (req, res) => {
  const client_id = process.env.TIKTOK_CLIENT_ID;
  const client_secret = process.env.TIKTOK_CLIENT_SECRET;
  
  const { code } = req.body;

  if (!client_id || !client_secret) {
    return res.status(500).json({ error: 'Server configuration error. Please check environment variables.' });
  }

  const params = new URLSearchParams({
    client_key: client_id,
    client_secret: client_secret,
    code: code,
    grant_type: 'authorization_code',
  }).toString();

  const url = `${TIKTOK_ACCESS_TOKEN_ENDPOINT}?${params}`;

  try {
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`TikTok API returned an error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data.data);
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Failed to fetch token from TikTok API.' });
  }
});

app.get('/tiktok', (req, res) => {
    const client_id = process.env.TIKTOK_CLIENT_ID;
  res.send(`Welcome to Formula Tiktok: ${client_id}`);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
