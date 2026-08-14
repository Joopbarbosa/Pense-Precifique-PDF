// Sem build/bundler neste serviço (Node puro) — .jsx aqui é só convenção de nome, o conteúdo é
// JS válido via React.createElement, sem sintaxe JSX literal. Ver ARCHITECTURE.md/decisoes-pdf.md.
const React = require('react');
const COLORS = require('../tokens.js');

const styles = {
  // borda a 25% de opacidade do teal (COLORS.teal) — layout aprovado no Claude Design, ver
  // contrato-pdf.md.
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    paddingBottom: '22px',
    borderBottom: '2px solid rgba(42,157,143,0.25)',
  },
  left: { display: 'flex', alignItems: 'center', gap: '14px', flex: 1 },
  logoImg: { width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' },
  logoPlaceholder: {
    width: '56px',
    height: '56px',
    borderRadius: '10px',
    backgroundColor: COLORS.teal,
    color: COLORS.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  nome: { fontSize: '18px', fontWeight: 'bold', margin: 0, color: COLORS.ink, letterSpacing: '-0.01em' },
  contatos: { display: 'flex', flexWrap: 'wrap', gap: '2px 14px', marginTop: '5px' },
  contato: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: COLORS.textSecondary },
  contatoIcone: { color: COLORS.teal, display: 'flex' },
  right: { textAlign: 'right', flexShrink: 0 },
};

function IconeEmail() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '11', height: '11', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: '3', y: '5', width: '18', height: '14', rx: '2.5' }),
    React.createElement('path', { d: 'm4 7 8 5.5L20 7' }),
  );
}

function IconeTelefone() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', width: '11', height: '11', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', {
      d: 'M6.5 4.5h3l1.2 3.2-1.7 1.3a11 11 0 0 0 4.7 4.7l1.3-1.7 3.2 1.2v3a1.5 1.5 0 0 1-1.6 1.5A14.5 14.5 0 0 1 5 6.1 1.5 1.5 0 0 1 6.5 4.5Z',
    }),
  );
}

function inicialDaEmpresa(nome) {
  if (!nome) {
    return '?';
  }
  return nome.trim().charAt(0).toUpperCase();
}

// RN-NOVA-1 — logoUrl null (ou fetch de imagem falho) sempre vira um placeholder com iniciais,
// nunca espaço vazio ou erro visual.
function DocumentHeader({ empresa, children }) {
  const logo = empresa.logoUrl
    ? React.createElement('img', { src: empresa.logoUrl, alt: empresa.nome, style: styles.logoImg })
    : React.createElement('div', { style: styles.logoPlaceholder }, inicialDaEmpresa(empresa.nome));

  return React.createElement(
    'div',
    { style: styles.header },
    React.createElement(
      'div',
      { style: styles.left },
      logo,
      React.createElement(
        'div',
        null,
        React.createElement('h3', { style: styles.nome }, empresa.nome),
        (empresa.email || empresa.whatsapp)
          ? React.createElement(
              'div',
              { style: styles.contatos },
              empresa.email
                ? React.createElement(
                    'span',
                    { style: styles.contato },
                    React.createElement('span', { style: styles.contatoIcone }, React.createElement(IconeEmail)),
                    empresa.email,
                  )
                : null,
              empresa.whatsapp
                ? React.createElement(
                    'span',
                    { style: styles.contato },
                    React.createElement('span', { style: styles.contatoIcone }, React.createElement(IconeTelefone)),
                    empresa.whatsapp,
                  )
                : null,
            )
          : null,
      ),
    ),
    React.createElement('div', { style: styles.right }, children),
  );
}

module.exports = DocumentHeader;
