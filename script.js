const MAX_SAVES = 5;

const POSICOES = [
  "Goleiro",
  "Zagueiro",
  "Lateral direito",
  "Lateral esquerdo",
  "Volante",
  "Meio-campista",
  "Meia ofensivo",
  "Ponta direita",
  "Ponta esquerda",
  "Segundo atacante",
  "Centroavante"
];

// Estatísticas que cada jogador tem em cada temporada
const CAMPOS = ["jogos", "gols", "assistencias", "amarelos", "vermelhos", "nota"];

// Nomes que aparecem em cima de cada número quando a tabela vira cartão (celular)
const ROTULOS_STATS = {
  jogos: "Jogos",
  gols: "Gols",
  assistencias: "Assist.",
  amarelos: "Amarelos",
  vermelhos: "Vermelhos",
  nota: "Nota média"
};

// ---------- Elementos da página ----------

const telaInicial = document.getElementById("tela-inicial");
const telaSave = document.getElementById("tela-save");

const listaSaves = document.getElementById("lista-saves");
const botaoNovoSave = document.getElementById("btn-novo-save");
const formSave = document.getElementById("form-save");
const buscaClube = document.getElementById("busca-clube");
const listaClubes = document.getElementById("lista-clubes");
const clubeDigitado = document.getElementById("clube-digitado");
const clubeEscolhido = document.getElementById("clube-escolhido");
const botaoCriar = document.getElementById("btn-criar");
const botaoCancelar = document.getElementById("btn-cancelar");

const botaoVoltar = document.getElementById("btn-voltar");
const tituloSave = document.getElementById("titulo-save");
const seletorTemporada = document.getElementById("seletor-temporada");
const botaoNovaTemporada = document.getElementById("btn-nova-temporada");
const botaoExcluirTemporada = document.getElementById("btn-excluir-temporada");
const tagLiga = document.getElementById("tag-liga");
const botaoEditarLiga = document.getElementById("btn-editar-liga");
const ligaDigitada = document.getElementById("liga-digitada");
const treinadorDigitado = document.getElementById("treinador-digitado");
const notaResumo = document.getElementById("nota-resumo");
const avisoTemporada = document.getElementById("aviso-temporada");
const botaoNovoJogador = document.getElementById("btn-novo-jogador");
const formJogador = document.getElementById("form-jogador");
const tituloFormJogador = document.getElementById("titulo-form-jogador");
const nomeJogador = document.getElementById("nome-jogador");
const posicaoJogador = document.getElementById("posicao-jogador");
const idadeJogador = document.getElementById("idade-jogador");
const botaoSalvarJogador = document.getElementById("btn-salvar-jogador");
const botaoCancelarJogador = document.getElementById("btn-cancelar-jogador");
const tabelaElenco = document.getElementById("tabela-elenco");
const corpoElenco = document.getElementById("corpo-elenco");
const elencoVazio = document.getElementById("elenco-vazio");
const areaResultados = document.getElementById("area-resultados");
const tituloResultados = document.getElementById("titulo-resultados");
const resumoTitulos = document.getElementById("resumo-titulos");
const formCampeonato = document.getElementById("form-campeonato");
const nomeCampeonato = document.getElementById("nome-campeonato");
const resultadoCampeonato = document.getElementById("resultado-campeonato");
const posicaoCampeonato = document.getElementById("posicao-campeonato");
const botaoAddCampeonato = document.getElementById("btn-add-campeonato");
const listaCampeonatos = document.getElementById("lista-campeonatos");
const cartoesResumo = document.getElementById("cartoes-resumo");
const areaTrofeus = document.getElementById("area-trofeus");
const resumoDinheiro = document.getElementById("resumo-dinheiro");
const formTransferencia = document.getElementById("form-transferencia");
const tipoTransferencia = document.getElementById("tipo-transferencia");
const jogadorTransferencia = document.getElementById("jogador-transferencia");
const clubeTransferencia = document.getElementById("clube-transferencia");
const valorTransferencia = document.getElementById("valor-transferencia");
const botaoAddTransferencia = document.getElementById("btn-add-transferencia");
const listaTransferencias = document.getElementById("lista-transferencias");
const opcaoEmprestimo = document.getElementById("opcao-emprestimo");
const valorOpcao = document.getElementById("valor-opcao");
const perfilTecnico = document.getElementById("perfil-tecnico");
const areaRecordes = document.getElementById("area-recordes");
const menuClube = document.getElementById("menu-clube");
const areaLinhaTempo = document.getElementById("area-linha-tempo");
const areaGraficos = document.getElementById("area-graficos");
const areaHall = document.getElementById("area-hall");
const filtroHall = document.getElementById("filtro-hall");
const buscaHall = document.getElementById("busca-hall");
const entradasFinancas = document.getElementById("entradas-financas");
const cartoesFinancas = document.getElementById("cartoes-financas");
const tituloFinancas = document.getElementById("titulo-financas");

// ---------- Dados ----------

let saves = [];                    // os saves ficam na nuvem; aqui é a cópia que está na tela
let idSaveAberto = null;           // id do save aberto (pra achar ele de novo depois de sincronizar)
let clubeSelecionado = "";
let saveAberto = null;             // posição do save que está aberto
let jogadorEditando = null;        // posição do jogador que está sendo editado
let temporadaSelecionada = "geral"; // "geral" ou uma temporada, ex: "25/26"

function guardarSaves() {
  localStorage.setItem("saves", JSON.stringify(saves)); // cópia neste aparelho
  agendarEnvio();                                        // e envio pra nuvem
  if (saveAberto !== null && saves[saveAberto]) mostrarPerfilTecnico(); // perfil sempre em dia
}

// ---------- Tela inicial: saves ----------

// Tira acentos e deixa minúsculo, pra "sao" achar "São Paulo"
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function atualizarEscolhido() {
  if (clubeSelecionado) {
    clubeEscolhido.textContent = "Clube escolhido: " + clubeSelecionado;
  } else {
    clubeEscolhido.textContent = "Nenhum clube escolhido";
  }
}

function tirarDestaque() {
  const marcados = listaClubes.querySelectorAll(".selecionado");
  marcados.forEach(function (item) {
    item.classList.remove("selecionado");
  });
}

function mostrarClubes() {
  const termo = normalizar(buscaClube.value);
  listaClubes.innerHTML = "";
  let achouAlgum = false;

  for (const liga in CLUBES) {
    const filtrados = CLUBES[liga].filter(function (clube) {
      return normalizar(clube).includes(termo);
    });

    if (filtrados.length === 0) continue;
    achouAlgum = true;

    const titulo = document.createElement("div");
    titulo.className = "liga-titulo";
    titulo.textContent = liga;
    listaClubes.appendChild(titulo);

    filtrados.forEach(function (clube) {
      const item = document.createElement("div");
      item.className = "clube-item";
      item.textContent = clube;

      if (clube === clubeSelecionado) {
        item.classList.add("selecionado");
      }

      item.addEventListener("click", function () {
        tirarDestaque();
        item.classList.add("selecionado");
        clubeSelecionado = clube;
        clubeDigitado.value = "";
        atualizarEscolhido();
      });

      listaClubes.appendChild(item);
    });
  }

  if (!achouAlgum) {
    listaClubes.innerHTML =
      '<div class="sem-resultado">Nenhum clube encontrado. Digite o nome abaixo.</div>';
  }
}

// Descobre a divisão/liga pelo nome do clube, usando a lista do clubes.js
function ligaDoClube(clube) {
  for (const liga in CLUBES) {
    if (CLUBES[liga].includes(clube)) return liga;
  }
  return "";
}

// A divisão que você escolheu, ou a da lista de clubes
function ligaDoSave(save) {
  return save.liga || ligaDoClube(save.clube);
}

function criarTag(texto, destaque) {
  const tag = document.createElement("span");
  tag.className = destaque ? "tag destaque" : "tag";
  tag.textContent = texto;
  return tag;
}

// Seleções ficam na mesma lista de saves (tipo "selecao"); aqui só os clubes
function ehSelecao(save) {
  return !!save && save.tipo === "selecao";
}

function indicesDeClubes() {
  const indices = [];
  saves.forEach(function (save, i) {
    if (!ehSelecao(save)) indices.push(i);
  });
  return indices;
}

function mostrarSaves() {
  listaSaves.innerHTML = "";

  const indicesClubes = indicesDeClubes();

  for (let i = 0; i < MAX_SAVES; i++) {
    const caixa = document.createElement("div");
    const indice = indicesClubes[i];
    const save = indice === undefined ? null : saves[indice];

    if (save) {
      caixa.className = "save";

      const info = document.createElement("div");
      info.className = "save-info";

      const nome = document.createElement("span");
      nome.className = "save-nome";
      nome.textContent = "Save " + (i + 1) + ": " + save.clube;
      info.appendChild(nome);

      // Tags: temporada atual e divisão
      const tags = document.createElement("div");
      tags.className = "tags";

      const temporadasDoSave = save.temporadas || [];
      if (temporadasDoSave.length > 0) {
        tags.appendChild(criarTag(temporadasDoSave[temporadasDoSave.length - 1], true));
      } else {
        tags.appendChild(criarTag("Sem temporada"));
      }

      const ligaDoCard = ligaDoSave(save);
      if (ligaDoCard) tags.appendChild(criarTag(ligaDoCard));

      info.appendChild(tags);

      const acoes = document.createElement("div");
      acoes.className = "acoes";
      acoes.innerHTML =
        '<button class="btn-abrir" data-posicao="' + indice + '">Abrir</button>' +
        '<button class="btn-excluir" data-posicao="' + indice + '">Excluir</button>';

      caixa.appendChild(info);
      caixa.appendChild(acoes);
    } else {
      caixa.className = "save vazio";
      caixa.textContent = "Save " + (i + 1) + ": vazio";
    }

    listaSaves.appendChild(caixa);
  }
}

function abrirFormularioSave() {
  clubeSelecionado = "";
  ligaDigitada.value = "";
  treinadorDigitado.value = nomeDoUltimoTreinador();
  buscaClube.value = "";
  clubeDigitado.value = "";
  atualizarEscolhido();
  mostrarClubes();
  formSave.classList.remove("escondido");
}

buscaClube.addEventListener("input", mostrarClubes);

clubeDigitado.addEventListener("input", function () {
  clubeSelecionado = clubeDigitado.value.trim();
  tirarDestaque();
  atualizarEscolhido();
});

botaoNovoSave.addEventListener("click", function () {
  if (indicesDeClubes().length >= MAX_SAVES) {
    alert("Você já tem 5 saves. Exclua um para criar outro.");
    return;
  }
  abrirFormularioSave();
});

botaoCancelar.addEventListener("click", function () {
  formSave.classList.add("escondido");
});

botaoCriar.addEventListener("click", function () {
  if (!clubeSelecionado) {
    alert("Escolha um clube da lista ou digite o nome dele.");
    return;
  }

  saves.push({
    id: Date.now(),
    clube: clubeSelecionado,
    liga: ligaDigitada.value.trim() || ligaDoClube(clubeSelecionado),
    tecnico: treinadorDigitado.value.trim(),
    temporadas: [],
    jogadores: []
  });

  guardarSaves();
  mostrarSaves();
  formSave.classList.add("escondido");
});

listaSaves.addEventListener("click", function (evento) {
  const botao = evento.target;

  if (botao.classList.contains("btn-excluir")) {
    const posicao = Number(botao.dataset.posicao);

    if (confirm("Tem certeza que quer excluir este save?")) {
      const removido = saves.splice(posicao, 1)[0];
      saves = saves.filter(function (s) { return s.paiId !== removido.id; });
      guardarSaves();
      mostrarSaves();
    }
  }

  if (botao.classList.contains("btn-abrir")) {
    abrirSave(Number(botao.dataset.posicao));
  }
});

// ---------- Seleções ligadas ao clube ----------
// Cada seleção é um save próprio (tipo "selecao") ligado ao save do clube por "paiId".
// Ela aparece como uma aba no menu do clube, e o clube aparece como aba dentro dela.

const GENTILICOS_SELECAO = {
  "África do Sul": "Sul-Africana", "Albânia": "Albanesa", "Alemanha": "Alemã", "Angola": "Angolana",
  "Arábia Saudita": "Saudita", "Argélia": "Argelina", "Argentina": "Argentina", "Austrália": "Australiana",
  "Áustria": "Austríaca", "Bélgica": "Belga", "Bolívia": "Boliviana", "Bósnia e Herzegovina": "Bósnia",
  "Brasil": "Brasileira", "Bulgária": "Búlgara", "Cabo Verde": "Cabo-Verdiana", "Camarões": "Camaronesa",
  "Canadá": "Canadense", "Catar": "Catariana", "Cazaquistão": "Cazaque", "Chile": "Chilena",
  "China": "Chinesa", "Colômbia": "Colombiana", "Coreia do Sul": "Sul-Coreana",
  "Costa do Marfim": "Marfinense", "Costa Rica": "Costa-Riquenha", "Croácia": "Croata", "Cuba": "Cubana",
  "Dinamarca": "Dinamarquesa", "Egito": "Egípcia", "Equador": "Equatoriana", "Escócia": "Escocesa",
  "Eslováquia": "Eslovaca", "Eslovênia": "Eslovena", "Espanha": "Espanhola", "Estados Unidos": "Americana",
  "Finlândia": "Finlandesa", "França": "Francesa", "Gales": "Galesa", "Gana": "Ganesa", "Geórgia": "Georgiana",
  "Grécia": "Grega", "Holanda": "Holandesa", "Honduras": "Hondurenha", "Hungria": "Húngara",
  "Inglaterra": "Inglesa", "Índia": "Indiana", "Irã": "Iraniana", "Irlanda": "Irlandesa", "Islândia": "Islandesa",
  "Israel": "Israelense", "Itália": "Italiana", "Jamaica": "Jamaicana", "Japão": "Japonesa",
  "Luxemburgo": "Luxemburguesa", "Malta": "Maltesa", "Marrocos": "Marroquina", "México": "Mexicana",
  "Montenegro": "Montenegrina", "Moçambique": "Moçambicana", "Nigéria": "Nigeriana", "Noruega": "Norueguesa",
  "Nova Zelândia": "Neozelandesa", "Panamá": "Panamenha", "Paraguai": "Paraguaia", "Peru": "Peruana",
  "Polônia": "Polonesa", "Portugal": "Portuguesa", "República Tcheca": "Tcheca", "Romênia": "Romena",
  "Rússia": "Russa", "Senegal": "Senegalesa", "Sérvia": "Sérvia", "Suécia": "Sueca", "Suíça": "Suíça",
  "Tunísia": "Tunisiana", "Turquia": "Turca", "Ucrânia": "Ucraniana", "Uruguai": "Uruguaia",
  "Venezuela": "Venezuelana"
};

// "Brasil" vira "Seleção Brasileira"; se não tiver o gentílico, fica "Seleção · Nome"
function rotuloSelecao(nome) {
  return GENTILICOS_SELECAO[nome] ? "Seleção " + GENTILICOS_SELECAO[nome] : "Seleção · " + nome;
}

function confederacaoDe(nome) {
  const fonte = typeof SELECOES !== "undefined" ? SELECOES : {};

  for (const confederacao in fonte) {
    if (fonte[confederacao].includes(nome)) return confederacao;
  }
  return "";
}

// Cria a seleção ligada a este clube (ou reaproveita uma que já exista)
function garantirSelecao(clubeSave, nome) {
  const chave = normalizar(nome);

  const jaLigada = saves.find(function (s) {
    return ehSelecao(s) && s.paiId === clubeSave.id && normalizar(s.clube) === chave;
  });
  if (jaLigada) return;

  const solta = saves.find(function (s) {
    return ehSelecao(s) && !s.paiId && normalizar(s.clube) === chave;
  });
  if (solta) {
    solta.paiId = clubeSave.id;
    return;
  }

  saves.push({
    id: Date.now() + 1,
    tipo: "selecao",
    paiId: clubeSave.id,
    clube: nome,
    liga: confederacaoDe(nome),
    tecnico: clubeSave.tecnico || "",
    temporadas: [],
    jogadores: []
  });
}

function criarAbaExtra(texto, primeira, aoClicar) {
  const botao = document.createElement("button");
  botao.className = "aba aba-extra" + (primeira ? " aba-extra-inicio" : "");
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  menuLateral.appendChild(botao);
}

// Aba da seleção dentro do clube, e aba do clube dentro da seleção
function montarAbasExtras() {
  menuLateral.querySelectorAll(".aba-extra").forEach(function (botao) {
    botao.remove();
  });

  const save = saves[saveAberto];

  if (ehSelecao(save)) {
    const pai = saves.findIndex(function (s) { return s.id === save.paiId; });

    if (pai !== -1) {
      criarAbaExtra("🏠 " + saves[pai].clube, true, function () { abrirSave(pai); });
    }
    return;
  }

  let primeira = true;

  saves.forEach(function (s, indice) {
    if (!ehSelecao(s) || s.paiId !== save.id) return;

    criarAbaExtra("🌍 " + rotuloSelecao(s.clube), primeira, function () { abrirSave(indice); });
    primeira = false;
  });
}

// ---------- Estatísticas ----------

// Devolve as estatísticas de um jogador numa temporada (zeros se não tiver nada)
function lerStats(jogador, temporada) {
  const base = { jogos: 0, gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, nota: 0 };

  if (jogador.stats && jogador.stats[temporada]) {
    return Object.assign(base, jogador.stats[temporada]);
  }

  return base;
}

// Soma as estatísticas de todas as temporadas (a nota é a média ponderada pelos jogos)
function somarStats(jogador, temporadas) {
  const total = { jogos: 0, gols: 0, assistencias: 0, amarelos: 0, vermelhos: 0, nota: 0 };
  let somaNotas = 0;

  temporadas.forEach(function (temporada) {
    const s = lerStats(jogador, temporada);
    total.jogos += s.jogos;
    total.gols += s.gols;
    total.assistencias += s.assistencias;
    total.amarelos += s.amarelos;
    total.vermelhos += s.vermelhos;
    somaNotas += s.nota * s.jogos;
  });

  total.nota = total.jogos > 0 ? somaNotas / total.jogos : 0;
  return total;
}

function formatarNota(nota) {
  return nota > 0 ? String(Number(nota.toFixed(2))) : "-";
}

// Sugere a próxima temporada: 25/26 vira 26/27
function sugerirProximaTemporada(temporadas) {
  if (temporadas.length === 0) return "25/26";

  const ultima = temporadas[temporadas.length - 1];
  const partes = ultima.split("/");
  const inicio = (Number(partes[0]) + 1) % 100;
  const fim = (Number(partes[1]) + 1) % 100;

  return String(inicio).padStart(2, "0") + "/" + String(fim).padStart(2, "0");
}

function preencherSeletorTemporada() {
  const save = saves[saveAberto];
  seletorTemporada.innerHTML = "";

  save.temporadas.forEach(function (temporada) {
    const opcao = document.createElement("option");
    opcao.value = temporada;
    opcao.textContent = temporada;
    seletorTemporada.appendChild(opcao);
  });

  const geral = document.createElement("option");
  geral.value = "geral";
  geral.textContent = "Geral (todas as temporadas)";
  seletorTemporada.appendChild(geral);

  seletorTemporada.value = temporadaSelecionada;

  if (save.temporadas.length === 0) {
    avisoTemporada.classList.remove("escondido");
  } else {
    avisoTemporada.classList.add("escondido");
  }

  atualizarBotaoExcluirTemporada();
}

// O botão de excluir só aparece quando uma temporada está selecionada (não no Geral)
function atualizarBotaoExcluirTemporada() {
  botaoExcluirTemporada.classList.toggle("escondido", temporadaSelecionada === "geral");
}

seletorTemporada.addEventListener("change", function () {
  temporadaSelecionada = seletorTemporada.value;
  atualizarBotaoExcluirTemporada();
  mostrarElenco();
});

