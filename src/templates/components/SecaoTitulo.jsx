const React = require('react');
const COLORS = require('../tokens.js');

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const styles = {
  card: (cor) => ({
    marginTop: '22px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: hexA(cor, 0.07),
    border: `1px solid ${hexA(cor, 0.22)}`,
    borderLeft: `4px solid ${cor}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }),
  iconeChip: (cor) => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    backgroundColor: COLORS.white,
    border: `1px solid ${hexA(cor, 0.25)}`,
    color: cor,
  }),
  heading: (cor) => ({ fontSize: '13px', fontWeight: 'bold', color: cor, letterSpacing: '-0.005em' }),
};

// Seção 2 do Design aprovado (P-F008) — faixa de título do documento, reusada pelos 4 tipos com a
// cor de destaque própria de cada um (teal/success/red/orange).
function SecaoTitulo({ corDestaque, icone, titulo }) {
  return React.createElement(
    'div',
    { style: styles.card(corDestaque) },
    React.createElement('span', { style: styles.iconeChip(corDestaque) }, icone),
    React.createElement('div', { style: styles.heading(corDestaque) }, titulo),
  );
}

module.exports = SecaoTitulo;
