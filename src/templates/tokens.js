// Cores usadas nos templates de documento. CSS-in-JS inline continua sendo a arquitetura (ver
// ARCHITECTURE.md — Puppeteer não pode depender de CSS externo) — este arquivo só centraliza os
// valores hex em vez de repeti-los como literais em cada componente. Mudança de cor de marca
// passa a ser 1 edição aqui, não N edições espalhadas.
module.exports = {
  ink: '#3A372F', // texto principal
  teal: '#2A9D8F', // marca — cor primária
  orange: '#F97316', // marca — cor de destaque (total, wordmark)
  orangeLight: '#FFE5D5', // fundo do total
  labelMuted: '#B0ACA4', // rótulos uppercase secundários (datas, método, observações)
  tableLabel: '#9A968E', // rótulos de cabeçalho de tabela / texto do rodapé
  borderLight: '#F0EEE9', // bordas e divisores claros
  borderSubtle: '#C0BCB4', // borda de estado vazio (customização ausente)
  textMuted: '#5C594F', // texto secundário (descrições, totais)
  textSecondary: '#7C786F', // contato, subvalores
  red: '#C0492B', // valor de desconto
  white: '#FFFFFF',
  offWhite: '#FBFAF8', // fundo da seção de observações
};
