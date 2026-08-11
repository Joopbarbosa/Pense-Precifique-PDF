const React = require('react');

const styles = {
  footer: {
    marginTop: '26px',
    paddingTop: '18px',
    borderTop: '1px solid #F0EEE9',
    fontSize: '8.5px',
    color: '#9A968E',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
  },
};

// MVP de orçamento cabe em 1 página — rodapé fica minimalista de propósito, sem paginação.
function DocumentFooter({ children }) {
  return React.createElement(
    'div',
    { style: styles.footer },
    React.createElement('span', null, children),
    React.createElement('span', null, 'Gerado por ', React.createElement('strong', null, 'Pense & Precifique')),
  );
}

module.exports = DocumentFooter;
