const request = require('supertest');
const app = require('../index');

// PP-710 (CT-710-02 / CEN-710-02): corpo hostil nunca devolve 500, com zod 4 e Express atual.
describe('entrada hostil em /render (PP-710)', () => {
  const url = '/render/orcamento/1?format=html';

  test('JSON malformado -> 400', async () => {
    const res = await request(app).post(url).set('Content-Type', 'application/json').send('{"empresa": ');
    expect(res.status).toBe(400);
  });

  test('corpo acima de 5mb -> 413', async () => {
    const res = await request(app).post(url).set('Content-Type', 'application/json')
      .send(JSON.stringify({ lixo: 'x'.repeat(5 * 1024 * 1024 + 10) }));
    expect(res.status).toBe(413);
  });

  test('content-type errado (texto puro) -> 400 de validação, não 500', async () => {
    const res = await request(app).post(url).set('Content-Type', 'text/plain').send('qualquer coisa');
    expect(res.status).toBe(400);
  });

  test.each([['null'], ['[]'], ['42'], ['"texto"'], ['{}'], ['{"empresa":null,"documento":[]}']])(
    'corpo JSON %s -> 400', async (corpo) => {
      const res = await request(app).post(url).set('Content-Type', 'application/json').send(corpo);
      expect(res.status).toBe(400);
    });

  test('chaves de protótipo no corpo não quebram nem vazam', async () => {
    const res = await request(app).post(url).set('Content-Type', 'application/json')
      .send('{"__proto__":{"polluted":true},"constructor":{"prototype":{"x":1}}}');
    expect(res.status).toBe(400);
    expect({}.polluted).toBeUndefined();
  });

  test('tipo e format hostis -> 400', async () => {
    expect((await request(app).post('/render/..%2F..%2Fetc/1?format=html').send({})).status).toBe(400);
    expect((await request(app).post('/render/orcamento/1?format=exe').send({})).status).toBe(400);
  });
});
