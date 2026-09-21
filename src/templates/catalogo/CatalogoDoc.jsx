// Sem build/bundler neste serviço (Node puro) — .jsx aqui é só convenção de nome, o conteúdo é
// JS válido via React.createElement, sem sintaxe JSX literal. Ver ARCHITECTURE.md/decisoes-pdf.md.
const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const SecaoTitulo = require('../components/SecaoTitulo.jsx');
const COLORS = require('../tokens.js');

// OpenProject #519 (RN-NOVA-8/UC-NOVO-2) — sem cliente/valores/datas (diferente dos outros 5
// documentos, todos derivados de Orçamento): é uma listagem de itens do catálogo pra artesã
// enviar pra cliente final, foto+nome+descrição, na ordem em que os itens chegam no payload.
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
  grid: {
    marginTop: '22px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  card: {
    border: `1px solid ${COLORS.borderLight}`,
    borderRadius: '10px',
    overflow: 'hidden',
    // evita um card ser cortado ao meio entre 2 páginas do PDF (Puppeteer respeita break-inside).
    breakInside: 'avoid',
  },
  foto: { width: '100%', height: '140px', objectFit: 'cover', display: 'block' },
  fotoPlaceholder: {
    width: '100%',
    height: '140px',
    backgroundColor: COLORS.borderLight,
    color: COLORS.borderSubtle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corpo: { padding: '12px 14px' },
  nome: { fontSize: '13px', fontWeight: 'bold', color: COLORS.ink, margin: 0 },
  descricao: { fontSize: '10px', color: COLORS.textMuted, marginTop: '5px', lineHeight: 1.45 },
  preco: { fontSize: '13px', fontWeight: 'bold', color: COLORS.teal, marginTop: '7px' },
};

function IconeCatalogo() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: '3.5', y: '3.5', width: '8', height: '8', rx: '1.5' }),
    React.createElement('rect', { x: '12.5', y: '3.5', width: '8', height: '8', rx: '1.5' }),
    React.createElement('rect', { x: '3.5', y: '12.5', width: '8', height: '8', rx: '1.5' }),
    React.createElement('rect', { x: '12.5', y: '12.5', width: '8', height: '8', rx: '1.5' }),
  );
}

function IconeImagem() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '28', height: '28', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: '3.5', y: '4.5', width: '17', height: '15', rx: '2' }),
    React.createElement('circle', { cx: '9', cy: '10', r: '1.6' }),
    React.createElement('path', { d: 'm4.5 16.5 4.8-4.8a2 2 0 0 1 2.8 0l1.4 1.4' }),
    React.createElement('path', { d: 'm12.5 15-1-1a2 2 0 0 1 0-2.8l3.3-3.3a2 2 0 0 1 2.8 0l2.1 2.1' }),
  );
}

function ItemCard({ item }) {
  const foto = item.fotoUrl
    ? React.createElement('img', { src: item.fotoUrl, alt: item.nome, style: styles.foto })
    : React.createElement('div', { style: styles.fotoPlaceholder }, React.createElement(IconeImagem));

  return React.createElement(
    'div',
    { style: styles.card },
    foto,
    React.createElement(
      'div',
      { style: styles.corpo },
      React.createElement('p', { style: styles.nome }, item.nome),
      item.descricao ? React.createElement('p', { style: styles.descricao }, item.descricao) : null,
      React.createElement('p', { style: styles.preco }, item.precoVenda),
    ),
  );
}

function CatalogoDoc({ empresa, documento }) {
  const { numeroFormatado, nome, itens } = documento;

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Catálogo'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),

    React.createElement(SecaoTitulo, {
      corDestaque: COLORS.teal,
      icone: React.createElement(IconeCatalogo),
      titulo: nome,
    }),

    React.createElement('div', { style: styles.grid }, itens.map((item, i) =>
      React.createElement(ItemCard, { key: i, item }))),

    React.createElement(
      'div',
      { style: { marginTop: 'auto' } },
      React.createElement(DocumentFooter, null, 'Catálogo gerado em ', React.createElement('strong', null, itens.length + ' ite' + (itens.length === 1 ? 'm' : 'ns') + '.')),
    ),
  );
}

module.exports = CatalogoDoc;
