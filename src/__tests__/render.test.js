const request = require('supertest');
const app = require('../index');

const payloadValido = {
  empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
  documento: {
    numeroFormatado: '47',
    status: 'Aguardando aprovação',
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

describe('GET /render/orcamento/:id?format=html', () => {
  test('payload de exemplo retorna 200 e HTML com os dados reais', async () => {
    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000001?format=html')
      .send(payloadValido);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Mariana Costa');
    expect(res.text).toContain('#47');
    expect(res.text).toContain('Bolo Vulcão de Chocolate');
  });

  test('desconto=null não aparece no HTML renderizado', async () => {
    const payload = {
      ...payloadValido,
      documento: { ...payloadValido.documento, desconto: null },
    };

    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000002?format=html')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('Desconto');
    expect(res.text).not.toContain('R$ null');
  });

  test('logoUrl=null renderiza o placeholder sem quebrar', async () => {
    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000003?format=html')
      .send(payloadValido);

    expect(res.status).toBe(200);
    // placeholder = inicial do nome da empresa, sem <img>
    expect(res.text).not.toContain('<img');
    expect(res.text).toContain('S');
  });

  test('payload incompleto retorna 400 com detalhe do campo', async () => {
    const payload = JSON.parse(JSON.stringify(payloadValido));
    delete payload.documento.nomeCliente;

    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000004?format=html')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.detalhes.some((d) => d.campo === 'documento.nomeCliente')).toBe(true);
  });

  test('tipo desconhecido retorna 400', async () => {
    const res = await request(app)
      .get('/render/tipo-invalido/e5f5c3a0-0000-0000-0000-000000000005?format=html')
      .send(payloadValido);

    expect(res.status).toBe(400);
  });
});

const payloadReciboSinalValido = {
  empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
  documento: {
    numeroFormatado: '47',
    nomeCliente: 'Mariana Costa',
    metodoRecebido: 'Pix',
    valorRecebido: 'R$ 150,00',
    dataEmissao: '01/01/2026',
    dataAprovacao: '01/01/2026',
    prazoProducao: '15 dias úteis',
    inicioProducao: 'Assim que aprovado',
    itens: [
      {
        nomeProduto: 'Bolo Vulcão de Chocolate',
        customizacoes: 'Sem glúten, Cobertura extra',
        quantidade: '2',
        precoUnitario: 'R$ 150,00',
        subtotal: 'R$ 300,00',
      },
    ],
    valorTotalPedido: 'R$ 300,00',
    percentualSinal: '50%',
    restante: 'R$ 150,00',
  },
};

describe('GET /render/recibo-sinal/:id?format=html', () => {
  test('payload de exemplo retorna 200 e HTML com os dados reais', async () => {
    const res = await request(app)
      .get('/render/recibo-sinal/e5f5c3a0-0000-0000-0000-000000000020?format=html')
      .send(payloadReciboSinalValido);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Mariana Costa');
    expect(res.text).toContain('R$ 150,00');
  });

  test('payload incompleto retorna 400 com detalhe do campo', async () => {
    const payload = JSON.parse(JSON.stringify(payloadReciboSinalValido));
    delete payload.documento.metodoRecebido;

    const res = await request(app)
      .get('/render/recibo-sinal/e5f5c3a0-0000-0000-0000-000000000021?format=html')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.detalhes.some((d) => d.campo === 'documento.metodoRecebido')).toBe(true);
  });
});

const payloadPdfMultaValido = {
  empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
  documento: {
    numeroFormatado: '47',
    nomeCliente: 'Mariana Costa',
    motivo: 'Cliente desistiu da encomenda',
    percentualMulta: '10%',
    valorMulta: 'R$ 30,00',
    dataEmissao: '01/01/2026',
    dataAprovacao: '01/01/2026',
    prazoProducao: '15 dias úteis',
    inicioProducao: 'Assim que aprovado',
    dataCancelamento: '10/01/2026',
    itens: [],
  },
};

describe('GET /render/pdf-multa/:id?format=html', () => {
  test('payload de exemplo retorna 200 e HTML com os dados reais', async () => {
    const res = await request(app)
      .get('/render/pdf-multa/e5f5c3a0-0000-0000-0000-000000000022?format=html')
      .send(payloadPdfMultaValido);

    expect(res.status).toBe(200);
    expect(res.text).toContain('Cliente desistiu da encomenda');
    expect(res.text).toContain('R$ 30,00');
  });

  test('motivo=null não quebra a renderização', async () => {
    const payload = { ...payloadPdfMultaValido, documento: { ...payloadPdfMultaValido.documento, motivo: null } };

    const res = await request(app)
      .get('/render/pdf-multa/e5f5c3a0-0000-0000-0000-000000000023?format=html')
      .send(payload);

    expect(res.status).toBe(200);
  });

  test('campo obrigatório faltando retorna 400', async () => {
    const payload = JSON.parse(JSON.stringify(payloadPdfMultaValido));
    delete payload.documento.valorMulta;

    const res = await request(app)
      .get('/render/pdf-multa/e5f5c3a0-0000-0000-0000-000000000024?format=html')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.detalhes.some((d) => d.campo === 'documento.valorMulta')).toBe(true);
  });
});

