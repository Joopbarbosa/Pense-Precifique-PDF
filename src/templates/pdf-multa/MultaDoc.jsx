const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (V0.8.1) — layout aprovado no Claude Design (mock "Multa-PDF.html", ver
// contrato-pdf.md seção 2.1/7). pdfMultaSchema não tem dataCancelamento/valorOriginal/insumos
// consumidos/instrução de pagamento (só os 8 campos abaixo) — essas seções do mock não são
// reproduzidas aqui por falta de dado real. `motivo` é o único campo nullable (sem fallback no
// PdfMapper.java) — seção "Motivo" some quando ausente. Sem SignatureBlock (mesma decisão já
// registrada em decisoes-pdf.md).
const RED_SOFT = 'rgba(192,73,43,0.08)';
const RED_LINE = 'rgba(192,73,43,0.24)';

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
    color: COLORS.red,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
  tituloCard: {
    marginTop: '22px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: RED_SOFT,
    border: `1px solid ${RED_LINE}`,
    borderLeft: `4px solid ${COLORS.red}`,
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
    border: `1px solid ${RED_LINE}`,
    color: COLORS.red,
  },
  tituloHeading: { fontSize: '13px', fontWeight: 'bold', color: COLORS.red, letterSpacing: '-0.005em' },
  tituloSub: { fontSize: '8.5px', color: '#8A5A4E', marginTop: '3px' },
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
  motivoSection: { marginTop: '16px', padding: '13px 15px', borderRadius: '9px', backgroundColor: COLORS.offWhite, border: `1px solid ${COLORS.borderLight}` },
  motivoLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '5px',
  },
  motivoValue: { fontSize: '9.5px', color: COLORS.ink, lineHeight: 1.5 },
  detalhesCard: { marginTop: '18px', borderRadius: '10px', border: `1px solid ${COLORS.borderLight}`, overflow: 'hidden' },
  detalhesLinha: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: `1px solid ${COLORS.borderLight}`,
    fontSize: '9.5px',
  },
  detalhesLinhaLabel: { color: COLORS.textMuted },
  detalhesLinhaValue: { fontWeight: 600, color: COLORS.ink },
  valorMultaLinha: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '13px 15px',
    backgroundColor: RED_SOFT,
  },
  valorMultaLabel: { fontSize: '10px', fontWeight: 'bold', color: COLORS.red },
  valorMultaAmount: { fontSize: '19px', fontWeight: 'bold', color: COLORS.red, letterSpacing: '-0.01em' },
  datasGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '22px',
    padding: '18px 0',
    borderTop: `1px solid ${COLORS.borderLight}`,
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
};

function IconeAlerta() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M12 4 21.5 20.5h-19L12 4Z' }),
    React.createElement('path', { d: 'M12 10.5v4.5', strokeWidth: '2' }),
    React.createElement('circle', { cx: '12', cy: '18', r: '0.5', fill: 'currentColor', stroke: 'none' }),
  );
}

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
      React.createElement('div', { style: styles.headerRightLabel }, 'Orçamento'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),

    React.createElement(
      'div',
      { style: styles.tituloCard },
      React.createElement('span', { style: styles.tituloIconeChip }, React.createElement(IconeAlerta)),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.tituloHeading }, 'NOTIFICAÇÃO DE MULTA POR CANCELAMENTO'),
        React.createElement('div', { style: styles.tituloSub }, 'Referência: Orçamento #' + numeroFormatado),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.clienteSection },
      React.createElement('div', { style: styles.clienteLabel }, 'Dados da cliente'),
      React.createElement('div', { style: styles.clienteNome }, nomeCliente),
    ),

    motivo
      ? React.createElement(
          'div',
          { style: styles.motivoSection },
          React.createElement('div', { style: styles.motivoLabel }, 'Motivo'),
          React.createElement('div', { style: styles.motivoValue }, motivo),
        )
      : null,

    React.createElement(
      'div',
      { style: styles.detalhesCard },
      React.createElement(
        'div',
        { style: styles.detalhesLinha },
        React.createElement('span', { style: styles.detalhesLinhaLabel }, 'Percentual de multa aplicado'),
        React.createElement('span', { style: styles.detalhesLinhaValue }, percentualMulta),
      ),
      React.createElement(
        'div',
        { style: styles.valorMultaLinha },
        React.createElement('span', { style: styles.valorMultaLabel }, 'Valor da multa'),
        React.createElement('span', { style: styles.valorMultaAmount }, valorMulta),
      ),
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
