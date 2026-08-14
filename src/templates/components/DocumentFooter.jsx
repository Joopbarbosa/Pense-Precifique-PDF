const React = require('react');

const styles = {
  footer: {
    marginTop: '26px',
    paddingTop: '18px',
    borderTop: '1px solid #F0EEE9',
    fontSize: '9px',
    color: '#9A968E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  esquerda: { display: 'flex', alignItems: 'center', gap: '8px' },
  icone: { color: '#2A9D8F', display: 'flex' },
  wordmarkPense: { color: '#2A9D8F', fontWeight: 700 },
  wordmarkE: { color: '#F97316', fontWeight: 700, margin: '0 1px' },
  wordmarkPrecifique: { color: '#3A372F', fontWeight: 700 },
};

function IconeDocumento() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '13', height: '13', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z' }),
    React.createElement('path', { d: 'M13 3.5V9h5' }),
    React.createElement('path', { d: 'M8.5 13.5h7M8.5 16.5h5' }),
  );
}

// MVP de orçamento cabe em 1 página — rodapé fica minimalista de propósito, sem paginação.
function DocumentFooter({ children }) {
  return React.createElement(
    'div',
    { style: styles.footer },
    React.createElement(
      'span',
      { style: styles.esquerda },
      React.createElement('span', { style: styles.icone }, React.createElement(IconeDocumento)),
      children,
    ),
    React.createElement(
      'span',
      null,
      'Gerado com ',
      React.createElement('span', { style: styles.wordmarkPense }, 'Pense'),
      React.createElement('span', { style: styles.wordmarkE }, '&'),
      React.createElement('span', { style: styles.wordmarkPrecifique }, 'Precifique'),
    ),
  );
}

module.exports = DocumentFooter;