botaoExcluirTemporada.addEventListener("click", function () {
  if (temporadaSelecionada === "geral") return;

  const save = saves[saveAberto];
  const temporada = temporadaSelecionada;

  const certeza = confirm(
    "Excluir a temporada " + temporada + "?\n\n" +
    "Isso apaga as estatísticas dos jogadores, o desempenho, os campeonatos " +
    "e as transferências dessa temporada. Não dá pra desfazer."
  );

  if (!certeza) return;

  save.temporadas = save.temporadas.filter(function (t) {
    return t !== temporada;
  });

  save.jogadores.forEach(function (jogador) {
    if (jogador.stats) delete jogador.stats[temporada];
  });

  if (save.desempenho) delete save.desempenho[temporada];
  if (save.campeonatos) delete save.campeonatos[temporada];
  if (save.transferencias) delete save.transferencias[temporada];
  if (save.financas) delete save.financas[temporada];
  if (save.notas) delete save.notas[temporada];
  if (save.taticas) delete save.taticas[temporada];
  if (save.eventos) save.eventos = save.eventos.filter(function (e) { return e.temporada !== temporada; });

  temporadaSelecionada = save.temporadas.length > 0
    ? save.temporadas[save.temporadas.length - 1]
    : "geral";

  guardarSaves();
  preencherSeletorTemporada();
  mostrarElenco();
});

botaoNovaTemporada.addEventListener("click", function () {
  const save = saves[saveAberto];
  const sugestao = sugerirProximaTemporada(save.temporadas);
  const resposta = prompt("Nome da temporada (ex: 25/26):", sugestao);

  if (resposta === null) return;

  const nome = resposta.trim();

  if (!/^\d{2}\/\d{2}$/.test(nome)) {
    alert("Use o formato 25/26.");
    return;
  }

  if (save.temporadas.includes(nome)) {
    alert("Essa temporada já existe.");
    return;
  }

  save.temporadas.push(nome);
  save.temporadas.sort();
  temporadaSelecionada = nome;

  guardarSaves();
  preencherSeletorTemporada();
  mostrarElenco();
});

// ---------- Desempenho do time (calculado a partir dos campeonatos) ----------

function numeroDe(valor) {
  const n = Number(valor);
  return isNaN(n) ? 0 : n;
}

function valorOuVazio(valor) {
  return valor === null || valor === undefined ? "" : valor;
}

// Números antigos de vitórias/empates/derrotas por temporada (de antes de ser por campeonato)
function lerDesempenho(save, temporada) {
  const base = { vitorias: 0, empates: 0, derrotas: 0 };

  if (save.desempenho && save.desempenho[temporada]) {
    return Object.assign(base, save.desempenho[temporada]);
  }

  return base;
}

function somarCampanhas(lista) {
  const total = { vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0 };

  lista.forEach(function (item) {
    total.vitorias += numeroDe(item.vitorias);
    total.empates += numeroDe(item.empates);
    total.derrotas += numeroDe(item.derrotas);
    total.golsPro += numeroDe(item.golsPro);
    total.golsContra += numeroDe(item.golsContra);
  });

  return total;
}

function jogosDe(campanha) {
  return campanha.vitorias + campanha.empates + campanha.derrotas;
}

function aproveitamentoDe(campanha) {
  const jogos = jogosDe(campanha);
  if (jogos === 0) return "-";
  const pontos = campanha.vitorias * 3 + campanha.empates;
  return Math.round((pontos / (jogos * 3)) * 100) + "%";
}

// Uma linha por campeonato da temporada (mais os números antigos, se existirem)
function linhasDaTemporada(save, temporada) {
  const linhas = listaDaTemporada(save, temporada).map(function (campeonato) {
    return Object.assign({ nome: campeonato.nome, antigo: false }, somarCampanhas([campeonato]));
  });

  const antigo = lerDesempenho(save, temporada);
  if (antigo.vitorias + antigo.empates + antigo.derrotas > 0) {
    linhas.push(Object.assign(
      { nome: "Dados antigos (sem campeonato)", antigo: true },
      somarCampanhas([antigo])
    ));
  }

  return linhas;
}

function totalDaTemporada(save, temporada) {
  return somarCampanhas(linhasDaTemporada(save, temporada));
}

function criarCelula(texto, tag) {
  const celula = document.createElement(tag || "td");
  celula.textContent = texto;
  return celula;
}

function criarLinhaResultado(nome, dados, classe) {
  const linha = document.createElement("tr");
  if (classe) linha.className = classe;

  linha.appendChild(criarCelula(nome));
  linha.appendChild(criarCelula(jogosDe(dados)));
  linha.appendChild(criarCelula(dados.vitorias));
  linha.appendChild(criarCelula(dados.empates));
  linha.appendChild(criarCelula(dados.derrotas));
  linha.appendChild(criarCelula(dados.golsPro));
  linha.appendChild(criarCelula(dados.golsContra));
  linha.appendChild(criarCelula(aproveitamentoDe(dados)));

  return linha;
}

// Aba Resultados: só mostra, quem calcula é o app
function mostrarResultados() {
  const save = saves[saveAberto];
  const emGeral = temporadaSelecionada === "geral";

  areaResultados.innerHTML = "";
  tituloResultados.textContent = emGeral
    ? "Desempenho por temporada"
    : "Desempenho em " + temporadaSelecionada;

  if (save.temporadas.length === 0) {
    areaResultados.innerHTML =
      '<p class="texto-vazio">Crie uma temporada para ver o desempenho.</p>';
    return;
  }

  let linhas = [];

  if (emGeral) {
    linhas = save.temporadas.map(function (temporada) {
      return { nome: temporada, dados: totalDaTemporada(save, temporada), antigo: false };
    });
  } else {
    linhas = linhasDaTemporada(save, temporadaSelecionada).map(function (linha) {
      return { nome: linha.nome, dados: linha, antigo: linha.antigo };
    });
  }

  if (linhas.length === 0) {
    areaResultados.innerHTML =
      '<p class="texto-vazio">Nenhum campeonato nessa temporada. Cadastre na aba Competições.</p>';
    return;
  }

  const tabela = document.createElement("table");
  tabela.className = "tabela-resultados";

  const cabecalho = document.createElement("thead");
  const linhaCabecalho = document.createElement("tr");
  [emGeral ? "Temporada" : "Competição", "J", "V", "E", "D", "GM", "GS", "Aprov.", ""].forEach(
    function (titulo) {
      linhaCabecalho.appendChild(criarCelula(titulo, "th"));
    }
  );
  cabecalho.appendChild(linhaCabecalho);
  tabela.appendChild(cabecalho);

  const corpo = document.createElement("tbody");

  linhas.forEach(function (item) {
    const linha = criarLinhaResultado(item.nome, item.dados, item.antigo ? "antigo" : "");

    const celulaAcao = document.createElement("td");
    if (item.antigo) {
      const apagar = document.createElement("button");
      apagar.className = "btn-excluir btn-apagar-antigo";
      apagar.textContent = "Apagar";
      celulaAcao.appendChild(apagar);
    }
    linha.appendChild(celulaAcao);

    corpo.appendChild(linha);
  });

  if (linhas.length > 1) {
    const total = somarCampanhas(linhas.map(function (item) { return item.dados; }));
    const linhaTotal = criarLinhaResultado("Total", total, "total");
    linhaTotal.appendChild(document.createElement("td"));
    corpo.appendChild(linhaTotal);
  }

  tabela.appendChild(corpo);
  areaResultados.appendChild(tabela);

  const legenda = document.createElement("p");
  legenda.className = "nota-resumo";
  legenda.textContent = "J = jogos · V = vitórias · E = empates · D = derrotas · GM = gols marcados · GS = gols sofridos";
  areaResultados.appendChild(legenda);
}

areaResultados.addEventListener("click", function (evento) {
  if (!evento.target.classList.contains("btn-apagar-antigo")) return;

  if (!confirm("Apagar os números antigos de vitórias, empates e derrotas dessa temporada?")) return;

  const save = saves[saveAberto];
  if (save.desempenho) delete save.desempenho[temporadaSelecionada];

  guardarSaves();
  mostrarResultados();
  mostrarResumo();
});

// ---------- Campeonatos e títulos ----------

const RESULTADOS = [
  "Campeão",
  "Vice-campeão",
  "Semifinal",
  "Quartas de final",
  "Oitavas de final",
  "Fase de grupos",
  "Terminou (sem título)",
  "Eliminado",
  "Em andamento"
];

function preencherResultados() {
  RESULTADOS.forEach(function (resultado) {
    const opcao = document.createElement("option");
    opcao.value = resultado;
    opcao.textContent = resultado;
    resultadoCampeonato.appendChild(opcao);
  });

  // Um campeonato novo começa "em andamento"; você troca pra campeão, vice etc. quando terminar
  resultadoCampeonato.value = "Em andamento";
}

function listaDaTemporada(save, temporada) {
  if (save.campeonatos && save.campeonatos[temporada]) {
    return save.campeonatos[temporada];
  }
  return [];
}

function criarSeletorResultado(campeonato) {
  const seletor = document.createElement("select");
  seletor.className = "sel-resultado";
  seletor.dataset.id = campeonato.id;

  RESULTADOS.forEach(function (resultado) {
    const opcao = document.createElement("option");
    opcao.value = resultado;
    opcao.textContent = resultado;
    seletor.appendChild(opcao);
  });

  seletor.value = campeonato.resultado;
  return seletor;
}

function criarCampoNumero(rotulo, campeonato, chave) {
  const bloco = document.createElement("div");
  bloco.className = "campo-numero";

  const texto = document.createElement("span");
  texto.textContent = rotulo;
  bloco.appendChild(texto);

  const entrada = document.createElement("input");
  entrada.type = "number";
  entrada.className = "campo-stat campo-comp";
  entrada.min = 0;
  entrada.step = "1";
  entrada.value = numeroDe(campeonato[chave]);
  entrada.dataset.id = campeonato.id;
  entrada.dataset.campo = chave;
  bloco.appendChild(entrada);

  return bloco;
}

function mostrarCampeonatos() {
  const save = saves[saveAberto];
  const emGeral = temporadaSelecionada === "geral";
  let itens = [];

  listaCampeonatos.innerHTML = "";

  // O formulário de adicionar só aparece quando tem uma temporada escolhida
  formCampeonato.classList.toggle("escondido", emGeral);

  if (emGeral) {
    save.temporadas.forEach(function (temporada) {
      listaDaTemporada(save, temporada).forEach(function (campeonato) {
        itens.push({ temporada: temporada, campeonato: campeonato });
      });
    });
  } else {
    itens = listaDaTemporada(save, temporadaSelecionada).map(function (campeonato) {
      return { temporada: temporadaSelecionada, campeonato: campeonato };
    });
  }

  const titulos = itens.filter(function (item) {
    return item.campeonato.resultado === "Campeão";
  }).length;

  resumoTitulos.textContent =
    (emGeral ? "Títulos no total: " : "Títulos nesta temporada: ") + titulos;

  if (save.temporadas.length === 0) {
    listaCampeonatos.innerHTML =
      '<p class="texto-vazio">Crie uma temporada para registrar campeonatos.</p>';
    return;
  }

  if (itens.length === 0) {
    listaCampeonatos.innerHTML =
      '<p class="texto-vazio">Nenhum campeonato registrado ainda.</p>';
    return;
  }

  itens.forEach(function (item) {
    const campeonato = item.campeonato;

    // ----- Geral: só mostra -----
    if (emGeral) {
      const linha = document.createElement("div");
      linha.className = "linha-campeonato";

      const nome = document.createElement("span");
      nome.className = "nome-campeonato";
      nome.textContent = item.temporada + " · " + campeonato.nome;
      linha.appendChild(nome);

      const resultado = document.createElement("span");
      resultado.className = "resultado-texto";
      if (campeonato.resultado === "Campeão") resultado.classList.add("campeao");
      resultado.textContent = campeonato.resultado;
      if (campeonato.posicao > 0) resultado.textContent += " · " + campeonato.posicao + "º";
      linha.appendChild(resultado);

      const campanha = somarCampanhas([campeonato]);
      if (jogosDe(campanha) > 0 || campanha.golsPro > 0 || campanha.golsContra > 0) {
        const detalhe = document.createElement("span");
        detalhe.className = "detalhe-campeonato";
        detalhe.textContent =
          campanha.vitorias + "V " + campanha.empates + "E " + campanha.derrotas + "D · " +
          campanha.golsPro + " GM · " + campanha.golsContra + " GS";
        linha.appendChild(detalhe);
      }

      listaCampeonatos.appendChild(linha);
      return;
    }

    // ----- Temporada: cartão editável -----
    const cartao = document.createElement("div");
    cartao.className = "cartao-campeonato";

    const cabecalho = document.createElement("div");
    cabecalho.className = "cabecalho-campeonato";

    const nome = document.createElement("span");
    nome.className = "nome-campeonato";
    nome.textContent = campeonato.nome;
    cabecalho.appendChild(nome);

    cabecalho.appendChild(criarSeletorResultado(campeonato));

    const entradaPosicao = document.createElement("input");
    entradaPosicao.type = "number";
    entradaPosicao.className = "campo-stat campo-posicao";
    entradaPosicao.min = 1;
    entradaPosicao.step = "1";
    entradaPosicao.placeholder = "Pos.";
    entradaPosicao.title = "Posição final";
    entradaPosicao.value = campeonato.posicao > 0 ? campeonato.posicao : "";
    entradaPosicao.dataset.id = campeonato.id;
    cabecalho.appendChild(entradaPosicao);

    const excluir = document.createElement("button");
    excluir.className = "btn-excluir";
    excluir.dataset.id = campeonato.id;
    excluir.textContent = "Excluir";
    cabecalho.appendChild(excluir);

    cartao.appendChild(cabecalho);

    const grade = document.createElement("div");
    grade.className = "grade-numeros";
    grade.appendChild(criarCampoNumero("Vitórias", campeonato, "vitorias"));
    grade.appendChild(criarCampoNumero("Empates", campeonato, "empates"));
    grade.appendChild(criarCampoNumero("Derrotas", campeonato, "derrotas"));
    grade.appendChild(criarCampoNumero("Gols marcados", campeonato, "golsPro"));
    grade.appendChild(criarCampoNumero("Gols sofridos", campeonato, "golsContra"));
    cartao.appendChild(grade);


    listaCampeonatos.appendChild(cartao);
  });
}

botaoAddCampeonato.addEventListener("click", function () {
  if (temporadaSelecionada === "geral") return;

  const nome = nomeCampeonato.value.trim();

  if (!nome) {
    alert("Digite o nome do campeonato.");
    return;
  }

  const save = saves[saveAberto];
  if (!save.campeonatos) save.campeonatos = {};
  if (!save.campeonatos[temporadaSelecionada]) {
    save.campeonatos[temporadaSelecionada] = [];
  }

  let posicao = Math.floor(parseFloat(posicaoCampeonato.value));
  if (isNaN(posicao) || posicao < 1) posicao = 0;

  save.campeonatos[temporadaSelecionada].push({
    id: Date.now(),
    nome: nome,
    resultado: resultadoCampeonato.value,
    posicao: posicao,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golsPro: 0,
    golsContra: 0
  });

  nomeCampeonato.value = "";
  posicaoCampeonato.value = "";
  guardarSaves();
  mostrarCampeonatos();
});

listaCampeonatos.addEventListener("click", function (evento) {
  const botao = evento.target;

  if (!botao.classList.contains("btn-excluir")) return;

  const id = Number(botao.dataset.id);
  const save = saves[saveAberto];

  if (confirm("Excluir este campeonato?")) {
    save.campeonatos[temporadaSelecionada] = listaDaTemporada(save, temporadaSelecionada).filter(
      function (campeonato) {
        return campeonato.id !== id;
      }
    );
    guardarSaves();
    mostrarCampeonatos();
  }
});

// Quando você muda qualquer campo de um campeonato, salva na hora
listaCampeonatos.addEventListener("change", function (evento) {
  const campo = evento.target;
  const id = Number(campo.dataset.id);
  const save = saves[saveAberto];

  const campeonato = listaDaTemporada(save, temporadaSelecionada).find(function (item) {
    return item.id === id;
  });

  if (!campeonato) return;

  // Resultado (campeão, vice...)
  if (campo.classList.contains("sel-resultado")) {
    campeonato.resultado = campo.value;
    guardarSaves();
    mostrarCampeonatos(); // atualiza a contagem de títulos
    return;
  }

  // Posição final
  if (campo.classList.contains("campo-posicao")) {
    const posicao = Math.floor(parseFloat(campo.value));
    campeonato.posicao = isNaN(posicao) || posicao < 1 ? 0 : posicao;
    campo.value = campeonato.posicao > 0 ? campeonato.posicao : "";
    guardarSaves();
    return;
  }

  // Vitórias, empates, derrotas, gols marcados e sofridos
  if (campo.classList.contains("campo-comp")) {
    let valor = Math.floor(parseFloat(campo.value));
    if (isNaN(valor) || valor < 0) valor = 0;
    campo.value = valor;
    campeonato[campo.dataset.campo] = valor;
    guardarSaves();
    return;
  }
});

// ---------- Transferências e dinheiro ----------
// Os valores são em milhões de euros (ex: 25,5 = € 25,5 mi)

const NOMES_TIPO = {
  chegada: "Compra",
  saida: "Venda",
  emprestimo_chegada: "Empréstimo (chegou)",
  emprestimo_saida: "Empréstimo (saiu)",
  sem_contrato: "Sem contrato"
};

function ehEmprestimo(tipo) {
  return tipo === "emprestimo_chegada" || tipo === "emprestimo_saida";
}

// Jogador que chegou ao clube (compra, empréstimo recebido ou sem contrato)
function ehChegada(tipo) {
  return tipo === "chegada" || tipo === "emprestimo_chegada" || tipo === "sem_contrato";
}

// Quanto o clube gastou nessa transferência
function gastoDe(transferencia) {
  if (transferencia.tipo === "chegada" || transferencia.tipo === "emprestimo_chegada") {
    return numeroDe(transferencia.valor);
  }
  return 0;
}

// Quanto o clube ganhou nessa transferência
function ganhoDe(transferencia) {
  if (transferencia.tipo === "saida" || transferencia.tipo === "emprestimo_saida") {
    return numeroDe(transferencia.valor);
  }
  return 0;
}

function arredondar(numero) {
  return Math.round(numero * 100) / 100;
}

function formatarDinheiro(valor) {
  return "€ " + valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + " mi";
}

function formatarSaldo(saldo) {
  if (saldo > 0) return "+" + formatarDinheiro(saldo);
  if (saldo < 0) return "-" + formatarDinheiro(Math.abs(saldo));
  return formatarDinheiro(0);
}

function transferenciasDaTemporada(save, temporada) {
  if (save.transferencias && save.transferencias[temporada]) {
    return save.transferencias[temporada];
  }
  return [];
}

function todasTransferencias(save, temporadas) {
  let lista = [];
  temporadas.forEach(function (temporada) {
    lista = lista.concat(transferenciasDaTemporada(save, temporada));
  });
  return lista;
}

// Todos os números do mercado de uma lista de transferências
function resumoFinanceiro(lista) {
  let gastos = 0;
  let ganhos = 0;
  let emprestimos = 0;
  let semContrato = 0;
  const compras = [];
  const vendas = [];

  lista.forEach(function (transferencia) {
    gastos += gastoDe(transferencia);
    ganhos += ganhoDe(transferencia);

    if (transferencia.tipo === "chegada") compras.push(transferencia);
    if (transferencia.tipo === "saida") vendas.push(transferencia);
    if (transferencia.tipo === "emprestimo_chegada") emprestimos++;
    if (transferencia.tipo === "sem_contrato") semContrato++;
  });

  function maiorDe(itens) {
    let melhor = null;
    itens.forEach(function (item) {
      if (!melhor || numeroDe(item.valor) > numeroDe(melhor.valor)) melhor = item;
    });
    return melhor;
  }

  const somaCompras = compras.reduce(function (soma, item) {
    return soma + numeroDe(item.valor);
  }, 0);

  return {
    gastos: arredondar(gastos),
    ganhos: arredondar(ganhos),
    saldo: arredondar(ganhos - gastos),
    maiorCompra: maiorDe(compras),
    maiorVenda: maiorDe(vendas),
    mediaCompras: compras.length > 0 ? arredondar(somaCompras / compras.length) : null,
    contratacoes: compras.length + emprestimos + semContrato,
    compras: compras.length,
    emprestimos: emprestimos,
    semContrato: semContrato
  };
}

