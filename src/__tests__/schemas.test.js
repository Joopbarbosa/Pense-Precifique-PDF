const {
  orcamentoSchema,
  reciboSinalSchema,
  pdfMultaSchema,
  reciboEstornoSchema,
  reciboPagamentoSchema,
} = require('../schemas');

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

describe('reciboSinalSchema', () => {
  const payloadValidoReciboSinal = {
    empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
    documento: {
      numeroFormatado: '47',
      nomeCliente: 'Mariana Costa',
      metodoRecebido: 'Pix',
      valorRecebido: 'R$ 150,00',
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

  test('payload válido passa a validação', () => {
    expect(reciboSinalSchema.safeParse(payloadValidoReciboSinal).success).toBe(true);
  });

  test('campo obrigatório faltando é rejeitado', () => {
    const payload = JSON.parse(JSON.stringify(payloadValidoReciboSinal));
    delete payload.documento.valorRecebido;
    expect(reciboSinalSchema.safeParse(payload).success).toBe(false);
  });
});

describe('pdfMultaSchema', () => {
  const payloadValidoPdfMulta = {
    empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
    documento: {
      numeroFormatado: '47',
      nomeCliente: 'Mariana Costa',
      motivo: 'Cliente desistiu da encomenda',
      percentualMulta: '10%',
      valorMulta: 'R$ 30,00',
      dataAprovacao: '01/01/2026',
      prazoProducao: '15 dias úteis',
      inicioProducao: 'Assim que aprovado',
      dataCancelamento: '10/01/2026',
      itens: [],
    },
  };

  test('payload válido passa a validação', () => {
    expect(pdfMultaSchema.safeParse(payloadValidoPdfMulta).success).toBe(true);
  });

  test('motivo aceita null explícito', () => {
    const payload = { ...payloadValidoPdfMulta, documento: { ...payloadValidoPdfMulta.documento, motivo: null } };
    expect(pdfMultaSchema.safeParse(payload).success).toBe(true);
  });

  test('campo obrigatório faltando é rejeitado', () => {
    const payload = JSON.parse(JSON.stringify(payloadValidoPdfMulta));
    delete payload.documento.valorMulta;
    expect(pdfMultaSchema.safeParse(payload).success).toBe(false);
  });
});

describe('reciboEstornoSchema', () => {
  const payloadValidoReciboEstorno = {
    empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
    documento: {
      numeroFormatado: '47',
      nomeCliente: 'Mariana Costa',
      valorRecebido: 'R$ 150,00',
      dataEstorno: '05/01/2026',
    },
  };

  test('payload válido passa a validação', () => {
    expect(reciboEstornoSchema.safeParse(payloadValidoReciboEstorno).success).toBe(true);
  });

  test('campo obrigatório faltando é rejeitado', () => {
    const payload = JSON.parse(JSON.stringify(payloadValidoReciboEstorno));
    delete payload.documento.dataEstorno;
    expect(reciboEstornoSchema.safeParse(payload).success).toBe(false);
  });
});

describe('reciboPagamentoSchema', () => {
  const payloadValidoReciboPagamento = {
    empresa: { nome: 'Studio da Ana', email: 'ana@studio.com', whatsapp: '(11) 99999-1234', logoUrl: null },
    documento: {
      numeroFormatado: '47',
      nomeCliente: 'Mariana Costa',
      metodoPagamento: 'Pix',
      valorTotal: 'R$ 1.000,00',
      valorSinalPago: 'R$ 200,00',
      valorRestantePago: 'R$ 800,00',
      totalQuitado: 'R$ 1.000,00',
      dataAprovacao: '01/01/2026',
      prazoProducao: '15 dias úteis',
      inicioProducao: 'Assim que aprovado',
      dataPagamento: '01/03/2026',
      itens: [],
    },
  };

  test('payload válido passa a validação', () => {
    expect(reciboPagamentoSchema.safeParse(payloadValidoReciboPagamento).success).toBe(true);
  });

  test('campo obrigatório faltando é rejeitado', () => {
    const payload = JSON.parse(JSON.stringify(payloadValidoReciboPagamento));
    delete payload.documento.totalQuitado;
    expect(reciboPagamentoSchema.safeParse(payload).success).toBe(false);
  });
});
