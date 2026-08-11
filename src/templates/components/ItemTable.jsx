const React = require('react');

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', margin: '22px 0 8px 0' },
  theadRow: { backgroundColor: '#2A9D8F' },
  th: { color: '#FFFFFF', fontWeight: 'bold', fontSize: '8.5px', padding: '7px', textAlign: 'left' },
  thNumeric: { textAlign: 'right' },
  tdBase: { padding: '6px 7px', fontSize: '9px', color: '#3A372F' },
  tdNumeric: { textAlign: 'right' },
  rowEven: { backgroundColor: '#FBFAF8' },
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
        { style: styles.theadRow },
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
          { key: index, style: index % 2 === 1 ? styles.rowEven : undefined },
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
