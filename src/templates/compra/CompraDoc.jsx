// Sem build/bundler neste serviço (Node puro) — .jsx é só convenção de nome (React.createElement).
const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const SecaoStatus = require('../components/SecaoStatus.jsx');
const SecaoObservacoes = require('../components/SecaoObservacoes.jsx');
const TabelaColunas = require('../components/TabelaColunas.jsx');
const COLORS = require('../tokens.js');

// OpenProject #545 (V0.15.0, RN-NOVA-11) — documento de compra de insumos (COM-N): dados da empresa,
// status (RASCUNHO e CANCELADA destacados — não é compra efetivada), data, fornecedor(es), pagamento,
// linhas (insumo, [fornecedor], quantidade, preço total, preço unitário pago), total e observações.
// Tudo chega formatado do backend; valor não informado vem "—".
const COR_STATUS = { CONFIRMADA: COLORS.teal, RASCUNHO: COLORS.orange, CANCELADA: COLORS.red };

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
  headerRightLabel: { fontSize: '11px', fontWeight: 600, color: COLORS.teal, textTransform: 'uppercase', letterSpacing: '0.08em' },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
  faixa: (cor) => ({
    marginTop: '18px',
    padding: '9px 14px',
    borderRadius: '8px',
    border: `1.5px dashed ${cor}`,
    color: cor,
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    textAlign: 'center',
  }),
  secaoLabel: {
    marginTop: '24px',
    fontSize: '10.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: COLORS.labelMuted,
  },
  totalBox: {
    marginTop: '10px',
    marginLeft: 'auto',
    minWidth: '220px',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: COLORS.orangeLight,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: '11px', fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' },
  totalValor: { fontSize: '18px', fontWeight: 'bold', color: COLORS.orange },
  cancelamento: { marginTop: '18px', fontSize: '10.5px', color: COLORS.red },
};

function IconeCarrinho() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('circle', { cx: '9', cy: '20', r: '1.3' }),
    React.createElement('circle', { cx: '17', cy: '20', r: '1.3' }),
    React.createElement('path', { d: 'M3.5 4h2l2.2 11h10.6l2-8H6.6' }),
  );
}

function CompraDoc({ empresa, documento }) {
  const cor = COR_STATUS[documento.statusCodigo];
  const colunas = [
    { titulo: 'Insumo', campo: 'insumo', destaque: true },
    ...(documento.multiplosFornecedores ? [{ titulo: 'Fornecedor', campo: 'fornecedor' }] : []),
    { titulo: 'Qtd', campo: 'quantidade', numerico: true },
    { titulo: 'Preço total', campo: 'precoTotal', numerico: true },
    { titulo: 'Preço unit.', campo: 'precoUnitario', numerico: true },
  ];

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Compra'),
      React.createElement('div', { style: styles.headerRightNumero }, documento.numeroFormatado),
    ),

    documento.statusCodigo !== 'CONFIRMADA'
      ? React.createElement('div', { style: styles.faixa(cor) },
          documento.statusCodigo === 'RASCUNHO' ? 'Rascunho — compra ainda não confirmada' : 'Compra cancelada')
      : null,

    React.createElement(SecaoStatus, {
      corDestaque: cor,
      icone: React.createElement(IconeCarrinho),
      tituloStatus: documento.status,
      descricao: null,
      campos: [
        { label: 'Data da compra', value: documento.dataCompra },
        { label: documento.multiplosFornecedores ? 'Fornecedores' : 'Fornecedor', value: documento.fornecedor },
        { label: 'Pagamento', value: documento.pagamento },
      ],
    }),

    React.createElement('div', { style: styles.secaoLabel }, 'Itens'),
    React.createElement(TabelaColunas, { colunas, linhas: documento.itens }),

    React.createElement(
      'div',
      { style: styles.totalBox },
      React.createElement('span', { style: styles.totalLabel }, 'Total'),
      React.createElement('span', { style: styles.totalValor }, documento.total),
    ),

    documento.statusCodigo === 'CANCELADA' && documento.observacaoCancelamento
      ? React.createElement('div', { style: styles.cancelamento },
          React.createElement('strong', null, 'Cancelada em ' + (documento.dataCancelamento || '—') + ': '),
          documento.observacaoCancelamento)
      : null,

    React.createElement(SecaoObservacoes, { texto: documento.observacoes }),

    React.createElement(
      'div',
      { style: { marginTop: 'auto' } },
      React.createElement(DocumentFooter, null, 'Compra com ', React.createElement('strong', null,
        documento.itens.length + ' ite' + (documento.itens.length === 1 ? 'm' : 'ns') + '.')),
    ),
  );
}

module.exports = CompraDoc;