const payloadReciboEstornoValido = {
  empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
  documento: {
    numeroFormatado: '47',
    nomeCliente: 'Mariana Costa',
    valorRecebido: 'R$ 150,00',
    dataEstorno: '05/01/2026',
  },
};

describe('GET /render/recibo-estorno/:id?format=html', () => {
  test('payload de exemplo retorna 200 e HTML com os dados reais', async () => {
    const res = await request(app)
      .get('/render/recibo-estorno/e5f5c3a0-0000-0000-0000-000000000025?format=html')
      .send(payloadReciboEstornoValido);

    expect(res.status).toBe(200);
    expect(res.text).toContain('Mariana Costa');
    expect(res.text).toContain('05/01/2026');
  });

  test('campo obrigatório faltando retorna 400', async () => {
    const payload = JSON.parse(JSON.stringify(payloadReciboEstornoValido));
    delete payload.documento.dataEstorno;

    const res = await request(app)
      .get('/render/recibo-estorno/e5f5c3a0-0000-0000-0000-000000000026?format=html')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.detalhes.some((d) => d.campo === 'documento.dataEstorno')).toBe(true);
  });
});

const payloadReciboPagamentoValido = {
  empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
  documento: {
    numeroFormatado: '47',
    nomeCliente: 'Mariana Costa',
    metodoPagamento: 'Pix',
    valorTotal: 'R$ 1.000,00',
    valorSinalPago: 'R$ 200,00',
    valorRestantePago: 'R$ 800,00',
    totalQuitado: 'R$ 1.000,00',
    dataEmissao: '01/01/2026',
    dataAprovacao: '01/01/2026',
    prazoProducao: '15 dias úteis',
    inicioProducao: 'Assim que aprovado',
    dataPagamento: '01/03/2026',
    itens: [],
  },
};

describe('GET /render/recibo-pagamento/:id?format=html', () => {
  test('payload de exemplo retorna 200 e HTML com os dados reais', async () => {
    const res = await request(app)
      .get('/render/recibo-pagamento/e5f5c3a0-0000-0000-0000-000000000027?format=html')
      .send(payloadReciboPagamentoValido);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Mariana Costa');
    expect(res.text).toContain('R$ 1.000,00');
  });

  test('campo obrigatório faltando retorna 400 com detalhe do campo', async () => {
    const payload = JSON.parse(JSON.stringify(payloadReciboPagamentoValido));
    delete payload.documento.totalQuitado;

    const res = await request(app)
      .get('/render/recibo-pagamento/e5f5c3a0-0000-0000-0000-000000000028?format=html')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.detalhes.some((d) => d.campo === 'documento.totalQuitado')).toBe(true);
  });
});

// Testes de format=pdf ficam em render.pdf.test.js — precisam mockar `puppeteer-core` e setar
// RENDER_TIMEOUT_SECONDS baixo antes do require de `../index`, o que exige módulo isolado.
