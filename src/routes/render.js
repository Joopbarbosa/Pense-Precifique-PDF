const express = require('express');
const { orcamentoSchema } = require('../schemas');
const { renderHtmlDocument } = require('../renderer/htmlRenderer');
const OrcamentoDoc = require('../templates/orcamento/OrcamentoDoc.jsx');

const router = express.Router();

// Registro por tipo — novo tipo de documento (recibo-sinal, pdf-multa, ...) só precisa de uma
// entrada nova aqui, sem rota nova (contrato genérico /render/:tipo/:id).
const TEMPLATES = {
  orcamento: { schema: orcamentoSchema, Component: OrcamentoDoc },
};

function handleRender(req, res) {
  const { tipo, id } = req.params;
  const { format } = req.query;

  const template = TEMPLATES[tipo];
  if (!template) {
    return res.status(400).json({ message: `Tipo desconhecido: ${tipo}` });
  }

  if (format === 'pdf') {
    return res.status(501).json({
      message: 'format=pdf ainda não implementado nesta rodada — Puppeteer entra no próximo prompt.',
    });
  }

  if (format !== 'html') {
    return res.status(400).json({ message: `format inválido: ${format}` });
  }

  const parsed = template.schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Payload inválido',
      detalhes: parsed.error.issues.map((issue) => ({ campo: issue.path.join('.'), erro: issue.message })),
    });
  }

  // `id` é só identificador para log/rastreamento nesta fase — serviço é stateless, não busca
  // nada no banco por ele. Todo o dado vem do payload (`req.body`), validado acima.
  console.log(`[render] tipo=${tipo} id=${id} format=${format}`);

  const html = renderHtmlDocument(template.Component, parsed.data);
  res.set('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}

router.get('/:tipo/:id', handleRender);
router.post('/:tipo/:id', handleRender);

module.exports = router;
