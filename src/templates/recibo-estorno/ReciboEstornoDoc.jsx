const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (V0.8.1) — sem Design próprio no Claude Design (não existe mock para este tipo,
// ver contrato-pdf.md/decisoes-pdf.md); segue o mesmo padrão visual (icon chip + card de destaque)
// dos outros 3 documentos recém-migrados. Cor de destaque `orange` — mesmo acento já usado para
// estorno em DetalheOrcamentoPage.tsx (card do passo 2 do wizard de cancelamento com estorno,
// frontend), reaproveitado aqui por consistência. reciboEstornoSchema só tem 4 campos (sem
// dataAprovacao/prazoProducao/inicioProducao) — nenhuma seção "Próximos passos"/"Instrução de
// pagamento" aqui: um estorno não tem próximo pagamento a instruir, e não há dado real pras
// datas de produção. Sem SignatureBlock (mesma decisão já registrada em decisoes-pdf.md).
const ORANGE_SOFT = 'rgba(249,115,22,0.08)';
const ORANGE_LINE = 'rgba(249,115,22,0.28)';

const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    padding: '40px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '11px',
    color: COLORS.ink,
    lineHeight: 1.4,
  },
  headerRightLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
  tituloCard: {
    marginTop: '22px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: ORANGE_SOFT,
    border: `1px solid ${ORANGE_LINE}`,
    borderLeft: `4px solid ${COLORS.orange}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tituloIconeChip: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    backgroundColor: COLORS.white,
    border: `1px solid ${ORANGE_LINE}`,
    color: COLORS.orange,
  },
  tituloHeading: { fontSize: '13px', fontWeight: 'bold', color: COLORS.orange, letterSpacing: '-0.005em' },
  tituloSub: { fontSize: '8.5px', color: '#8A5A33', marginTop: '3px' },
  clienteSection: { padding: '18px 0 0' },
  clienteLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '5px',
  },
  clienteNome: { fontSize: '11.5px', fontWeight: 'bold', color: COLORS.ink },
  destaqueCard: {
    marginTop: '18px',
    padding: '16px 18px',
    borderRadius: '11px',
    border: `1.2px solid ${ORANGE_LINE}`,
    backgroundColor: 'rgba(249,115,22,0.045)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '16px',
  },
  valorLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  valorAmount: { fontSize: '22px', fontWeight: 'bold', color: COLORS.orange, marginTop: '3px', letterSpacing: '-0.01em' },
  metaLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metaValue: { fontSize: '9.5px', fontWeight: 600, color: COLORS.ink, marginTop: '2px' },
};

function IconeEstorno() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M4 10.5a8 8 0 1 1 2.1 6.4' }),
    React.createElement('path', { d: 'M4 5.5v5h5' }),
  );
}

function ReciboEstornoDoc({ empresa, documento }) {
  const { numeroFormatado, nomeCliente, valorRecebido, dataEstorno } = documento;

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Orçamento'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),

    React.createElement(
      'div',
      { style: styles.tituloCard },
      React.createElement('span', { style: styles.tituloIconeChip }, React.createElement(IconeEstorno)),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.tituloHeading }, 'RECIBO DE ESTORNO'),
        React.createElement('div', { style: styles.tituloSub }, 'Referência: Orçamento #' + numeroFormatado),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.clienteSection },
      React.createElement('div', { style: styles.clienteLabel }, 'Dados da cliente'),
      React.createElement('div', { style: styles.clienteNome }, nomeCliente),
    ),

    React.createElement(
      'div',
      { style: styles.destaqueCard },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.valorLabel }, 'Valor estornado'),
        React.createElement('div', { style: styles.valorAmount }, valorRecebido),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Data do estorno'),
        React.createElement('div', { style: styles.metaValue }, dataEstorno),
      ),
    ),

    React.createElement(
      DocumentFooter,
      null,
      'Recibo de estorno referente ao orçamento #' + numeroFormatado,
      '.',
    ),
  );
}

module.exports = ReciboEstornoDoc;
