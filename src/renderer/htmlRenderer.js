const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Sem hidratação no cliente (documento estático, consumido como HTML puro ou virando PDF via
// Puppeteer) — renderToStaticMarkup em vez de renderToString, evita os atributos extras
// (data-reactroot etc.) que só fazem sentido para hidratação.
function renderHtmlDocument(Component, props) {
  const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Component, props));
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8" /><title>Documento</title></head><body>${markup}</body></html>`;
}

module.exports = { renderHtmlDocument };
