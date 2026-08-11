// Sem build/bundler neste serviço (Node puro) — .jsx aqui é só convenção de nome, o conteúdo é
// JS válido via React.createElement, sem sintaxe JSX literal. Ver ARCHITECTURE.md/decisoes-pdf.md.
const React = require('react');

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '22px',
    borderBottom: '2px solid #2A9D8F',
    paddingBottom: '16px',
  },
  left: { display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 },
  logoImg: { width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover' },
  logoPlaceholder: {
    width: '52px',
    height: '52px',
    borderRadius: '10px',
    backgroundColor: '#2A9D8F',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  nome: { fontSize: '15px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#3A372F' },
  contato: { fontSize: '9px', color: '#7C786F', margin: '2px 0' },
  right: { textAlign: 'right', flexShrink: 0 },
};

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
        empresa.email
          ? React.createElement('p', { style: styles.contato }, '✉ ' + empresa.email)
          : null,
        empresa.whatsapp
          ? React.createElement('p', { style: styles.contato }, '☎ ' + empresa.whatsapp)
          : null,
      ),
    ),
    React.createElement('div', { style: styles.right }, children),
  );
}

module.exports = DocumentHeader;
