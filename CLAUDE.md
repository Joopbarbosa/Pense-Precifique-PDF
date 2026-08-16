# CLAUDE.md — pense-precifique-pdf

> Microsserviço de Documentos do Pense & Precifique. Node.js + Express + React SSR + Puppeteer.
> Repositório independente, container Docker próprio, rede interna Docker.

---

## 1. O que este serviço faz

Renderiza documentos (orçamentos, recibos, multas) em HTML (para preview no frontend) e PDF
(para download, via backend). Um único template React serve os dois formatos — elimina
divergência visual entre o que a artesã vê no preview e o que a cliente final recebe no PDF.

**Stateless.** Não tem banco de dados. Recebe payload JSON completo por request, renderiza,
devolve. Sem cache — sempre gera sob demanda.

---

## 2. Onde cada coisa vai

| Categoria | Local |
|---|---|
| Entry point / rotas Express | `src/index.js`, `src/routes/render.js` |
| Lógica de renderização HTML (React SSR) | `src/renderer/htmlRenderer.js` |
| Lógica de exportação PDF (Puppeteer) | `src/renderer/pdfRenderer.js` |
| Schema de payload por tipo de documento | `src/schemas/index.js` (export nomeado por tipo, ex: `orcamentoSchema`) |
| Templates de documento (1 componente React por tipo) | `src/templates/{tipo}/` |
| Componentes reaproveitados entre 2+ tipos de documento | `src/templates/components/` |

**Novo tipo de documento?** Cria pasta em `src/templates/{novo-tipo}/`, schema nomeado em
`src/schemas/index.js`, reaproveita `src/templates/components/` sempre que possível. Não cria
rota nova — o contrato `GET /render/:tipo/:id?format=` já é genérico.

---

## 3. Verificar antes de criar

Antes de criar qualquer componente, sempre checar `src/templates/components/` primeiro —
`DocumentHeader`, `DocumentFooter`, `ItemTable`, `SignatureBlock` já existem e cobrem os
elementos mais comuns entre documentos. Duplicação encontrada deve ser reportada antes de
implementar, nunca corrigida silenciosamente sem avisar.

---

## 4. Legado e exceções

- **CSS inline / CSS-in-JS nos templates** — diferente do padrão Tailwind do resto do sistema
  (frontend principal). Decisão consciente, não legado acidental: Puppeteer não pode depender
  de arquivo CSS externo carregado em tempo de renderização. Não replicar esse padrão fora
  deste repositório.
- **Sem autenticação própria (JWT)** — este serviço confia 100% em quem chama (backend/frontend
  já validaram o token). Roda em rede Docker interna, nunca exposto à internet. Não adicionar
  validação de JWT aqui sem antes revisar essa decisão no `ARCHITECTURE.md`.
- **Layout do documento de Orçamento** — segue a referência visual oficial do Claude Design (ver
  `contrato-pdf.md`, seção 2.1, `docs-pense-precifique`). Qualquer mudança de layout deve ser
  cotejada contra essa referência antes de implementar, não decidida ad-hoc.

---

## 4.1 Tokens de cor (extraído — débito resolvido)

- **`src/templates/tokens.js`** centraliza os valores hex antes hardcoded (`#2A9D8F`, `#3A372F`,
  `#F97316`, etc.) — extraído no commit `6e3ec8b`, gatilho atingido na Epic #248 (novos tipos de
  documento reaproveitando as cores do template de Orçamento). Reaproveitado hoje pelos 4
  componentes compartilhados (`DocumentHeader.jsx`, `ItemTable.jsx`, `DocumentFooter.jsx`) e pelos
  5 templates de documento (`OrcamentoDoc.jsx`, `ReciboSinalDoc.jsx`, `MultaDoc.jsx`,
  `ReciboEstornoDoc.jsx`, `ReciboPagamentoDoc.jsx`). Não há mais duplicação de cor hardcoded a
  corrigir — qualquer cor nova do design system entra em `tokens.js`, não direto no componente.

---

## 5. Regras de Ouro do projeto (herdadas do pipeline geral)

- Documentação (`modulos/PDF/`) fica em `docs-pense-precifique/`, repositório separado — não
  duplicar aqui.
- Business rule decisions sempre voltam para João decidir — nunca resolver ambiguidade sozinho.
- `git add [arquivo específico]`, nunca `git add .` (exceção: commit inicial de repositório
  recém-criado, sem histórico).
- Commit: `tipo(escopo): descrição — OpenProject #N`.

---

## 6. Docker

Sempre testar via Docker (`docker-compose build --no-cache` + `up -d`), nunca `node index.js`
solto — garante paridade com o ambiente onde o serviço realmente roda (rede interna, variáveis
de ambiente do compose).

Ver `docker-compose.yml` na raiz do projeto (`Pense & Precifique/`) para a definição do serviço
`pense-precifique-pdf` dentro do compose geral.
