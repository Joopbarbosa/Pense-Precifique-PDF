const { z } = require('zod');

// Todo valor monetário/data já chega formatado como string pelo backend (ex: "R$ 300,00",
// "10/08/2026") — o microsserviço não formata nada, só valida forma e renderiza. Ver
// contrato-pdf.md seção 1.

const empresaSchema = z.object({
  nome: z.string(),
  // email/whatsapp não estão na lista de "aceita null" do contrato, mas o PdfMapper.java atual
  // já trata os dois como opcionais (th:if) — mantidos nullable aqui para não quebrar payload
  // real; achado registrado em DECISOES_V0.8.md para confirmação na Retomada.
  email: z.string().nullable(),
  whatsapp: z.string().nullable(),
  logoUrl: z.string().nullable(),
});

const itemPdfSchema = z.object({
  nomeProduto: z.string(),
  customizacoes: z.string().nullable(),
  quantidade: z.string(),
  precoUnitario: z.string(),
  subtotal: z.string(),
});

const documentoOrcamentoSchema = z.object({
  numeroFormatado: z.string(),
  status: z.string(),
  nomeCliente: z.string(),
  dataEmissao: z.string(),
  dataValidade: z.string(),
  prazoProducao: z.string(),
  inicioProducao: z.string(),
  metodoPagamento: z.string(),
  sinalAtivo: z.boolean(),
  // nullable explícito (não só optional) — contrato exige a chave presente mesmo quando o valor
  // não se aplica (ex: sinalAtivo=false → valorSinal/restanteAposSinal=null).
  valorSinal: z.string().nullable(),
  restanteAposSinal: z.string().nullable(),
  subtotal: z.string(),
  desconto: z.string().nullable(),
  total: z.string(),
  // mesma nota de email/whatsapp acima — não listado explicitamente no contrato como nullable,
  // mas orçamento sem observações é um caso real (PdfMapper.java: orc.getObservacoes() pode ser
  // null). Ver DECISOES_V0.8.md.
  observacoes: z.string().nullable(),
  itens: z.array(itemPdfSchema),
  // Campos novos do layout aprovado no Claude Design (regressão #89) — `PdfMapper.java` ainda não
  // os popula, por isso `.optional()` além de `.nullable()`: payload atual do backend (sem essas
  // chaves) continua válido até a Retomada que atualizar o mapper. Ver pendência em
  // contrato-pdf.md. Quando ausentes, o componente renderiza sem a informação (sem inventar
  // dado/cálculo — contrato do microsserviço não formata nem calcula nada, só o que recebe).
  telefoneCliente: z.string().nullable().optional(),
  emailCliente: z.string().nullable().optional(),
  percentualDesconto: z.string().nullable().optional(),
  percentualSinal: z.string().nullable().optional(),
});

const orcamentoSchema = z.object({
  empresa: empresaSchema,
  documento: documentoOrcamentoSchema,
});

// Os 3 schemas abaixo (#248) migram recibo-sinal/pdf-multa/recibo-estorno do fluxo Thymeleaf
// local do backend para este microsserviço. Campos sem `.nullable()` correspondem a valores que
// o PdfMapper.java sempre resolve com fallback "—" antes de enviar (nunca null); `motivo` é
// exceção — o mapper não aplica fallback nesse campo (`orc.getCancelamentoMotivo()` direto), por
// isso fica nullable aqui também.

const documentoReciboSinalSchema = z.object({
  numeroFormatado: z.string(),
  nomeCliente: z.string(),
  telefoneCliente: z.string().nullable().optional(),
  emailCliente: z.string().nullable().optional(),
  metodoRecebido: z.string(),
  valorRecebido: z.string(),
  dataEmissao: z.string(),
  dataAprovacao: z.string(),
  prazoProducao: z.string(),
  inicioProducao: z.string(),
  // P-F007b — restaura "Detalhes do pedido"/"Próximos passos" do mock ("Recibo do Sinal -
  // standalone"), cortadas na migração #248 por o schema original não ter itens/totais.
  // `itemPdfSchema` reaproveitado tal qual (precoUnitario/subtotal chegam preenchidos mas não são
  // exibidos nesta tabela de 3 colunas — mesma origem de dado do Orçamento, sem schema paralelo).
  itens: z.array(itemPdfSchema),
  valorTotalPedido: z.string(),
  percentualSinal: z.string(),
  restante: z.string(),
  // P-F012 — mesmo tratamento de `motivo` em documentoPdfMultaSchema: PdfMapper.java não aplica
  // fallback "—" (orc.getObservacoes() direto), fica nullable também aqui.
  observacoes: z.string().nullable(),
});

const reciboSinalSchema = z.object({
  empresa: empresaSchema,
  documento: documentoReciboSinalSchema,
});

const documentoPdfMultaSchema = z.object({
  numeroFormatado: z.string(),
  nomeCliente: z.string(),
  telefoneCliente: z.string().nullable().optional(),
  emailCliente: z.string().nullable().optional(),
  motivo: z.string().nullable(),
  percentualMulta: z.string(),
  valorMulta: z.string(),
  dataEmissao: z.string(),
  dataAprovacao: z.string(),
  prazoProducao: z.string(),
  inicioProducao: z.string(),
  dataCancelamento: z.string(),
  itens: z.array(itemPdfSchema),
});

const pdfMultaSchema = z.object({
  empresa: empresaSchema,
  documento: documentoPdfMultaSchema,
});

// P-F014 (V0.8.1) — ampliado para o padrão de 9 seções, paridade com documentoPdfMultaSchema
// (payload de backend ganhou os campos novos em P-B004). Sem prazoProducao/inicioProducao — mesma
// decisão já usada em pdfMultaSchema (cancelamento sem produção remanescente), o Doc.jsx usa "—"
// fixo para essas duas linhas em vez de ler do payload.
const documentoReciboEstornoSchema = z.object({
  numeroFormatado: z.string(),
  nomeCliente: z.string(),
  telefoneCliente: z.string().nullable().optional(),
  emailCliente: z.string().nullable().optional(),
  valorRecebido: z.string(),
  dataEstorno: z.string(),
  dataEmissao: z.string(),
  dataAprovacao: z.string(),
  // mesmo tratamento de `motivo` em documentoPdfMultaSchema: PdfMapper.java não aplica fallback
  // "—" (orc.getCancelamentoMotivo() direto), fica nullable também aqui.
  motivo: z.string().nullable(),
  itens: z.array(itemPdfSchema),
});

const reciboEstornoSchema = z.object({
  empresa: empresaSchema,
  documento: documentoReciboEstornoSchema,
});

const documentoReciboPagamentoSchema = z.object({
  numeroFormatado: z.string(),
  nomeCliente: z.string(),
  telefoneCliente: z.string().nullable().optional(),
  emailCliente: z.string().nullable().optional(),
  metodoPagamento: z.string(),
  valorTotal: z.string(),
  valorSinalPago: z.string(),
  valorRestantePago: z.string(),
  totalQuitado: z.string(),
  dataEmissao: z.string(),
  dataAprovacao: z.string(),
  prazoProducao: z.string(),
  inicioProducao: z.string(),
  dataPagamento: z.string(),
  itens: z.array(itemPdfSchema),
  observacoes: z.string().nullable(),
});

const reciboPagamentoSchema = z.object({
  empresa: empresaSchema,
  documento: documentoReciboPagamentoSchema,
});

module.exports = {
  orcamentoSchema,
  reciboSinalSchema,
  pdfMultaSchema,
  reciboEstornoSchema,
  reciboPagamentoSchema,
};
