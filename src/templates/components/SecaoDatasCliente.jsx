const React = require('react');
const COLORS = require('../tokens.js');

const styles = {
  wrap: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: `1px solid ${COLORS.borderLight}`,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  colLabel: {
    fontSize: '10.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '10px',
  },
  datasGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' },
  campoLabel: { fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.labelMuted },
  campoValor: (vazio) => ({ fontSize: '13.5px', fontWeight: 600, color: vazio ? COLORS.borderSubtle : COLORS.ink, marginTop: '2px' }),
  clienteNome: { fontSize: '15px', fontWeight: 'bold', color: COLORS.ink },
  clienteWhats: { fontSize: '13px', color: COLORS.textMuted, marginTop: '5px' },
};

function CampoData({ label, value }) {
  const vazio = !value || value === '—';
  return React.createElement(
    'div',
    null,
    React.createElement('div', { style: styles.campoLabel }, label),
    React.createElement('div', { style: styles.campoValor(vazio) }, value || '—'),
  );
}

// Seção 3 do Design aprovado (P-F008) — grid Datas + Cliente, reusada pelos 4 tipos de documento.
function SecaoDatasCliente({ datas, cliente }) {
  return React.createElement(
    'div',
    { style: styles.wrap },
    React.createElement(
      'div',
      null,
      React.createElement('div', { style: styles.colLabel }, 'Datas'),
      React.createElement(
        'div',
        { style: styles.datasGrid },
        datas.map((campo, i) => React.createElement(CampoData, { key: i, label: campo.label, value: campo.value })),
      ),
    ),
    React.createElement(
      'div',
      null,
      React.createElement('div', { style: styles.colLabel }, 'Cliente'),
      React.createElement('div', { style: styles.clienteNome }, cliente.nome),
      cliente.whatsapp
        ? React.createElement('div', { style: styles.clienteWhats }, cliente.whatsapp)
        : null,
    ),
  );
}

module.exports = SecaoDatasCliente;
