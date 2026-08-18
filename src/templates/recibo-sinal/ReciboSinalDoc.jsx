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

// P-F008 — redesign por componentização de seção (Design aprovado "Recibo-Sinal.html"). Substitui
// a versão monolítica anterior (P-F007b/c). "Validade" fica traço na Seção 3 — o schema de
// recibo-sinal não carrega essa data (fora do escopo de P-F008 expandir o contrato além do
// aprovado em Passo 0). "Emissão" passou a vir do backend (data de geração do documento —
// P-F009) desde que o schema ganhou o campo `dataEmissao`.
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
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
};

function IconeSelo() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('circle', { cx: '12', cy: '12', r: '8.5' }),
    React.createElement('path', { d: 'm8.3 12.2 2.5 2.5 4.9-5', strokeWidth: '2' }),
  );
}

function IconeCheck() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'm5 12.5 4.2 4.2L19 7' }),
  );
}

function IconeSacola() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M6 8.5h12l-1 11.5a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 8.5Z' }),
    React.createElement('path', { d: 'M9 8.5V7a3 3 0 0 1 6 0v1.5' }),
  );
}

function IconeSparkles() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', {
      d: 'M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9 12 3.5ZM18.5 15.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z',
    }),
  );
}

function ReciboSinalDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    telefoneCliente,
    metodoRecebido,
    valorRecebido,
    dataEmissao,
    dataAprovacao,
    prazoProducao,
    inicioProducao,
    itens,
    valorTotalPedido,
    percentualSinal,
    restante,
  } = documento;

  const rotuloSinal = percentualSinal && percentualSinal !== '—' ? `Entrada paga (${percentualSinal})` : 'Entrada paga';

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
      corDestaque: COLORS.teal,
      icone: React.createElement(IconeSelo),
      titulo: 'Recibo do Sinal',
    }),

    React.createElement(SecaoDatasCliente, {
      datas: [
        { label: 'Emissão', value: dataEmissao },
        { label: 'Aprovação', value: dataAprovacao },
        { label: 'Validade', value: '—' },
        { label: 'Prazo', value: prazoProducao },
      ],
      cliente: { nome: nomeCliente, whatsapp: telefoneCliente },
    }),

    React.createElement(SecaoStatus, {
      corDestaque: COLORS.teal,
      icone: React.createElement(IconeCheck),
      tituloStatus: 'Entrada recebida com sucesso',
      campos: [
        { label: 'Forma de pagamento', value: metodoRecebido },
        { label: 'Início estimado', value: inicioProducao },
      ],
    }),

    React.createElement('div', { style: { marginTop: '26px' } }, React.createElement(ItemTable, {
      itens,
      titulo: 'Detalhes do produto',
      icone: React.createElement(IconeSacola),
      corDestaque: COLORS.teal,
    })),

    React.createElement(SecaoCalculadora, {
      linhas: [
        { tipo: 'simples', label: 'Valor total do pedido', value: valorTotalPedido },
        { tipo: 'destaque-tracejado', label: rotuloSinal, value: valorRecebido, corDestaque: COLORS.teal },
        { tipo: 'total', label: 'Restante a pagar na entrega', value: restante, corDestaque: COLORS.orange },
      ],
    }),

    React.createElement(SecaoObservacoes, { texto: documento.observacoes }),

    React.createElement(
      SecaoProximosPassos,
      { corDestaque: COLORS.teal, icone: React.createElement(IconeSparkles) },
      React.createElement('strong', { style: { fontWeight: 'bold', color: '#1F7A6F' } }, 'Sua produção foi iniciada!'),
      ' O restante de ',
      React.createElement('strong', { style: { fontWeight: 'bold', color: COLORS.orange } }, restante),
      ' será cobrado na entrega do pedido. Prazo estimado: ',
      React.createElement('strong', { style: { fontWeight: 'bold', color: COLORS.textMuted } }, prazoProducao),
      '.',
    ),

    React.createElement('div', { style: { marginTop: 'auto' } }, React.createElement(
      DocumentFooter,
      null,
      'Recibo referente ao sinal do orçamento #' + numeroFormatado,
      '.',
    )),
  );
}

module.exports = ReciboSinalDoc;
