const React = require('react');
const COLORS = require('../tokens.js');

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const styles = {
  wrap: { marginTop: '22px' },
  tituloRow: { display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' },
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
  box: (cor) => ({
    padding: '16px 18px',
    borderRadius: '12px',
    backgroundColor: hexA(cor, 0.05),
    border: `1px solid ${hexA(cor, 0.2)}`,
  }),
  texto: { margin: 0, fontSize: '13.5px', color: COLORS.ink, lineHeight: 1.65 },
};

// Seção 8 do Design aprovado (P-F008) — reusada pelos 4 tipos de documento. `children` aceita
// texto rico (React.createElement('strong', ...)), cada Doc.jsx monta a própria instrução.
function SecaoProximosPassos({ corDestaque, icone, children }) {
  return React.createElement(
    'div',
    { style: styles.wrap },
    React.createElement(
      'div',
      { style: styles.tituloRow },
      React.createElement('span', { style: styles.tituloChip(corDestaque) }, icone),
      React.createElement('h2', { style: styles.tituloTexto }, 'Próximos passos'),
    ),
    React.createElement('div', { style: styles.box(corDestaque) }, React.createElement('p', { style: styles.texto }, children)),
  );
}

module.exports = SecaoProximosPassos;
