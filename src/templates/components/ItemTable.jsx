const React = require('react');

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', margin: '22px 0 8px 0' },
  th: {
    textAlign: 'left',
    fontSize: '8.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#9A968E',
    padding: '0 7px 9px',
    borderBottom: '1.5px solid #2A9D8F',
  },
  thNumeric: { textAlign: 'right' },
  tdBase: { padding: '10px 7px', fontSize: '9.5px', color: '#3A372F', borderBottom: '1px solid #F0EEE9', verticalAlign: 'top' },
  tdNumeric: { textAlign: 'right' },
  nomeProduto: { fontWeight: 600 },
  customizacoes: { color: '#5C594F' },
  customizacoesVazia: { color: '#C0BCB4' },
  subtotal: { fontWeight: 600 },
};

function ItemTable({ itens }) {
  return React.createElement(
    'table',
    { style: styles.table },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        React.createElement('th', { style: styles.th }, 'Produto'),
        React.createElement('th', { style: styles.th }, 'Customizações'),
        React.createElement('th', { style: { ...styles.th, ...styles.thNumeric } }, 'Qtd'),
        React.createElement('th', { style: { ...styles.th, ...styles.thNumeric } }, 'Valor unit.'),
        React.createElement('th', { style: { ...styles.th, ...styles.thNumeric } }, 'Total'),
      ),
    ),
    React.createElement(
      'tbody',
      null,
      itens.map((item, index) =>
        React.createElement(
          'tr',
          { key: index },
          React.createElement('td', { style: { ...styles.tdBase, ...styles.nomeProduto } }, item.nomeProduto),
          React.createElement(
            'td',
            { style: { ...styles.tdBase, ...(item.customizacoes ? styles.customizacoes : styles.customizacoesVazia) } },
            item.customizacoes || '—',
          ),
          React.createElement('td', { style: { ...styles.tdBase, ...styles.tdNumeric } }, item.quantidade),
          React.createElement('td', { style: { ...styles.tdBase, ...styles.tdNumeric } }, item.precoUnitario),
          React.createElement(
            'td',
            { style: { ...styles.tdBase, ...styles.tdNumeric, ...styles.subtotal } },
            item.subtotal,
          ),
        ),
      ),
    ),
  );
}

module.exports = ItemTable;
