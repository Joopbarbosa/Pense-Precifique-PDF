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
    observacoes: 'Embalagem para presente incluída.',
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

  test('observacoes preenchida aparece no HTML renderizado', async () => {
    const res = await request(app)
      .get('/render/recibo-sinal/e5f5c3a0-0000-0000-0000-000000000022?format=html')
      .send(payloadReciboSinalValido);

    expect(res.status).toBe(200);
    expect(res.text).toContain('Embalagem para presente incluída.');
  });

  test('observacoes=null não renderiza a seção', async () => {
    const payload = {
      ...payloadReciboSinalValido,
      documento: { ...payloadReciboSinalValido.documento, observacoes: null },
    };

    const res = await request(app)
      .get('/render/recibo-sinal/e5f5c3a0-0000-0000-0000-000000000023?format=html')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('Observações');
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
    telefoneCliente: '(11) 98888-7777',
    emailCliente: 'mariana@email.com',
    valorRecebido: 'R$ 150,00',
    dataEstorno: '05/01/2026',
    dataEmissao: '20/08/2026',
    dataAprovacao: '01/01/2026',
    motivo: 'Cliente desistiu da encomenda',
    itens: [
      {
        nomeProduto: 'Bolo Vulcão de Chocolate',
        customizacoes: null,
        quantidade: '1',
        precoUnitario: 'R$ 150,00',
        subtotal: 'R$ 150,00',
      },
    ],
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
    observacoes: 'Embalagem para presente incluída.',
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

  test('observacoes preenchida aparece no HTML renderizado', async () => {
    const res = await request(app)
      .get('/render/recibo-pagamento/e5f5c3a0-0000-0000-0000-000000000029?format=html')
      .send(payloadReciboPagamentoValido);

    expect(res.status).toBe(200);
    expect(res.text).toContain('Embalagem para presente incluída.');
  });

  test('observacoes=null não renderiza a seção', async () => {
    const payload = {
      ...payloadReciboPagamentoValido,
      documento: { ...payloadReciboPagamentoValido.documento, observacoes: null },
    };

    const res = await request(app)
      .get('/render/recibo-pagamento/e5f5c3a0-0000-0000-0000-000000000030?format=html')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('Observações');
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

const payloadCatalogoValido = {
  empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
  documento: {
    numeroFormatado: '3',
    nome: 'Kit Presente Dia das Mães',
    itens: [
      { nome: 'Kit Presente P', descricao: 'Sabonete + fita de cetim', fotoUrl: 'https://exemplo.r2.dev/foto1.jpg', precoVenda: 'R$ 45,90' },
      { nome: 'Kit Presente G', descricao: null, fotoUrl: null, precoVenda: 'R$ 68,00' },
    ],
  },
};

describe('GET /render/catalogo/:id?format=html', () => {
  test('payload de exemplo retorna 200 e HTML com os dados reais', async () => {
    const res = await request(app)
      .get('/render/catalogo/e5f5c3a0-0000-0000-0000-000000000040?format=html')
      .send(payloadCatalogoValido);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Kit Presente Dia das Mães');
    expect(res.text).toContain('Kit Presente P');
    expect(res.text).toContain('Sabonete + fita de cetim');
    expect(res.text).toContain('https://exemplo.r2.dev/foto1.jpg');
    expect(res.text).toContain('R$ 45,90');
    // Cabeçalho mostra o identificador do catálogo (número), não o nome — nome só aparece
    // 1x, no título da seção (achado do teste manual, corrige duplicação).
    expect(res.text).toContain('#3');
    expect((res.text.match(/Kit Presente Dia das Mães/g) || []).length).toBe(1);
  });

  test('item sem foto renderiza placeholder (sem <img>) e sem descrição não quebra', async () => {
    const payload = { ...payloadCatalogoValido, documento: { ...payloadCatalogoValido.documento, itens: [payloadCatalogoValido.documento.itens[1]] } };

    const res = await request(app)
      .get('/render/catalogo/e5f5c3a0-0000-0000-0000-000000000041?format=html')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.text).toContain('Kit Presente G');
    expect(res.text).toContain('R$ 68,00');
    expect(res.text).not.toContain('<img');
  });

  test('campo obrigatório faltando retorna 400 com detalhe do campo', async () => {
    const payload = JSON.parse(JSON.stringify(payloadCatalogoValido));
    delete payload.documento.nome;

    const res = await request(app)
      .get('/render/catalogo/e5f5c3a0-0000-0000-0000-000000000042?format=html')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.detalhes.some((d) => d.campo === 'documento.nome')).toBe(true);
  });
});

// OpenProject #545 (V0.15.0, RN-NOVA-11) — PDF da compra.
const payloadCompraValido = {
  empresa: { nome: 'Studio da Ana', email: null, whatsapp: null, logoUrl: null },
  documento: {
    numeroFormatado: 'COM-7',
    status: 'Confirmada',
    statusCodigo: 'CONFIRMADA',
    dataCompra: '20/09/2026',
    fornecedor: 'Papelaria Central',
    multiplosFornecedores: false,
    pagamento: 'Pago — Pix',
    total: 'R$ 295,00',
    observacoes: 'Entrega na terça.',
    dataCancelamento: null,
    observacaoCancelamento: null,
    itens: [
      { insumo: 'Papel Couché 250g', fornecedor: 'Papelaria Central', quantidade: '500 un', precoTotal: 'R$ 250,00', precoUnitario: 'R$ 0,50' },
      { insumo: 'Cola Branca 1L', fornecedor: 'Papelaria Central', quantidade: '3 un', precoTotal: 'R$ 45,00', precoUnitario: 'R$ 15,00' },
    ],
  },
};

describe('GET /render/compra/:id?format=html', () => {
  test('compra confirmada renderiza itens, total e pagamento, sem faixa de rascunho', async () => {
    const res = await request(app)
      .get('/render/compra/e5f5c3a0-0000-0000-0000-000000000050?format=html')
      .send(payloadCompraValido);

    expect(res.status).toBe(200);
    expect(res.text).toContain('COM-7');
    expect(res.text).toContain('Papel Couché 250g');
    expect(res.text).toContain('R$ 295,00');
    expect(res.text).toContain('Pago — Pix');
    expect(res.text).toContain('Entrega na terça.');
    expect(res.text).not.toContain('Rascunho — compra ainda não confirmada');
    // modo fornecedor único: sem coluna "Fornecedor" na tabela
    expect(res.text).not.toContain('>Fornecedor</th>');
  });

  test('rascunho e cancelada saem destacados; múltiplos fornecedores mostra a coluna', async () => {
    const rascunho = { ...payloadCompraValido, documento: { ...payloadCompraValido.documento, status: 'Rascunho', statusCodigo: 'RASCUNHO', multiplosFornecedores: true, fornecedor: 'Vários fornecedores' } };
    const r1 = await request(app).get('/render/compra/e5f5c3a0-0000-0000-0000-000000000051?format=html').send(rascunho);
    expect(r1.status).toBe(200);
    expect(r1.text).toContain('Rascunho — compra ainda não confirmada');
    expect(r1.text).toContain('>Fornecedor</th>');

    const cancelada = { ...payloadCompraValido, documento: { ...payloadCompraValido.documento, status: 'Cancelada', statusCodigo: 'CANCELADA', dataCancelamento: '22/09/2026', observacaoCancelamento: 'Fornecedor entregou o pedido errado.' } };
    const r2 = await request(app).get('/render/compra/e5f5c3a0-0000-0000-0000-000000000052?format=html').send(cancelada);
    expect(r2.text).toContain('Compra cancelada');
    expect(r2.text).toContain('Fornecedor entregou o pedido errado.');
  });

  test('statusCodigo fora do enum retorna 400', async () => {
    const payload = { ...payloadCompraValido, documento: { ...payloadCompraValido.documento, statusCodigo: 'PAGA' } };
    const res = await request(app).get('/render/compra/e5f5c3a0-0000-0000-0000-000000000053?format=html').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.detalhes.some((d) => d.campo === 'documento.statusCodigo')).toBe(true);
  });
});

// OpenProject #547 (V0.15.0, RN-NOVA-14) — PDF da lista de compras.
const payloadListaValido = {
  empresa: { nome: 'Studio da Ana', email: null, whatsapp: null, logoUrl: null },
  documento: {
    numeroFormatado: 'LST-3',
    dataGeracao: '26/09/2026',
    quantidadeItens: 3,
    grupos: [
      { fornecedor: 'Atacado Arte', itens: [{ insumo: 'Cola Branca 1L', unidade: 'un', quantidade: '4', precoReferencia: 'R$ 13,50' }] },
      { fornecedor: 'Papelaria Central', itens: [{ insumo: 'Papel Couché 250g', unidade: 'un', quantidade: '100', precoReferencia: 'R$ 0,50' }] },
      { fornecedor: 'Sem fornecedor', itens: [{ insumo: 'Papel Kraft', unidade: 'folha', quantidade: '2,5', precoReferencia: null }] },
    ],
  },
};

describe('GET /render/lista-compras/:id?format=html', () => {
  test('agrupa por fornecedor e mostra "—" sem preço de referência', async () => {
    const res = await request(app)
      .get('/render/lista-compras/e5f5c3a0-0000-0000-0000-000000000060?format=html')
      .send(payloadListaValido);

    expect(res.status).toBe(200);
    expect(res.text).toContain('LST-3');
    expect(res.text).toContain('Atacado Arte');
    expect(res.text).toContain('Sem fornecedor');
    expect(res.text).toContain('R$ 13,50');
    expect(res.text).toContain('Papel Kraft');
    expect(res.text).toContain('—');
    expect(res.text.indexOf('Atacado Arte')).toBeLessThan(res.text.indexOf('Sem fornecedor'));
  });

  test('quantidadeItens não inteiro retorna 400', async () => {
    const payload = { ...payloadListaValido, documento: { ...payloadListaValido.documento, quantidadeItens: '3' } };
    const res = await request(app).get('/render/lista-compras/e5f5c3a0-0000-0000-0000-000000000061?format=html').send(payload);
    expect(res.status).toBe(400);
  });
});

// Testes de format=pdf ficam em render.pdf.test.js — precisam mockar `puppeteer-core` e setar
// RENDER_TIMEOUT_SECONDS baixo antes do require de `../index`, o que exige módulo isolado.
