const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', uptime: process.uptime() });
});

app.listen(PORT, () => console.log(`pense-precifique-pdf rodando na porta ${PORT}`));
