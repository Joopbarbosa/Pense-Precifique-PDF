const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const ItemTable = require('../components/ItemTable.jsx');
const COLORS = require('../tokens.js');

// Layout aprovado no Claude Design (regressão #89) — ver contrato-pdf.md, seção "Referência
// visual". Fontes do documento seguem Helvetica/Arial (sem @font-face externo) por decisão de
// confiabilidade do Puppeteer, mesmo o design de origem usando Google Fonts (Inter/Nunito) — ver
// nota em htmlRenderer.js sobre não depender de recurso externo na renderização.
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
    gridTemplateColumns: '1fr 1fr 1fr',
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
  metaHighlight: { fontSize: '14px', fontWeight: 600, color: COLORS.teal, marginTop: '3px' },
  metaSubvalue: { fontSize: '9px', color: COLORS.textSecondary, marginTop: '2px' },
  metaClienteNome: { fontSize: '11px', fontWeight: 600, color: COLORS.ink },
  metaClienteContato: { fontSize: '9px', color: COLORS.textSecondary, marginTop: '2px' },
  metodoSection: { padding: '14px 0', borderBottom: `1px solid ${COLORS.borderLight}` },
  metodoLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  metodoValue: { fontSize: '10px', fontWeight: 600, color: COLORS.ink },
  sinalSection: {
    marginTop: '24px',
    padding: '16px 18px',
    borderRadius: '12px',
    backgroundColor: 'rgba(42,157,143,0.05)',
    border: '1.5px solid rgba(42,157,143,0.4)',
  },
  sinalTitleRow: { display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '8px' },
  sinalIconeChip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '7px',
    backgroundColor: COLORS.white,
    border: '1px solid rgba(42,157,143,0.25)',
    color: COLORS.teal,
  },
  sinalTitle: { fontSize: '10.5px', fontWeight: 'bold', color: COLORS.ink },
  sinalDesc: { fontSize: '8.5px', color: COLORS.textMuted, marginBottom: '12px', lineHeight: 1.4 },
  sinalValues: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  sinalValueCell: { flex: 1, minWidth: '120px', padding: '8px 10px', borderRadius: '8px', backgroundColor: COLORS.white, border: '1px solid rgba(42,157,143,0.2)' },
  sinalValueCellRestante: { flex: 1, minWidth: '120px', padding: '8px 10px', borderRadius: '8px', backgroundColor: COLORS.white, border: `1px solid ${COLORS.borderLight}` },
  sinalValueLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sinalValueLabelDestaque: {
    fontSize: '7px',
    fontWeight: 600,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sinalValueAmount: { fontSize: '12px', fontWeight: 'bold', color: COLORS.teal, marginTop: '2px' },
  sinalValueAmountRestante: { fontSize: '12px', fontWeight: 'bold', color: COLORS.ink, marginTop: '2px' },
  totaisSection: { marginTop: '22px', display: 'flex', justifyContent: 'flex-end' },
  totaisTable: { width: '260px' },
  totaisRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 10px', fontSize: '9px', color: COLORS.textMuted },
  totaisRowDescontoValue: { fontWeight: 600, color: COLORS.red },
  totaisRowSinal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '4px 0',
    padding: '7px 9px',
    borderRadius: '7px',
    fontSize: '8.5px',
    fontWeight: 600,
    color: COLORS.teal,
    backgroundColor: 'rgba(42,157,143,0.07)',
    border: '1px dashed rgba(42,157,143,0.4)',
  },
  totaisRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '7px 10px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: COLORS.orangeLight,
    borderRadius: '6px',
    marginTop: '4px',
  },
  totaisRowTotalValue: { fontSize: '15px', color: COLORS.orange },
  totaisRowRestante: { display: 'flex', justifyContent: 'space-between', padding: '7px 10px 0', fontSize: '9px', color: COLORS.textMuted },
  totaisRowRestanteValue: { fontWeight: 600, color: COLORS.ink },
  obsSection: {
    marginTop: '26px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: COLORS.offWhite,
    border: `1px solid ${COLORS.borderLight}`,
  },
  obsLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  obsContent: { fontSize: '9px', color: COLORS.ink, lineHeight: 1.5 },
  clausula: { margin: '14px 0 0', fontSize: '8px', lineHeight: 1.55, color: COLORS.labelMuted },
};

function IconeCarteira() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M4 7.5A1.5 1.5 0 0 1 5.5 6H18a1.5 1.5 0 0 1 1.5 1.5V9M4 7.5V18a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 18v-2.5M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5V12' }),
    React.createElement('path', { d: 'M20 12h-3.2a1.8 1.8 0 0 0 0 3.6H20V12Z' }),
  );
}

function OrcamentoDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    telefoneCliente,
    emailCliente,
    dataEmissao,
    dataValidade,
    prazoProducao,
    inicioProducao,
    metodoPagamento,
    sinalAtivo,
    valorSinal,
    restanteAposSinal,
    subtotal,
    desconto,
    percentualDesconto,
    percentualSinal,
    total,
    observacoes,
    itens,
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
      { style: styles.metaGrid },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Datas'),
        React.createElement('div', { style: styles.metaValue }, 'Emissão: ', React.createElement('strong', null, dataEmissao)),
        React.createElement('div', { style: styles.metaValue }, 'Validade: ', React.createElement('strong', null, dataValidade)),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Prazo de produção'),
        React.createElement('div', { style: styles.metaHighlight }, prazoProducao),
        React.createElement('div', { style: styles.metaSubvalue }, 'Início: ' + inicioProducao),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Cliente'),
        React.createElement('div', { style: styles.metaClienteNome }, nomeCliente),
        telefoneCliente
          ? React.createElement('div', { style: styles.metaClienteContato }, telefoneCliente)
          : null,
        emailCliente
          ? React.createElement('div', { style: styles.metaClienteContato }, emailCliente)
          : null,
      ),
    ),

    React.createElement(
      'div',
      { style: styles.metodoSection },
      React.createElement('div', { style: styles.metodoLabel }, 'Método de pagamento'),
      React.createElement('div', { style: styles.metodoValue }, metodoPagamento),
    ),

    React.createElement(ItemTable, { itens }),

    sinalAtivo
      ? React.createElement(
          'div',
          { style: styles.sinalSection },
          React.createElement(
            'div',
            { style: styles.sinalTitleRow },
            React.createElement('span', { style: styles.sinalIconeChip }, React.createElement(IconeCarteira)),
            React.createElement('div', { style: styles.sinalTitle }, 'Entrada solicitada'),
          ),
          React.createElement(
            'div',
            { style: styles.sinalDesc },
            percentualSinal
              ? 'Para iniciar a produção, solicitamos o pagamento de ' + percentualSinal + ' do valor total.'
              : 'Para iniciar a produção, solicitamos o pagamento do sinal indicado abaixo.',
          ),
          React.createElement(
            'div',
            { style: styles.sinalValues },
            React.createElement(
              'div',
              { style: styles.sinalValueCell },
              React.createElement('div', { style: styles.sinalValueLabelDestaque }, 'Valor do sinal'),
              React.createElement('div', { style: styles.sinalValueAmount }, valorSinal),
            ),
            React.createElement(
              'div',
              { style: styles.sinalValueCellRestante },
              React.createElement('div', { style: styles.sinalValueLabel }, 'Restante na entrega'),
              React.createElement('div', { style: styles.sinalValueAmountRestante }, restanteAposSinal),
            ),
          ),
        )
      : null,

    React.createElement(
      'div',
      { style: styles.totaisSection },
      React.createElement(
        'div',
        { style: styles.totaisTable },
        React.createElement(
          'div',
          { style: styles.totaisRow },
          React.createElement('span', null, 'Subtotal'),
          React.createElement('span', null, subtotal),
        ),
        desconto
          ? React.createElement(
              'div',
              { style: styles.totaisRow },
              React.createElement('span', null, 'Desconto' + (percentualDesconto ? ' (' + percentualDesconto + ')' : '')),
              React.createElement('span', { style: styles.totaisRowDescontoValue }, '− ' + desconto),
            )
          : null,
        sinalAtivo && percentualSinal
          ? React.createElement(
              'div',
              { style: styles.totaisRowSinal },
              React.createElement(
                'span',
                { style: { display: 'flex', alignItems: 'center', gap: '5px' } },
                React.createElement(IconeCarteira),
                'Sinal solicitado (' + percentualSinal + ')',
              ),
              React.createElement('span', null, valorSinal),
            )
          : null,
        React.createElement(
          'div',
          { style: styles.totaisRowTotal },
          React.createElement('span', null, 'Total'),
          React.createElement('span', { style: styles.totaisRowTotalValue }, total),
        ),
        sinalAtivo
          ? React.createElement(
              'div',
              { style: styles.totaisRowRestante },
              React.createElement('span', null, 'Restante após sinal'),
              React.createElement('span', { style: styles.totaisRowRestanteValue }, restanteAposSinal),
            )
          : null,
      ),
    ),

    observacoes
      ? React.createElement(
          'div',
          { style: styles.obsSection },
          React.createElement('div', { style: styles.obsLabel }, 'Observações'),
          React.createElement('div', { style: styles.obsContent }, observacoes),
        )
      : null,

    React.createElement(
      DocumentFooter,
      null,
      'Este orçamento é válido até ',
      React.createElement('strong', null, dataValidade),
      '.',
    ),
    // Cláusula estática (sem valor/percentual dinâmico — não há campo no contrato para taxa de
    // cancelamento hoje). Aprovado para esta rodada com o texto fixo abaixo; melhorar na V0.8.1
    // com dado real vindo do backend. Ver pendência em contrato-pdf.md.
    React.createElement(
      'p',
      { style: styles.clausula },
      'Em caso de cancelamento após aprovação, poderá ser cobrada uma taxa referente aos materiais e ao tempo já investidos na produção, conforme acordado previamente com a empresa.',
    ),
  );
}

module.exports = OrcamentoDoc;
