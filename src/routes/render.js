const express = require('express');
const { PDFDocument } = require('pdf-lib');
const { orcamentoSchema, reciboSinalSchema, pdfMultaSchema, reciboEstornoSchema } = require('../schemas');
const { renderHtmlDocument } = require('../renderer/htmlRenderer');
const { renderPdfBuffer, RenderTimeoutError } = require('../renderer/pdfRenderer');
const OrcamentoDoc = require('../templates/orcamento/OrcamentoDoc.jsx');
const ReciboSinalDoc = require('../templates/recibo-sinal/ReciboSinalDoc.jsx');
const MultaDoc = require('../templates/pdf-multa/MultaDoc.jsx');
const ReciboEstornoDoc = require('../templates/recibo-estorno/ReciboEstornoDoc.jsx');

const router = express.Router();

const RENDER_TIMEOUT_SECONDS = Number(process.env.RENDER_TIMEOUT_SECONDS) || 30;
const MAX_PAGINAS = Number(process.env.MAX_PAGINAS) || 10;

// Registro por tipo — novo tipo de documento (recibo-sinal, pdf-multa, ...) só precisa de uma
// entrada nova aqui, sem rota nova (contrato genérico /render/:tipo/:id).
const TEMPLATES = {
  orcamento: { schema: orcamentoSchema, Component: OrcamentoDoc },
  'recibo-sinal': { schema: reciboSinalSchema, Component: ReciboSinalDoc },
  'pdf-multa': { schema: pdfMultaSchema, Component: MultaDoc },
  'recibo-estorno': { schema: reciboEstornoSchema, Component: ReciboEstornoDoc },
};

async function handleRender(req, res) {
  const { tipo, id } = req.params;
  const { format } = req.query;

  const template = TEMPLATES[tipo];
  if (!template) {
    return res.status(400).json({ message: `Tipo desconhecido: ${tipo}` });
  }

  if (format !== 'html' && format !== 'pdf') {
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

  if (format === 'html') {
    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  let pdfBuffer;
  try {
    pdfBuffer = await renderPdfBuffer(html, { timeoutSeconds: RENDER_TIMEOUT_SECONDS });
  } catch (err) {
    if (err instanceof RenderTimeoutError) {
      return res.status(408).json({ message: err.message });
    }
    throw err;
  }

  const pdfDoc = await PDFDocument.load(pdfBuffer);
  if (pdfDoc.getPageCount() > MAX_PAGINAS) {
    return res.status(413).json({ message: 'Documento muito extenso. Entre em contato com o suporte.' });
  }

  const filename = `${tipo}-${parsed.data.documento.numeroFormatado}.pdf`;
  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(pdfBuffer);
}

router.get('/:tipo/:id', handleRender);
router.post('/:tipo/:id', handleRender);

module.exports = router;
