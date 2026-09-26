// Sem build/bundler neste serviço (Node puro) — .jsx é só convenção de nome (React.createElement).
const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const SecaoTitulo = require('../components/SecaoTitulo.jsx');
const TabelaColunas = require('../components/TabelaColunas.jsx');
const COLORS = require('../tokens.js');

// OpenProject #547 (V0.15.0, RN-NOVA-14) — lista de compras (LST-N), sempre do retrato gravado na
// geração, nunca dos dados atuais. Linhas agrupadas por fornecedor sugerido; "Sem fornecedor" vem
// por último (ordem dos grupos definida pelo backend).
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
  grupo: { marginTop: '20px', breakInside: 'avoid' },
};

function IconeLista() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M9 6h11M9 12h11M9 18h11' }),
    React.createElement('path', { d: 'm3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2' }),
  );
}

const COLUNAS = [
  { titulo: 'Insumo', campo: 'insumo', destaque: true },
  { titulo: 'Unidade', campo: 'unidade' },
  { titulo: 'Quantidade', campo: 'quantidade', numerico: true },
  { titulo: 'Preço de referência', campo: 'precoReferencia', numerico: true },
];

function ListaComprasDoc({ empresa, documento }) {
  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Lista de compras'),
      React.createElement('div', { style: styles.headerRightNumero }, documento.numeroFormatado),
    ),

    documento.grupos.map((grupo, i) =>
      React.createElement(
        'div',
        { key: i, style: styles.grupo },
        React.createElement(SecaoTitulo, {
          corDestaque: grupo.fornecedor === 'Sem fornecedor' ? COLORS.textSecondary : COLORS.teal,
          icone: React.createElement(IconeLista),
          titulo: grupo.fornecedor,
        }),
        React.createElement(TabelaColunas, { colunas: COLUNAS, linhas: grupo.itens }),
      )),

    React.createElement(
      'div',
      { style: { marginTop: 'auto' } },
      React.createElement(DocumentFooter, null, 'Lista gerada em ' + documento.dataGeracao + ' com ', React.createElement('strong', null,
        documento.quantidadeItens + ' ite' + (documento.quantidadeItens === 1 ? 'm' : 'ns') + '.')),
    ),
  );
}

module.exports = ListaComprasDoc;