function criarItemDinheiro(titulo, texto, classe) {
  const item = document.createElement("div");
  item.className = "item-dinheiro";

  const rotulo = document.createElement("span");
  rotulo.textContent = titulo;

  const valor = document.createElement("strong");
  valor.textContent = texto;
  if (classe) valor.classList.add(classe);

  item.appendChild(rotulo);
  item.appendChild(valor);
  return item;
}

function classeDoSaldo(saldo) {
  if (saldo > 0) return "positivo";
  if (saldo < 0) return "negativo";
  return "";
}

// ----- Mercado -----

function mostrarTransferencias() {
  const save = saves[saveAberto];
  const emGeral = temporadaSelecionada === "geral";
  let itens = [];

  listaTransferencias.innerHTML = "";
  resumoDinheiro.innerHTML = "";

  // O formulário de adicionar só aparece quando tem uma temporada escolhida
  formTransferencia.classList.toggle("escondido", emGeral);

  if (emGeral) {
    save.temporadas.forEach(function (temporada) {
      transferenciasDaTemporada(save, temporada).forEach(function (transferencia) {
        itens.push({ temporada: temporada, transferencia: transferencia });
      });
    });
  } else {
    itens = transferenciasDaTemporada(save, temporadaSelecionada).map(function (transferencia) {
      return { temporada: temporadaSelecionada, transferencia: transferencia };
    });
  }

  const dinheiro = resumoFinanceiro(itens.map(function (item) {
    return item.transferencia;
  }));

  resumoDinheiro.appendChild(criarItemDinheiro("Gastos com compras", formatarDinheiro(dinheiro.gastos)));
  resumoDinheiro.appendChild(criarItemDinheiro("Ganhos com vendas", formatarDinheiro(dinheiro.ganhos)));
  resumoDinheiro.appendChild(criarItemDinheiro("Saldo", formatarSaldo(dinheiro.saldo), classeDoSaldo(dinheiro.saldo)));

  if (save.temporadas.length === 0) {
    listaTransferencias.innerHTML =
      '<p class="texto-vazio">Crie uma temporada para registrar transferências.</p>';
    return;
  }

  if (itens.length === 0) {
    listaTransferencias.innerHTML =
      '<p class="texto-vazio">Nenhuma transferência registrada ainda.</p>';
    return;
  }

  itens.forEach(function (item) {
    const t = item.transferencia;
    const linha = document.createElement("div");
    linha.className = "linha-transferencia";

    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta " + t.tipo;
    etiqueta.textContent = NOMES_TIPO[t.tipo] || t.tipo;
    linha.appendChild(etiqueta);

    let texto = t.jogador;
    if (t.clube) {
      texto += (ehChegada(t.tipo) ? " (de " : " (para ") + t.clube + ")";
    }

    if (ehEmprestimo(t.tipo)) {
      if (t.opcao === "com") {
        texto += " · com opção de compra";
        if (numeroDe(t.valorOpcao) > 0) {
          texto += " de " + formatarDinheiro(numeroDe(t.valorOpcao));
        }
      } else {
        texto += " · sem opção de compra";
      }
    }

    if (emGeral) {
      texto = item.temporada + " · " + texto;
    }

    const info = document.createElement("span");
    info.className = "info";
    info.textContent = texto;
    linha.appendChild(info);

    const valor = document.createElement("span");
    valor.className = "valor-transferencia";
    valor.textContent = t.tipo === "sem_contrato" ? "Grátis" : formatarDinheiro(numeroDe(t.valor));
    linha.appendChild(valor);

    if (!emGeral) {
      const excluir = document.createElement("button");
      excluir.className = "btn-excluir";
      excluir.dataset.id = t.id;
      excluir.textContent = "Excluir";
      linha.appendChild(excluir);
    }

    listaTransferencias.appendChild(linha);
  });
}

// Mostra só os campos que fazem sentido pro tipo escolhido
function ajustarFormularioTransferencia() {
  const tipo = tipoTransferencia.value;
  const emprestimo = ehEmprestimo(tipo);

  valorTransferencia.classList.toggle("escondido", tipo === "sem_contrato");
  opcaoEmprestimo.classList.toggle("escondido", !emprestimo);
  valorOpcao.classList.toggle("escondido", !(emprestimo && opcaoEmprestimo.value === "com"));
}

tipoTransferencia.addEventListener("change", ajustarFormularioTransferencia);
opcaoEmprestimo.addEventListener("change", ajustarFormularioTransferencia);

botaoAddTransferencia.addEventListener("click", function () {
  if (temporadaSelecionada === "geral") return;

  const jogador = jogadorTransferencia.value.trim();

  if (!jogador) {
    alert("Digite o nome do jogador.");
    return;
  }

  const tipo = tipoTransferencia.value;

  let valor = parseFloat(valorTransferencia.value);
  if (isNaN(valor) || valor < 0) valor = 0; // vazio = grátis
  if (tipo === "sem_contrato") valor = 0;

  const transferencia = {
    id: Date.now(),
    tipo: tipo,
    jogador: jogador,
    clube: clubeTransferencia.value.trim(),
    valor: valor
  };

  if (ehEmprestimo(tipo)) {
    transferencia.opcao = opcaoEmprestimo.value;

    if (transferencia.opcao === "com") {
      let valorDaOpcao = parseFloat(valorOpcao.value);
      if (isNaN(valorDaOpcao) || valorDaOpcao < 0) valorDaOpcao = 0;
      transferencia.valorOpcao = valorDaOpcao;
    }
  }

  const save = saves[saveAberto];
  if (!save.transferencias) save.transferencias = {};
  if (!save.transferencias[temporadaSelecionada]) {
    save.transferencias[temporadaSelecionada] = [];
  }

  save.transferencias[temporadaSelecionada].push(transferencia);

  jogadorTransferencia.value = "";
  clubeTransferencia.value = "";
  valorTransferencia.value = "";
  valorOpcao.value = "";

  guardarSaves();
  mostrarTransferencias();
});

listaTransferencias.addEventListener("click", function (evento) {
  const botao = evento.target;

  if (!botao.classList.contains("btn-excluir")) return;

  const id = Number(botao.dataset.id);
  const save = saves[saveAberto];

  if (confirm("Excluir esta transferência?")) {
    save.transferencias[temporadaSelecionada] = transferenciasDaTemporada(save, temporadaSelecionada).filter(
      function (transferencia) {
        return transferencia.id !== id;
      }
    );
    guardarSaves();
    mostrarTransferencias();
  }
});

// ----- Finanças da temporada -----

function lerFinancas(save, temporada) {
  const base = { orcamentoInicial: null, salarioTotal: null };

  if (save.financas && save.financas[temporada]) {
    return Object.assign(base, save.financas[temporada]);
  }

  return base;
}

function criarCartaoComEntrada(titulo, chave, valor) {
  const cartao = document.createElement("div");
  cartao.className = "cartao";

  const rotulo = document.createElement("span");
  rotulo.textContent = titulo;
  cartao.appendChild(rotulo);

  const entrada = document.createElement("input");
  entrada.type = "number";
  entrada.className = "campo-stat campo-financa";
  entrada.min = 0;
  entrada.step = "0.1";
  entrada.placeholder = "€ mi";
  entrada.value = valorOuVazio(valor);
  entrada.dataset.campo = chave;
  cartao.appendChild(entrada);

  return cartao;
}

function textoDoMaior(registro) {
  return registro ? formatarDinheiro(numeroDe(registro.valor)) : "-";
}

function atualizarCartoesFinancas() {
  const save = saves[saveAberto];
  const emGeral = temporadaSelecionada === "geral";
  const temporadas = emGeral ? save.temporadas : [temporadaSelecionada];

  cartoesFinancas.innerHTML = "";

  if (save.temporadas.length === 0) {
    cartoesFinancas.innerHTML = '<p class="texto-vazio">Crie uma temporada para ver as finanças.</p>';
    return;
  }

  const dinheiro = resumoFinanceiro(todasTransferencias(save, temporadas));

  // Orçamento restante (só numa temporada específica)
  if (!emGeral) {
    const inicial = lerFinancas(save, temporadaSelecionada).orcamentoInicial;

    if (inicial === null) {
      cartoesFinancas.appendChild(criarCartao("Orçamento restante", "-", "Preencha o orçamento inicial"));
    } else {
      const restante = arredondar(inicial + dinheiro.ganhos - dinheiro.gastos);
      const texto = restante < 0
        ? "-" + formatarDinheiro(Math.abs(restante))
        : formatarDinheiro(restante);
      cartoesFinancas.appendChild(criarCartao(
        "Orçamento restante", texto, "", restante < 0 ? "negativo" : "positivo"
      ));
    }
  }

  cartoesFinancas.appendChild(criarCartao("Gastos com compras", formatarDinheiro(dinheiro.gastos)));
  cartoesFinancas.appendChild(criarCartao("Ganhos com vendas", formatarDinheiro(dinheiro.ganhos)));
  cartoesFinancas.appendChild(criarCartao(
    "Saldo", formatarSaldo(dinheiro.saldo), "", classeDoSaldo(dinheiro.saldo)
  ));
  cartoesFinancas.appendChild(criarCartao(
    "Maior compra", textoDoMaior(dinheiro.maiorCompra),
    dinheiro.maiorCompra ? dinheiro.maiorCompra.jogador : ""
  ));
  cartoesFinancas.appendChild(criarCartao(
    "Maior venda", textoDoMaior(dinheiro.maiorVenda),
    dinheiro.maiorVenda ? dinheiro.maiorVenda.jogador : ""
  ));
  cartoesFinancas.appendChild(criarCartao(
    "Média das compras",
    dinheiro.mediaCompras === null ? "-" : formatarDinheiro(dinheiro.mediaCompras)
  ));
  cartoesFinancas.appendChild(criarCartao(
    "Contratações", dinheiro.contratacoes,
    dinheiro.compras + (dinheiro.compras === 1 ? " compra" : " compras") + " · " +
    dinheiro.emprestimos + (dinheiro.emprestimos === 1 ? " empréstimo" : " empréstimos") + " · " +
    dinheiro.semContrato + " sem contrato"
  ));

  // No geral, mostra a soma dos salários que você anotou
  if (emGeral) {
    let somaSalarios = 0;
    save.temporadas.forEach(function (temporada) {
      somaSalarios += numeroDe(lerFinancas(save, temporada).salarioTotal);
    });
    cartoesFinancas.appendChild(criarCartao("Salário total (soma)", formatarDinheiro(arredondar(somaSalarios))));
  }
}

function mostrarFinancas() {
  const save = saves[saveAberto];
  const emGeral = temporadaSelecionada === "geral";

  entradasFinancas.innerHTML = "";
  tituloFinancas.textContent = emGeral
    ? "Finanças de todas as temporadas"
    : "Finanças da temporada " + temporadaSelecionada;

  if (!emGeral && save.temporadas.length > 0) {
    const dados = lerFinancas(save, temporadaSelecionada);
    entradasFinancas.appendChild(criarCartaoComEntrada("Orçamento inicial (€ mi)", "orcamentoInicial", dados.orcamentoInicial));
    entradasFinancas.appendChild(criarCartaoComEntrada("Salário total (€ mi)", "salarioTotal", dados.salarioTotal));
  }

  atualizarCartoesFinancas();
}

// Quando você muda o orçamento inicial ou o salário, salva na hora
entradasFinancas.addEventListener("change", function (evento) {
  const campo = evento.target;

  if (!campo.classList.contains("campo-financa")) return;

  const save = saves[saveAberto];
  const valor = parseFloat(campo.value);
  const vazio = isNaN(valor) || valor < 0;

  if (!save.financas) save.financas = {};
  if (!save.financas[temporadaSelecionada]) {
    save.financas[temporadaSelecionada] = lerFinancas(save, temporadaSelecionada);
  }

  save.financas[temporadaSelecionada][campo.dataset.campo] = vazio ? null : valor;
  if (vazio) campo.value = "";

  guardarSaves();
  atualizarCartoesFinancas();
});

// ----- Sub-abas: Mercado e Finanças -----

const subAbas = document.querySelectorAll(".sub-aba");
const subPaineis = document.querySelectorAll(".sub-painel");

function mostrarSubAba(nome) {
  subAbas.forEach(function (botao) {
    botao.classList.toggle("ativa", botao.dataset.sub === nome);
  });

  subPaineis.forEach(function (painel) {
    painel.classList.toggle("escondido", painel.id !== "sub-" + nome);
  });

  if (nome === "financas") mostrarFinancas();
}

subAbas.forEach(function (botao) {
  botao.addEventListener("click", function () {
    mostrarSubAba(botao.dataset.sub);
  });
});

// ---------- Hall da Fama do elenco ----------

const COLUNAS_HALL = [
  { chave: "nome", titulo: "Jogador", texto: true },
  { chave: "posicao", titulo: "Posição", texto: true },
  { chave: "temporadas", titulo: "Temp." },
  { chave: "jogos", titulo: "Jogos" },
  { chave: "gols", titulo: "Gols" },
  { chave: "assistencias", titulo: "Assist." },
  { chave: "amarelos", titulo: "Amarelos" },
  { chave: "vermelhos", titulo: "Vermelhos" },
  { chave: "nota", titulo: "Nota média" }
];

// Como a lista está ordenada agora (começa pelos que mais jogaram)
let ordemHall = { coluna: "jogos", direcao: "desc" };

// Um registro por jogador, somando as temporadas escolhidas
function dadosDoHall(save, temporadas) {
  return save.jogadores.map(function (jogador) {
    const total = somarStats(jogador, temporadas);

    const temporadasJogadas = temporadas.filter(function (temporada) {
      return lerStats(jogador, temporada).jogos > 0;
    }).length;

    return {
      nome: jogador.nome,
      posicao: jogador.posicao,
      temporadas: temporadasJogadas,
      jogos: total.jogos,
      gols: total.gols,
      assistencias: total.assistencias,
      amarelos: total.amarelos,
      vermelhos: total.vermelhos,
      nota: total.nota
    };
  });
}

function compararHall(a, b) {
  const coluna = ordemHall.coluna;
  const fator = ordemHall.direcao === "asc" ? 1 : -1;
  let resultado;

  if (coluna === "nome" || coluna === "posicao") {
    resultado = String(a[coluna]).localeCompare(String(b[coluna]), "pt") * fator;
  } else if (coluna === "nota" && (a.nota === 0 || b.nota === 0)) {
    // Quem não tem nota (não jogou) fica sempre no fim
    if (a.nota === b.nota) return a.nome.localeCompare(b.nome, "pt");
    return a.nota === 0 ? 1 : -1;
  } else {
    resultado = (a[coluna] - b[coluna]) * fator;
  }

  // Empatou? Desempata pelo nome
  return resultado !== 0 ? resultado : a.nome.localeCompare(b.nome, "pt");
}

function preencherFiltroHall() {
  const save = saves[saveAberto];
  const atual = filtroHall.value || "todas";

  filtroHall.innerHTML = "";

  const todas = document.createElement("option");
  todas.value = "todas";
  todas.textContent = "Todas as temporadas";
  filtroHall.appendChild(todas);

  save.temporadas.forEach(function (temporada) {
    const opcao = document.createElement("option");
    opcao.value = temporada;
    opcao.textContent = temporada;
    filtroHall.appendChild(opcao);
  });

  // Mantém a escolha de antes, se ela ainda existir
  filtroHall.value = atual === "todas" || save.temporadas.includes(atual) ? atual : "todas";
}

function mostrarHall() {
  const save = saves[saveAberto];

  preencherFiltroHall();
  areaHall.innerHTML = "";

  if (save.temporadas.length === 0) {
    areaHall.innerHTML = '<p class="texto-vazio">Crie uma temporada pra ver o Hall da Fama.</p>';
    return;
  }

  if (save.jogadores.length === 0) {
    areaHall.innerHTML = '<p class="texto-vazio">Nenhum jogador ainda. Cadastre na aba Elenco.</p>';
    return;
  }

  const temporadas = filtroHall.value === "todas" ? save.temporadas : [filtroHall.value];
  const lista = dadosDoHall(save, temporadas).sort(compararHall);

  // Busca por nome (sem ligar pra acento ou maiúscula); a posição no ranking continua a de verdade
  const consulta = normalizar(buscaHall.value.trim());
  const visiveis = lista
    .map(function (registro, i) { return { registro: registro, posicao: i + 1 }; })
    .filter(function (item) { return !consulta || normalizar(item.registro.nome).includes(consulta); });

  if (visiveis.length === 0) {
    areaHall.innerHTML = '<p class="texto-vazio">Nenhum jogador encontrado.</p>';
    return;
  }

  const tabela = document.createElement("table");
  tabela.className = "tabela-hall";

  // Cabeçalho: clicar numa coluna ordena por ela
  const cabecalho = document.createElement("thead");
  const linhaCabecalho = document.createElement("tr");

  linhaCabecalho.appendChild(criarCelula("#", "th"));

  COLUNAS_HALL.forEach(function (coluna) {
    const celula = criarCelula(coluna.titulo, "th");
    celula.className = "ordenavel";
    celula.dataset.coluna = coluna.chave;
    if (coluna.texto) celula.classList.add("col-texto");

    if (ordemHall.coluna === coluna.chave) {
      celula.classList.add("ativa");
      celula.textContent = coluna.titulo + (ordemHall.direcao === "desc" ? " ▼" : " ▲");
    }

    linhaCabecalho.appendChild(celula);
  });

  cabecalho.appendChild(linhaCabecalho);
  tabela.appendChild(cabecalho);

  const corpo = document.createElement("tbody");

  visiveis.forEach(function (item) {
    const registro = item.registro;
    const indice = item.posicao - 1;
    const linha = document.createElement("tr");

    const celulaPosicao = criarCelula(indice + 1);
    if (indice < 3) celulaPosicao.className = "posicao-" + (indice + 1);
    linha.appendChild(celulaPosicao);

    COLUNAS_HALL.forEach(function (coluna) {
      const valor = coluna.chave === "nota" ? formatarNota(registro.nota) : registro[coluna.chave];
      const celula = criarCelula(valor);

      if (coluna.texto) celula.className = "col-texto";
      if (ordemHall.coluna === coluna.chave) celula.classList.add("ordenada");

      linha.appendChild(celula);
    });

    corpo.appendChild(linha);
  });

  tabela.appendChild(corpo);
  areaHall.appendChild(tabela);
}

areaHall.addEventListener("click", function (evento) {
  const celula = evento.target.closest("th.ordenavel");

  if (!celula) return;

  const coluna = celula.dataset.coluna;

  if (ordemHall.coluna === coluna) {
    // Clicou de novo na mesma coluna: inverte a ordem
    ordemHall.direcao = ordemHall.direcao === "desc" ? "asc" : "desc";
  } else {
    // Coluna nova: números começam pelos maiores, nomes de A a Z
    ordemHall.coluna = coluna;
    ordemHall.direcao = coluna === "nome" || coluna === "posicao" ? "asc" : "desc";
  }

  mostrarHall();
});

filtroHall.addEventListener("change", mostrarHall);
buscaHall.addEventListener("input", mostrarHall);

// ---------- Perfil do treinador ----------

// "Danilo Melo" vira "DM"
function iniciaisDe(nome) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();

  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

function contarTitulos(save, temporadas) {
  let titulos = 0;

  temporadas.forEach(function (temporada) {
    listaDaTemporada(save, temporada).forEach(function (campeonato) {
      if (campeonato.resultado === "Campeão") titulos++;
    });
  });

  return titulos;
}

function criarMiniStat(titulo, valor) {
  const item = document.createElement("div");
  item.className = "mini-stat";

  const numero = document.createElement("strong");
  numero.textContent = valor;
  item.appendChild(numero);

  const rotulo = document.createElement("span");
  rotulo.textContent = titulo;
  item.appendChild(rotulo);

  return item;
}

