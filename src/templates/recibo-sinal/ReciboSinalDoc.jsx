const React = require('react');
const DocumentHeader = require('../components/DocumentHeader.jsx');
const DocumentFooter = require('../components/DocumentFooter.jsx');
const COLORS = require('../tokens.js');

// Migração #248 (V0.8.1) — layout aprovado no Claude Design (mock "Recibo do Sinal - standalone",
// ver contrato-pdf.md seção 2.1/6). P-F007b restaura "Detalhes do pedido" (tabela de itens +
// resumo financeiro) e "Próximos passos", cortadas em #248 por o schema original não ter
// itens/totais — `ReciboPdfPayloadService`/`PdfMapper` agora buscam os mesmos dados de
// itens/customizações já usados pelo Orçamento. Sem SignatureBlock (mesma decisão já registrada
// em decisoes-pdf.md). Tabela de "Detalhes do pedido" não reaproveita `ItemTable.jsx` (5 colunas,
// com preço unitário/total) — o mock só mostra Item/Customização/Qtd, por isso é uma tabela local
// própria, mesmo padrão de estilo (COLORS.tableLabel/borderLight).
//
// Tamanhos de fonte escalados proporcionalmente — base do corpo 11px→13px (P-F007b). P-F007c pediu
// +35% sobre 13px (≈18px), mas isso quebrava 1 página mesmo no caso mais simples (1 item) — e a
// 16.5px (+27%) já quebrava com um pedido real de 2 itens (dados de #18). O valor final, 15px
// (+15% sobre P-F007b), é o maior que ainda cabe em 1 página testado contra pedidos de 1-2 itens
// (dados reais); pedidos de 3+ itens com texto longo já não cabiam em 1 página nem no baseline de
// 13px (achado, não regressão desta mudança — ver DECISOES_V0.8.1.md, P-F007c). Cada tamanho é
// escalado a partir do valor atual do elemento (fator ~15/13), não igualado a um único valor —
// preserva a hierarquia label/valor/heading do layout aprovado.
const styles = {
  page: {
    width: '210mm',
    minHeight: '297mm',
    boxSizing: 'border-box',
    padding: '40px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '15px',
    color: COLORS.ink,
    lineHeight: 1.4,
  },
  headerRightLabel: {
    fontSize: '15px',
    fontWeight: 600,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  headerRightNumero: { fontSize: '32.5px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.02em', marginTop: '2px' },
  tituloCard: {
    marginTop: '22px',
    padding: '16px 18px',
    borderRadius: '10px',
    backgroundColor: 'rgba(42,157,143,0.07)',
    border: '1px solid rgba(42,157,143,0.22)',
    borderLeft: `4px solid ${COLORS.teal}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tituloIconeChip: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    backgroundColor: COLORS.white,
    border: '1px solid rgba(42,157,143,0.25)',
    color: COLORS.teal,
  },
  tituloHeading: { fontSize: '18px', fontWeight: 'bold', color: COLORS.teal, letterSpacing: '-0.005em' },
  tituloSub: { fontSize: '11.5px', color: '#4A6B62', marginTop: '3px' },
  clienteSection: { padding: '18px 0 0' },
  clienteLabel: {
    fontSize: '10.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '5px',
  },
  clienteNome: { fontSize: '15.5px', fontWeight: 'bold', color: COLORS.ink },
  destaqueCard: {
    marginTop: '18px',
    borderRadius: '11px',
    overflow: 'hidden',
    border: '1.2px solid rgba(42,157,143,0.3)',
    backgroundColor: 'rgba(42,157,143,0.045)',
  },
  destaqueHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '11px 15px',
    backgroundColor: 'rgba(42,157,143,0.1)',
    borderBottom: '1px solid rgba(42,157,143,0.18)',
  },
  destaqueHeaderIcone: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    borderRadius: '7px',
    backgroundColor: COLORS.white,
    color: COLORS.teal,
  },
  destaqueHeaderTexto: { fontSize: '14.5px', fontWeight: 'bold', color: COLORS.teal },
  destaqueBody: { display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '15px' },
  valorLabel: {
    fontSize: '10.5px',
    fontWeight: 600,
    color: COLORS.teal,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  valorAmount: { fontSize: '30px', fontWeight: 'bold', color: COLORS.teal, marginTop: '3px', letterSpacing: '-0.01em' },
  destaqueMetaLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  destaqueMetaValue: { fontSize: '12.5px', fontWeight: 600, color: COLORS.ink, marginTop: '2px' },
  datasGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '22px',
    padding: '18px 0',
    borderTop: `1px solid ${COLORS.borderLight}`,
  },
  metaLabel: {
    fontSize: '10.5px',
    fontWeight: 600,
    color: COLORS.labelMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  metaValue: { fontSize: '14px', fontWeight: 600, color: COLORS.ink, margin: '4px 0' },
  metaValueDestaque: { fontSize: '14px', fontWeight: 600, color: COLORS.teal, margin: '4px 0' },

  secaoTituloRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  secaoTituloChip: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '8px',
    backgroundColor: 'rgba(42,157,143,0.1)',
    color: COLORS.teal,
  },
  secaoTituloTexto: { fontSize: '16.5px', fontWeight: 'bold', color: COLORS.ink, letterSpacing: '-0.005em' },

  pedidoSection: { marginTop: '26px' },
  pedidoTable: { width: '100%', borderCollapse: 'collapse', marginTop: '14px' },
  pedidoTh: {
    textAlign: 'left',
    fontSize: '10.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: COLORS.tableLabel,
    padding: '0 8px 9px',
    borderBottom: `1.5px solid ${COLORS.teal}`,
  },
  pedidoThNum: { textAlign: 'right' },
  pedidoTd: { padding: '10px 8px', fontSize: '12.5px', color: COLORS.ink, borderBottom: `1px solid ${COLORS.borderLight}`, verticalAlign: 'top' },
  pedidoTdNum: { textAlign: 'right', fontWeight: 600 },
  pedidoNomeItem: { fontWeight: 600 },
  pedidoCustom: { color: COLORS.textMuted },
  pedidoCustomVazia: { color: COLORS.borderSubtle },

  resumoWrap: { display: 'flex', justifyContent: 'flex-end', marginTop: '18px' },
  // largura ampliada de 300px→360px (P-F007c) — companion fix: no fontSize anterior (10.5-15px)
  // "Entrada paga (XX%)"/"Restante a pagar na entrega" cabiam numa linha só a 300px; no fontSize
  // novo (12-17.5px) quebrariam texto/valor em 2 linhas dentro da caixa. Página tem ~714px úteis
  // (210mm - 80px de padding), 360px continua confortável alinhado à direita.
  resumoBox: { width: '360px', maxWidth: '100%' },
  resumoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: COLORS.textMuted, padding: '7px 10px' },
  resumoRowEntrada: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: COLORS.textMuted,
    padding: '8px 10px',
    borderRadius: '8px',
    backgroundColor: 'rgba(42,157,143,0.07)',
    border: '1px dashed rgba(42,157,143,0.4)',
    margin: '2px 0',
  },
  resumoRowEntradaLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: COLORS.teal },
  resumoRowEntradaValor: { fontWeight: 'bold', color: COLORS.teal },
  resumoRowRestante: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '6px',
    padding: '11px 12px',
    borderRadius: '9px',
    backgroundColor: COLORS.orangeLight,
    border: '1px solid rgba(249,115,22,0.28)',
  },
  resumoRowRestanteLabel: { fontSize: '12px', fontWeight: 600, color: COLORS.ink },
  resumoRowRestanteValor: { fontSize: '17.5px', fontWeight: 'bold', color: COLORS.orange, letterSpacing: '-0.01em' },

  passosSection: { marginTop: '26px' },
  passosBox: {
    marginTop: '14px',
    padding: '14px 16px',
    borderRadius: '11px',
    backgroundColor: 'rgba(42,157,143,0.05)',
    border: '1px solid rgba(42,157,143,0.2)',
  },
  passosTexto: { margin: 0, fontSize: '13.5px', color: COLORS.ink, lineHeight: 1.65 },
  passosDestaque: { fontWeight: 'bold', color: COLORS.teal },
  passosRestante: { fontWeight: 'bold', color: COLORS.orange },
  passosPrazo: { fontWeight: 'bold', color: COLORS.textMuted },
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
    { viewBox: '0 0 24 24', width: '12', height: '12', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'm5 12.5 4.2 4.2L19 7' }),
  );
}

// Path idêntico ao ícone `bag` do mock (recibo-sinal-app.jsx) — "Detalhes do pedido".
function IconeSacola() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M6 8.5h12l-1 11.5a1 1 0 0 1-1 .9H8a1 1 0 0 1-1-.9L6 8.5Z' }),
    React.createElement('path', { d: 'M9 8.5V7a3 3 0 0 1 6 0v1.5' }),
  );
}

// Path idêntico ao ícone `sparkles` do mock — "Próximos passos".
function IconeSparkles() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', {
      d: 'M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9 12 3.5ZM18.5 15.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z',
    }),
  );
}

function SecaoTitulo({ icone, children }) {
  return React.createElement(
    'div',
    { style: styles.secaoTituloRow },
    React.createElement('span', { style: styles.secaoTituloChip }, icone),
    React.createElement('h2', { style: styles.secaoTituloTexto }, children),
  );
}

function ReciboSinalDoc({ empresa, documento }) {
  const {
    numeroFormatado,
    nomeCliente,
    metodoRecebido,
    valorRecebido,
    dataAprovacao,
    prazoProducao,
    inicioProducao,
    itens,
    valorTotalPedido,
    percentualSinal,
    restante,
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

    React.createElement(
      'div',
      { style: styles.tituloCard },
      React.createElement('span', { style: styles.tituloIconeChip }, React.createElement(IconeSelo)),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.tituloHeading }, 'RECIBO DE PAGAMENTO — ENTRADA'),
        React.createElement('div', { style: styles.tituloSub }, 'Referência: Orçamento #' + numeroFormatado),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.clienteSection },
      React.createElement('div', { style: styles.clienteLabel }, 'Dados da cliente'),
      React.createElement('div', { style: styles.clienteNome }, nomeCliente),
    ),

    React.createElement(
      'div',
      { style: styles.destaqueCard },
      React.createElement(
        'div',
        { style: styles.destaqueHeader },
        React.createElement('span', { style: styles.destaqueHeaderIcone }, React.createElement(IconeCheck)),
        React.createElement('span', { style: styles.destaqueHeaderTexto }, 'Entrada recebida com sucesso'),
      ),
      React.createElement(
        'div',
        { style: styles.destaqueBody },
        React.createElement(
          'div',
          { style: { flex: '1 1 140px' } },
          React.createElement('div', { style: styles.valorLabel }, 'Valor recebido'),
          React.createElement('div', { style: styles.valorAmount }, valorRecebido),
        ),
        React.createElement(
          'div',
          null,
          React.createElement('div', { style: styles.destaqueMetaLabel }, 'Forma de pagamento'),
          React.createElement('div', { style: styles.destaqueMetaValue }, metodoRecebido),
        ),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.datasGrid },
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Data de aprovação'),
        React.createElement('div', { style: styles.metaValue }, dataAprovacao),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Prazo de produção'),
        React.createElement('div', { style: styles.metaValueDestaque }, prazoProducao),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('div', { style: styles.metaLabel }, 'Início estimado'),
        React.createElement('div', { style: styles.metaValue }, inicioProducao),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.pedidoSection },
      React.createElement(SecaoTitulo, { icone: React.createElement(IconeSacola) }, 'Detalhes do pedido'),
      React.createElement(
        'table',
        { style: styles.pedidoTable },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement('th', { style: styles.pedidoTh }, 'Item'),
            React.createElement('th', { style: styles.pedidoTh }, 'Customização'),
            React.createElement('th', { style: { ...styles.pedidoTh, ...styles.pedidoThNum } }, 'Qtd'),
          ),
        ),
        React.createElement(
          'tbody',
          null,
          itens.map((item, index) =>
            React.createElement(
              'tr',
              { key: index },
              React.createElement('td', { style: { ...styles.pedidoTd, ...styles.pedidoNomeItem } }, item.nomeProduto),
              React.createElement(
                'td',
                { style: { ...styles.pedidoTd, ...(item.customizacoes ? styles.pedidoCustom : styles.pedidoCustomVazia) } },
                item.customizacoes || '—',
              ),
              React.createElement('td', { style: { ...styles.pedidoTd, ...styles.pedidoTdNum } }, '× ' + item.quantidade),
            ),
          ),
        ),
      ),

      React.createElement(
        'div',
        { style: styles.resumoWrap },
        React.createElement(
          'div',
          { style: styles.resumoBox },
          React.createElement(
            'div',
            { style: styles.resumoRow },
            React.createElement('span', null, 'Valor total do pedido'),
            React.createElement('span', null, valorTotalPedido),
          ),
          React.createElement(
            'div',
            { style: styles.resumoRowEntrada },
            React.createElement(
              'span',
              { style: styles.resumoRowEntradaLabel },
              React.createElement(IconeCheck),
              percentualSinal && percentualSinal !== '—' ? 'Entrada paga (' + percentualSinal + ')' : 'Entrada paga',
            ),
            React.createElement('span', { style: styles.resumoRowEntradaValor }, valorRecebido),
          ),
          React.createElement(
            'div',
            { style: styles.resumoRowRestante },
            React.createElement('span', { style: styles.resumoRowRestanteLabel }, 'Restante a pagar na entrega'),
            React.createElement('span', { style: styles.resumoRowRestanteValor }, restante),
          ),
        ),
      ),
    ),

    React.createElement(
      'div',
      { style: styles.passosSection },
      React.createElement(SecaoTitulo, { icone: React.createElement(IconeSparkles) }, 'Próximos passos'),
      React.createElement(
        'div',
        { style: styles.passosBox },
        React.createElement(
          'p',
          { style: styles.passosTexto },
          React.createElement('strong', { style: styles.passosDestaque }, 'Sua produção foi iniciada!'),
          ' O restante de ',
          React.createElement('strong', { style: styles.passosRestante }, restante),
          ' será cobrado na entrega do pedido. Prazo estimado: ',
          React.createElement('strong', { style: styles.passosPrazo }, prazoProducao),
          '.',
        ),
      ),
    ),

    React.createElement(
      DocumentFooter,
      null,
      'Recibo referente ao sinal do orçamento #' + numeroFormatado,
      '.',
    ),
  );
}

module.exports = ReciboSinalDoc;
