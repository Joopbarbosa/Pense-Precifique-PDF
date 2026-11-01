const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const SecaoTitulo = require('../components/SecaoTitulo.jsx');
const SecaoDatasCliente = require('../components/SecaoDatasCliente.jsx');
const SecaoObservacoes = require('../components/SecaoObservacoes.jsx');
const TabelaColunas = require('../components/TabelaColunas.jsx');
const COLORS = require('../tokens.js');

// V0.19.0 #382 (RN-NOVA-44, DT-NOVA-10) — orçamento Descritivo (cardápio de opções). Só a página de
// opções: título, cliente (se houver), data, observação e a lista de opções com o preço de referência.
// Sem total, subtotal, desconto, sinal, forma de pagamento nem página de condições (decisão D16).
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
  nota: { marginTop: '6px', fontSize: '9px', color: COLORS.labelMuted },
};

function IconeLista() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M8 6h12M8 12h12M8 18h12' }),
    React.createElement('path', { d: 'M4 6h.01M4 12h.01M4 18h.01' }),
  );
}

function OrcamentoDescritivoDoc({ empresa, documento }) {
  const { numeroFormatado, titulo, nomeCliente, telefoneCliente, dataEmissao, observacoes, opcoes } = documento;

  const colunas = [
    { titulo: 'Opção', campo: 'nome', destaque: true },
    { titulo: 'Quantidade / unidade', campo: 'quantidadeUnidade' },
    { titulo: 'Preço de referência', campo: 'precoReferencia', numerico: true, destaque: true },
  ];

  return React.createElement(
    'div',
    { style: styles.page },
    React.createElement(
      DocumentHeader,
      { empresa },
      React.createElement('div', { style: styles.headerRightLabel }, 'Orçamento'),
      React.createElement('div', { style: styles.headerRightNumero }, '#' + numeroFormatado),
    ),
    React.createElement(SecaoTitulo, { corDestaque: COLORS.teal, icone: React.createElement(IconeLista), titulo }),
    React.createElement(SecaoDatasCliente, {
      datas: [{ label: 'Emissão', value: dataEmissao }],
      cliente: { nome: nomeCliente || '—', whatsapp: telefoneCliente },
    }),
    React.createElement(
      'div',
      { style: { marginTop: '22px' } },
      React.createElement(TabelaColunas, { colunas, linhas: opcoes }),
      React.createElement('div', { style: styles.nota }, 'Os preços são de referência e podem mudar até o pedido ser confirmado.'),
    ),
    React.createElement(SecaoObservacoes, { texto: observacoes }),
    React.createElement(
      'div',
      { style: { marginTop: 'auto' } },
      React.createElement(DocumentFooter, null, 'Escolha as opções que mais gostar e combine com a gente.'),
    ),
  );
}

module.exports = OrcamentoDescritivoDoc;
