const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const ItemTable = require('../components/ItemTable.jsx');
const SecaoTitulo = require('../components/SecaoTitulo.jsx');
const SecaoDatasCliente = require('../components/SecaoDatasCliente.jsx');
const SecaoStatus = require('../components/SecaoStatus.jsx');
const SecaoCalculadora = require('../components/SecaoCalculadora.jsx');
const SecaoObservacoes = require('../components/SecaoObservacoes.jsx');
const COLORS = require('../tokens.js');

// P-F008 — redesign por componentização de seção (Design aprovado "Recibo-Pagamento.html",
// variante Quitação Total — a variante "Entrada" do mock já é o próprio Recibo do Sinal no domínio
// atual, guard SINAL_PAGO vs PAGO em ReciboPdfPayloadService/ReciboPagamentoPdfPayloadService,
// confirmado no Passo 0). Sem Seção 8 (Próximos passos) — mesma decisão do Design: quitação total
// não tem próximo pagamento a instruir. "Emissão"/"Validade" ficam traço na Seção 3 — schema não
// carrega essas datas para este tipo de documento.
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
    color: COLORS.success,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
};

function IconeSeloCheck() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', {
      d: 'M12 2.8l2.3 1.7 2.8-.3 1 2.6 2.4 1.5-.6 2.8 1.3 2.5-2 2-.2 2.8-2.7.8-1.7 2.3-2.6-1.1-2.6 1.1-1.7-2.3-2.7-.8-.2-2.8-2-2 1.3-2.5-.6-2.8L4.9 6.8l1-2.6 2.8.3L12 2.8Z',
    }),
    React.createElement('path', { d: 'm8.8 12 2.2 2.2 4.2-4.4', strokeWidth: '1.9' }),
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

function ReciboPagamentoDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    telefoneCliente,
    metodoPagamento,
    valorTotal,
    valorSinalPago,
    valorRestantePago,
    totalQuitado,
    dataAprovacao,
    prazoProducao,
    dataPagamento,
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
      corDestaque: COLORS.success,
      icone: React.createElement(IconeSeloCheck),
      titulo: 'Recibo de Pagamento — Quitação Total',
    }),

    React.createElement(SecaoDatasCliente, {
      datas: [
        { label: 'Emissão', value: '—' },
        { label: 'Aprovação', value: dataAprovacao },
        { label: 'Validade', value: '—' },
        { label: 'Prazo', value: prazoProducao },
      ],
      cliente: { nome: nomeCliente, whatsapp: telefoneCliente },
    }),

    React.createElement(SecaoStatus, {
      corDestaque: COLORS.success,
      icone: React.createElement(IconeCheck),
      tituloStatus: 'Pedido quitado',
      descricao: 'Não há valores pendentes para este orçamento.',
      campos: [
        { label: 'Forma de pagamento', value: metodoPagamento },
        { label: 'Data do pagamento', value: dataPagamento },
      ],
    }),

    React.createElement('div', { style: { marginTop: '26px' } }, React.createElement(ItemTable, {
      itens,
      titulo: 'Detalhes do produto',
      icone: React.createElement(IconeSacola),
      corDestaque: COLORS.success,
    })),

    React.createElement(SecaoCalculadora, {
      linhas: [
        { tipo: 'simples', label: 'Valor total', value: valorTotal },
        { tipo: 'simples', label: 'Sinal pago', value: valorSinalPago },
        { tipo: 'simples', label: 'Valor restante pago', value: valorRestantePago },
        { tipo: 'total', label: 'Total quitado', value: totalQuitado, corDestaque: COLORS.orange },
      ],
    }),

    React.createElement(SecaoObservacoes, { texto: documento.observacoes }),

    React.createElement('div', { style: { marginTop: 'auto' } }, React.createElement(
      DocumentFooter,
      null,
      'Este recibo confirma a quitação total do orçamento #' + numeroFormatado,
      '.',
    )),
  );
}

module.exports = ReciboPagamentoDoc;
