const express = require('express');
const renderRouter = require('./routes/render');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '5mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.0', uptime: process.uptime() });
});

app.use('/render', renderRouter);

app.use((err, req, res, next) => {
  // Erros de leitura do corpo (JSON malformado, corpo grande demais, charset inválido) trazem
  // status 4xx do body-parser: respondem como erro do cliente, nunca 500 (PP-710, entrada hostil).
  if (err && Number.isInteger(err.status) && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: err.status === 413 ? 'Corpo da requisição grande demais.' : 'Corpo da requisição inválido.' });
  }
  console.error('[render] falha interna', err);
  res.status(500).json({ message: 'Falha interna ao gerar o documento.' });
});

// Guard pra permitir `require('./index')` em teste (supertest) sem abrir uma porta real.
if (require.main === module) {
  app.listen(PORT, () => console.log(`pense-precifique-pdf rodando na porta ${PORT}`));
}

module.exports = app;
