// Sem build/bundler neste serviço (Node puro) — .jsx é só convenção de nome (React.createElement).
const React = require('react');
const COLORS = require('../tokens.js');

// OpenProject #545/#547 (V0.15.0) — tabela com colunas configuráveis, para documentos cujas colunas
// não são as de orçamento (ItemTable tem Produto/Customizações/Qtd/Valor/Total fixos). Mesmo visual
// da ItemTable: cabeçalho uppercase com linha teal, linhas com divisor claro, numéricas à direita.
const styles = {
  table: { width: '100%', borderCollapse: 'collapse', margin: '14px 0 8px 0' },
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
  td: { padding: '9px 7px', fontSize: '9.5px', color: COLORS.ink, borderBottom: `1px solid ${COLORS.borderLight}`, verticalAlign: 'top' },
  numerico: { textAlign: 'right' },
  destaque: { fontWeight: 600 },
  vazio: { color: COLORS.borderSubtle },
};

/**
 * colunas: [{ titulo, campo, numerico?, destaque? }]. Valor nulo/vazio aparece como "—".
 */
function TabelaColunas({ colunas, linhas }) {
  return React.createElement(
    'table',
    { style: styles.table },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        colunas.map((c, i) => React.createElement('th', { key: i, style: { ...styles.th, ...(c.numerico ? styles.numerico : {}) } }, c.titulo)),
      ),
    ),
    React.createElement(
      'tbody',
      null,
      linhas.map((linha, li) =>
        React.createElement(
          'tr',
          { key: li, style: { breakInside: 'avoid' } },
          colunas.map((c, ci) => {
            const valor = linha[c.campo];
            const vazio = valor === null || valor === undefined || valor === '';
            return React.createElement(
              'td',
              { key: ci, style: { ...styles.td, ...(c.numerico ? styles.numerico : {}), ...(c.destaque ? styles.destaque : {}), ...(vazio ? styles.vazio : {}) } },
              vazio ? '—' : valor,
            );
          }),
        ),
      ),
    ),
  );
}

module.exports = TabelaColunas;
