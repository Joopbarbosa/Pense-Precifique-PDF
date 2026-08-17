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
  clienteWhats: { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: COLORS.textMuted, marginTop: '5px' },
  clienteWhatsIcone: { color: COLORS.teal, display: 'flex' },
};

function IconeWhatsapp() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '13', height: '13', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M4 20.5 5.4 16a8 8 0 1 1 3.1 3.1L4 20.5Z' }),
    React.createElement('path', {
      d: 'M9 9.2c.2-.6.5-.6.8-.6h.6c.2 0 .5 0 .7.5l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6a6 6 0 0 0 2.6 2.3c.3.1.4 0 .6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.8c.3.1.4.3.4.5s0 .9-.4 1.3c-.4.4-1.2.8-1.8.8a7 7 0 0 1-5-2.6 6.7 6.7 0 0 1-1.9-3.8c0-.8.3-1.5.5-1.7Z',
    }),
  );
}

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
        ? React.createElement(
            'div',
            { style: styles.clienteWhats },
            React.createElement('span', { style: styles.clienteWhatsIcone }, React.createElement(IconeWhatsapp)),
            cliente.whatsapp,
          )
        : null,
    ),
  );
}

module.exports = SecaoDatasCliente;