// Nome do técnico (aceita o campo antigo "treinador" de saves mais velhos)
function nomeDoTecnico(save) {
  return (save.tecnico || save.treinador || "").trim();
}

function mostrarPerfilTecnico() {
  const save = saves[saveAberto];
  const temporadas = save.temporadas;
  const nome = nomeDoTecnico(save);
  const recolhido = localStorage.getItem("perfilRecolhido") === "1";

  perfilTecnico.innerHTML = "";

  // ----- Quem é o técnico -----
  const topo = document.createElement("div");
  topo.className = "perfil-topo";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = iniciaisDe(nome);
  topo.appendChild(avatar);

  const dados = document.createElement("div");
  dados.className = "perfil-dados";

  const nomeTecnico = document.createElement("div");
  nomeTecnico.className = "perfil-nome";
  nomeTecnico.textContent = nome || "Técnico sem nome";
  dados.appendChild(nomeTecnico);

  const liga = ligaDoSave(save);
  const linhaClube = document.createElement("div");
  linhaClube.className = "perfil-linha";
  linhaClube.textContent = save.clube + (liga ? " · " + liga : "");
  dados.appendChild(linhaClube);

  const linhaTempo = document.createElement("div");
  linhaTempo.className = "perfil-linha";
  if (temporadas.length > 0) {
    linhaTempo.textContent =
      "Temporada " + temporadas[temporadas.length - 1] +
      " · no clube desde " + temporadas[0] +
      " (" + temporadas.length + (temporadas.length === 1 ? " temporada" : " temporadas") + ")";
  } else {
    linhaTempo.textContent = "Nenhuma temporada ainda";
  }
  dados.appendChild(linhaTempo);

  topo.appendChild(dados);

  const acoes = document.createElement("div");
  acoes.className = "perfil-acoes";

  const botaoNome = document.createElement("button");
  botaoNome.className = "link-pequeno btn-editar-tecnico";
  botaoNome.textContent = nome ? "Alterar nome" : "Definir nome";
  acoes.appendChild(botaoNome);

  const botaoAlternar = document.createElement("button");
  botaoAlternar.className = "link-pequeno btn-alternar-perfil";
  botaoAlternar.textContent = recolhido ? "Mostrar estatísticas" : "Ocultar estatísticas";
  acoes.appendChild(botaoAlternar);

  topo.appendChild(acoes);
  perfilTecnico.appendChild(topo);

  if (recolhido) return;

  // ----- Carreira como técnico (sempre todas as temporadas) -----
  const campanha = somarCampanhas(temporadas.map(function (temporada) {
    return totalDaTemporada(save, temporada);
  }));

  const tituloStats = document.createElement("p");
  tituloStats.className = "perfil-titulo-stats";
  tituloStats.textContent = "Carreira como técnico (todas as temporadas)";
  perfilTecnico.appendChild(tituloStats);

  const stats = document.createElement("div");
  stats.className = "perfil-stats";
  stats.appendChild(criarMiniStat("Jogos", jogosDe(campanha)));
  stats.appendChild(criarMiniStat("Vitórias", campanha.vitorias));
  stats.appendChild(criarMiniStat("Empates", campanha.empates));
  stats.appendChild(criarMiniStat("Derrotas", campanha.derrotas));
  stats.appendChild(criarMiniStat("Títulos", contarTitulos(save, temporadas)));
  stats.appendChild(criarMiniStat("Aproveitamento", aproveitamentoDe(campanha)));
  stats.appendChild(criarMiniStat("Gols marcados", campanha.golsPro));
  stats.appendChild(criarMiniStat("Gols sofridos", campanha.golsContra));
  perfilTecnico.appendChild(stats);
}

perfilTecnico.addEventListener("click", function (evento) {
  const alvo = evento.target;

  // Mostrar / ocultar os números da carreira
  if (alvo.classList.contains("btn-alternar-perfil")) {
    const recolhido = localStorage.getItem("perfilRecolhido") === "1";
    localStorage.setItem("perfilRecolhido", recolhido ? "0" : "1");
    mostrarPerfilTecnico();
    return;
  }

  if (!alvo.classList.contains("btn-editar-tecnico")) return;

  const save = saves[saveAberto];
  const sugestao = nomeDoTecnico(save) || nomeDoUltimoTreinador();
  const resposta = prompt("Nome do treinador:", sugestao);

  if (resposta === null) return;

  save.tecnico = resposta.trim();
  delete save.treinador; // o campo antigo some, vale só o novo

  guardarSaves(); // já atualiza o perfil na tela
});

// ---------- Recordes da carreira ----------

function plural(quantidade, singular, pluralTexto) {
  return quantidade + " " + (quantidade === 1 ? singular : pluralTexto);
}

// Quantos títulos o clube ganhou em cada temporada
function titulosPorTemporada(save) {
  const mapa = {};

  save.temporadas.forEach(function (temporada) {
    mapa[temporada] = listaDaTemporada(save, temporada).filter(function (campeonato) {
      return campeonato.resultado === "Campeão";
    }).length;
  });

  return mapa;
}

// Quem tem o maior valor (se empatar, junta todos os nomes)
function maioresDe(lista, valorDe) {
  let maior = 0;
  let nomes = [];

  lista.forEach(function (item) {
    const valor = valorDe(item);

    if (valor > maior) {
      maior = valor;
      nomes = [item.nome];
    } else if (valor === maior && valor > 0) {
      nomes.push(item.nome);
    }
  });

  return { valor: maior, nomes: nomes };
}

const MAX_NOMES_NO_CARTAO = 3;

// Cada nome vira um pedaço separado (nada de juntar tudo numa string só),
// então nome com vírgula ou empate com muita gente não quebra nada.
// Passou de 3: mostra 3 + um "+N" que revela o resto ao passar o mouse.
function cartaoRecorde(titulo, recorde, detalheDe) {
  if (recorde.valor <= 0) {
    return criarCartao(titulo, "-", "Ainda sem registros");
  }

  const cartao = criarCartao(titulo, "", detalheDe(recorde));
  const principal = cartao.querySelector("strong");
  const nomes = recorde.nomes;

  principal.classList.add("lista-nomes");
  if (nomes.length > 1) principal.classList.add("varios");

  nomes.slice(0, MAX_NOMES_NO_CARTAO).forEach(function (nome, i) {
    const pedaco = document.createElement("span");
    pedaco.className = "nome-recorde";
    pedaco.textContent = nome + (i < Math.min(nomes.length, MAX_NOMES_NO_CARTAO) - 1 ? "," : "");
    principal.appendChild(pedaco);
  });

  if (nomes.length > MAX_NOMES_NO_CARTAO) {
    const restantes = nomes.slice(MAX_NOMES_NO_CARTAO);

    const mais = document.createElement("span");
    mais.className = "nomes-mais";
    mais.tabIndex = 0;
    mais.setAttribute("aria-label", "Mais " + restantes.length + ": " + restantes.join(", "));
    mais.textContent = "+" + restantes.length;

    const dica = document.createElement("span");
    dica.className = "nomes-mais-dica";
    restantes.forEach(function (nome) {
      const linha = document.createElement("span");
      linha.textContent = nome;
      dica.appendChild(linha);
    });

    mais.appendChild(dica);
    principal.appendChild(mais);
  }

  return cartao;
}

// A maior compra (ou venda) já registrada, com a temporada
function maiorTransferencia(save, tipo) {
  let melhor = null;

  save.temporadas.forEach(function (temporada) {
    transferenciasDaTemporada(save, temporada).forEach(function (transferencia) {
      if (transferencia.tipo !== tipo) return;

      if (!melhor || numeroDe(transferencia.valor) > numeroDe(melhor.transferencia.valor)) {
        melhor = { temporada: temporada, transferencia: transferencia };
      }
    });
  });

  return melhor;
}

function cartaoRecordeFinanceiro(titulo, registro, preposicao) {
  if (!registro || numeroDe(registro.transferencia.valor) <= 0) {
    return criarCartao(titulo, "-", "Ainda sem registros");
  }

  const t = registro.transferencia;
  const detalhe = t.jogador + (t.clube ? " (" + preposicao + " " + t.clube + ")" : "") + " · " + registro.temporada;

  return criarCartao(titulo, formatarDinheiro(numeroDe(t.valor)), detalhe);
}

function mostrarRecordes() {
  const save = saves[saveAberto];
  areaRecordes.innerHTML = "";

  if (save.temporadas.length === 0) {
    areaRecordes.innerHTML = '<p class="texto-vazio">Crie uma temporada pra ver os recordes.</p>';
    return;
  }

  const jogadores = dadosDoHall(save, save.temporadas);
  const porTemporada = titulosPorTemporada(save);

  // ----- Títulos -----
  let totalTitulos = 0;
  save.temporadas.forEach(function (temporada) {
    totalTitulos += porTemporada[temporada];
  });

  const melhorTemporada = maioresDe(
    save.temporadas.map(function (temporada) {
      return { nome: temporada, valor: porTemporada[temporada] };
    }),
    function (item) { return item.valor; }
  );

  // Um jogador "ganha" os títulos das temporadas em que ele jogou
  const titulosDosJogadores = save.jogadores.map(function (jogador) {
    let titulos = 0;

    save.temporadas.forEach(function (temporada) {
      if (lerStats(jogador, temporada).jogos > 0) titulos += porTemporada[temporada];
    });

    return { nome: jogador.nome, valor: titulos };
  });

  areaRecordes.appendChild(criarCartao(
    "Títulos do clube", totalTitulos, "em " + plural(save.temporadas.length, "temporada", "temporadas")
  ));

  areaRecordes.appendChild(cartaoRecorde("Temporada com mais títulos", melhorTemporada, function (r) {
    return plural(r.valor, "título", "títulos") + (r.nomes.length > 1 ? " cada" : "");
  }));

  areaRecordes.appendChild(cartaoRecorde(
    "Jogador com mais títulos",
    maioresDe(titulosDosJogadores, function (item) { return item.valor; }),
    function (r) {
      return plural(r.valor, "título", "títulos") + (r.nomes.length > 1 ? " cada" : "") +
        " (nas temporadas em que jogou)";
    }
  ));

  // ----- Jogadores -----
  areaRecordes.appendChild(cartaoRecorde(
    "Maior artilheiro",
    maioresDe(jogadores, function (j) { return j.gols; }),
    function (r) { return plural(r.valor, "gol", "gols") + (r.nomes.length > 1 ? " cada" : ""); }
  ));

  areaRecordes.appendChild(cartaoRecorde(
    "Mais assistências",
    maioresDe(jogadores, function (j) { return j.assistencias; }),
    function (r) {
      return plural(r.valor, "assistência", "assistências") + (r.nomes.length > 1 ? " cada" : "");
    }
  ));

  areaRecordes.appendChild(cartaoRecorde(
    "Mais jogos",
    maioresDe(jogadores, function (j) { return j.jogos; }),
    function (r) { return plural(r.valor, "jogo", "jogos") + (r.nomes.length > 1 ? " cada" : ""); }
  ));

  areaRecordes.appendChild(cartaoRecorde(
    "Mais cartões",
    maioresDe(jogadores, function (j) { return j.amarelos + j.vermelhos; }),
    function (r) {
      if (r.nomes.length > 1) return plural(r.valor, "cartão", "cartões") + " cada";

      const jogador = jogadores.find(function (j) { return j.nome === r.nomes[0]; });
      return plural(jogador.amarelos, "amarelo", "amarelos") + " · " +
        plural(jogador.vermelhos, "vermelho", "vermelhos");
    }
  ));

  // ----- Dinheiro -----
  if (!ehSelecao(save)) {
    areaRecordes.appendChild(cartaoRecordeFinanceiro("Maior compra", maiorTransferencia(save, "chegada"), "de"));
    areaRecordes.appendChild(cartaoRecordeFinanceiro("Maior venda", maiorTransferencia(save, "saida"), "para"));
  }
}

// ---------- Linha do tempo da carreira ----------

// ---------- Demissões e propostas ----------

const formEvento = document.getElementById("form-evento");
const temporadaEvento = document.getElementById("temporada-evento");
const tipoEvento = document.getElementById("tipo-evento");
const clubeEvento = document.getElementById("clube-evento");
const detalheEvento = document.getElementById("detalhe-evento");
const botaoAddEvento = document.getElementById("btn-add-evento");

const TIPOS_EVENTO = [
  { valor: "proposta", rotulo: "📩 Recebeu proposta" },
  { valor: "recusou", rotulo: "❌ Recusou proposta" },
  { valor: "aceitou", rotulo: "✅ Aceitou proposta" },
  { valor: "demitido", rotulo: "🟥 Demitido" },
  { valor: "selecao", rotulo: "🌍 Assumiu uma seleção", oculto: true }
];

function rotuloDoEvento(tipo) {
  const achado = TIPOS_EVENTO.find(function (t) { return t.valor === tipo; });
  return achado ? achado.rotulo : tipo;
}

function eventosDaTemporada(save, temporada) {
  if (!save.eventos) return [];
  return save.eventos.filter(function (evento) { return evento.temporada === temporada; });
}

function preencherFormEvento() {
  const save = saves[saveAberto];
  formEvento.classList.toggle("escondido", save.temporadas.length === 0 || ehSelecao(save));

  if (tipoEvento.options.length === 0) {
    TIPOS_EVENTO.forEach(function (tipo) {
      if (tipo.oculto) return;
      const opcao = document.createElement("option");
      opcao.value = tipo.valor;
      opcao.textContent = tipo.rotulo;
      tipoEvento.appendChild(opcao);
    });
  }

  const atual = temporadaEvento.value;
  temporadaEvento.innerHTML = "";

  save.temporadas.forEach(function (temporada) {
    const opcao = document.createElement("option");
    opcao.value = temporada;
    opcao.textContent = temporada;
    temporadaEvento.appendChild(opcao);
  });

  atualizarDestinoEvento();

  // Mantém a escolha de antes; senão, a temporada mais recente
  temporadaEvento.value = save.temporadas.includes(atual)
    ? atual
    : save.temporadas[save.temporadas.length - 1];
}

const destinoEvento = document.getElementById("destino-evento");
const sugestoesDestino = document.getElementById("sugestoes-destino");

// A lista de busca muda conforme for clube (clubes.js) ou seleção (selecoes.js)
function atualizarDestinoEvento() {
  const ehSelecao = destinoEvento.value === "selecao";
  const fonte = ehSelecao ? (typeof SELECOES !== "undefined" ? SELECOES : {}) : CLUBES;
  const vistos = {};

  sugestoesDestino.innerHTML = "";
  clubeEvento.placeholder = ehSelecao ? "Seleção (busque ou digite)" : "Clube (busque ou digite)";

  for (const grupo in fonte) {
    fonte[grupo].forEach(function (nome) {
      if (vistos[nome]) return;
      vistos[nome] = true;

      const opcao = document.createElement("option");
      opcao.value = nome;
      opcao.label = grupo;
      sugestoesDestino.appendChild(opcao);
    });
  }
}

destinoEvento.addEventListener("change", function () {
  clubeEvento.value = "";
  atualizarDestinoEvento();
});

botaoAddEvento.addEventListener("click", function () {
  const nome = clubeEvento.value.trim();

  if (!nome) {
    alert("Digite o clube ou a seleção.");
    return;
  }

  const save = saves[saveAberto];

  const registro = {
    id: Date.now(),
    temporada: temporadaEvento.value,
    tipo: tipoEvento.value,
    destino: destinoEvento.value,
    clube: nome,
    detalhe: detalheEvento.value.trim()
  };

  // Aceitou proposta de um clube: o clube do save muda
  if (registro.tipo === "aceitou" && registro.destino === "clube") {
    if (normalizar(nome) === normalizar(save.clube)) {
      alert("Você já está nesse clube.");
      return;
    }

    if (!confirm("Aceitar a proposta muda o clube do save de " + save.clube + " para " + nome + ". Continuar?")) {
      return;
    }

    registro.clubeAnterior = save.clube;
    registro.ligaAnterior = save.liga || "";
    save.clube = nome;
    save.liga = ligaDoClube(nome);
  }

  if (!save.eventos) save.eventos = [];
  save.eventos.push(registro);

  if (registro.tipo === "aceitou" && registro.destino === "selecao") {
    garantirSelecao(save, nome);
  }

  clubeEvento.value = "";
  detalheEvento.value = "";
  guardarSaves();
  atualizarCabecalhoSave();
  mostrarLinhaDoTempo();
});

areaLinhaTempo.addEventListener("click", function (evento) {
  const botao = evento.target;
  if (!botao.classList.contains("btn-evento")) return;

  const save = saves[saveAberto];
  const id = Number(botao.dataset.id);
  const removido = (save.eventos || []).find(function (e) { return e.id === id; });

  // Excluir uma proposta aceita devolve o clube de antes (se ele ainda for o atual)
  const voltaClube = removido && removido.tipo === "aceitou" && removido.clubeAnterior &&
    save.clube === removido.clube;

  const aviso = voltaClube
    ? "Excluir este registro? O clube do save volta para " + removido.clubeAnterior + "."
    : "Excluir este registro da linha do tempo?";

  if (!confirm(aviso)) return;

  if (voltaClube) {
    save.clube = removido.clubeAnterior;
    save.liga = removido.ligaAnterior || "";
  }

  save.eventos = (save.eventos || []).filter(function (e) { return e.id !== id; });

  if (removido && removido.tipo === "aceitou" && removido.destino === "selecao") {
    const indice = saves.findIndex(function (s) {
      return ehSelecao(s) && s.paiId === save.id && normalizar(s.clube) === normalizar(removido.clube);
    });

    if (indice !== -1 && (saves[indice].temporadas || []).length === 0 && (saves[indice].jogadores || []).length === 0) {
      saves.splice(indice, 1);
      saveAberto = saves.findIndex(function (s) { return s.id === idSaveAberto; });
    }
  }

  guardarSaves();
  atualizarCabecalhoSave();
  mostrarLinhaDoTempo();
});

