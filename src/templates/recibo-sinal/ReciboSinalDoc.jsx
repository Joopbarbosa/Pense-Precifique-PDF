const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (Frente A) — mesmo estilo visual de OrcamentoDoc.jsx (sem mock aprovado no Claude
// Design para este tipo, ver contrato-pdf.md). Sem tabela de itens (documento de recibo simples,
// 1 valor só) e sem SignatureBlock (decisão explícita — nenhum template Thymeleaf original tinha
// seção de assinatura, ver decisoes-pdf.md).
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
  datasGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '22px',
    padding: '22px 0',
    borderBottom: `1px solid ${COLORS.borderLight}`,
  },
};

function ReciboSinalDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    metodoRecebido,
    valorRecebido,
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
      React.createElement('div', { style: styles.headerRightLabel }, 'Recibo de Sinal'),
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
        React.createElement('div', { style: styles.metaLabel }, 'Método recebido'),
        React.createElement('div', { style: styles.metaValue }, metodoRecebido),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.valorSection },
      React.createElement('div', { style: styles.valorLabel }, 'Valor do sinal recebido'),
      React.createElement('div', { style: styles.valorAmount }, valorRecebido),
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
      'Recibo referente ao sinal do orçamento #' + numeroFormatado,
      '.',
    ),
  );
}

module.exports = ReciboSinalDoc;
