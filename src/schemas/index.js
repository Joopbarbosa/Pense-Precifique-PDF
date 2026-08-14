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

module.exports = { orcamentoSchema };
