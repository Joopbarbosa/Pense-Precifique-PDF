const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (Frente A) — mesmo estilo visual de OrcamentoDoc.jsx/ReciboSinalDoc.jsx (sem mock
// aprovado no Claude Design, ver contrato-pdf.md). `inicioProducao` incluído por decisão explícita
// (dado já calculado pelo PdfMapper.java; o Thymeleaf original nunca o exibia — ver
// decisoes-pdf.md, Divergências de Premissa). Sem SignatureBlock (mesma decisão de ReciboSinalDoc).
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
  motivoSection: { padding: '14px 0', borderBottom: `1px solid ${COLORS.borderLight}` },
  valorSection: {
    marginTop: '24px',
    padding: '16px 18px',
    borderRadius: '12px',
    backgroundColor: COLORS.orangeLight,
    border: '1.5px solid rgba(249,115,22,0.35)',
  },
  valorLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  valorAmount: { fontSize: '20px', fontWeight: 'bold', color: COLORS.orange, marginTop: '4px' },
  valorSub: { fontSize: '9px', color: COLORS.textMuted, marginTop: '4px' },
  datasGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '22px',
    padding: '22px 0',
    borderBottom: `1px solid ${COLORS.borderLight}`,
  },
};

function MultaDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    motivo,
    percentualMulta,
    valorMulta,
    dataAprovacao,
    prazoProducao,
    inicioProducao,
  } = documento;

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Notificação de Cancelamento'),
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
        React.createElement('div', { style: styles.metaLabel }, 'Percentual de multa'),
        React.createElement('div', { style: styles.metaValue }, percentualMulta),
      ),
    ),

    motivo
      ? React.createElement(
          'div',
          { style: styles.motivoSection },
          React.createElement('div', { style: styles.metaLabel }, 'Motivo'),
          React.createElement('div', { style: styles.metaValue }, motivo),
        )
      : null,

    React.createElement(
      'div',
      { style: styles.valorSection },
      React.createElement('div', { style: styles.valorLabel }, 'Valor da multa'),
      React.createElement('div', { style: styles.valorAmount }, valorMulta),
    ),

    React.createElement(
      'div',
      { style: styles.datasGrid },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Data de aprovação'),
        React.createElement('div', { style: styles.metaValue }, dataAprovacao),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Prazo de produção'),
        React.createElement('div', { style: styles.metaValue }, prazoProducao),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Início estimado'),
        React.createElement('div', { style: styles.metaValue }, inicioProducao),
      ),
    ),

    React.createElement(
      DocumentFooter,
      null,
      'Notificação de cancelamento do orçamento #' + numeroFormatado,
      '.',
    ),
  );
}

module.exports = MultaDoc;
