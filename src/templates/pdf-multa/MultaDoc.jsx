const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const ItemTable = require('../components/ItemTable.jsx');
const SecaoTitulo = require('../components/SecaoTitulo.jsx');
const SecaoDatasCliente = require('../components/SecaoDatasCliente.jsx');
const SecaoStatus = require('../components/SecaoStatus.jsx');
const SecaoCalculadora = require('../components/SecaoCalculadora.jsx');
const SecaoObservacoes = require('../components/SecaoObservacoes.jsx');
const SecaoProximosPassos = require('../components/SecaoProximosPassos.jsx');
const COLORS = require('../tokens.js');

// P-F008 — redesign por componentização de seção (Design aprovado "Multa-PDF.html"). Substitui a
// versão monolítica anterior (#248). "Prazo" fica sempre traço na Seção 3 — decisão do próprio
// Design (documento de cancelamento não tem prazo de produção remanescente), não ausência de dado.
// "Validade" fica traço porque o schema de Multa não carrega essa data (nunca carregou, fora do
// escopo de P-F008 expandir). "Emissão" passou a vir do backend (data de geração do documento —
// P-F009) desde que o schema ganhou o campo `dataEmissao`. Alteração aprovada sobre o Design
// original: Seção 4 usa "Data de cancelamento" no lugar de "Início estimado".
const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    padding: '40px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '11px',
    color: COLORS.ink,
    lineHeight: 1.4,
    display: 'flex',
    flexDirection: 'column',
  },
  headerRightLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: COLORS.red,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
};

function IconeAlerta() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M12 4 21.5 20.5h-19L12 4Z' }),
    React.createElement('path', { d: 'M12 10.5v4.5', strokeWidth: '2' }),
    React.createElement('circle', { cx: '12', cy: '18', r: '0.5', fill: 'currentColor', stroke: 'none' }),
  );
}

function IconeBan() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('circle', { cx: '12', cy: '12', r: '8.5' }),
    React.createElement('path', { d: 'm6 6 12 12' }),
  );
}

function IconeBox() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6L12 3.2Z' }),
    React.createElement('path', { d: 'M4 7.6 12 12l8-4.4M12 12v8.8' }),
  );
}

function IconePagar() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: '3', y: '6', width: '18', height: '12', rx: '2.5' }),
    React.createElement('path', { d: 'M3 10h18' }),
    React.createElement('path', { d: 'M6.5 14.5h3' }),
  );
}

function MultaDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    telefoneCliente,
    percentualMulta,
    valorMulta,
    dataEmissao,
    dataAprovacao,
    dataCancelamento,
    itens,
  } = documento;

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Orçamento'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),

    React.createElement(SecaoTitulo, {
      corDestaque: COLORS.red,
      icone: React.createElement(IconeAlerta),
      titulo: 'Notificação de Multa por Cancelamento',
    }),

    React.createElement(SecaoDatasCliente, {
      datas: [
        { label: 'Emissão', value: dataEmissao },
        { label: 'Aprovação', value: dataAprovacao },
        { label: 'Validade', value: '—' },
        { label: 'Prazo', value: '—' },
      ],
      cliente: { nome: nomeCliente, whatsapp: telefoneCliente },
    }),

    React.createElement(SecaoStatus, {
      corDestaque: COLORS.red,
      icone: React.createElement(IconeBan),
      tituloStatus: 'Cancelado',
      campos: [
        { label: 'Forma de pagamento', value: null },
        { label: 'Data de cancelamento', value: dataCancelamento },
      ],
    }),

    React.createElement('div', { style: { marginTop: '26px' } }, React.createElement(ItemTable, {
      itens,
      titulo: 'Detalhes do produto',
      icone: React.createElement(IconeBox),
      corDestaque: COLORS.red,
      nota: 'Itens do pedido cancelado, mantidos como referência — nada foi ou será produzido.',
    })),

    React.createElement(SecaoCalculadora, {
      linhas: [
        { tipo: 'simples', label: 'Percentual de multa aplicado', value: percentualMulta },
        { tipo: 'total', label: 'Valor da multa', value: valorMulta, corDestaque: COLORS.red },
      ],
    }),

    React.createElement(SecaoObservacoes, { texto: documento.motivo }),

    React.createElement(
      SecaoProximosPassos,
      { corDestaque: COLORS.red, icone: React.createElement(IconePagar) },
      'O valor de ',
      React.createElement('strong', { style: { fontWeight: 'bold', color: COLORS.red } }, valorMulta),
      ' referente à multa por cancelamento deve ser pago conforme combinado. Entre em contato para definir a forma de pagamento.',
    ),

    React.createElement('div', { style: { marginTop: 'auto' } }, React.createElement(
      DocumentFooter,
      null,
      'Notificação de cancelamento do orçamento #' + numeroFormatado,
      '.',
    )),
  );
}

module.exports = MultaDoc;