function mostrarLinhaDoTempo() {
  const save = saves[saveAberto];
  areaLinhaTempo.innerHTML = "";
  preencherFormEvento();

  if (save.temporadas.length === 0) {
    areaLinhaTempo.innerHTML = '<p class="texto-vazio">Crie uma temporada pra começar a sua linha do tempo.</p>';
    return;
  }

  const atual = save.temporadas[save.temporadas.length - 1];

  // Da temporada mais recente pra mais antiga
  save.temporadas.slice().reverse().forEach(function (temporada) {
    const campeonatos = listaDaTemporada(save, temporada);
    const titulos = campeonatos.filter(function (campeonato) {
      return campeonato.resultado === "Campeão";
    });

    const campanha = totalDaTemporada(save, temporada);
    const transferencias = transferenciasDaTemporada(save, temporada);
    const dinheiro = resumoFinanceiro(transferencias);

    const jogadores = dadosDoHall(save, [temporada]);
    const artilheiro = maioresDe(jogadores, function (j) { return j.gols; });
    const garcom = maioresDe(jogadores, function (j) { return j.assistencias; });
    const utilizados = jogadores.filter(function (j) { return j.jogos > 0; }).length;

    const marco = document.createElement("div");
    marco.className = "marco" + (titulos.length > 0 ? " com-titulo" : "");

    // ----- Cabeçalho: temporada -----
    const cabecalho = document.createElement("div");
    cabecalho.className = "marco-cabecalho";

    const nome = document.createElement("span");
    nome.className = "marco-temporada";
    nome.textContent = temporada;
    cabecalho.appendChild(nome);

    if (temporada === atual) cabecalho.appendChild(criarTag("Temporada atual", true));

    marco.appendChild(cabecalho);

    // ----- Propostas, recusas e demissões -----
    const eventos = eventosDaTemporada(save, temporada);

    eventos.forEach(function (registro) {
      const linhaEvento = document.createElement("div");
      linhaEvento.className = "marco-evento " + registro.tipo;

      const texto = document.createElement("span");
      texto.textContent = rotuloDoEvento(registro.tipo) + " · " + registro.clube +
        (registro.destino === "selecao" ? " (seleção)" : "") +
        (registro.detalhe ? " — " + registro.detalhe : "");
      linhaEvento.appendChild(texto);

      const excluir = document.createElement("button");
      excluir.className = "btn-excluir btn-evento";
      excluir.dataset.id = registro.id;
      excluir.textContent = "×";
      excluir.title = "Excluir";
      linhaEvento.appendChild(excluir);

      marco.appendChild(linhaEvento);
    });

    // ----- Títulos -----
    const linhaTitulos = document.createElement("div");
    if (titulos.length > 0) {
      linhaTitulos.className = "marco-titulos";
      linhaTitulos.textContent = plural(titulos.length, "título", "títulos") + ": " +
        titulos.map(function (campeonato) { return campeonato.nome; }).join(", ");
    } else {
      linhaTitulos.className = "marco-titulos sem-titulo";
      linhaTitulos.textContent = "Sem títulos nessa temporada";
    }
    marco.appendChild(linhaTitulos);

    // ----- Campeonatos disputados -----
    if (campeonatos.length > 0) {
      const chips = document.createElement("div");
      chips.className = "tags";

      campeonatos.forEach(function (campeonato) {
        let texto = campeonato.nome + " · " + campeonato.resultado;
        if (campeonato.posicao > 0) texto += " · " + campeonato.posicao + "º";

        const chip = criarTag(texto);
        if (campeonato.resultado === "Campeão") chip.classList.add("campea");
        chips.appendChild(chip);
      });

      marco.appendChild(chips);
    }

    // ----- Campanha do time -----
    if (jogosDe(campanha) > 0 || campanha.golsPro > 0 || campanha.golsContra > 0) {
      const stats = document.createElement("div");
      stats.className = "perfil-stats";
      stats.appendChild(criarMiniStat("Jogos", jogosDe(campanha)));
      stats.appendChild(criarMiniStat("Vitórias", campanha.vitorias));
      stats.appendChild(criarMiniStat("Empates", campanha.empates));
      stats.appendChild(criarMiniStat("Derrotas", campanha.derrotas));
      stats.appendChild(criarMiniStat("Aproveit.", aproveitamentoDe(campanha)));
      stats.appendChild(criarMiniStat("Gols marc.", campanha.golsPro));
      stats.appendChild(criarMiniStat("Gols sofr.", campanha.golsContra));
      marco.appendChild(stats);
    }

    // ----- Destaques do elenco -----
    const destaques = [];
    if (artilheiro.valor > 0) {
      destaques.push("Artilheiro: " + artilheiro.nomes.join(", ") + " (" + plural(artilheiro.valor, "gol", "gols") + ")");
    }
    if (garcom.valor > 0) {
      destaques.push("Mais assistências: " + garcom.nomes.join(", ") + " (" + garcom.valor + ")");
    }
    if (utilizados > 0) {
      destaques.push(plural(utilizados, "jogador utilizado", "jogadores utilizados"));
    }

    if (destaques.length > 0) {
      const linhaDestaques = document.createElement("div");
      linhaDestaques.className = "marco-linha";
      linhaDestaques.textContent = destaques.join(" · ");
      marco.appendChild(linhaDestaques);
    }

    // ----- Mercado -----
    if (transferencias.length > 0) {
      const linhaMercado = document.createElement("div");
      linhaMercado.className = "marco-linha";
      linhaMercado.textContent =
        "Mercado: gastos " + formatarDinheiro(dinheiro.gastos) +
        " · vendas " + formatarDinheiro(dinheiro.ganhos) +
        " · saldo " + formatarSaldo(dinheiro.saldo) +
        " · " + plural(dinheiro.contratacoes, "contratação", "contratações");
      marco.appendChild(linhaMercado);
    }

    // Temporada ainda sem nenhum registro
    if (campeonatos.length === 0 && jogosDe(campanha) === 0 && utilizados === 0 && transferencias.length === 0 && eventos.length === 0) {
      const vazio = document.createElement("div");
      vazio.className = "marco-linha";
      vazio.textContent = "Ainda sem registros nessa temporada.";
      marco.appendChild(vazio);
    }

    areaLinhaTempo.appendChild(marco);
  });
}

// ---------- Gráficos de evolução ----------

const SVG_NS = "http://www.w3.org/2000/svg";

function criarSvg(tag, atributos) {
  const elemento = document.createElementNS(SVG_NS, tag);

  Object.keys(atributos || {}).forEach(function (chave) {
    elemento.setAttribute(chave, atributos[chave]);
  });

  return elemento;
}

function criarTextoSvg(texto, atributos) {
  const elemento = criarSvg("text", atributos);
  elemento.textContent = texto;
  return elemento;
}

// Arredonda pra cima pra um número "redondo" (1, 2, 5, 10, 20, 50, 100...)
function maximoBonito(valor) {
  if (valor <= 0) return 1;

  const potencia = Math.pow(10, Math.floor(Math.log10(valor)));
  const fracao = valor / potencia;
  let bonito = 10;

  if (fracao <= 1) bonito = 1;
  else if (fracao <= 2) bonito = 2;
  else if (fracao <= 5) bonito = 5;

  return bonito * potencia;
}

function numeroLimpo(valor) {
  return String(Number(valor.toFixed(2)));
}

// Desenha um gráfico de colunas. Cada categoria (temporada) pode ter várias séries.
// config: { categorias, series: [{ nome, cor, valores, corPorValor }],
//           formatar, maximoFixo, inteiro, sufixoEixo }
function criarGrafico(config) {
  const categorias = config.categorias;
  const series = config.series;
  const formatar = config.formatar || numeroLimpo;

  const larguraGrupo = series.length > 1 ? 84 : 58;
  const margem = { esquerda: 46, direita: 12, topo: 24, base: 30 };
  const larguraNecessaria = margem.esquerda + margem.direita + categorias.length * larguraGrupo;
  const largura = Math.max(380, larguraNecessaria);
  const altura = 230;
  const alturaArea = altura - margem.topo - margem.base;

  // Descobre o maior e o menor valor pra montar a escala
  let maior = 0;
  let menor = 0;
  series.forEach(function (serie) {
    serie.valores.forEach(function (valor) {
      if (valor === null) return;
      maior = Math.max(maior, valor);
      menor = Math.min(menor, valor);
    });
  });

  let topo;
  let fundo;

  if (config.maximoFixo !== undefined) {
    topo = config.maximoFixo;
    fundo = 0;
  } else if (menor < 0) {
    // Tem valor negativo: o zero fica no meio, com a mesma escala pros dois lados
    const limite = maximoBonito(Math.max(maior, -menor));
    topo = maior > 0 ? limite : 0;
    fundo = -limite;
  } else if (config.inteiro) {
    topo = Math.max(4, Math.ceil(maior / 4) * 4);
    fundo = 0;
  } else {
    topo = maximoBonito(maior);
    fundo = 0;
  }

  const faixa = topo - fundo;

  function posicaoY(valor) {
    return margem.topo + ((topo - valor) / faixa) * alturaArea;
  }

  const svg = criarSvg("svg", {
    "class": "grafico-svg",
    viewBox: "0 0 " + largura + " " + altura,
    role: "img"
  });
  svg.style.width = "100%";
  svg.style.minWidth = larguraNecessaria + "px";

  // Linhas de grade e números do eixo (4 intervalos)
  for (let i = 0; i <= 4; i++) {
    const valor = fundo + (faixa * i) / 4;
    const y = posicaoY(valor);

    svg.appendChild(criarSvg("line", {
      "class": valor === 0 && fundo < 0 ? "zero" : "grade",
      x1: margem.esquerda, x2: largura - margem.direita, y1: y, y2: y
    }));

    svg.appendChild(criarTextoSvg(numeroLimpo(valor) + (config.sufixoEixo || ""), {
      x: margem.esquerda - 6, y: y + 4, "text-anchor": "end"
    }));
  }

  // Colunas
  const folga = 4;
  const larguraColuna = Math.min(34, (larguraGrupo * 0.72) / series.length);
  const larguraTotal = larguraColuna * series.length + folga * (series.length - 1);
  const linhaZero = posicaoY(0);

  categorias.forEach(function (categoria, i) {
    const inicioGrupo = margem.esquerda + i * larguraGrupo;
    const inicio = inicioGrupo + (larguraGrupo - larguraTotal) / 2;

    series.forEach(function (serie, j) {
      const valor = serie.valores[i];
      const x = inicio + j * (larguraColuna + folga);
      const meio = x + larguraColuna / 2;

      if (valor === null) {
        svg.appendChild(criarTextoSvg("-", { "class": "valor", x: meio, y: linhaZero - 4, "text-anchor": "middle" }));
        return;
      }

      const yValor = posicaoY(valor);
      const cor = serie.corPorValor ? serie.corPorValor(valor) : serie.cor;

      if (valor !== 0) {
        svg.appendChild(criarSvg("rect", {
          x: x,
          y: Math.min(yValor, linhaZero),
          width: larguraColuna,
          height: Math.max(1, Math.abs(yValor - linhaZero)),
          rx: 3,
          fill: cor
        }));
      }

      svg.appendChild(criarTextoSvg(formatar(valor), {
        "class": "valor",
        x: meio,
        y: valor >= 0 ? yValor - 5 : yValor + 13,
        "text-anchor": "middle"
      }));
    });

    // Nome da temporada embaixo
    svg.appendChild(criarTextoSvg(categoria, {
      x: inicioGrupo + larguraGrupo / 2, y: altura - 10, "text-anchor": "middle"
    }));
  });

  return svg;
}

function criarCartaoGrafico(titulo, config) {
  const cartao = document.createElement("div");
  cartao.className = "grafico-cartao";

  const cabecalho = document.createElement("h3");
  cabecalho.textContent = titulo;
  cartao.appendChild(cabecalho);

  // Legenda (só quando tem mais de uma série)
  if (config.series.length > 1) {
    const legenda = document.createElement("div");
    legenda.className = "legenda";

    config.series.forEach(function (serie) {
      const item = document.createElement("span");
      const quadrado = document.createElement("i");
      quadrado.style.backgroundColor = serie.cor;
      item.appendChild(quadrado);
      item.appendChild(document.createTextNode(serie.nome));
      legenda.appendChild(item);
    });

    cartao.appendChild(legenda);
  }

  const rolagem = document.createElement("div");
  rolagem.className = "rolagem-horizontal";
  rolagem.appendChild(criarGrafico(config));
  cartao.appendChild(rolagem);

  return cartao;
}

function mostrarGraficos() {
  const save = saves[saveAberto];
  areaGraficos.innerHTML = "";

  if (save.temporadas.length === 0) {
    areaGraficos.innerHTML = '<p class="texto-vazio">Crie uma temporada pra ver os gráficos.</p>';
    return;
  }

  const temporadas = save.temporadas;
  const porTemporada = titulosPorTemporada(save);

  // Os números de cada temporada, na ordem
  const campanhas = temporadas.map(function (temporada) {
    return totalDaTemporada(save, temporada);
  });

  const dinheiro = temporadas.map(function (temporada) {
    return resumoFinanceiro(transferenciasDaTemporada(save, temporada));
  });

  const aproveitamentos = campanhas.map(function (campanha) {
    const jogos = jogosDe(campanha);
    if (jogos === 0) return null; // sem jogos, sem coluna
    return ((campanha.vitorias * 3 + campanha.empates) / (jogos * 3)) * 100;
  });

  const utilizados = temporadas.map(function (temporada) {
    return dadosDoHall(save, [temporada]).filter(function (j) {
      return j.jogos > 0;
    }).length;
  });

  const VERDE = "#38d98a";
  const VERMELHO = "#ff7070";
  const DOURADO = "#f4c152";
  const AZUL = "#46c7e8";

  areaGraficos.appendChild(criarCartaoGrafico("Aproveitamento por temporada", {
    categorias: temporadas,
    series: [{ nome: "Aproveitamento", cor: VERDE, valores: aproveitamentos }],
    maximoFixo: 100,
    sufixoEixo: "%",
    formatar: function (valor) { return Math.round(valor) + "%"; }
  }));

  areaGraficos.appendChild(criarCartaoGrafico("Títulos por temporada", {
    categorias: temporadas,
    series: [{
      nome: "Títulos", cor: DOURADO,
      valores: temporadas.map(function (temporada) { return porTemporada[temporada]; })
    }],
    inteiro: true
  }));

  areaGraficos.appendChild(criarCartaoGrafico("Gols marcados e sofridos", {
    categorias: temporadas,
    series: [
      { nome: "Marcados", cor: VERDE, valores: campanhas.map(function (c) { return c.golsPro; }) },
      { nome: "Sofridos", cor: VERMELHO, valores: campanhas.map(function (c) { return c.golsContra; }) }
    ]
  }));

  if (!ehSelecao(save)) {
  areaGraficos.appendChild(criarCartaoGrafico("Gastos e vendas (€ mi)", {
    categorias: temporadas,
    series: [
      { nome: "Gastos com compras", cor: VERMELHO, valores: dinheiro.map(function (d) { return d.gastos; }) },
      { nome: "Ganhos com vendas", cor: VERDE, valores: dinheiro.map(function (d) { return d.ganhos; }) }
    ]
  }));

  areaGraficos.appendChild(criarCartaoGrafico("Saldo de transferências (€ mi)", {
    categorias: temporadas,
    series: [{
      nome: "Saldo",
      cor: VERDE,
      valores: dinheiro.map(function (d) { return d.saldo; }),
      corPorValor: function (valor) { return valor < 0 ? VERMELHO : VERDE; }
    }],
    formatar: function (valor) { return (valor > 0 ? "+" : "") + numeroLimpo(valor); }
  }));
  }

  areaGraficos.appendChild(criarCartaoGrafico("Jogadores utilizados", {
    categorias: temporadas,
    series: [{ nome: "Jogadores utilizados", cor: AZUL, valores: utilizados }],
    inteiro: true
  }));
}

// ---------- Sala de Troféus ----------

// Ícone de troféu dourado (desenhado direto, sem imagem)
function criarIconeTrofeu() {
  const svg = criarSvg("svg", {
    "class": "icone-trofeu",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#f4c152",
    "stroke-width": "1.8",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true"
  });

  svg.appendChild(criarSvg("path", { d: "M7 4h10v5a5 5 0 0 1-10 0V4z", fill: "rgba(251, 191, 36, 0.25)" }));
  svg.appendChild(criarSvg("path", { d: "M7 6H4v2a3 3 0 0 0 3 3" }));
  svg.appendChild(criarSvg("path", { d: "M17 6h3v2a3 3 0 0 1-3 3" }));
  svg.appendChild(criarSvg("path", { d: "M12 14v3" }));
  svg.appendChild(criarSvg("path", { d: "M9 20h6M10 17h4v3h-4z" }));

  return svg;
}

function mostrarTrofeus() {
  const save = saves[saveAberto];
  areaTrofeus.innerHTML = "";

  // Todos os títulos, do mais antigo pro mais recente
  const porTemporada = [];
  const porCompeticao = {};
  let total = 0;

  save.temporadas.forEach(function (temporada) {
    const ganhos = listaDaTemporada(save, temporada).filter(function (campeonato) {
      return campeonato.resultado === "Campeão";
    });

    if (ganhos.length === 0) return;

    porTemporada.push({ temporada: temporada, titulos: ganhos });

    ganhos.forEach(function (campeonato) {
      porCompeticao[campeonato.nome] = (porCompeticao[campeonato.nome] || 0) + 1;
      total++;
    });
  });

  if (total === 0) {
    areaTrofeus.innerHTML =
      '<p class="texto-vazio">Nenhum título ainda. Quando você marcar um campeonato como "Campeão" na aba Competições, ele aparece aqui.</p>';
    return;
  }

  // ----- Destaque: total de títulos -----
  const destaque = document.createElement("div");
  destaque.className = "trofeus-destaque";
  destaque.appendChild(criarIconeTrofeu());

  const textos = document.createElement("div");

  const numero = document.createElement("div");
  numero.className = "trofeus-total";
  numero.textContent = plural(total, "título", "títulos");
  textos.appendChild(numero);

  const legenda = document.createElement("div");
  legenda.className = "trofeus-legenda";
  legenda.textContent = "em " + plural(porTemporada.length, "temporada com título", "temporadas com título");
  textos.appendChild(legenda);

  destaque.appendChild(textos);
  areaTrofeus.appendChild(destaque);

  // ----- Quantos de cada competição (o que mais ganhou primeiro) -----
  const resumo = document.createElement("div");
  resumo.className = "trofeus-resumo";

  Object.keys(porCompeticao)
    .sort(function (a, b) {
      return porCompeticao[b] - porCompeticao[a] || a.localeCompare(b, "pt");
    })
    .forEach(function (nome) {
      resumo.appendChild(criarTag(nome + " × " + porCompeticao[nome], true));
    });

  areaTrofeus.appendChild(resumo);

  // ----- Um bloco por temporada -----
  porTemporada.forEach(function (bloco) {
    const secao = document.createElement("div");
    secao.className = "trofeus-temporada";

    const titulo = document.createElement("h3");
    titulo.textContent = bloco.temporada;
    secao.appendChild(titulo);

    const grade = document.createElement("div");
    grade.className = "grade-trofeus";

    bloco.titulos.forEach(function (campeonato) {
      const cartao = document.createElement("div");
      cartao.className = "trofeu";
      cartao.appendChild(criarIconeTrofeu());

      const nome = document.createElement("span");
      nome.className = "trofeu-nome";
      nome.textContent = campeonato.nome;
      cartao.appendChild(nome);

      grade.appendChild(cartao);
    });

    secao.appendChild(grade);
    areaTrofeus.appendChild(secao);
  });
}

// ---------- Aproveitamento tático ----------

const formTatica = document.getElementById("form-tatica");
const formacaoTatica = document.getElementById("formacao-tatica");
const estiloTatica = document.getElementById("estilo-tatica");
const vTatica = document.getElementById("v-tatica");
const eTatica = document.getElementById("e-tatica");
const dTatica = document.getElementById("d-tatica");
const botaoAddTatica = document.getElementById("btn-add-tatica");
const listaTaticas = document.getElementById("lista-taticas");
const tituloTaticas = document.getElementById("titulo-taticas");
const areaTaticasCombo = document.getElementById("area-taticas-combo");

function taticasDaTemporada(save, temporada) {
  if (save.taticas && save.taticas[temporada]) return save.taticas[temporada];
  return [];
}

// Registros da temporada escolhida (ou de todas, no Geral)
function taticasEscolhidas(save) {
  if (temporadaSelecionada !== "geral") return taticasDaTemporada(save, temporadaSelecionada);

  let todas = [];
  save.temporadas.forEach(function (temporada) {
    todas = todas.concat(taticasDaTemporada(save, temporada));
  });
  return todas;
}

// Junta os registros que têm o mesmo nome (ignora maiúsculas e acentos)
function agruparTaticas(lista, nomeDe) {
  const grupos = {};

  lista.forEach(function (registro) {
    const nome = nomeDe(registro);
    const chave = normalizar(nome);

    if (!grupos[chave]) grupos[chave] = { nome: nome, vitorias: 0, empates: 0, derrotas: 0 };

    grupos[chave].vitorias += numeroDe(registro.vitorias);
    grupos[chave].empates += numeroDe(registro.empates);
    grupos[chave].derrotas += numeroDe(registro.derrotas);
  });

  return Object.keys(grupos).map(function (chave) { return grupos[chave]; });
}

function pontosDe(grupo) {
  const jogos = jogosDe(grupo);
  return jogos === 0 ? 0 : (grupo.vitorias * 3 + grupo.empates) / (jogos * 3);
}

// Como a lista está ordenada agora (melhor aproveitamento primeiro)
let ordemTaticas = { coluna: "aproveit", direcao: "desc" };

const COLUNAS_TATICAS = [
  { chave: "nome", titulo: "Formação e estilo", texto: true },
  { chave: "jogos", titulo: "Jogos" },
  { chave: "vitorias", titulo: "V" },
  { chave: "empates", titulo: "E" },
  { chave: "derrotas", titulo: "D" },
  { chave: "aproveit", titulo: "Aproveit." }
];

