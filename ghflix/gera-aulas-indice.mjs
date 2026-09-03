// Gera ghflix/aulas-indice.json: só os vídeos que o mapa aulas-exercicio.json referencia
// (nome, sub_tipo, drive_id). O app carrega isso (KB) em vez do indice.json inteiro (1,4 MB).
// Roda no ghflix-deploy.sh (todo deploy) e depois de mexer no mapa de aulas.
import fs from "fs"; import path from "path"; import { fileURLToPath } from "url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const mapa = JSON.parse(fs.readFileSync(path.join(dir, 'aulas-exercicio.json'), 'utf8'));
const idx = JSON.parse(fs.readFileSync(path.join(dir, 'indice.json'), 'utf8'));
const videos = idx.videos || {};
const ids = new Set(); Object.values(mapa).forEach(arr => (arr || []).forEach(id => ids.add(String(id))));
const out = { gerado: new Date().toISOString(), total: 0, videos: {}, ausentes: [] };
let faltando = 0;
for (const id of ids) { const v = videos[id]; if (!v) { faltando++; out.ausentes.push(id); continue; } out.videos[id] = { nome: v.nome || '', sub_tipo: v.sub_tipo || '', drive_id: v.drive_id || '' }; out.total++; }
fs.writeFileSync(path.join(dir, 'aulas-indice.json'), JSON.stringify(out));
console.log(`aulas-indice.json: ${out.total} vídeos referenciados (${faltando} ids do mapa sem entrada no índice) | ${fs.statSync(path.join(dir, 'aulas-indice.json')).size} bytes`);
