import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3103';
const url = new URL(base);
assert(['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname), 'Smoke tests must target localhost');
const { drugs } = JSON.parse(await readFile(new URL('../src/data/drugs.json', import.meta.url)));
const get = async (path, status = 200) => {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, status, path);
  return response.text();
};
assert.match(await get('/'), /原研药查询/);
assert.match(await get('/about'), /原研药/);
assert.deepEqual(JSON.parse(await get('/api/hello')), { name: 'John Doe' });
await get('/drug/missing-security-smoke-id', 404);
const sitemap = await get('/sitemap.xml');
for (const drug of drugs) {
  const html = await get(`/drug/${encodeURIComponent(drug.id)}`);
  assert(html.includes(drug.genericName), `Missing drug ${drug.id}`);
  assert(html.includes('name="description"'), `Missing SEO ${drug.id}`);
  assert(sitemap.includes(`/drug/${drug.id}`), `Missing sitemap entry ${drug.id}`);
}
assert.match(await get('/robots.txt'), /https:\/\/yuanyanyao.org\/sitemap.xml/);
console.log(`Route smoke passed: home, about, API, 404, all ${drugs.length} drugs, sitemap, robots, metadata`);