function valorTatica(grupo, chave) {
  if (chave === "nome") return grupo.nome;
  if (chave === "jogos") return jogosDe(grupo);
  if (chave === "aproveit") return pontosDe(grupo);
  return grupo[chave];
}

function criarTabelaTaticas(area, grupos) {
  area.innerHTML = "";

  if (grupos.length === 0) {
    area.innerHTML = '<p class="texto-vazio">Ainda sem registros.</p>';
    return;
  }

  const fator = ordemTaticas.direcao === "asc" ? 1 : -1;

  grupos.sort(function (a, b) {
    const va = valorTatica(a, ordemTaticas.coluna);
    const vb = valorTatica(b, ordemTaticas.coluna);
    const resultado = ordemTaticas.coluna === "nome"
      ? String(va).localeCompare(String(vb), "pt") * fator
      : (va - vb) * fator;

    return resultado || pontosDe(b) - pontosDe(a) || a.nome.localeCompare(b.nome, "pt");
  });

  const tabela = document.createElement("table");
  tabela.className = "tabela-hall";

  const cabecalho = document.createElement("thead");
  const linhaCab = document.createElement("tr");
  linhaCab.appendChild(criarCelula("#", "th"));

  COLUNAS_TATICAS.forEach(function (coluna) {
    const celula = criarCelula(coluna.titulo, "th");
    celula.className = "ordenavel";
    celula.dataset.coluna = coluna.chave;
    if (coluna.texto) celula.classList.add("col-texto");

    if (ordemTaticas.coluna === coluna.chave) {
      celula.classList.add("ativa");
      celula.textContent = coluna.titulo + (ordemTaticas.direcao === "desc" ? " ▼" : " ▲");
    }

    linhaCab.appendChild(celula);
  });

  cabecalho.appendChild(linhaCab);
  tabela.appendChild(cabecalho);

  const corpo = document.createElement("tbody");

  grupos.forEach(function (grupo, indice) {
    const linha = document.createElement("tr");

    const posicao = criarCelula(indice + 1);
    if (indice < 3) posicao.className = "posicao-" + (indice + 1);
    linha.appendChild(posicao);

    COLUNAS_TATICAS.forEach(function (coluna) {
      const valor = coluna.chave === "aproveit" ? aproveitamentoDe(grupo) : valorTatica(grupo, coluna.chave);
      const celula = criarCelula(valor);

      if (coluna.texto) celula.className = "col-texto";
      if (ordemTaticas.coluna === coluna.chave) celula.classList.add("ordenada");

      linha.appendChild(celula);
    });

    corpo.appendChild(linha);
  });

  tabela.appendChild(corpo);
  area.appendChild(tabela);
}

areaTaticasCombo.addEventListener("click", function (evento) {
  const celula = evento.target.closest("th.ordenavel");
  if (!celula) return;

  const coluna = celula.dataset.coluna;

  if (ordemTaticas.coluna === coluna) {
    ordemTaticas.direcao = ordemTaticas.direcao === "desc" ? "asc" : "desc";
  } else {
    ordemTaticas.coluna = coluna;
    ordemTaticas.direcao = coluna === "nome" ? "asc" : "desc";
  }

  mostrarTaticas();
});

function mostrarTaticas() {
  const save = saves[saveAberto];
  const emGeral = temporadaSelecionada === "geral";

  tituloTaticas.textContent = emGeral
    ? "Aproveitamento tático · Geral"
    : "Aproveitamento tático · " + temporadaSelecionada;

  formTatica.classList.toggle("escondido", emGeral);
  listaTaticas.innerHTML = "";

  if (save.temporadas.length === 0) {
    listaTaticas.innerHTML = '<p class="texto-vazio">Crie uma temporada pra registrar as táticas.</p>';
  } else if (emGeral) {
    listaTaticas.innerHTML = '<p class="texto-vazio">Escolha uma temporada no seletor pra adicionar ou editar registros.</p>';
  } else {
    const registros = taticasDaTemporada(save, temporadaSelecionada);

    if (registros.length === 0) {
      listaTaticas.innerHTML = '<p class="texto-vazio">Nenhum registro nesta temporada.</p>';
    } else {
      const tabela = document.createElement("table");
      tabela.className = "tabela-hall";

      const cabecalho = document.createElement("thead");
      const linhaCab = document.createElement("tr");
      ["Formação", "Estilo", "V", "E", "D", "Aproveit.", ""].forEach(function (titulo, i) {
        const celula = criarCelula(titulo, "th");
        if (i < 2) celula.className = "col-texto";
        linhaCab.appendChild(celula);
      });
      cabecalho.appendChild(linhaCab);
      tabela.appendChild(cabecalho);

      const corpo = document.createElement("tbody");

      registros.forEach(function (registro) {
        const linha = document.createElement("tr");

        const formacao = criarCelula(registro.formacao || "-");
        formacao.className = "col-texto";
        linha.appendChild(formacao);

        const estilo = criarCelula(registro.estilo || "-");
        estilo.className = "col-texto";
        linha.appendChild(estilo);

        [["vitorias", "V"], ["empates", "E"], ["derrotas", "D"]].forEach(function (par) {
          const celula = document.createElement("td");
          const entrada = document.createElement("input");
          entrada.type = "number";
          entrada.className = "campo-stat";
          entrada.min = 0;
          entrada.step = 1;
          entrada.value = numeroDe(registro[par[0]]);
          entrada.dataset.id = registro.id;
          entrada.dataset.campo = par[0];
          entrada.title = par[1];
          celula.appendChild(entrada);
          linha.appendChild(celula);
        });

        linha.appendChild(criarCelula(aproveitamentoDe(somarCampanhas([registro]))));

        const acoes = document.createElement("td");
        const excluir = document.createElement("button");
        excluir.className = "btn-excluir";
        excluir.dataset.id = registro.id;
        excluir.textContent = "Excluir";
        acoes.appendChild(excluir);
        linha.appendChild(acoes);

        corpo.appendChild(linha);
      });

      tabela.appendChild(corpo);
      listaTaticas.appendChild(tabela);
    }
  }

  // Rankings (temporada escolhida ou geral)
  const lista = taticasEscolhidas(save);

  criarTabelaTaticas(areaTaticasCombo, agruparTaticas(
    lista.filter(function (r) { return r.formacao && r.estilo; }),
    function (r) { return r.formacao + " · " + r.estilo; }
  ));
}

botaoAddTatica.addEventListener("click", function () {
  const formacao = formacaoTatica.value.trim();
  const estilo = estiloTatica.value.trim();

  if (!formacao && !estilo) {
    alert("Digite a formação ou o estilo de jogo.");
    return;
  }

  const save = saves[saveAberto];
  if (!save.taticas) save.taticas = {};
  if (!save.taticas[temporadaSelecionada]) save.taticas[temporadaSelecionada] = [];

  function lerNumero(campo) {
    const n = Math.floor(parseFloat(campo.value));
    return isNaN(n) || n < 0 ? 0 : n;
  }

  save.taticas[temporadaSelecionada].push({
    id: Date.now(),
    formacao: formacao,
    estilo: estilo,
    vitorias: lerNumero(vTatica),
    empates: lerNumero(eTatica),
    derrotas: lerNumero(dTatica)
  });

  formacaoTatica.value = "";
  estiloTatica.value = "";
  vTatica.value = "";
  eTatica.value = "";
  dTatica.value = "";
  guardarSaves();
  mostrarTaticas();
});

listaTaticas.addEventListener("change", function (evento) {
  const entrada = evento.target;
  if (!entrada.classList.contains("campo-stat")) return;

  const save = saves[saveAberto];
  const registro = taticasDaTemporada(save, temporadaSelecionada).find(function (r) {
    return r.id === Number(entrada.dataset.id);
  });
  if (!registro) return;

  let valor = Math.floor(parseFloat(entrada.value));
  if (isNaN(valor) || valor < 0) valor = 0;

  registro[entrada.dataset.campo] = valor;
  guardarSaves();
  mostrarTaticas();
});

listaTaticas.addEventListener("click", function (evento) {
  const botao = evento.target;
  if (!botao.classList.contains("btn-excluir")) return;

  if (!confirm("Excluir este registro?")) return;

  const save = saves[saveAberto];
  const id = Number(botao.dataset.id);
  save.taticas[temporadaSelecionada] = taticasDaTemporada(save, temporadaSelecionada).filter(function (r) {
    return r.id !== id;
  });
  guardarSaves();
  mostrarTaticas();
});

// ---------- Mural de Ídolos ----------

const areaIdoloEscolhido = document.getElementById("area-idolo-escolhido");
const areaIdolosAuto = document.getElementById("area-idolos-auto");
const nomeIdolo = document.getElementById("nome-idolo");
const motivoIdolo = document.getElementById("motivo-idolo");
const sugestoesIdolo = document.getElementById("sugestoes-idolo");
const botaoSalvarIdolo = document.getElementById("btn-salvar-idolo");

const MINIMO_JOGOS_NOTA = 10;

const CATEGORIAS_IDOLOS = [
  { titulo: "Maior artilheiro", chave: "gols", singular: "gol", pluralTexto: "gols" },
  { titulo: "Mais jogos pelo clube", chave: "jogos", singular: "jogo", pluralTexto: "jogos" },
  { titulo: "Maior garçom", chave: "assistencias", singular: "assistência", pluralTexto: "assistências" },
  { titulo: "Mais temporadas no clube", chave: "temporadas", singular: "temporada", pluralTexto: "temporadas" },
  { titulo: "Melhor nota média", chave: "nota", minimoJogos: MINIMO_JOGOS_NOTA }
];

function valorIdolo(registro, categoria) {
  return categoria.chave === "nota" ? Number(registro.nota.toFixed(2)) : registro[categoria.chave];
}

function mostrarIdolos() {
  const save = saves[saveAberto];
  const registros = dadosDoHall(save, save.temporadas);

  // Sugestões do campo: jogadores do elenco
  sugestoesIdolo.innerHTML = "";
  save.jogadores.forEach(function (jogador) {
    const opcao = document.createElement("option");
    opcao.value = jogador.nome;
    sugestoesIdolo.appendChild(opcao);
  });

  // ----- Ídolo escolhido pelo treinador -----
  areaIdoloEscolhido.innerHTML = "";

  if (save.idolo && save.idolo.nome) {
    const idolo = save.idolo;
    const dados = registros.find(function (r) {
      return normalizar(r.nome) === normalizar(idolo.nome);
    });

    const caixa = document.createElement("div");
    caixa.className = "idolo-destaque";

    const avatar = document.createElement("div");
    avatar.className = "idolo-avatar";
    avatar.textContent = iniciaisDe(idolo.nome);
    caixa.appendChild(avatar);

    const textos = document.createElement("div");
    textos.className = "idolo-textos";

    const nome = document.createElement("div");
    nome.className = "idolo-nome";
    nome.textContent = idolo.nome;
    textos.appendChild(nome);

    if (dados) {
      const detalhe = document.createElement("div");
      detalhe.className = "idolo-detalhe";
      detalhe.textContent = dados.posicao + " · " + plural(dados.jogos, "jogo", "jogos") + " · " +
        plural(dados.gols, "gol", "gols") + " · " + plural(dados.assistencias, "assistência", "assistências");
      textos.appendChild(detalhe);
    }

    if (idolo.motivo) {
      const motivo = document.createElement("div");
      motivo.className = "idolo-motivo";
      motivo.textContent = "“" + idolo.motivo + "”";
      textos.appendChild(motivo);
    }

    const remover = document.createElement("button");
    remover.className = "btn-excluir";
    remover.id = "btn-remover-idolo";
    remover.textContent = "Remover";
    textos.appendChild(remover);

    caixa.appendChild(textos);
    areaIdoloEscolhido.appendChild(caixa);

    nomeIdolo.value = idolo.nome;
    motivoIdolo.value = idolo.motivo || "";
  } else {
    areaIdoloEscolhido.innerHTML = '<p class="texto-vazio">Você ainda não escolheu seu ídolo. Digite o nome abaixo.</p>';
    nomeIdolo.value = "";
    motivoIdolo.value = "";
  }

  // ----- Ídolos pelos números -----
  areaIdolosAuto.innerHTML = "";

  if (save.temporadas.length === 0 || save.jogadores.length === 0) {
    areaIdolosAuto.innerHTML = '<p class="texto-vazio">Cadastre jogadores e temporadas pra ver os ídolos pelos números.</p>';
    return;
  }

  CATEGORIAS_IDOLOS.forEach(function (categoria) {
    let candidatos = registros;

    if (categoria.minimoJogos) {
      candidatos = registros.filter(function (r) { return r.jogos >= categoria.minimoJogos; });
    }

    let melhor = 0;
    candidatos.forEach(function (r) {
      const valor = valorIdolo(r, categoria);
      if (valor > melhor) melhor = valor;
    });

    if (melhor <= 0) {
      const aviso = categoria.minimoJogos
        ? "Precisa de " + categoria.minimoJogos + "+ jogos"
        : "Ainda sem registros";
      areaIdolosAuto.appendChild(criarCartao(categoria.titulo, "-", aviso));
      return;
    }

    const nomes = candidatos
      .filter(function (r) { return valorIdolo(r, categoria) === melhor; })
      .map(function (r) { return r.nome; })
      .join(", ");

    const detalhe = categoria.chave === "nota"
      ? formatarNota(melhor) + " de média (" + categoria.minimoJogos + "+ jogos)"
      : plural(melhor, categoria.singular, categoria.pluralTexto);

    areaIdolosAuto.appendChild(criarCartao(categoria.titulo, nomes, detalhe));
  });
}

botaoSalvarIdolo.addEventListener("click", function () {
  const nome = nomeIdolo.value.trim();

  if (!nome) {
    alert("Digite o nome do seu ídolo.");
    return;
  }

  saves[saveAberto].idolo = { nome: nome, motivo: motivoIdolo.value.trim() };
  guardarSaves();
  mostrarIdolos();
});

areaIdoloEscolhido.addEventListener("click", function (evento) {
  if (evento.target.id !== "btn-remover-idolo") return;

  if (confirm("Remover o ídolo escolhido?")) {
    delete saves[saveAberto].idolo;
    guardarSaves();
    mostrarIdolos();
  }
});

// ---------- Resumo do clube ----------

function criarCartao(titulo, valor, detalhe, classe) {
  const cartao = document.createElement("div");
  cartao.className = "cartao";

  const rotulo = document.createElement("span");
  rotulo.textContent = titulo;
  cartao.appendChild(rotulo);

  const principal = document.createElement("strong");
  principal.textContent = valor;
  if (classe) principal.classList.add(classe);
  cartao.appendChild(principal);

  if (detalhe) {
    const secundario = document.createElement("small");
    secundario.textContent = detalhe;
    cartao.appendChild(secundario);
  }

  return cartao;
}

function mostrarResumo() {
  const save = saves[saveAberto];
  const emGeral = temporadaSelecionada === "geral";
  const temporadas = emGeral ? save.temporadas : [temporadaSelecionada];

  cartoesResumo.innerHTML = "";

  notaResumo.textContent = emGeral
    ? "Resumo de todas as temporadas"
    : "Resumo da temporada " + temporadaSelecionada;

  // Campanha do time (somada a partir dos campeonatos das temporadas escolhidas)
  const campanha = somarCampanhas(temporadas.map(function (temporada) {
    return totalDaTemporada(save, temporada);
  }));

  const jogos = jogosDe(campanha);
  const aproveitamento = aproveitamentoDe(campanha);

  // Títulos conquistados
  const titulos = [];
  temporadas.forEach(function (temporada) {
    listaDaTemporada(save, temporada).forEach(function (campeonato) {
      if (campeonato.resultado === "Campeão") {
        titulos.push({ temporada: temporada, nome: campeonato.nome });
      }
    });
  });

  // Maior artilheiro nas temporadas escolhidas
  let artilheiro = "";
  let maisGols = 0;
  save.jogadores.forEach(function (jogador) {
    const total = somarStats(jogador, temporadas);
    if (total.gols > maisGols) {
      maisGols = total.gols;
      artilheiro = jogador.nome;
    }
  });

  // Dinheiro das transferências
  const dinheiro = resumoFinanceiro(todasTransferencias(save, temporadas));
  const gastos = dinheiro.gastos;
  const ganhos = dinheiro.ganhos;
  const saldo = dinheiro.saldo;
  const classeSaldo = classeDoSaldo(saldo);

  if (emGeral) {
    cartoesResumo.appendChild(criarCartao("Temporadas jogadas", save.temporadas.length));
  }
  cartoesResumo.appendChild(criarCartao("Títulos", titulos.length));
  cartoesResumo.appendChild(criarCartao(
    "Jogos", jogos,
    campanha.vitorias + "V · " + campanha.empates + "E · " + campanha.derrotas + "D"
  ));
  cartoesResumo.appendChild(criarCartao("Aproveitamento", aproveitamento));
  cartoesResumo.appendChild(criarCartao("Gols marcados", campanha.golsPro));
  cartoesResumo.appendChild(criarCartao("Gols sofridos", campanha.golsContra));
  cartoesResumo.appendChild(criarCartao(
    "Maior artilheiro",
    artilheiro || "-",
    maisGols > 0 ? maisGols + (maisGols === 1 ? " gol" : " gols") : ""
  ));
  if (!ehSelecao(save)) {
    cartoesResumo.appendChild(criarCartao("Gastos com compras", formatarDinheiro(gastos)));
    cartoesResumo.appendChild(criarCartao("Ganhos com vendas", formatarDinheiro(ganhos)));
    cartoesResumo.appendChild(criarCartao("Saldo de transferências", formatarSaldo(saldo), "", classeSaldo));
    cartoesResumo.appendChild(criarCartao("Contratações", dinheiro.contratacoes));
  }

}

// ---------- Abas ----------

const botoesAba = document.querySelectorAll(".aba");
const paineisAba = document.querySelectorAll(".painel-aba");

// ----- Menu: coluna fixa no computador, painel deslizante (hambúrguer) no celular -----

const menuLateral = document.getElementById("menu-lateral");
const fundoMenu = document.getElementById("fundo-menu");
const botaoMenu = document.getElementById("btn-menu");
const botaoFecharMenu = document.getElementById("btn-fechar-menu");
const tituloAbaAtual = document.getElementById("titulo-aba-atual");

function abrirMenu() {
  menuLateral.classList.add("aberto");
  fundoMenu.classList.add("visivel");
  botaoMenu.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-aberto");

  // Leva o foco do teclado pra dentro do painel
  const ativa = menuLateral.querySelector(".aba.ativa");
  if (ativa) ativa.focus();
}

function fecharMenu() {
  const estavaAberto = menuLateral.classList.contains("aberto");

  menuLateral.classList.remove("aberto");
  fundoMenu.classList.remove("visivel");
  botaoMenu.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-aberto");

  // Devolve o foco pro botão das três barrinhas
  if (estavaAberto) botaoMenu.focus();
}

botaoMenu.addEventListener("click", abrirMenu);
botaoFecharMenu.addEventListener("click", fecharMenu);
fundoMenu.addEventListener("click", fecharMenu);

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") fecharMenu();
});

// Se a tela virar "computador" (por exemplo, girou o celular), o painel fecha sozinho
if (window.matchMedia) {
  const consultaComputador = window.matchMedia("(min-width: 900px)");
  const aoMudarTamanho = function (evento) {
    if (evento.matches) fecharMenu();
  };

  if (consultaComputador.addEventListener) {
    consultaComputador.addEventListener("change", aoMudarTamanho);
  } else if (consultaComputador.addListener) {
    consultaComputador.addListener(aoMudarTamanho);
  }
}

// ---------- Anotações por temporada ----------

const areaAnotacoes = document.getElementById("area-anotacoes");

