const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248/PB003 (V0.8.1, fecha a Epic) — layout aprovado no Claude Design (mock
// "Recibo-Pagamento.html", ver contrato-pdf.md seção 2.1/9). Cor de destaque é `success` (verde),
// não `teal` — mesma distinção visual do mock (quitação total ≠ entrada/sinal) e do frontend
// (ReciboPagamentoPage.tsx usa `text-success`, ReciboSinalPage.tsx usa `text-teal`). Sem tabela de
// itens (documento é resumo de valores) e sem SignatureBlock — mesma decisão já registrada em
// decisoes-pdf.md.
const SUCCESS_SOFT = 'rgba(31,138,91,0.07)';
const SUCCESS_LINE = 'rgba(31,138,91,0.24)';

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
    color: COLORS.success,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
  tituloCard: {
    marginTop: '22px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: SUCCESS_SOFT,
    border: `1px solid ${SUCCESS_LINE}`,
    borderLeft: `4px solid ${COLORS.success}`,
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
    border: `1px solid ${SUCCESS_LINE}`,
    color: COLORS.success,
  },
  tituloHeading: { fontSize: '13px', fontWeight: 'bold', color: COLORS.success, letterSpacing: '-0.005em' },
  tituloSub: { fontSize: '8.5px', color: '#3F6B53', marginTop: '3px' },
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
    borderRadius: '11px',
    overflow: 'hidden',
    border: `1.2px solid ${SUCCESS_LINE}`,
    backgroundColor: 'rgba(31,138,91,0.03)',
  },
  destaqueHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '11px 15px',
    backgroundColor: SUCCESS_SOFT,
    borderBottom: `1px solid ${SUCCESS_LINE}`,
  },
  destaqueHeaderIcone: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    borderRadius: '7px',
    backgroundColor: COLORS.white,
    color: COLORS.success,
  },
  destaqueHeaderTexto: { fontSize: '10.5px', fontWeight: 'bold', color: COLORS.success },
  destaqueBody: { padding: '15px' },
  destaqueTexto: { fontSize: '9.5px', color: '#5C7A68' },
  destaqueMetaLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  destaqueMetaValue: { fontSize: '9.5px', fontWeight: 600, color: COLORS.ink, marginTop: '2px' },
  valoresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '20px',
    padding: '18px 0',
    borderTop: `1px solid ${COLORS.borderLight}`,
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
    marginTop: '16px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: COLORS.orangeLight,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: { fontSize: '10.5px', fontWeight: 'bold', color: COLORS.ink },
  totalAmount: { fontSize: '20px', fontWeight: 'bold', color: COLORS.orange, letterSpacing: '-0.01em' },
  datasGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '20px',
    padding: '18px 0',
    borderTop: `1px solid ${COLORS.borderLight}`,
  },
  datasGridSecundario: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '14px',
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

function IconeSeloCheck() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', {
      d: 'M12 2.8l2.3 1.7 2.8-.3 1 2.6 2.4 1.5-.6 2.8 1.3 2.5-2 2-.2 2.8-2.7.8-1.7 2.3-2.6-1.1-2.6 1.1-1.7-2.3-2.7-.8-.2-2.8-2-2 1.3-2.5-.6-2.8L4.9 6.8l1-2.6 2.8.3L12 2.8Z',
    }),
    React.createElement('path', { d: 'm8.8 12 2.2 2.2 4.2-4.4', strokeWidth: '1.9' }),
  );
}

function IconeCheck() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '12', height: '12', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'm5 12.5 4.2 4.2L19 7' }),
  );
}

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
      React.createElement('div', { style: styles.headerRightLabel }, 'Orçamento'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),

    React.createElement(
      'div',
      { style: styles.tituloCard },
      React.createElement('span', { style: styles.tituloIconeChip }, React.createElement(IconeSeloCheck)),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.tituloHeading }, 'RECIBO DE PAGAMENTO — QUITAÇÃO TOTAL'),
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
        { style: styles.destaqueHeader },
        React.createElement('span', { style: styles.destaqueHeaderIcone }, React.createElement(IconeCheck)),
        React.createElement('span', { style: styles.destaqueHeaderTexto }, 'Pedido quitado'),
      ),
      React.createElement(
        'div',
        { style: styles.destaqueBody },
        React.createElement('div', { style: styles.destaqueTexto }, 'Pagamento recebido em sua totalidade. Não há valores pendentes para este orçamento.'),
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
      React.createElement('span', { style: styles.totalLabel }, 'Total quitado'),
      React.createElement('span', { style: styles.totalAmount }, totalQuitado),
    ),

    React.createElement(
      'div',
      { style: styles.datasGrid },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Data de pagamento'),
        React.createElement('div', { style: styles.metaValue }, dataPagamento),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Método de pagamento'),
        React.createElement('div', { style: styles.metaValue }, metodoPagamento),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Data de aprovação'),
        React.createElement('div', { style: styles.metaValue }, dataAprovacao),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.datasGridSecundario },
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
      'Recibo referente ao pagamento do orçamento #' + numeroFormatado,
      '.',
    ),
  );
}

module.exports = ReciboPagamentoDoc;
