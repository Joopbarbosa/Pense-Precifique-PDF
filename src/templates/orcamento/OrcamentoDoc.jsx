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
const SecaoCondicoesPagamento = require('../components/SecaoCondicoesPagamento.jsx');
const COLORS = require('../tokens.js');

// P-F008 — redesign por componentização de seção (Design aprovado "Preview.html"). Alteração
// aprovada sobre o Design original: rótulo "Rascunho" vira "Aguardando aprovação" — tradução já
// feita em Java (PdfMapper.formatarStatusOrcamento), o template só exibe `documento.status` pronto.
// "Aprovação" fica sempre traço na Seção 3 — o contrato de Orçamento não carrega essa data (só
// Orçamento aprovado tem `dataAprovacao`, mas esse campo não existe neste schema). Seção 4 mostra
// início estimado como traço. V0.19.0 #445 (RN-NOVA-45): a página 1 não traz mais forma de
// pagamento, sinal, restante nem data do sinal; isso vai para a página 2 (Condições de pagamento).
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
  pagina2: {
    width: '210mm',
    boxSizing: 'border-box',
    padding: '40px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '11px',
    color: COLORS.ink,
    lineHeight: 1.4,
    breakBefore: 'page',
    pageBreakBefore: 'always',
  },
  headerRightLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '24px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
  clausula: { margin: '14px 0 0', fontSize: '8px', lineHeight: 1.55, color: COLORS.labelMuted },
};

function IconeDoc() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z' }),
    React.createElement('path', { d: 'M13 3.5V9h5' }),
    React.createElement('path', { d: 'M8.5 13.5h7M8.5 16.5h5' }),
  );
}

function IconeCheckCircle() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('circle', { cx: '12', cy: '12', r: '8.5' }),
    React.createElement('path', { d: 'm8.3 12.2 2.5 2.5 4.9-5', strokeWidth: '2' }),
  );
}

function IconeSeta() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M5 12h13M13 6.5 18.5 12 13 17.5' }),
  );
}

function OrcamentoDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    status,
    nomeCliente,
    telefoneCliente,
    dataEmissao,
    dataValidade,
    prazoProducao,
    sinalAtivo,
    condicoes,
    subtotal,
    desconto,
    percentualDesconto,
    total,
    observacoes,
    itens,
  } = documento;

  const linhasCalculadora = [{ tipo: 'simples', label: 'Subtotal', value: subtotal }];
  if (desconto) {
    linhasCalculadora.push({
      tipo: 'simples',
      label: 'Desconto' + (percentualDesconto ? ` (${percentualDesconto})` : ''),
      value: '− ' + desconto,
      corValor: COLORS.red,
    });
  }
  linhasCalculadora.push({ tipo: 'total', label: 'Total', value: total, corDestaque: COLORS.orange });

  const aprovado = status === 'Aprovado';
  const corTexto = { fontWeight: 'bold', color: '#1F7A6F' };
  // RN-NOVA-45: o texto fala em aprovar e combinar o pagamento; valores e datas ficam na página 2.
  const passos = aprovado
    ? React.createElement(
        React.Fragment,
        null,
        React.createElement('strong', { style: corTexto }, 'Orçamento aprovado! '),
        'As condições de pagamento combinadas estão na página 2. ',
        sinalAtivo ? 'Assim que o sinal for identificado, a produção será iniciada.' : 'A produção será iniciada em breve.',
      )
    : React.createElement(
        React.Fragment,
        null,
        'Para seguir, aprove este orçamento. ',
        React.createElement('strong', { style: corTexto }, 'O pagamento e o sinal são combinados na aprovação'),
        '. Prazo estimado de entrega: ',
        React.createElement('strong', { style: { fontWeight: 'bold', color: COLORS.textMuted } }, prazoProducao),
        '.',
      );

  const pagina1 = React.createElement(
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
      icone: React.createElement(IconeDoc),
      titulo: 'Orçamento',
    }),

    React.createElement(SecaoDatasCliente, {
      datas: [
        { label: 'Emissão', value: dataEmissao },
        { label: 'Aprovação', value: '—' },
        { label: 'Validade', value: dataValidade },
        { label: 'Prazo', value: prazoProducao },
      ],
      cliente: { nome: nomeCliente, whatsapp: telefoneCliente },
    }),

    React.createElement(SecaoStatus, {
      corDestaque: COLORS.teal,
      icone: React.createElement(IconeCheckCircle),
      tituloStatus: status,
      campos: [
        { label: 'Início estimado', value: null },
      ],
    }),

    React.createElement('div', { style: { marginTop: '26px' } }, React.createElement(ItemTable, { itens })),

    React.createElement(SecaoCalculadora, { linhas: linhasCalculadora }),

    React.createElement(SecaoObservacoes, { texto: observacoes }),

    React.createElement(SecaoProximosPassos, { corDestaque: COLORS.teal, icone: React.createElement(IconeSeta) }, passos),

    React.createElement(
      'div',
      { style: { marginTop: 'auto' } },
      React.createElement(
        DocumentFooter,
        null,
        'Este orçamento é válido até ',
        React.createElement('strong', null, dataValidade),
        '.',
      ),
      // Cláusula estática (sem valor/percentual dinâmico — não há campo no contrato para taxa de
      // cancelamento na fase de orçamento, antes de qualquer cancelamento real acontecer).
      React.createElement(
        'p',
        { style: styles.clausula },
        'Em caso de cancelamento após aprovação, poderá ser cobrada uma taxa referente aos materiais e ao tempo já investidos na produção, conforme acordado previamente com a empresa.',
      ),
    ),
  );

  if (!condicoes) {
    return pagina1;
  }
  // Página 2 (RN-NOVA-45): quebra de página forçada; o contêiner não usa a altura mínima da página 1.
  const pagina2 = React.createElement(
    'div',
    { style: styles.pagina2 },
    React.createElement(SecaoCondicoesPagamento, { condicoes }),
  );
  return React.createElement(React.Fragment, null, pagina1, pagina2);
}

module.exports = OrcamentoDoc;
