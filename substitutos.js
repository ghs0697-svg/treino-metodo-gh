// ════════════════════════════════════════════════════════════════════════
//  MAPA GLOBAL DE SUBSTITUTOS DE EXERCÍCIO — Método GH
//  Preenchido manualmente pelo GH. Vale pra TODO protocolo (Entregas,
//  Reajustes, Ajustes diários, ou montagem manual sua/do funcionário),
//  porque o app casa pelo NOME do exercício na hora de renderizar — não
//  depende do dado do protocolo.
//
//  COMO PREENCHER:
//   - chave  = exercício PRESCRITO (como aparece no protocolo)
//   - valor  = SUBSTITUTO que o aluno pode escolher
//   - os DOIS têm que existir no banco oficial (editor-data.js / EXERCISE_DB)
//     COM vídeo. Se o substituto não tiver vídeo no banco, o app IGNORA a
//     entrada (não mostra o botão) — te protege de erro de digitação.
//   - maiúscula/minúscula e acento NÃO importam (o app normaliza).
//   - exercício SEM entrada aqui = SEM botão de troca (os "não-substituíveis"
//     ficam de fora naturalmente — é só não listar).
//   - bidirecional? põe as DUAS linhas. Ex: "A":"B" e "B":"A".
//   - um exercício tem UM substituto. (Se um dia quiser vários, dá pra
//     evoluir pra lista — me avisa.)
//
//  Os exemplos abaixo são só pra você ver o formato — REVISE/TROQUE/APAGUE
//  à vontade. Todos os nomes batem com o banco oficial.
// ════════════════════════════════════════════════════════════════════════
const SUBSTITUTOS = {
  "Agachamento Hack": "Agachamento Smith",
  "Agachamento Smith": "Agachamento Hack",
  "Leg Press 45º": "Leg Horizontal",
  "Mesa Flexora": "Cadeira Flexora",
  "Cadeira Flexora": "Mesa Flexora",
  "Supino Inclinado na Máquina": "Supino Inclinado com Halteres"
};
