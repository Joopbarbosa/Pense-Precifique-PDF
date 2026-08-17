const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (V0.8.1) — layout aprovado no Claude Design (mock "Recibo do Sinal - standalone",
// ver contrato-pdf.md seção 2.1/6). reciboSinalSchema só tem 7 campos (sem itens/totais/restante),
// então a seção "Detalhes do pedido" do mock não é reproduzida aqui — nenhum dado real a mostrar
// nela. Sem SignatureBlock (mesma decisão já registrada em decisoes-pdf.md).
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
  tituloCard: {
    marginTop: '22px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: 'rgba(42,157,143,0.07)',
    border: '1px solid rgba(42,157,143,0.22)',
    borderLeft: `4px solid ${COLORS.teal}`,
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
    border: '1px solid rgba(42,157,143,0.25)',
    color: COLORS.teal,
  },
  tituloHeading: { fontSize: '13px', fontWeight: 'bold', color: COLORS.teal, letterSpacing: '-0.005em' },
  tituloSub: { fontSize: '8.5px', color: '#4A6B62', marginTop: '3px' },
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
    border: '1.2px solid rgba(42,157,143,0.3)',
    backgroundColor: 'rgba(42,157,143,0.045)',
  },
  destaqueHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '11px 15px',
    backgroundColor: 'rgba(42,157,143,0.1)',
    borderBottom: '1px solid rgba(42,157,143,0.18)',
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
    color: COLORS.teal,
  },
  destaqueHeaderTexto: { fontSize: '10.5px', fontWeight: 'bold', color: COLORS.teal },
  destaqueBody: { display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '15px' },
  valorLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  valorAmount: { fontSize: '22px', fontWeight: 'bold', color: COLORS.teal, marginTop: '3px', letterSpacing: '-0.01em' },
  destaqueMetaLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  destaqueMetaValue: { fontSize: '9.5px', fontWeight: 600, color: COLORS.ink, marginTop: '2px' },
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
  metaValueDestaque: { fontSize: '10px', fontWeight: 600, color: COLORS.teal, margin: '4px 0' },
};

function IconeSelo() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('circle', { cx: '12', cy: '12', r: '8.5' }),
    React.createElement('path', { d: 'm8.3 12.2 2.5 2.5 4.9-5', strokeWidth: '2' }),
  );
}

function IconeCheck() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '12', height: '12', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'm5 12.5 4.2 4.2L19 7' }),
  );
}

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
      React.createElement('div', { style: styles.headerRightLabel }, 'Orçamento'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),

    React.createElement(
      'div',
      { style: styles.tituloCard },
      React.createElement('span', { style: styles.tituloIconeChip }, React.createElement(IconeSelo)),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.tituloHeading }, 'RECIBO DE PAGAMENTO — ENTRADA'),
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
        React.createElement('span', { style: styles.destaqueHeaderTexto }, 'Entrada recebida com sucesso'),
      ),
      React.createElement(
        'div',
        { style: styles.destaqueBody },
        React.createElement(
          'div',
          { style: { flex: '1 1 140px' } },
          React.createElement('div', { style: styles.valorLabel }, 'Valor recebido'),
          React.createElement('div', { style: styles.valorAmount }, valorRecebido),
        ),
        React.createElement(
          'div',
          null,
          React.createElement('div', { style: styles.destaqueMetaLabel }, 'Forma de pagamento'),
          React.createElement('div', { style: styles.destaqueMetaValue }, metodoRecebido),
        ),
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
        React.createElement('div', { style: styles.metaValueDestaque }, prazoProducao),
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
