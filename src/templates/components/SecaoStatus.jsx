const React = require('react');
const COLORS = require('../tokens.js');

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const styles = {
  card: (cor) => ({
    marginTop: '24px',
    borderRadius: '14px',
    overflow: 'hidden',
    border: `1.5px solid ${hexA(cor, 0.32)}`,
    backgroundColor: hexA(cor, 0.05),
  }),
  header: (cor) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '14px 18px',
    backgroundColor: hexA(cor, 0.12),
    borderBottom: `1px solid ${hexA(cor, 0.2)}`,
  }),
  headerIcone: (cor) => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '9px',
    backgroundColor: COLORS.white,
    color: cor,
  }),
  headerTexto: (cor) => ({ fontSize: '15px', fontWeight: 'bold', color: cor, letterSpacing: '-0.005em' }),
  body: { display: 'flex', flexWrap: 'wrap', gap: '18px 28px', padding: '18px' },
  descricao: { flex: '1 1 220px', fontSize: '12.5px', color: COLORS.textMuted, lineHeight: 1.5 },
  campoLabel: { fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: COLORS.tableLabel },
  campoValor: (vazio) => ({ fontSize: '14px', fontWeight: 600, color: vazio ? COLORS.borderSubtle : COLORS.ink, marginTop: '3px' }),
};

function CampoStatus({ label, value }) {
  const vazio = !value || value === '—';
  return React.createElement(
    'div',
    null,
    React.createElement('div', { style: styles.campoLabel }, label),
    React.createElement('div', { style: styles.campoValor(vazio) }, value || '—'),
  );
}

// Seção 4 do Design aprovado (P-F008) — card de status do pedido, reusada pelos 4 tipos de
// documento. Cada Doc.jsx monta o próprio array `campos` (ex.: Multa passa "Data de cancelamento",
// Sinal passa "Início estimado").
function SecaoStatus({ corDestaque, icone, tituloStatus, descricao, campos }) {
  return React.createElement(
    'div',
    { style: styles.card(corDestaque) },
    React.createElement(
      'div',
      { style: styles.header(corDestaque) },
      React.createElement('span', { style: styles.headerIcone(corDestaque) }, icone),
      React.createElement('span', { style: styles.headerTexto(corDestaque) }, tituloStatus),
    ),
    React.createElement(
      'div',
      { style: styles.body },
      descricao ? React.createElement('div', { style: styles.descricao }, descricao) : null,
      campos.map((campo, i) => React.createElement(CampoStatus, { key: i, label: campo.label, value: campo.value })),
    ),
  );
}

module.exports = SecaoStatus;
