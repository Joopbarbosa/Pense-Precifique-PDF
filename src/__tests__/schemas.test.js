const { orcamentoSchema } = require('../schemas');

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

describe('orcamentoSchema', () => {
  test('payload de exemplo do contrato passa a validação', () => {
    const resultado = orcamentoSchema.safeParse(payloadValido);
    expect(resultado.success).toBe(true);
  });

  test('campos opcionais aceitam null explícito (desconto, valorSinal, restanteAposSinal, logoUrl)', () => {
    const payload = {
      empresa: { ...payloadValido.empresa, logoUrl: null },
      documento: {
        ...payloadValido.documento,
        sinalAtivo: false,
        valorSinal: null,
        restanteAposSinal: null,
        desconto: null,
      },
    };
    const resultado = orcamentoSchema.safeParse(payload);
    expect(resultado.success).toBe(true);
  });

  test('campo obrigatório faltando é rejeitado', () => {
    const payload = JSON.parse(JSON.stringify(payloadValido));
    delete payload.documento.nomeCliente;

    const resultado = orcamentoSchema.safeParse(payload);
    expect(resultado.success).toBe(false);
    expect(resultado.error.issues.some((issue) => issue.path.join('.') === 'documento.nomeCliente')).toBe(true);
  });

  test('undefined não é aceito no lugar de null explícito', () => {
    const payload = JSON.parse(JSON.stringify(payloadValido));
    delete payload.documento.desconto;

    const resultado = orcamentoSchema.safeParse(payload);
    expect(resultado.success).toBe(false);
  });
});
