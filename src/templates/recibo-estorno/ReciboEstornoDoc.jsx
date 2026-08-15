const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (Frente A) — o mais simples dos 3: template Thymeleaf original só tinha
// numeroFormatado/nomeCliente/valorRecebido/dataEstorno, sem seção de datas de
// aprovação/produção. Mesmo estilo visual de OrcamentoDoc.jsx, sem SignatureBlock (mesma decisão
// de ReciboSinalDoc/MultaDoc).
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
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '22px',
    padding: '22px 0',
    borderBottom: `1px solid ${COLORS.borderLight}`,
  },
  metaLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  metaValue: { fontSize: '10px', fontWeight: 600, color: COLORS.ink, margin: '4px 0' },
  valorSection: {
    marginTop: '24px',
    padding: '16px 18px',
    borderRadius: '12px',
    backgroundColor: 'rgba(42,157,143,0.05)',
    border: '1.5px solid rgba(42,157,143,0.4)',
  },
  valorLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  valorAmount: { fontSize: '20px', fontWeight: 'bold', color: COLORS.teal, marginTop: '4px' },
};

function ReciboEstornoDoc({ empresa, documento }) {
  const { numeroFormatado, nomeCliente, valorRecebido, dataEstorno } = documento;

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Recibo de Estorno'),
      React.createElement('div', { style: styles.headerRightNumero }, 'Orçamento #' + numeroFormatado),
    ),

    React.createElement(
      'div',
      { style: styles.metaGrid },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Cliente'),
        React.createElement('div', { style: styles.metaValue }, nomeCliente),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Data do estorno'),
        React.createElement('div', { style: styles.metaValue }, dataEstorno),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.valorSection },
      React.createElement('div', { style: styles.valorLabel }, 'Valor estornado'),
      React.createElement('div', { style: styles.valorAmount }, valorRecebido),
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