function mostrarAnotacoes() {
  const save = saves[saveAberto];
  areaAnotacoes.innerHTML = "";

  if (save.temporadas.length === 0) {
    areaAnotacoes.innerHTML = '<p class="texto-vazio">Crie uma temporada pra escrever anotações.</p>';
    return;
  }

  const idDoSave = save.id;
  const notas = save.notas || {};

  // A temporada mais nova primeiro
  save.temporadas.slice().reverse().forEach(function (temporada) {
    const bloco = document.createElement("div");
    bloco.className = "nota-bloco";

    const titulo = document.createElement("h3");
    titulo.textContent = temporada;
    bloco.appendChild(titulo);

    const campo = document.createElement("textarea");
    campo.rows = 4;
    campo.maxLength = 3000;
    campo.placeholder = "O que marcou essa temporada?";
    campo.value = notas[temporada] || "";
    bloco.appendChild(campo);

    const estado = document.createElement("small");
    estado.className = "nota-estado";
    bloco.appendChild(estado);

    let temporizador = null;

    function gravar() {
      clearTimeout(temporizador);
      temporizador = null;

      // Acha o save de novo (a lista pode ter sido atualizada pela nuvem)
      const atual = saves.find(function (s) { return s.id === idDoSave; });
      if (!atual || !atual.temporadas.includes(temporada)) return;

      if (!atual.notas) atual.notas = {};
      if (campo.value.trim()) atual.notas[temporada] = campo.value;
      else delete atual.notas[temporada];

      guardarSaves();
      estado.textContent = "Salvo";
    }

    campo.addEventListener("input", function () {
      estado.textContent = "Salvando...";
      clearTimeout(temporizador);
      temporizador = setTimeout(gravar, 500);
    });
    campo.addEventListener("blur", function () {
      if (temporizador !== null) gravar();
    });

    areaAnotacoes.appendChild(bloco);
  });
}

// ---------- Comparar temporadas ----------

const comparaA = document.getElementById("comparar-a");
const comparaB = document.getElementById("comparar-b");
const areaComparar = document.getElementById("area-comparar");

function numeroDaTemporadaParaComparar(save, temporada) {
  const camp = totalDaTemporada(save, temporada);
  const jogos = jogosDe(camp);
  const jogadores = dadosDoHall(save, [temporada]);
  const fin = resumoFinanceiro(transferenciasDaTemporada(save, temporada));

  return {
    camp: camp,
    jogos: jogos,
    aproveitamento: jogos > 0 ? ((camp.vitorias * 3 + camp.empates) / (jogos * 3)) * 100 : null,
    titulos: titulosPorTemporada(save)[temporada],
    utilizados: jogadores.filter(function (j) { return j.jogos > 0; }).length,
    artilheiro: maioresDe(jogadores, function (j) { return j.gols; }),
    garcom: maioresDe(jogadores, function (j) { return j.assistencias; }),
    fin: fin
  };
}

function textoDoRecorde(recorde, unidadeSingular, unidadePlural) {
  if (recorde.valor <= 0) return "-";

  let nomes = recorde.nomes.slice(0, 2).join(", ");
  if (recorde.nomes.length > 2) nomes += " +" + (recorde.nomes.length - 2);

  return nomes + " (" + plural(recorde.valor, unidadeSingular, unidadePlural) + ")";
}

function preencherSeletoresComparar() {
  const save = saves[saveAberto];
  const antigoA = comparaA.value;
  const antigoB = comparaB.value;

  [comparaA, comparaB].forEach(function (seletor) {
    seletor.innerHTML = "";
    save.temporadas.forEach(function (temporada) {
      const opcao = document.createElement("option");
      opcao.value = temporada;
      opcao.textContent = temporada;
      seletor.appendChild(opcao);
    });
  });

  const n = save.temporadas.length;
  comparaA.value = save.temporadas.includes(antigoA) ? antigoA : save.temporadas[Math.max(n - 2, 0)];
  comparaB.value = save.temporadas.includes(antigoB) ? antigoB : save.temporadas[n - 1];
}

function mostrarComparar() {
  const save = saves[saveAberto];

  if (save.temporadas.length < 2) {
    comparaA.parentElement.classList.add("escondido");
    areaComparar.innerHTML = '<p class="texto-vazio">Crie pelo menos 2 temporadas pra comparar.</p>';
    return;
  }

  comparaA.parentElement.classList.remove("escondido");
  preencherSeletoresComparar();
  desenharComparacao();
}

function desenharComparacao() {
  const save = saves[saveAberto];
  const tA = comparaA.value;
  const tB = comparaB.value;
  areaComparar.innerHTML = "";

  if (!save.temporadas.includes(tA) || !save.temporadas.includes(tB)) return;

  const a = numeroDaTemporadaParaComparar(save, tA);
  const b = numeroDaTemporadaParaComparar(save, tB);
  const inteiro = function (v) { return String(v); };
  const dinheiro = function (v) { return formatarDinheiro(v); };

  // melhor: "maior" ou "menor" destaca quem foi melhor; sem isso, não destaca ninguém
  const linhas = [
    { r: "Jogos", a: a.jogos, b: b.jogos, f: inteiro },
    { r: "Vitórias", a: a.camp.vitorias, b: b.camp.vitorias, f: inteiro, melhor: "maior" },
    { r: "Empates", a: a.camp.empates, b: b.camp.empates, f: inteiro },
    { r: "Derrotas", a: a.camp.derrotas, b: b.camp.derrotas, f: inteiro, melhor: "menor" },
    { r: "Aproveitamento", a: a.aproveitamento, b: b.aproveitamento, f: function (v) { return Math.round(v) + "%"; }, melhor: "maior" },
    { r: "Gols marcados", a: a.camp.golsPro, b: b.camp.golsPro, f: inteiro, melhor: "maior" },
    { r: "Gols sofridos", a: a.camp.golsContra, b: b.camp.golsContra, f: inteiro, melhor: "menor" },
    { r: "Saldo de gols", a: a.camp.golsPro - a.camp.golsContra, b: b.camp.golsPro - b.camp.golsContra, f: function (v) { return (v > 0 ? "+" : "") + v; }, melhor: "maior" },
    { r: "Títulos", a: a.titulos, b: b.titulos, f: inteiro, melhor: "maior" },
    { r: "Jogadores utilizados", a: a.utilizados, b: b.utilizados, f: inteiro },
    { r: "Artilheiro", ta: textoDoRecorde(a.artilheiro, "gol", "gols"), tb: textoDoRecorde(b.artilheiro, "gol", "gols") },
    { r: "Mais assistências", ta: textoDoRecorde(a.garcom, "assistência", "assistências"), tb: textoDoRecorde(b.garcom, "assistência", "assistências") }
  ];

  if (!ehSelecao(save)) {
    linhas.push(
      { r: "Gastos com compras", a: a.fin.gastos, b: b.fin.gastos, f: dinheiro },
      { r: "Ganhos com vendas", a: a.fin.ganhos, b: b.fin.ganhos, f: dinheiro, melhor: "maior" },
      { r: "Saldo de transferências", a: a.fin.saldo, b: b.fin.saldo, f: formatarSaldo, melhor: "maior" }
    );
  }

  const tabela = document.createElement("table");
  tabela.className = "tabela-hall tabela-comparar";

  const cab = document.createElement("thead");
  const linhaCab = document.createElement("tr");
  linhaCab.appendChild(criarCelula("", "th"));
  linhaCab.appendChild(criarCelula(tA, "th"));
  linhaCab.appendChild(criarCelula(tB, "th"));
  cab.appendChild(linhaCab);
  tabela.appendChild(cab);

  const corpo = document.createElement("tbody");

  linhas.forEach(function (linha) {
    const tr = document.createElement("tr");
    const rotulo = criarCelula(linha.r);
    rotulo.className = "col-texto";
    tr.appendChild(rotulo);

    const celA = criarCelula(linha.ta !== undefined ? linha.ta : (linha.a === null ? "-" : linha.f(linha.a)));
    const celB = criarCelula(linha.tb !== undefined ? linha.tb : (linha.b === null ? "-" : linha.f(linha.b)));

    if (linha.melhor && linha.a !== null && linha.b !== null && linha.a !== linha.b) {
      const aGanha = linha.melhor === "maior" ? linha.a > linha.b : linha.a < linha.b;
      (aGanha ? celA : celB).classList.add("melhor");
    }

    tr.appendChild(celA);
    tr.appendChild(celB);
    corpo.appendChild(tr);
  });

  tabela.appendChild(corpo);
  areaComparar.appendChild(tabela);

  const nota = document.createElement("p");
  nota.className = "nota-resumo";
  nota.textContent = "O número em verde é o melhor da linha.";
  areaComparar.appendChild(nota);
}

comparaA.addEventListener("change", desenharComparacao);
comparaB.addEventListener("change", desenharComparacao);

function mostrarAba(nome) {
  botoesAba.forEach(function (botao) {
    const ativo = botao.dataset.aba === nome;
    botao.classList.toggle("ativa", ativo);
    if (ativo) tituloAbaAtual.textContent = botao.textContent;
  });

  fecharMenu(); // no celular, escolher uma aba fecha o painel

  paineisAba.forEach(function (painel) {
    painel.classList.toggle("escondido", painel.id !== "aba-" + nome);
  });

  // O resumo e os resultados são recalculados toda vez que você entra neles
  // O perfil do treinador só aparece no Resumo
  perfilTecnico.style.display = nome === "resumo" ? "" : "none";

  if (nome === "resumo") mostrarResumo();
  if (nome === "resultados") mostrarResultados();
  if (nome === "hall") mostrarHall();
  if (nome === "recordes") mostrarRecordes();
  if (nome === "trofeus") mostrarTrofeus();
  if (nome === "idolos") mostrarIdolos();
  if (nome === "taticas") mostrarTaticas();
  if (nome === "linha-tempo") mostrarLinhaDoTempo();
  if (nome === "graficos") mostrarGraficos();
  if (nome === "anotacoes") mostrarAnotacoes();
  if (nome === "comparar") mostrarComparar();
  if (nome !== "hall") buscaHall.value = "";
}

botoesAba.forEach(function (botao) {
  botao.addEventListener("click", function () {
    mostrarAba(botao.dataset.aba);
  });
});

// ---------- Tela do save: elenco ----------

function preencherPosicoes() {
  POSICOES.forEach(function (posicao) {
    const opcao = document.createElement("option");
    opcao.value = posicao;
    opcao.textContent = posicao;
    posicaoJogador.appendChild(opcao);
  });
}

function atualizarCabecalhoSave() {
  const save = saves[saveAberto];
  tituloSave.textContent = save.clube;
  tagLiga.textContent = ligaDoSave(save) || "Sem divisão";
  menuClube.textContent = save.clube;

  if (ehSelecao(save)) {
    tituloSave.textContent = rotuloSelecao(save.clube);
    menuClube.textContent = rotuloSelecao(save.clube);
  }

  montarAbasExtras();

  // Seleção não tem divisão editável nem transferências
  const selecao = ehSelecao(save);
  botaoEditarLiga.style.display = selecao ? "none" : "";
  menuLateral.querySelector('.aba[data-aba="transferencias"]').style.display = selecao ? "none" : "";

  mostrarPerfilTecnico();
}

// Um save novo já vem com o nome de treinador que você usou no save anterior
function nomeDoUltimoTreinador() {
  for (let i = saves.length - 1; i >= 0; i--) {
    const nome = saves[i].tecnico || saves[i].treinador;
    if (nome) return nome;
  }
  return "";
}

botaoEditarLiga.addEventListener("click", function () {
  const save = saves[saveAberto];
  const resposta = prompt("Divisão / liga atual do " + save.clube + ":", ligaDoSave(save));

  if (resposta === null) return;

  save.liga = resposta.trim();
  guardarSaves();
  atualizarCabecalhoSave();
});

function abrirSave(posicao) {
  saveAberto = posicao;
  const save = saves[saveAberto];
  idSaveAberto = save.id;

  // Saves criados em etapas anteriores ainda não têm esses campos
  if (!save.jogadores) save.jogadores = [];
  if (!save.temporadas) save.temporadas = [];
  guardarSaves();

  // Abre direto na temporada mais recente (ou no geral, se não tiver nenhuma)
  if (save.temporadas.length > 0) {
    temporadaSelecionada = save.temporadas[save.temporadas.length - 1];
  } else {
    temporadaSelecionada = "geral";
  }

  atualizarCabecalhoSave();
  mostrarAba("resumo");
  fecharFormularioJogador();
  preencherSeletorTemporada();
  mostrarElenco();

  telaInicial.classList.add("escondido");
  telaSave.classList.remove("escondido");
}

function voltarParaInicio() {
  fecharMenu();
  saveAberto = null;
  telaSave.classList.add("escondido");
  telaInicial.classList.remove("escondido");
  mostrarSaves();
}

function mostrarElenco() {
  mostrarResultados();
  mostrarCampeonatos();
  mostrarTransferencias();
  mostrarFinancas();
  mostrarTaticas();
  mostrarResumo();
  const save = saves[saveAberto];
  const jogadores = save.jogadores;
  const emGeral = temporadaSelecionada === "geral";
  corpoElenco.innerHTML = "";

  if (jogadores.length === 0) {
    tabelaElenco.classList.add("escondido");
    elencoVazio.classList.remove("escondido");
    return;
  }

  tabelaElenco.classList.remove("escondido");
  elencoVazio.classList.add("escondido");

  jogadores.forEach(function (jogador, i) {
    const linha = document.createElement("tr");

    const celulaNome = document.createElement("td");
    celulaNome.textContent = jogador.nome;
    linha.appendChild(celulaNome);

    const celulaPosicao = document.createElement("td");
    celulaPosicao.textContent = jogador.posicao;
    linha.appendChild(celulaPosicao);

    const idade = idadeNaTemporada(jogador, temporadaDeReferencia(save));
    const celulaIdade = document.createElement("td");
    celulaIdade.className = "celula-idade";
    celulaIdade.textContent = idade === null ? "-" : idade + " anos";
    linha.appendChild(celulaIdade);

    const stats = emGeral
      ? somarStats(jogador, save.temporadas)
      : lerStats(jogador, temporadaSelecionada);

    CAMPOS.forEach(function (campo) {
      const celula = document.createElement("td");
      celula.className = "celula-num";
      celula.dataset.rotulo = ROTULOS_STATS[campo];

      if (emGeral) {
        // No geral só mostra os totais, sem editar
        celula.textContent = campo === "nota" ? formatarNota(stats.nota) : stats[campo];
      } else {
        const entrada = document.createElement("input");
        entrada.type = "number";
        entrada.className = "campo-stat";
        entrada.min = 0;
        entrada.step = campo === "nota" ? "0.1" : "1";
        if (campo === "nota") entrada.max = 10;
        entrada.value = stats[campo];
        entrada.dataset.indice = i;
        entrada.dataset.campo = campo;
        celula.appendChild(entrada);
      }

      linha.appendChild(celula);
    });

    const celulaAcoes = document.createElement("td");
    celulaAcoes.className = "celula-acoes";
    celulaAcoes.innerHTML =
      '<div class="acoes" style="justify-content: flex-end">' +
      '<button class="btn-editar" data-indice="' + i + '">Editar</button>' +
      '<button class="btn-excluir" data-indice="' + i + '">Excluir</button>' +
      "</div>";
    linha.appendChild(celulaAcoes);

    corpoElenco.appendChild(linha);
  });
}

// ---------- Idade dos jogadores ----------
// A idade é guardada junto com a temporada em que você a digitou.
// Daí o app soma 1 ano a cada temporada nova, sem você precisar atualizar.

// "25/26" vira 25
function anoInicialDe(temporada) {
  return Number(String(temporada).split("/")[0]);
}

// A temporada usada pra mostrar a idade: a escolhida, ou a mais recente no Geral
function temporadaDeReferencia(save) {
  if (temporadaSelecionada !== "geral") return temporadaSelecionada;
  return save.temporadas.length > 0 ? save.temporadas[save.temporadas.length - 1] : null;
}

function idadeNaTemporada(jogador, temporada) {
  if (jogador.idade === null || jogador.idade === undefined || jogador.idade === "") return null;

  let idade = Number(jogador.idade);
  if (isNaN(idade)) return null;

  if (jogador.idadeTemporada && temporada) {
    let diferenca = anoInicialDe(temporada) - anoInicialDe(jogador.idadeTemporada);

    // Vira de século (99/00 e 00/01): ajusta a conta
    if (diferenca > 50) diferenca -= 100;
    if (diferenca < -50) diferenca += 100;

    idade += diferenca;
  }

  return idade >= 0 ? idade : null;
}

function abrirFormularioJogador(indice) {
  if (indice === null) {
    jogadorEditando = null;
    tituloFormJogador.textContent = "Novo jogador";
    nomeJogador.value = "";
    posicaoJogador.value = POSICOES[0];
    idadeJogador.value = "";
  } else {
    const jogador = saves[saveAberto].jogadores[indice];
    jogadorEditando = indice;
    tituloFormJogador.textContent = "Editar jogador";
    nomeJogador.value = jogador.nome;
    posicaoJogador.value = jogador.posicao;

    const idadeAtual = idadeNaTemporada(jogador, temporadaDeReferencia(saves[saveAberto]));
    idadeJogador.value = idadeAtual === null ? "" : idadeAtual;
  }

  formJogador.classList.remove("escondido");
  nomeJogador.focus();
}

function fecharFormularioJogador() {
  jogadorEditando = null;
  formJogador.classList.add("escondido");
}

botaoVoltar.addEventListener("click", voltarParaInicio);

botaoNovoJogador.addEventListener("click", function () {
  abrirFormularioJogador(null);
});

botaoCancelarJogador.addEventListener("click", fecharFormularioJogador);

botaoSalvarJogador.addEventListener("click", function () {
  const nome = nomeJogador.value.trim();

  if (!nome) {
    alert("Digite o nome do jogador.");
    return;
  }

  // Idade: opcional, mas se vier, precisa fazer sentido
  let idade = null;
  if (idadeJogador.value.trim() !== "") {
    idade = Math.floor(Number(idadeJogador.value));

    if (isNaN(idade) || idade < 10 || idade > 60) {
      alert("Digite uma idade entre 10 e 60 anos, ou deixe em branco.");
      return;
    }
  }

  const save = saves[saveAberto];
  const jogadores = save.jogadores;
  const referencia = idade === null ? null : temporadaDeReferencia(save);

  if (jogadorEditando === null) {
    jogadores.push({
      id: Date.now(),
      nome: nome,
      posicao: posicaoJogador.value,
      idade: idade,
      idadeTemporada: referencia,
      stats: {}
    });
  } else {
    jogadores[jogadorEditando].nome = nome;
    jogadores[jogadorEditando].posicao = posicaoJogador.value;
    jogadores[jogadorEditando].idade = idade;
    jogadores[jogadorEditando].idadeTemporada = referencia;
  }

  guardarSaves();
  mostrarElenco();
  fecharFormularioJogador();
});

corpoElenco.addEventListener("click", function (evento) {
  const botao = evento.target;
  const jogadores = saves[saveAberto].jogadores;

  if (botao.classList.contains("btn-editar")) {
    abrirFormularioJogador(Number(botao.dataset.indice));
  }

  if (botao.classList.contains("btn-excluir")) {
    const indice = Number(botao.dataset.indice);

    if (confirm("Excluir " + jogadores[indice].nome + " do elenco?")) {
      jogadores.splice(indice, 1);
      guardarSaves();
      mostrarElenco();
    }
  }
});

// Quando você muda um número da tabela, salva na hora
corpoElenco.addEventListener("change", function (evento) {
  const entrada = evento.target;

  if (!entrada.classList.contains("campo-stat")) return;

  const jogador = saves[saveAberto].jogadores[Number(entrada.dataset.indice)];
  const campo = entrada.dataset.campo;
  let valor = parseFloat(entrada.value);

  if (isNaN(valor) || valor < 0) valor = 0;

  if (campo === "nota") {
    if (valor > 10) valor = 10;
  } else {
    valor = Math.floor(valor);
  }

  entrada.value = valor;

  if (!jogador.stats) jogador.stats = {};
  if (!jogador.stats[temporadaSelecionada]) {
    jogador.stats[temporadaSelecionada] = lerStats(jogador, temporadaSelecionada);
  }

  jogador.stats[temporadaSelecionada][campo] = valor;
  guardarSaves();
});

