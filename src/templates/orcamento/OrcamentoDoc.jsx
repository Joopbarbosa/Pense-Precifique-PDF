const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const ItemTable = require('../components/ItemTable.jsx');

const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    padding: '28px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '11px',
    color: '#3A372F',
    lineHeight: 1.4,
  },
  headerRightLabel: { fontSize: '8px', fontWeight: 600, color: '#B0ACA4', textTransform: 'uppercase' },
  headerRightNumero: { fontSize: '20px', fontWeight: 'bold', color: '#F97316' },
  metaGrid: {
    display: 'table',
    width: '100%',
    margin: '22px 0 0 0',
    padding: '22px 0',
    borderBottom: '1px solid #F0EEE9',
  },
  metaCell: { display: 'table-cell', width: '33.33%', padding: '8px', verticalAlign: 'top' },
  metaLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: '#B0ACA4',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  metaValue: { fontSize: '10px', fontWeight: 600, color: '#3A372F', margin: '4px 0' },
  metaHighlight: { fontSize: '14px', fontWeight: 600, color: '#2A9D8F', marginTop: '3px' },
  metaSubvalue: { fontSize: '9px', color: '#7C786F', marginTop: '2px' },
  metodoSection: { padding: '14px 0', borderBottom: '1px solid #F0EEE9' },
  metodoLabel: {
    fontSize: '7.5px',
    fontWeight: 600,
    color: '#B0ACA4',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  metodoValue: { fontSize: '10px', fontWeight: 600, color: '#3A372F' },
  sinalSection: {
    marginTop: '24px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: '#FBFAF8',
    border: '1px solid #F0EEE9',
  },
  sinalTitle: { fontSize: '10.5px', fontWeight: 'bold', color: '#3A372F', marginBottom: '6px' },
  sinalDesc: { fontSize: '8.5px', color: '#5C594F', marginBottom: '12px', lineHeight: 1.4 },
  sinalValues: { display: 'table', width: '100%' },
  sinalValueCell: { display: 'table-cell', width: '50%', padding: '6px', verticalAlign: 'top' },
  sinalValueLabel: {
    fontSize: '7px',
    fontWeight: 600,
    color: '#B0ACA4',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  },
  sinalValueAmount: { fontSize: '12px', fontWeight: 'bold', color: '#2A9D8F', marginTop: '2px' },
  totaisSection: { marginTop: '22px', display: 'flex', justifyContent: 'flex-end' },
  totaisTable: { width: '260px' },
  totaisRow: { display: 'flex', justifyContent: 'space-between', padding: '5px 10px', fontSize: '9px', color: '#5C594F' },
  totaisRowDescontoValue: { fontWeight: 600, color: '#C0492B' },
  totaisRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '7px 10px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#FFE5D5',
    borderRadius: '6px',
    marginTop: '4px',
  },
  totaisRowTotalValue: { fontSize: '15px', color: '#F97316' },
  obsSection: {
    marginTop: '26px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: '#FBFAF8',
    border: '1px solid #F0EEE9',
  },
  obsLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: '#B0ACA4',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  obsContent: { fontSize: '9px', color: '#3A372F', lineHeight: 1.5 },
};

function OrcamentoDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
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
      'table',
      { style: styles.metaGrid },
      React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            { style: styles.metaCell },
            React.createElement('div', { style: styles.metaLabel }, 'Datas'),
            React.createElement('div', { style: styles.metaValue }, 'Emissão: ', React.createElement('strong', null, dataEmissao)),
            React.createElement('div', { style: styles.metaValue }, 'Validade: ', React.createElement('strong', null, dataValidade)),
          ),
          React.createElement(
            'td',
            { style: styles.metaCell },
            React.createElement('div', { style: styles.metaLabel }, 'Prazo de produção'),
            React.createElement('div', { style: styles.metaHighlight }, prazoProducao),
            React.createElement('div', { style: styles.metaSubvalue }, 'Início: ' + inicioProducao),
          ),
          React.createElement(
            'td',
            { style: styles.metaCell },
            React.createElement('div', { style: styles.metaLabel }, 'Cliente'),
            React.createElement('div', { style: styles.metaValue }, nomeCliente),
          ),
        ),
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
          React.createElement('div', { style: styles.sinalTitle }, 'Entrada solicitada'),
          React.createElement(
            'div',
            { style: styles.sinalDesc },
            'Para iniciar a produção, solicitamos o pagamento de ' + valorSinal + ' do valor total.',
          ),
          React.createElement(
            'div',
            { style: styles.sinalValues },
            React.createElement(
              'div',
              { style: styles.sinalValueCell },
              React.createElement('div', { style: styles.sinalValueLabel }, 'Valor do sinal'),
              React.createElement('div', { style: styles.sinalValueAmount }, valorSinal),
            ),
            React.createElement(
              'div',
              { style: styles.sinalValueCell },
              React.createElement('div', { style: styles.sinalValueLabel }, 'Restante na entrega'),
              React.createElement('div', { style: styles.sinalValueAmount }, restanteAposSinal),
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
              React.createElement('span', null, 'Desconto'),
              React.createElement('span', { style: styles.totaisRowDescontoValue }, '− ' + desconto),
            )
          : null,
        React.createElement(
          'div',
          { style: styles.totaisRowTotal },
          React.createElement('span', null, 'Total'),
          React.createElement('span', { style: styles.totaisRowTotalValue }, total),
        ),
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
  );
}

module.exports = OrcamentoDoc;
