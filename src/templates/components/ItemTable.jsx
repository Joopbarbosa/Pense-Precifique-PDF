const React = require('react');
const COLORS = require('../tokens.js');

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const styles = {
  tituloRow: { display: 'flex', alignItems: 'center', gap: '9px' },
  tituloChip: (cor) => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: hexA(cor, 0.1),
    color: cor,
  }),
  tituloTexto: { margin: 0, fontSize: '14.5px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.005em' },
  nota: { marginTop: '10px', fontSize: '12.5px', color: COLORS.tableLabel },
  table: { width: '100%', borderCollapse: 'collapse', margin: '22px 0 8px 0' },
  th: {
    textAlign: 'left',
    fontSize: '8.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: COLORS.tableLabel,
    padding: '0 7px 9px',
    borderBottom: `1.5px solid ${COLORS.teal}`,
  },
  thNumeric: { textAlign: 'right' },
  tdBase: { padding: '10px 7px', fontSize: '9.5px', color: COLORS.ink, borderBottom: `1px solid ${COLORS.borderLight}`, verticalAlign: 'top' },
  tdNumeric: { textAlign: 'right' },
  nomeProduto: { fontWeight: 600 },
  customizacoes: { color: COLORS.textMuted },
  customizacoesVazia: { color: COLORS.borderSubtle },
  subtotal: { fontWeight: 600 },
};

// Seção 5 do Design aprovado (P-F008) — `titulo`/`icone`/`corDestaque` são opcionais: quando
// ausentes (caso do Orçamento, cujo Design não mostra essa faixa) a seção renderiza só a tabela,
// mesmo comportamento de antes da migração. `nota` é o texto de rodapé usado por Multa/Estorno
// ("itens mantidos como referência").
function ItemTable({ itens, titulo, icone, corDestaque, nota }) {
  return React.createElement(
    'div',
    null,
    titulo
      ? React.createElement(
          'div',
          { style: styles.tituloRow },
          React.createElement('span', { style: styles.tituloChip(corDestaque) }, icone),
          React.createElement('h2', { style: styles.tituloTexto }, titulo),
        )
      : null,
    React.createElement(
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
    ),
    nota ? React.createElement('div', { style: styles.nota }, nota) : null,
  );
}

module.exports = ItemTable;
