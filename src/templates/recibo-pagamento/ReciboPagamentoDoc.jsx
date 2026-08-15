const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (último dos 4 documentos da Epic) — mesmo estilo visual de ReciboSinalDoc.jsx/
// MultaDoc.jsx/ReciboEstornoDoc.jsx (sem mock aprovado no Claude Design para este tipo, ver
// contrato-pdf.md). Sem tabela de itens (documento é resumo de valores, não lista itens) e sem
// SignatureBlock (decisão explícita — o template Thymeleaf original não tinha seção de
// assinatura, ver decisoes-pdf.md).
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
  valoresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '22px',
  },
  valorLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  valorValue: { fontSize: '13px', fontWeight: 'bold', color: COLORS.ink },
  totalSection: {
    marginTop: '20px',
    padding: '16px 18px',
    borderRadius: '12px',
    backgroundColor: COLORS.orangeLight,
    textAlign: 'center',
  },
  totalLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.ink,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  totalAmount: { fontSize: '20px', fontWeight: 'bold', color: COLORS.orange, marginTop: '4px' },
  datasGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '22px',
    padding: '22px 0',
    borderBottom: `1px solid ${COLORS.borderLight}`,
  },
  datasGridSecundario: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '16px',
  },
};

function ReciboPagamentoDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    metodoPagamento,
    valorTotal,
    valorSinalPago,
    valorRestantePago,
    totalQuitado,
    dataAprovacao,
    prazoProducao,
    inicioProducao,
    dataPagamento,
  } = documento;

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Recibo de Pagamento'),
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
        React.createElement('div', { style: styles.metaLabel }, 'Método de pagamento'),
        React.createElement('div', { style: styles.metaValue }, metodoPagamento),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.valoresGrid },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.valorLabel }, 'Valor total'),
        React.createElement('div', { style: styles.valorValue }, valorTotal),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.valorLabel }, 'Sinal pago'),
        React.createElement('div', { style: styles.valorValue }, valorSinalPago),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.valorLabel }, 'Restante pago'),
        React.createElement('div', { style: styles.valorValue }, valorRestantePago),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.totalSection },
      React.createElement('div', { style: styles.totalLabel }, 'Total quitado'),
      React.createElement('div', { style: styles.totalAmount }, totalQuitado),
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
      'div',
      { style: styles.datasGridSecundario },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Data de pagamento'),
        React.createElement('div', { style: styles.metaValue }, dataPagamento),
      ),
    ),

    React.createElement(
      DocumentFooter,
      null,
      'Recibo referente ao pagamento do orçamento #' + numeroFormatado,
      '.',
    ),
  );
}

module.exports = ReciboPagamentoDoc;
