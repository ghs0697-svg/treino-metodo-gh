// ════════════════════════════════════════════════════════════════════════
//  MAPA GLOBAL DE SUBSTITUTOS DE EXERCÍCIO — Método GH
//  Preenchido manualmente pelo GH. Vale pra TODO protocolo (Entregas,
//  Reajustes, Ajustes diários, ou montagem manual sua/do funcionário),
//  porque o app casa pelo NOME do exercício na hora de renderizar.
//
//  COMO PREENCHER (no bloco GRUPOS_SUBSTITUTOS abaixo):
//   - UMA LINHA por GRUPO. Os exercícios da mesma linha se substituem ENTRE
//     SI (mão dupla: vale pra grupos de 2, 3, 4 ou mais).
//   - separe os nomes por " / ".
//   - SEM aspas, SEM vírgula, SEM dois-pontos — é só escrever os nomes.
//     (não tem como quebrar o arquivo escrevendo errado o texto.)
//   - copie os nomes EXATOS da LISTA DE REFERÊNCIA no fim deste arquivo.
//   - nome digitado errado, ou exercício sem vídeo, o app IGNORA (não mostra
//     a opção) — não quebra nada, só não aparece.
//   - exercício SEM grupo aqui = sem botão de troca (os "não-substituíveis"
//     ficam de fora naturalmente — é só não listar).
//   - se o exercício prescrito E um do grupo caírem no MESMO dia, o app não
//     oferece o que já está no dia (não duplica) — você não se preocupa.
//   - cargas/cronômetro/histórico NÃO mudam ao trocar — só o nome e o vídeo.
//
//  ⚠ um exercício só pode estar em UM grupo. Se aparecer em dois, o app usa
//    o primeiro e ignora no segundo.
// ════════════════════════════════════════════════════════════════════════
const GRUPOS_SUBSTITUTOS = `
Agachamento Hack / Agachamento Smith
Leg Press 45º / Leg Press 45º Unilateral
Mesa Flexora / Flexora Unilateral em Pé
Supino Inclinado na Máquina / Supino Inclinado com Halteres
Afundo no Chão / Afundo Smith / Afundo Smith com Step
Búlgaro / Búlgaro na Máquina
Levantamento Terra / Levantamento Terra na Máquina
Stiff / Stiff na Máquina / Stiff no Hiperextensor
Agachamento Sumo Smith / Terra Sumô
Meio Terra / Hiperextensão de Lombar / Hiperextensor de Lombar na Máquina com Carga
Elevação Pélvica 2D ou Livre / Elevação Pélvica na Máquina
Extensão de Glúteo na Máquina / Extensão de Glúteo na Polia / Extensão de Glúteo com Caneleira
Supino Reto na Máquina / Supino Reto na Máquina Sentado
Crucifixo Inclinado / Crucifixo Inclinado no Cross
Pulldown / Pulldown na Máquina
Puxada Alta Pronada / Puxada Alta na Máquina Articulada
Remada Curvada Pronada / Remada Curvada Sentado / Remada Curvada na Máquina Guiada
Remada Neutra no Cross / Remada Baixa com Triângulo
Remada Unilateral na Máquina / Serrote com Halter / Remada Neutra no Cross
Crucifixo Inverso com Halteres / Crucifixo Inverso no Cross / Crucifixo Inverso no Voador
Desenvolvimento com Halteres / Desenvolvimento na Máquina / Desenvolvimento na Máquina Inclinado / Desenvolvimento na Máquina Sentado
Elevação Lateral / Elevação Lateral na Máquina / Elevação Lateral no Cross
Face Pull / Facepull com Corda no Cross / Remada Alta na Polia
Elevação Frontal com Anilha / Elevação Frontal com Halteres em Isometria / Elevação Frontal Neutra com Halteres / Elevação Frontal no Cross
Rosca Concentrada com Halter / Rosca Unilateral no Cross / Rosca Scott Unilateral
Rosca Direta Alternada / Rosca Direta com Halteres / Rosca Scott Fechada
Rosca Direta com Barra W / Rosca Direta no Cross
Tríceps Pulley com Barra / Tríceps Pulley com Corda / Tríceps Pulley na Máquina / Tríceps Pulley Unilateral
Tríceps Testa em Pé / Tríceps Testa no Banco Inclinado
Abdominal Elevação de Pernas com Halter ou Caneleira / Abdominal Elevação de Pernas na Paralela / Abdominal na Barra Fixa
Abdominal na Máquina / Abdominal na Remada Baixa ou Cross / Abdominal no Banco Declinado
`;

