const puppeteer = require('puppeteer-core');

// Contrato-pdf.md seção 2 — A4, margem 1cm em todos os lados, decisão explícita (motor antigo
// nunca teve isso configurado). printBackground: true não está na tabela do contrato mas é
// necessário pra fidelidade pixel a pixel com o HTML — os templates usam backgroundColor inline
// (DocumentHeader, seções de sinal/observações/total) que o Puppeteer omite por padrão em PDF.
const PDF_OPTIONS = {
  format: 'A4',
  margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
  printBackground: true,
};

const LAUNCH_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

class RenderTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RenderTimeoutError';
  }
}

async function gerarPdf(browser, html) {
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    return await page.pdf(PDF_OPTIONS);
  } finally {
    await page.close();
  }
}

// Browser novo por requisição (não reaproveitado entre chamadas) — decisão do MVP dado volume
// baixo esperado; mais simples e sem risco de estado compartilhado quebrado entre requisições
// concorrentes. Revisitar com pool se performance virar problema real.
async function renderPdfBuffer(html, { timeoutSeconds }) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: LAUNCH_ARGS,
  });

  // A geração roda "solta" e corre contra o timeout — se o timeout vencer, o catch abaixo evita
  // unhandled rejection quando o browser.close() do finally interrompe a página no meio do jogo.
  const geracaoPromise = gerarPdf(browser, html);
  geracaoPromise.catch(() => {});

  let timeoutHandle;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new RenderTimeoutError(`Renderização excedeu ${timeoutSeconds}s`));
    }, timeoutSeconds * 1000);
  });

  try {
    return await Promise.race([geracaoPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutHandle);
    await browser.close();
  }
}

module.exports = { renderPdfBuffer, RenderTimeoutError };
