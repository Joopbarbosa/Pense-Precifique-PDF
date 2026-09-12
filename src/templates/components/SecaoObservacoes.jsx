const React = require('react');
const COLORS = require('../tokens.js');

const styles = {
  wrap: { marginTop: '8px' },
  label: {
    fontSize: '10.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: COLORS.labelMuted,
    marginBottom: '9px',
  },
  box: { padding: '14px 16px', borderRadius: '12px', backgroundColor: COLORS.offWhite, border: `1px solid ${COLORS.borderLight}` },
  texto: { margin: 0, fontSize: '13.5px', color: COLORS.textMuted, lineHeight: 1.6 },
};

// Seção 7 do Design aprovado (P-F008) — reusada pelos 4 tipos de documento. Diferente dos campos
// da Seção 3 (Emissão/Aprovação/etc, que mostram "—" quando vazios), a seção inteira não faz
// sentido sem conteúdo — sem texto, não renderiza nada (P-F009).
function SecaoObservacoes({ texto }) {
  if (!texto) {
    return null;
  }
  return React.createElement(
    'div',
    { style: styles.wrap },
    React.createElement('div', { style: styles.label }, 'Observações'),
    React.createElement('div', { style: styles.box }, React.createElement('p', { style: styles.texto }, texto)),
  );
}

module.exports = SecaoObservacoes;
