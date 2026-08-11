const express = require('express');
const renderRouter = require('./routes/render');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '5mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', uptime: process.uptime() });
});

app.use('/render', renderRouter);

// Guard pra permitir `require('./index')` em teste (supertest) sem abrir uma porta real.
if (require.main === module) {
  app.listen(PORT, () => console.log(`pense-precifique-pdf rodando na porta ${PORT}`));
}

module.exports = app;
