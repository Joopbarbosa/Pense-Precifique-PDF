const express = require('express');
const { PDFDocument } = require('pdf-lib');
const {
  orcamentoSchema,
  reciboSinalSchema,
  pdfMultaSchema,
  reciboEstornoSchema,
  reciboPagamentoSchema,
  reciboCaixaSchema,
  catalogoSchema,
  compraSchema,
  listaComprasSchema,
} = require('../schemas');
const { renderHtmlDocument } = require('../renderer/htmlRenderer');
const { renderPdfBuffer, RenderTimeoutError } = require('../renderer/pdfRenderer');
const OrcamentoDoc = require('../templates/orcamento/OrcamentoDoc.jsx');
const ReciboSinalDoc = require('../templates/recibo-sinal/ReciboSinalDoc.jsx');
const MultaDoc = require('../templates/pdf-multa/MultaDoc.jsx');
const ReciboEstornoDoc = require('../templates/recibo-estorno/ReciboEstornoDoc.jsx');
const ReciboPagamentoDoc = require('../templates/recibo-pagamento/ReciboPagamentoDoc.jsx');
const ReciboCaixaDoc = require('../templates/recibo-caixa/ReciboCaixaDoc.jsx');
const CatalogoDoc = require('../templates/catalogo/CatalogoDoc.jsx');
const CompraDoc = require('../templates/compra/CompraDoc.jsx');
const ListaComprasDoc = require('../templates/lista-compras/ListaComprasDoc.jsx');

const router = express.Router();

const RENDER_TIMEOUT_SECONDS = Number(process.env.RENDER_TIMEOUT_SECONDS) || 30;
const MAX_PAGINAS = Number(process.env.MAX_PAGINAS) || 10;
const MAX_PAGINAS_DOCUMENTO = MAX_PAGINAS * 2;

// Registro por tipo — novo tipo de documento (recibo-sinal, pdf-multa, ...) só precisa de uma
// entrada nova aqui, sem rota nova (contrato genérico /render/:tipo/:id).
const TEMPLATES = {
  orcamento: { schema: orcamentoSchema, Component: OrcamentoDoc },
  'recibo-sinal': { schema: reciboSinalSchema, Component: ReciboSinalDoc },
  'pdf-multa': { schema: pdfMultaSchema, Component: MultaDoc },
  'recibo-estorno': { schema: reciboEstornoSchema, Component: ReciboEstornoDoc },
  'recibo-pagamento': { schema: reciboPagamentoSchema, Component: ReciboPagamentoDoc },
  'recibo-caixa': { schema: reciboCaixaSchema, Component: ReciboCaixaDoc },
  catalogo: { schema: catalogoSchema, Component: CatalogoDoc },
  // V0.15.0 — #545/#547
  compra: { schema: compraSchema, Component: CompraDoc },
  'lista-compras': { schema: listaComprasSchema, Component: ListaComprasDoc },
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
  const filename = `${tipo}-${parsed.data.documento.numeroFormatado}.pdf`;
  const totalPaginas = pdfDoc.getPageCount();
  res.set('X-Pdf-Page-Count', String(totalPaginas));
  if (totalPaginas > MAX_PAGINAS_DOCUMENTO) {
    return res.status(413).json({
      tipo: 'BLOQUEIO',
      message: 'Este documento tem mais de 20 páginas e não pode ser gerado em até 2 partes.',
      totalPaginas,
    });
  }

  if (totalPaginas > MAX_PAGINAS && req.query.dividir !== 'true') {
    return res.status(409).json({
      tipo: 'AVISO',
      message: 'Este documento tem mais de 10 páginas. Você pode dividi-lo em 2 PDFs para continuar.',
      totalPaginas,
      dividirDisponivel: true,
    });
  }

  if (req.query.dividir === 'true' && totalPaginas > MAX_PAGINAS) {
    const { PDFDocument: Pdf, StandardFonts, rgb } = require('pdf-lib');
    const corte = Math.ceil(totalPaginas / 2);
    const paginas = [[0, corte], [corte, totalPaginas]];
    const partes = [];
    for (let indice = 0; indice < paginas.length; indice += 1) {
      const [inicio, fim] = paginas[indice];
      const parte = await Pdf.create();
      const fonte = await parte.embedFont(StandardFonts.Helvetica);
      const copias = await parte.copyPages(pdfDoc, Array.from({ length: fim - inicio }, (_, i) => inicio + i));
      copias.forEach((pagina) => {
        pagina.drawText(`parte ${indice + 1} de 2`, {
          x: 36, y: 18, size: 8, font: fonte, color: rgb(0.35, 0.35, 0.35),
        });
        parte.addPage(pagina);
      });
      partes.push({ numeroParte: indice + 1, totalPaginas: fim - inicio, pdfBase64: Buffer.from(await parte.save()).toString('base64') });
    }
    return res.status(200).json({ totalPaginas, partes });
  }

  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(pdfBuffer);
}

router.get('/:tipo/:id', handleRender);
router.post('/:tipo/:id', handleRender);

module.exports = router;
