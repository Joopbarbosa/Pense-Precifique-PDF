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

// P-F014 (V0.8.1) — redesign por componentização de seção, sem Design aprovado no Claude Design
// para este documento (não existe mock, ver decisoes-pdf.md) — layout inferido por analogia direta
// com MultaDoc.jsx, o mais próximo em espírito (documento de cancelamento, sem produção
// remanescente). Substitui a versão monolítica de 4 campos anterior (P-F008a/RECONCILIA-004).
// Cor de destaque `orange` mantida — mesmo acento já usado para estorno em
// DetalheOrcamentoPage.tsx (frontend) e na versão anterior deste template. "Prazo"/"Validade"
// ficam traço fixo na Seção 3, mesma decisão já tomada para Multa (cancelamento não tem produção
// remanescente) — payload não carrega esses dois campos para este tipo de documento. Payload
// completo (telefoneCliente/emailCliente/dataEmissao/dataAprovacao/motivo/itens) só existe desde
// P-B004 (2026-08-20) — antes disso o payload de Estorno tinha só 4 campos.
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
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
};

function IconeEstorno() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M4 10.5a8 8 0 1 1 2.1 6.4' }),
    React.createElement('path', { d: 'M4 5.5v5h5' }),
  );
}

function IconeCheck() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '14', height: '14', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'm5 12.5 4.2 4.2L19 7' }),
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

function ReciboEstornoDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    telefoneCliente,
    valorRecebido,
    dataEstorno,
    dataEmissao,
    dataAprovacao,
    motivo,
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
      corDestaque: COLORS.orange,
      icone: React.createElement(IconeEstorno),
      titulo: 'Recibo de Estorno',
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
      corDestaque: COLORS.orange,
      icone: React.createElement(IconeCheck),
      tituloStatus: 'Sinal estornado',
      campos: [
        { label: 'Forma de pagamento', value: null },
        { label: 'Data do estorno', value: dataEstorno },
      ],
    }),

    React.createElement('div', { style: { marginTop: '26px' } }, React.createElement(ItemTable, {
      itens,
      titulo: 'Detalhes do produto',
      icone: React.createElement(IconeBox),
      corDestaque: COLORS.orange,
      nota: 'Itens do pedido cancelado, mantidos como referência — nada foi ou será produzido.',
    })),

    React.createElement(SecaoCalculadora, {
      linhas: [
        { tipo: 'total', label: 'Valor devolvido', value: valorRecebido, corDestaque: COLORS.orange },
      ],
    }),

    React.createElement(SecaoObservacoes, { texto: motivo }),

    React.createElement(
      SecaoProximosPassos,
      { corDestaque: COLORS.orange, icone: React.createElement(IconeCheck) },
      'O pedido foi cancelado e o valor de ',
      React.createElement('strong', { style: { fontWeight: 'bold', color: COLORS.orange } }, valorRecebido),
      ' já foi devolvido à cliente. Nenhuma ação adicional é necessária.',
    ),

    React.createElement('div', { style: { marginTop: 'auto' } }, React.createElement(
      DocumentFooter,
      null,
      'Recibo de estorno referente ao orçamento #' + numeroFormatado,
      '.',
    )),
  );
}

module.exports = ReciboEstornoDoc;
