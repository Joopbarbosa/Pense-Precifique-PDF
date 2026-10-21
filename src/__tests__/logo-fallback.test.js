// V0.17.0 #965 (RN-NOVA-20, CEN-NOVO-60 e 61): logo do cabeçalho com fallback para a inicial.
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const DocumentHeader = require('../templates/components/DocumentHeader.jsx');
const { renderHtmlDocument } = require('../renderer/htmlRenderer');

const empresaBase = { nome: 'Ateliê Com Logo', email: 'ana@studio.com', whatsapp: '(11) 99999-1234' };

function cabecalho(empresa) {
  return ReactDOMServer.renderToStaticMarkup(React.createElement(DocumentHeader, { empresa }));
}

describe('cabeçalho com logo', () => {
  test('logo cadastrado vira img marcado com a inicial e o estilo do placeholder', () => {
    const html = cabecalho({ ...empresaBase, logoUrl: 'https://r2.exemplo/logo.png' });
    expect(html).toContain('<img');
    expect(html).toContain('data-logo-empresa="true"');
    expect(html).toContain('data-inicial="A"');
    expect(html).toMatch(/data-placeholder-css="[^"]*background-color:/);
  });

  test('sem logo mostra a inicial direto, sem img', () => {
    const html = cabecalho({ ...empresaBase, logoUrl: null });
    expect(html).not.toContain('<img');
    expect(html).toContain('>A<');
  });
});

describe('script de fallback no documento', () => {
  const documento = renderHtmlDocument(DocumentHeader, { empresa: { ...empresaBase, logoUrl: 'https://x/logo.png' } });
  const script = documento.match(/<script>([\s\S]*?)<\/script>/)[1];

  function executar(ouvintes, imgs) {
    const documentoFalso = {
      addEventListener: (tipo, fn, captura) => ouvintes.push({ tipo, fn, captura }),
      createElement: () => {
        const el = { atributos: {}, setAttribute(k, v) { this.atributos[k] = v } };
        return el;
      },
    }
    class HTMLImageElement {}
    new Function('document', 'HTMLImageElement', script)(documentoFalso, HTMLImageElement)
    return { documentoFalso, HTMLImageElement }
  }

  test('img com erro de carregamento é trocado pelo placeholder com a inicial e o estilo', () => {
    const ouvintes = []
    const { HTMLImageElement } = executar(ouvintes, [])
    expect(ouvintes).toHaveLength(1)
    expect(ouvintes[0].tipo).toBe('error')
    expect(ouvintes[0].captura).toBe(true)

    const trocado = []
    const img = Object.assign(new HTMLImageElement(), {
      hasAttribute: (k) => k === 'data-logo-empresa',
      getAttribute: (k) => ({ 'data-placeholder-css': 'background-color:#0f766e;color:#fff', 'data-inicial': 'A' })[k] ?? null,
      replaceWith: (el) => trocado.push(el),
    })
    ouvintes[0].fn({ target: img })
    expect(trocado).toHaveLength(1)
    expect(trocado[0].atributos.style).toBe('background-color:#0f766e;color:#fff')
    expect(trocado[0].textContent).toBe('A')
  })

  test('erro em outro elemento ou img sem a marca não mexe em nada', () => {
    const ouvintes = []
    const { HTMLImageElement } = executar(ouvintes, [])
    const trocado = []
    const outro = Object.assign(new HTMLImageElement(), {
      hasAttribute: () => false,
      replaceWith: (el) => trocado.push(el),
    })
    ouvintes[0].fn({ target: outro })
    ouvintes[0].fn({ target: { tagName: 'SCRIPT' } })
    expect(trocado).toHaveLength(0)
  })
});
