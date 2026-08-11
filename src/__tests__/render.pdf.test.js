// RENDER_TIMEOUT_SECONDS precisa estar setado antes do require de `../index` (routes/render.js
// lê o env var uma vez, no load do módulo) — por isso este teste de timeout vive num arquivo
// isolado, com um valor baixo, em vez de esperar os 30s reais do default.
process.env.RENDER_TIMEOUT_SECONDS = '1';

jest.mock('puppeteer-core');

const request = require('supertest');
const puppeteer = require('puppeteer-core');
const { PDFDocument } = require('pdf-lib');
const app = require('../index');

// supertest/superagent não tem parser registrado pra `application/pdf` — sem isso, `res.body`
// viria vazio em vez do binário retornado pela rota.
function binaryParser(res, callback) {
  res.setEncoding('binary');
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    callback(null, Buffer.from(data, 'binary'));
  });
}

async function criarPdfValido(numeroPaginas = 1) {
  const doc = await PDFDocument.create();
  for (let i = 0; i < numeroPaginas; i += 1) {
    doc.addPage([595.28, 841.89]); // A4 em pontos
  }
  return Buffer.from(await doc.save());
}

function mockBrowser(pageOverrides = {}) {
  const pageMock = {
    setContent: jest.fn().mockResolvedValue(undefined),
    pdf: jest.fn().mockResolvedValue(Buffer.from('')),
    close: jest.fn().mockResolvedValue(undefined),
    ...pageOverrides,
  };
  const browserMock = {
    newPage: jest.fn().mockResolvedValue(pageMock),
    close: jest.fn().mockResolvedValue(undefined),
  };
  puppeteer.launch.mockResolvedValue(browserMock);
  return { browserMock, pageMock };
}

const payloadValido = {
  empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
  documento: {
    numeroFormatado: '47',
    nomeCliente: 'Mariana Costa',
    dataEmissao: '10/08/2026',
    dataValidade: '20/08/2026',
    prazoProducao: '15 dias úteis',
    inicioProducao: 'Assim que aprovado',
    metodoPagamento: 'PIX',
    sinalAtivo: true,
    valorSinal: 'R$ 150,00',
    restanteAposSinal: 'R$ 150,00',
    subtotal: 'R$ 320,00',
    desconto: 'R$ 20,00',
    total: 'R$ 300,00',
    observacoes: 'Embalagem para presente incluída.',
    itens: [
      {
        nomeProduto: 'Bolo Vulcão de Chocolate',
        customizacoes: 'Sem glúten, Cobertura extra',
        quantidade: '2',
        precoUnitario: 'R$ 150,00',
        subtotal: 'R$ 300,00',
      },
    ],
  },
};

describe('GET /render/orcamento/:id?format=pdf', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('payload de exemplo retorna 200, Content-Type application/pdf e buffer começa com %PDF-', async () => {
    const pdfBuffer = await criarPdfValido(1);
    const { browserMock } = mockBrowser({ pdf: jest.fn().mockResolvedValue(pdfBuffer) });

    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000010?format=pdf')
      .send(payloadValido)
      .buffer()
      .parse(binaryParser);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.headers['content-disposition']).toContain('orcamento-47.pdf');
    expect(res.body.slice(0, 5).toString('utf-8')).toBe('%PDF-');
    expect(browserMock.close).toHaveBeenCalledTimes(1);
  });

  test('timeout na geração retorna 408 e garante que browser.close() foi chamado', async () => {
    // setContent nunca resolve — força a corrida contra o timeout de RENDER_TIMEOUT_SECONDS=1.
    const { browserMock } = mockBrowser({ setContent: jest.fn(() => new Promise(() => {})) });

    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000011?format=pdf')
      .send(payloadValido);

    expect(res.status).toBe(408);
    expect(browserMock.close).toHaveBeenCalledTimes(1);
  }, 10000);

  test('documento com mais de 10 páginas retorna 413', async () => {
    const pdfBufferGrande = await criarPdfValido(11);
    mockBrowser({ pdf: jest.fn().mockResolvedValue(pdfBufferGrande) });

    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000012?format=pdf')
      .send(payloadValido);

    expect(res.status).toBe(413);
    expect(res.body.message).toBe('Documento muito extenso. Entre em contato com o suporte.');
  });
});