// ---------- Login e sincronização com a nuvem ----------

const telaCarregando = document.getElementById("tela-carregando");
const textoCarregando = document.getElementById("texto-carregando");
const telaLogin = document.getElementById("tela-login");
const campoEmail = document.getElementById("login-email");
const campoSenha = document.getElementById("login-senha");
const mensagemLogin = document.getElementById("mensagem-login");
const botaoEntrar = document.getElementById("btn-entrar");
const botaoCriarConta = document.getElementById("btn-criar-conta");
const botaoEsqueci = document.getElementById("btn-esqueci");
const botaoVerSenha = document.getElementById("btn-ver-senha");
const emailConta = document.getElementById("email-conta");
const botaoSair = document.getElementById("btn-sair");
const botaoPerfil = document.getElementById("btn-perfil");
const menuPerfil = document.getElementById("menu-perfil");
const avatarLetra = document.getElementById("avatar-letra");
const avatarLetraGrande = document.getElementById("avatar-letra-grande");
const botaoSincronizar = document.getElementById("btn-sincronizar");
const botaoTrocarSenha = document.getElementById("btn-trocar-senha");
const infoPerfil = document.getElementById("info-perfil");
const statusNuvem = document.getElementById("status-nuvem");

let ultimoEnviado = {};       // id do save -> texto do que já está na nuvem
let temporizadorEnvio = null;
let enviando = false;
let envioPendente = false;

// Texto do save com as chaves em ordem fixa (pra comparar sem se confundir)
function textoEstavel(valor) {
  return JSON.stringify(valor, function (chave, v) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.keys(v).sort().reduce(function (novo, k) {
        novo[k] = v[k];
        return novo;
      }, {});
    }
    return v;
  });
}

function fotografiaDe(lista) {
  const mapa = {};
  lista.forEach(function (save) {
    mapa[save.id] = textoEstavel(save);
  });
  return mapa;
}

function mapasIguais(a, b) {
  const chavesA = Object.keys(a);
  if (chavesA.length !== Object.keys(b).length) return false;
  return chavesA.every(function (chave) {
    return a[chave] === b[chave];
  });
}

function lerSavesLocais() {
  try {
    return JSON.parse(localStorage.getItem("saves")) || [];
  } catch (erro) {
    return [];
  }
}

function definirStatus(texto, classe) {
  statusNuvem.textContent = texto;
  statusNuvem.className = "status-nuvem " + (classe || "");
}

// Espera 0,8 segundo depois da última mudança e manda tudo de uma vez
function agendarEnvio() {
  if (!window.Nuvem || !window.Nuvem.usuario()) return;

  localStorage.setItem("pendenteNuvem", "1");
  definirStatus("Salvando...", "salvando");

  clearTimeout(temporizadorEnvio);
  temporizadorEnvio = setTimeout(enviarParaNuvem, 800);
}

// Manda pra nuvem só os saves que mudaram (e apaga os que você excluiu)
async function enviarParaNuvem() {
  temporizadorEnvio = null;

  if (!window.Nuvem || !window.Nuvem.usuario()) return false;

  if (enviando) {
    envioPendente = true;
    return false;
  }

  enviando = true;
  let deuCerto = true;

  try {
    const idsAtuais = {};

    for (const save of saves) {
      const texto = textoEstavel(save);
      idsAtuais[save.id] = true;

      if (ultimoEnviado[save.id] !== texto) {
        await window.Nuvem.enviarSave(JSON.parse(JSON.stringify(save)));
        ultimoEnviado[save.id] = texto;
      }
    }

    for (const id in ultimoEnviado) {
      if (!idsAtuais[id]) {
        await window.Nuvem.apagarSave(id);
        delete ultimoEnviado[id];
      }
    }

    definirStatus("Sincronizado", "ok");
  } catch (erro) {
    console.error(erro);
    deuCerto = false;

    if (erro && erro.code === "permission-denied") {
      definirStatus("Sem permissão: confira as regras do Firestore", "erro");
    } else {
      definirStatus("Sem conexão: salvo só neste aparelho", "erro");
    }
  }

  enviando = false;

  if (envioPendente) {
    envioPendente = false;
    agendarEnvio();
  } else if (deuCerto) {
    localStorage.removeItem("pendenteNuvem");
  }

  return deuCerto;
}

// Traduz os erros do login pra português
function traduzirErro(erro) {
  const codigo = erro && erro.code;

  switch (codigo) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/missing-email":
      return "Digite o seu e-mail.";
    case "auth/missing-password":
      return "Digite a senha.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 6 caracteres.";
    case "auth/email-already-in-use":
      return "Já existe uma conta com esse e-mail. Clique em Entrar.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Espere um pouco e tente de novo.";
    case "auth/network-request-failed":
      return "Sem conexão com a internet.";
    case "auth/operation-not-allowed":
      return "Login por e-mail/senha desativado. Ative em Authentication > Sign-in method no Firebase.";
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    case "auth/invalid-api-key":
      return "A apiKey do firebase-config.js está errada. Copie ela de novo do console do Firebase.";
    default:
      return "Não deu certo (" + codigo + ").";
  }
}

function mostrarMensagemLogin(texto, ok) {
  mensagemLogin.textContent = texto;
  mensagemLogin.className = "mensagem-login" + (ok ? " ok" : "");
}

async function tentarLogin(acao) {
  const email = campoEmail.value.trim();
  const senha = campoSenha.value;

  mostrarMensagemLogin("", false);
  botaoEntrar.disabled = true;
  botaoCriarConta.disabled = true;

  try {
    if (acao === "entrar") {
      await window.Nuvem.entrar(email, senha);
    } else {
      await window.Nuvem.criarConta(email, senha);
    }
    campoSenha.value = "";
    esconderSenha();
  } catch (erro) {
    mostrarMensagemLogin(traduzirErro(erro), false);
  }

  botaoEntrar.disabled = false;
  botaoCriarConta.disabled = false;
}

botaoEntrar.addEventListener("click", function () {
  tentarLogin("entrar");
});

botaoCriarConta.addEventListener("click", function () {
  tentarLogin("criar");
});

campoSenha.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") tentarLogin("entrar");
});

// Olhinho: mostra ou esconde a senha que você está digitando
function esconderSenha() {
  campoSenha.type = "password";
  botaoVerSenha.classList.remove("ativo");
  botaoVerSenha.setAttribute("aria-label", "Mostrar senha");
  botaoVerSenha.title = "Mostrar senha";
}

botaoVerSenha.addEventListener("click", function () {
  const mostrando = campoSenha.type === "text";

  if (mostrando) {
    esconderSenha();
  } else {
    campoSenha.type = "text";
    botaoVerSenha.classList.add("ativo");
    botaoVerSenha.setAttribute("aria-label", "Esconder senha");
    botaoVerSenha.title = "Esconder senha";
  }

  campoSenha.focus();
});

botaoEsqueci.addEventListener("click", async function () {
  const email = campoEmail.value.trim();

  if (!email) {
    mostrarMensagemLogin("Digite o seu e-mail acima e clique de novo.", false);
    return;
  }

  try {
    await window.Nuvem.recuperarSenha(email);
    mostrarMensagemLogin("Enviei um e-mail pra " + email + " com o link pra criar uma senha nova.", true);
  } catch (erro) {
    mostrarMensagemLogin(traduzirErro(erro), false);
  }
});

// ----- Menu do perfil -----
function fecharMenuPerfil() {
  menuPerfil.classList.add("escondido");
  botaoPerfil.setAttribute("aria-expanded", "false");
}

botaoPerfil.addEventListener("click", function (evento) {
  evento.stopPropagation();
  const abrir = menuPerfil.classList.contains("escondido");
  infoPerfil.textContent = "";
  menuPerfil.classList.toggle("escondido", !abrir);
  botaoPerfil.setAttribute("aria-expanded", abrir ? "true" : "false");
});

document.addEventListener("click", function (evento) {
  if (!menuPerfil.contains(evento.target)) fecharMenuPerfil();
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") fecharMenuPerfil();
});

botaoSincronizar.addEventListener("click", async function () {
  botaoSincronizar.disabled = true;
  infoPerfil.textContent = "Sincronizando...";
  clearTimeout(temporizadorEnvio);

  const deuCerto = await enviarParaNuvem();

  infoPerfil.textContent = deuCerto ? "Tudo sincronizado." : "Não deu pra sincronizar agora.";
  botaoSincronizar.disabled = false;
});

botaoTrocarSenha.addEventListener("click", async function () {
  const email = emailConta.textContent;
  if (!email || !confirm("Enviar um e-mail pra " + email + " com o link pra criar uma senha nova?")) return;

  try {
    await window.Nuvem.recuperarSenha(email);
    infoPerfil.textContent = "E-mail enviado.";
  } catch (erro) {
    infoPerfil.textContent = traduzirErro(erro);
  }
});

botaoSair.addEventListener("click", async function () {
  clearTimeout(temporizadorEnvio);

  while (enviando) {
    await new Promise(function (resolver) {
      setTimeout(resolver, 200);
    });
  }

  const deuCerto = await enviarParaNuvem();

  if (!deuCerto && !confirm("Não consegui enviar as últimas alterações pra nuvem. Sair mesmo assim?")) {
    return;
  }

  localStorage.removeItem("saves");
  localStorage.removeItem("pendenteNuvem");
  await window.Nuvem.sair();
});

// Chamado pelo nuvem.js sempre que alguém entra ou sai
window.aoMudarLogin = async function (usuario) {
  telaCarregando.classList.add("escondido");

  if (!usuario) {
    saves = [];
    ultimoEnviado = {};
    saveAberto = null;
    idSaveAberto = null;
    telaInicial.classList.add("escondido");
    telaSave.classList.add("escondido");
    statusNuvem.classList.add("escondido");
    backupFlutuante.classList.add("escondido");
    fecharMenuBackup();
    telaLogin.classList.remove("escondido");
    return;
  }

  telaLogin.classList.add("escondido");
  backupFlutuante.classList.remove("escondido");
  emailConta.textContent = usuario.email;
  const letra = (usuario.email || "?").trim().charAt(0).toUpperCase();
  avatarLetra.textContent = letra;
  avatarLetraGrande.textContent = letra;
  fecharMenuPerfil();
  definirStatus("Carregando...", "salvando");

  const locais = lerSavesLocais();
  const temPendencia = localStorage.getItem("pendenteNuvem") === "1";

  try {
    const dados = await window.Nuvem.carregarSaves();

    if (temPendencia && locais.length > 0) {
      // Ficou alteração sem enviar (por falta de internet): vale a do aparelho
      saves = locais;
      ultimoEnviado = fotografiaDe(dados);
      agendarEnvio();
    } else if (dados.length === 0 && locais.length > 0 &&
               confirm("Encontrei " + locais.length + " save(s) guardado(s) neste navegador. Quer enviar pra sua conta?")) {
      // Primeiro login: leva os saves que já existiam neste navegador
      saves = locais;
      ultimoEnviado = {};
      agendarEnvio();
    } else {
      saves = dados;
      ultimoEnviado = fotografiaDe(dados);
      localStorage.setItem("saves", JSON.stringify(saves));
      definirStatus("Sincronizado", "ok");
    }
  } catch (erro) {
    console.error(erro);
    saves = locais;
    ultimoEnviado = fotografiaDe(locais);
    definirStatus("Sem conexão: usando os dados deste aparelho", "erro");
  }

  telaInicial.classList.remove("escondido");
  mostrarSaves();
};

// Atualiza a tela com o que veio da nuvem (por exemplo, o que você anotou no outro aparelho)
function atualizarTelaDepoisDeSincronizar() {
  if (saveAberto === null) {
    mostrarSaves();
    return;
  }

  const posicao = saves.findIndex(function (save) {
    return save.id === idSaveAberto;
  });

  if (posicao === -1) {
    voltarParaInicio();
    return;
  }

  saveAberto = posicao;
  const save = saves[saveAberto];

  if (temporadaSelecionada !== "geral" && !save.temporadas.includes(temporadaSelecionada)) {
    temporadaSelecionada = save.temporadas.length > 0
      ? save.temporadas[save.temporadas.length - 1]
      : "geral";
  }

  atualizarCabecalhoSave();
  preencherSeletorTemporada();
  mostrarElenco();
  mostrarResumo();
  mostrarHall();
  mostrarRecordes();
  mostrarTrofeus();
  mostrarIdolos();
  mostrarLinhaDoTempo();
  mostrarGraficos();
}

// Quando você volta pro app (ex: troca de aba ou abre o celular), puxa as novidades
async function atualizarDaNuvem() {
  if (!window.Nuvem || !window.Nuvem.usuario()) return;
  if (temporizadorEnvio || enviando || localStorage.getItem("pendenteNuvem") === "1") return;

  try {
    const dados = await window.Nuvem.carregarSaves();
    const fotografia = fotografiaDe(dados);

    if (mapasIguais(fotografia, ultimoEnviado)) return;
    if (temporizadorEnvio || enviando) return; // você mexeu em algo enquanto carregava

    saves = dados;
    ultimoEnviado = fotografia;
    localStorage.setItem("saves", JSON.stringify(saves));
    atualizarTelaDepoisDeSincronizar();
    definirStatus("Atualizado com a nuvem", "ok");
  } catch (erro) {
    console.error(erro);
  }
}

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    // Saindo do app: manda o que faltar na hora
    if (temporizadorEnvio) {
      clearTimeout(temporizadorEnvio);
      enviarParaNuvem();
    }
  } else {
    atualizarDaNuvem();
  }
});

window.addEventListener("online", function () {
  if (window.Nuvem && window.Nuvem.usuario()) agendarEnvio();
});

// Se o serviço de login não carregar, avisa em vez de ficar em branco
setTimeout(function () {
  if (!window.Nuvem) {
    textoCarregando.textContent =
      "Não consegui conectar ao serviço de login. Confira a internet e abra pelo Live Server.";
  }
}, 8000);

// ---------- Backup: baixar e restaurar os saves ----------

const botaoExportarBackup = document.getElementById("btn-exportar-backup");
const botaoImportarBackup = document.getElementById("btn-importar-backup");
const arquivoBackup = document.getElementById("arquivo-backup");
const infoBackup = document.getElementById("info-backup");
const backupFlutuante = document.getElementById("backup-flutuante");
const botaoBackup = document.getElementById("btn-backup");
const menuBackup = document.getElementById("menu-backup");

function fecharMenuBackup() {
  menuBackup.classList.add("escondido");
  botaoBackup.setAttribute("aria-expanded", "false");
}

function alternarMenuBackup() {
  const abrir = menuBackup.classList.contains("escondido");

  if (!abrir) {
    fecharMenuBackup();
    return;
  }

  mostrarInfoBackup();
  menuBackup.classList.remove("escondido");
  botaoBackup.setAttribute("aria-expanded", "true");
}

botaoBackup.addEventListener("click", alternarMenuBackup);

// Clicou fora da pílula ou apertou Esc: fecha as opções
document.addEventListener("click", function (evento) {
  if (!backupFlutuante.contains(evento.target)) fecharMenuBackup();
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") fecharMenuBackup();
});

// Data de hoje no formato 2026-10-03 (pro nome do arquivo)
function dataParaArquivo() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return agora.getFullYear() + "-" + mes + "-" + dia;
}

function baixarArquivo(nome, texto) {
  const arquivo = new Blob([texto], { type: "application/json" });
  const endereco = URL.createObjectURL(arquivo);

  const link = document.createElement("a");
  link.href = endereco;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(function () {
    URL.revokeObjectURL(endereco);
  }, 1000);
}

function conteudoDoBackup() {
  return JSON.stringify({
    app: "carreira-fifa",
    versao: 1,
    exportadoEm: new Date().toISOString(),
    saves: saves
  }, null, 2);
}

function mostrarInfoBackup() {
  const ultimo = localStorage.getItem("ultimoBackup");

  if (!ultimo) {
    infoBackup.textContent = "Nenhum backup baixado ainda";
    return;
  }

  infoBackup.textContent = "Último backup: " +
    new Date(ultimo).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

botaoExportarBackup.addEventListener("click", function () {
  fecharMenuBackup();

  if (saves.length === 0) {
    alert("Você ainda não tem saves pra guardar no backup.");
    return;
  }

  baixarArquivo("backup-carreira-fifa-" + dataParaArquivo() + ".json", conteudoDoBackup());
  localStorage.setItem("ultimoBackup", new Date().toISOString());
  mostrarInfoBackup();
});

// Confere se o arquivo é mesmo um backup e deixa os saves no formato certo
function validarBackup(dados) {
  const lista = Array.isArray(dados) ? dados : dados && dados.saves;

  if (!Array.isArray(lista)) {
    return { erro: "Esse arquivo não parece ser um backup do app." };
  }

  if (lista.length === 0) {
    return { erro: "Esse backup não tem nenhum save." };
  }

  if (lista.length > MAX_SAVES) {
    return { erro: "Esse backup tem " + lista.length + " saves, e o app aceita até " + MAX_SAVES + "." };
  }

  const idsUsados = {};
  const normalizados = [];

  for (let i = 0; i < lista.length; i++) {
    const item = lista[i];

    if (!item || typeof item !== "object" || typeof item.clube !== "string" || !item.clube.trim()) {
      return { erro: "Algum save do arquivo está incompleto ou com defeito." };
    }

    const save = JSON.parse(JSON.stringify(item));

    save.id = Number(save.id);
    if (!save.id || idsUsados[save.id]) save.id = Date.now() + i + 1;
    idsUsados[save.id] = true;

    if (!Array.isArray(save.temporadas)) save.temporadas = [];
    if (!Array.isArray(save.jogadores)) save.jogadores = [];

    normalizados.push(save);
  }

  return { saves: normalizados };
}

botaoImportarBackup.addEventListener("click", function () {
  fecharMenuBackup();
  arquivoBackup.click();
});

arquivoBackup.addEventListener("change", function () {
  const arquivo = arquivoBackup.files && arquivoBackup.files[0];

  if (!arquivo) return;

  const leitor = new FileReader();

  leitor.onerror = function () {
    alert("Não consegui ler esse arquivo.");
    arquivoBackup.value = "";
  };

  leitor.onload = function () {
    let dados;

    try {
      dados = JSON.parse(leitor.result);
    } catch (erro) {
      alert("Esse arquivo não parece ser um backup do app.");
      arquivoBackup.value = "";
      return;
    }

    const resultado = validarBackup(dados);

    if (resultado.erro) {
      alert(resultado.erro);
      arquivoBackup.value = "";
      return;
    }

    const nomes = resultado.saves.map(function (save) {
      return save.clube;
    }).join(", ");

    let pergunta = "Restaurar este backup?\n\n" +
      "Ele tem " + plural(resultado.saves.length, "save", "saves") + ": " + nomes + ".\n\n" +
      "Isso SUBSTITUI os seus saves atuais";

    pergunta += saves.length > 0
      ? " (" + plural(saves.length, "save", "saves") + "). Antes de trocar, o app baixa uma cópia deles, por segurança.\n\nContinuar?"
      : ".\n\nContinuar?";

    if (!confirm(pergunta)) {
      arquivoBackup.value = "";
      return;
    }

    // Guarda uma cópia do que existe hoje, caso você se arrependa
    if (saves.length > 0) {
      baixarArquivo("backup-antes-de-restaurar-" + dataParaArquivo() + ".json", conteudoDoBackup());
    }

    if (saveAberto !== null) voltarParaInicio(); // o save que estava aberto pode não existir mais

    saves = resultado.saves;
    guardarSaves(); // já manda pra nuvem e apaga o que não está mais na lista
    mostrarSaves();
    arquivoBackup.value = "";

    alert("Backup restaurado: " + plural(saves.length, "save voltou", "saves voltaram") + ".");
  };

  leitor.readAsText(arquivo);
});

// ---------- Início ----------

mostrarInfoBackup();
preencherPosicoes();
preencherResultados();
ajustarFormularioTransferencia();
mostrarSaves();