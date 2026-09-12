const React = require('react');
const COLORS = require('../tokens.js');

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const styles = {
  wrap: { marginTop: '22px', display: 'flex', justifyContent: 'flex-end' },
  box: { width: '360px', maxWidth: '100%' },
  simples: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: COLORS.textMuted, padding: '7px 10px' },
  simplesValor: (cor) => ({ fontWeight: 600, color: cor || COLORS.ink }),
  destaque: (cor) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '4px 0',
    padding: '8px 12px',
    borderRadius: '9px',
    fontSize: '12.5px',
    fontWeight: 600,
    color: cor,
    backgroundColor: hexA(cor, 0.07),
    border: `1px dashed ${hexA(cor, 0.4)}`,
  }),
  destaqueLabel: { display: 'flex', alignItems: 'center', gap: '6px' },
  total: (cor) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '6px',
    padding: '13px 14px',
    borderRadius: '10px',
    backgroundColor: hexA(cor, 0.08),
    border: `1px solid ${hexA(cor, 0.28)}`,
  }),
  totalLabel: { fontSize: '13.5px', fontWeight: 600, color: COLORS.ink },
  totalValor: (cor) => ({ fontSize: '20px', fontWeight: 'bold', color: cor, letterSpacing: '-0.01em' }),
};

function IconeCheck() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'm5 12.5 4.2 4.2L19 7' }),
  );
}

function Linha({ linha }) {
  if (linha.tipo === 'destaque-tracejado') {
    return React.createElement(
      'div',
      { style: styles.destaque(linha.corDestaque) },
      React.createElement('span', { style: styles.destaqueLabel }, React.createElement(IconeCheck), linha.label),
      React.createElement('span', null, linha.value),
    );
  }
  if (linha.tipo === 'total') {
    return React.createElement(
      'div',
      { style: styles.total(linha.corDestaque) },
      React.createElement('span', { style: styles.totalLabel }, linha.label),
      React.createElement('span', { style: styles.totalValor(linha.corDestaque) }, linha.value),
    );
  }
  return React.createElement(
    'div',
    { style: styles.simples },
    React.createElement('span', null, linha.label),
    React.createElement('span', { style: styles.simplesValor(linha.corValor) }, linha.value),
  );
}

// Seção 6 do Design aprovado (P-F008) — calculadora de pagamento. Renderer genérico de linhas de
// valor (tipos: simples/destaque-tracejado/total), reusado pelos 4 tipos de documento; cada
// Doc.jsx decide as linhas/ordem próprias (Sinal: subtotal/desconto/sinal/total/restante; Multa:
// valor original/%/valor da multa; etc.) — a variação de conteúdo fica no Doc.jsx, não em
// branching de tipo de documento dentro do componente.
function SecaoCalculadora({ linhas }) {
  return React.createElement(
    'div',
    { style: styles.wrap },
    React.createElement('div', { style: styles.box }, linhas.map((linha, i) => React.createElement(Linha, { key: i, linha }))),
  );
}

module.exports = SecaoCalculadora;