// ════════════════════════════════════════════════════════════════════════
//  LISTA DE REFERÊNCIA — os 143 exercícios do banco oficial (com vídeo).
//  Copie os nomes DAQUI pra não errar. (Só pra consulta; não mexe em nada.)
// ════════════════════════════════════════════════════════════════════════
/*
PERNA / QUADRÍCEPS
  Afundo no Chão
  Afundo Smith
  Afundo Smith com Step
  Agachamento Hack
  Agachamento Livre
  Agachamento Smith
  Agachamento Sumo Smith
  Búlgaro
  Búlgaro na Máquina
  Cadeira Extensora
  Leg Horizontal
  Leg Press 45º
  Leg Press 45º Unilateral
  Panturrilha no Leg 45º

POSTERIOR / TERRA
  Cadeira Flexora
  Flexor Nórdico na Máquina
  Flexora Unilateral em Pé
  Levantamento Terra
  Levantamento Terra Hexagonal
  Levantamento Terra na Máquina
  Meio Terra
  Mesa Flexora
  Mesa Flexora Livre com Halter
  Stiff
  Stiff na Máquina
  Stiff no Hiperextensor
  Terra Sumô

GLÚTEO
  Abdução Deitada com Mini Band
  Abdução em Pé na Máquina
  Abdução em Quatro Apoios com Mini Band
  Abdução Lateral na Máquina
  Abdução no Cross
  Cadeira Abdutora
  Cadeira Abdutora em Pé
  Cadeira Adutora
  Coice com Caneleira
  Coice na Máquina
  Coice no Cross com Polia Alta
  Elevação Pélvica 2D ou Livre
  Elevação Pélvica na Máquina
  Extensão de Glúteo com Caneleira
  Extensão de Glúteo na Máquina
  Extensão de Glúteo na Polia
  Glúteo no Hiperextensor de Lombar
  Ostra com Mini Band
  Sapinho na Máquina

PANTURRILHA
  Panturrilha em Pé
  Panturrilha Sentado
  Panturrilha no Leg 45º

PEITO
  Crossover
  Crossover Polia Média
  Crucifixo Inclinado
  Crucifixo Inclinado no Cross
  Supino Declinado na Máquina
  Supino Inclinado com Halteres
  Supino Inclinado na Máquina
  Supino Reto na Máquina
  Supino Reto na Máquina Sentado
  Voador

COSTAS
  Barra Fixa
  Pulldown
  Pulldown na Máquina
  Puxada Alta com Triângulo
  Puxada Alta na Máquina Articulada
  Puxada Alta Pronada
  Puxada Alta Supinada
  Remada Alta na Polia
  Remada Baixa Aberta
  Remada Baixa com Triângulo
  Remada Baixa Drop Set Mecânico com Triângulo
  Remada Baixa Supinada na Máquina
  Remada Curvada na Máquina Guiada
  Remada Curvada Pronada
  Remada Curvada Sentado
  Remada Neutra no Cross
  Remada Pronada na Máquina
  Remada Unilateral na Máquina
  Serrote com Halter
  Serrote Pêndulo com Halter

OMBRO
  Crucifixo Inverso com Halteres
  Crucifixo Inverso no Cross
  Crucifixo Inverso no Voador
  Desenvolvimento com Halteres
  Desenvolvimento na Máquina
  Desenvolvimento na Máquina Inclinado
  Desenvolvimento na Máquina Sentado
  Elevação Frontal com Anilha
  Elevação Frontal com Halteres em Isometria
  Elevação Frontal Neutra com Halteres
  Elevação Frontal no Cross
  Elevação Lateral
  Elevação Lateral na Máquina
  Elevação Lateral no Banco Inclinado
  Elevação Lateral no Cross
  Elevação Lateral Parcial no Cross
  Elevação Lateral Sentado
  Face Pull
  Facepull com Corda no Cross

BÍCEPS
  Rosca Concentrada com Halter
  Rosca Direta Alternada
  Rosca Direta com Barra W
  Rosca Direta com Halter no Banco Inclinado
  Rosca Direta com Halteres
  Rosca Direta na Puxada Alta
  Rosca Direta no Cross
  Rosca Martelo com Halteres
  Rosca Martelo no Cross
  Rosca Scott Fechada
  Rosca Scott Unilateral
  Rosca Unilateral no Cross

TRÍCEPS
  Tríceps Francês no Cross
  Tríceps na Paralela
  Tríceps Pulley com Barra
  Tríceps Pulley com Corda
  Tríceps Pulley na Máquina
  Tríceps Pulley Unilateral
  Tríceps Supinado
  Tríceps Testa em Pé
  Tríceps Testa no Banco Inclinado

ABDÔMEN / CORE / LOMBAR
  Abdominal Arnold
  Abdominal Elevação de Pernas com Halter ou Caneleira
  Abdominal Elevação de Pernas na Paralela
  Abdominal Elevação de Pernas no Banco Declinado
  Abdominal na Barra Fixa
  Abdominal na Máquina
  Abdominal na Remada Baixa ou Cross
  Abdominal no Banco Declinado
  Abdominal no Chão
  Hiperextensão de Lombar
  Hiperextensor de Lombar na Máquina com Carga
  Prancha com Retroversão
  Prancha Paravertebrais
  Superman – Fortalecimento Paravertebrais e Glúteo

AQUECIMENTO / ALONGAMENTO / MOBILIDADE
  Alongamento Adutores
  Alongamento Escápulas e Ombro
  Alongamento Glúteo
  Alongamento Peitoral Menor
  Alongamento Posterior
  Alongamento Quadril – Retroversão
  Alongamento Tornozelo e Iliopsoas
  Aquecimento Manguito
  Descompressão Escápulas
  Descompressão Lombar
  Mobilidade de Tornozelo
*/
