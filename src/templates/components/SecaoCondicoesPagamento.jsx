const React = require('react');
const COLORS = require('../tokens.js');

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const styles = {
  titulo: { margin: '0 0 6px', fontSize: '20px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.01em' },
  subtitulo: { margin: '0 0 22px', fontSize: '12px', color: COLORS.textSecondary },
  card: {
    padding: '18px 20px',
    borderRadius: '12px',
    backgroundColor: hexA(COLORS.teal, 0.05),
    border: `1px solid ${hexA(COLORS.teal, 0.2)}`,
  },
  rotulo: { fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: COLORS.tableLabel, marginBottom: '10px' },
  lista: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip: {
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.teal,
    backgroundColor: COLORS.white,
    border: `1px solid ${hexA(COLORS.teal, 0.35)}`,
  },
  aviso: { margin: '16px 0 0', fontSize: '13.5px', color: COLORS.ink, lineHeight: 1.65 },
  avisoSozinho: { margin: 0, fontSize: '13.5px', color: COLORS.ink, lineHeight: 1.65 },
  linha: { display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '9px 0', borderBottom: `1px solid ${COLORS.borderLight}`, fontSize: '13px' },
  linhaRotulo: { color: COLORS.textMuted },
  linhaValor: { fontWeight: 600, color: COLORS.ink, textAlign: 'right' },
};

function Linha({ rotulo, valor }) {
  return React.createElement(
    'div',
    { style: styles.linha },
    React.createElement('span', { style: styles.linhaRotulo }, rotulo),
    React.createElement('span', { style: styles.linhaValor }, valor),
  );
}

// V0.19.0 #445 (RN-NOVA-45, DT-NOVA-11) — página 2 do orçamento de Venda. Antes da aprovação lista
// as formas aceitas pela empresa (sem nenhuma, só o aviso fixo); depois da aprovação mostra o
// combinado. Tudo chega pronto do backend; aqui só se decide o que exibir.
function SecaoCondicoesPagamento({ condicoes }) {
  const corpo =
    condicoes.modo === 'APROVADO'
      ? React.createElement(
          'div',
          { style: styles.card },
          React.createElement(Linha, { rotulo: 'Forma de pagamento', valor: condicoes.forma }),
          React.createElement(Linha, { rotulo: 'Sinal', valor: condicoes.sinal }),
          condicoes.sinalAte ? React.createElement(Linha, { rotulo: 'Sinal até', valor: condicoes.sinalAte }) : null,
          condicoes.saldo ? React.createElement(Linha, { rotulo: 'Saldo', valor: condicoes.saldo }) : null,
          condicoes.vencimentoSaldo ? React.createElement(Linha, { rotulo: 'Vencimento do saldo', valor: condicoes.vencimentoSaldo }) : null,
          React.createElement(Linha, { rotulo: 'Recebido', valor: condicoes.recebido }),
        )
      : React.createElement(
          'div',
          { style: styles.card },
          condicoes.formasAceitas.length > 0
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement('div', { style: styles.rotulo }, 'Formas de pagamento aceitas'),
                React.createElement(
                  'ul',
                  { style: styles.lista },
                  condicoes.formasAceitas.map((nome, i) => React.createElement('li', { key: i, style: styles.chip }, nome)),
                ),
                React.createElement('p', { style: styles.aviso }, condicoes.aviso),
              )
            : React.createElement('p', { style: styles.avisoSozinho }, condicoes.aviso),
        );

  return React.createElement(
    'div',
    null,
    React.createElement('h2', { style: styles.titulo }, 'Condições de pagamento'),
    React.createElement(
      'p',
      { style: styles.subtitulo },
      condicoes.modo === 'APROVADO' ? 'Combinado na aprovação do orçamento.' : 'Como você pode pagar este orçamento.',
    ),
    corpo,
  );
}

module.exports = SecaoCondicoesPagamento;
