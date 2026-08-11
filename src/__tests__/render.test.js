const request = require('supertest');
const app = require('../index');

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
      .get('/render/pdf-multa/e5f5c3a0-0000-0000-0000-000000000005?format=html')
      .send(payloadValido);

    expect(res.status).toBe(400);
  });

  test('format=pdf retorna 501 (ainda não implementado)', async () => {
    const res = await request(app)
      .get('/render/orcamento/e5f5c3a0-0000-0000-0000-000000000006?format=pdf')
      .send(payloadValido);

    expect(res.status).toBe(501);
  });
});
