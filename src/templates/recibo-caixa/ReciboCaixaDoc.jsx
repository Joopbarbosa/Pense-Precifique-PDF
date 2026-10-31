const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const ItemTable = require('../components/ItemTable.jsx');
const SecaoTitulo = require('../components/SecaoTitulo.jsx');
const SecaoDatasCliente = require('../components/SecaoDatasCliente.jsx');
const SecaoCalculadora = require('../components/SecaoCalculadora.jsx');
const COLORS = require('../tokens.js');

// V0.19.0 #1170 (RN-NOVA-33, DT-NOVA-9) — recibo da venda do Caixa. Mesmo desenho do
// recibo-pagamento: cabeçalho com logo/empresa, número e data da venda, cliente (se houver),
// itens, total, cada forma de pagamento e o troco. O microsserviço só renderiza o que recebe.
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

function IconeRecibo() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Z' }),
    React.createElement('path', { d: 'M9 8h6M9 12h6' }),
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

function ReciboCaixaDoc({ empresa, documento }) {
  const { numeroFormatado, dataVenda, nomeCliente, telefoneCliente, itens, subtotal, desconto, total, pagamentos, troco } = documento;

  const linhas = [{ tipo: 'simples', label: 'Subtotal', value: subtotal }];
  if (desconto) linhas.push({ tipo: 'simples', label: 'Desconto', value: desconto });
  linhas.push({ tipo: 'total', label: 'Total da venda', value: total, corDestaque: COLORS.orange });
  pagamentos.forEach((p) => linhas.push({ tipo: 'simples', label: 'Pago em ' + p.metodo, value: p.valor }));
  if (troco) linhas.push({ tipo: 'simples', label: 'Troco', value: troco });

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Venda'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),
    React.createElement(SecaoTitulo, { corDestaque: COLORS.success, icone: React.createElement(IconeRecibo), titulo: 'Recibo da venda' }),
    React.createElement(SecaoDatasCliente, {
      datas: [{ label: 'Data da venda', value: dataVenda }],
      cliente: { nome: nomeCliente || 'Consumidor', whatsapp: telefoneCliente },
    }),
    React.createElement(
      'div',
      { style: { marginTop: '26px' } },
      React.createElement(ItemTable, { itens, titulo: 'Itens da venda', icone: React.createElement(IconeSacola), corDestaque: COLORS.success }),
    ),
    React.createElement(SecaoCalculadora, { linhas }),
    React.createElement(
      'div',
      { style: { marginTop: 'auto' } },
      React.createElement(DocumentFooter, null, 'Este recibo confirma a venda #' + numeroFormatado, '.'),
    ),
  );
}

module.exports = ReciboCaixaDoc;
