const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Sem hidratação no cliente (documento estático, consumido como HTML puro ou virando PDF via
// Puppeteer) — renderToStaticMarkup em vez de renderToString, evita os atributos extras
// (data-reactroot etc.) que só fazem sentido para hidratação.
// V0.17.0 #965 (RN-NOVA-20): logo da empresa que não carrega (URL quebrada, arquivo removido) vira a
// inicial do nome. O script troca o img marcado pelo placeholder quando o carregamento falha; roda no
// navegador do Puppeteer (PDF) e na visualização em HTML, no mesmo ponto.
const SCRIPT_FALLBACK_LOGO = [
  "document.addEventListener('error',function(e){",
  "var img=e.target;",
  "if(!(img instanceof HTMLImageElement)||!img.hasAttribute('data-logo-empresa'))return;",
  "var ph=document.createElement('div');",
  "ph.setAttribute('style',img.getAttribute('data-placeholder-css')||'');",
  "ph.textContent=img.getAttribute('data-inicial')||'';",
  "img.replaceWith(ph);",
  "},true);",
].join('');

function renderHtmlDocument(Component, props) {
  const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Component, props));
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" /><title>Documento</title><script>${SCRIPT_FALLBACK_LOGO}</script></head><body>${markup}</body></html>`;
}

module.exports = { renderHtmlDocument };
