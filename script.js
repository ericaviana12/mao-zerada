let baralho = [];
let jogador = [];
let bot = [];
let descarte = [];
let cartaComprada = null;
let turno = "jogador";

function embaralhar() {
  const naipes = ["♠", "♣", "♥", "♦"];
  const valores = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  baralho = [];
  for (const naipe of naipes) {
    for (const valor of valores) {
      baralho.push({ naipe, valor });
    }
  }
  for (let i = baralho.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
  }
}

function valorCarta(carta) {
  let valor = carta.valor === "A" ? 1 : ["J", "Q", "K"].includes(carta.valor) ? 10 : parseInt(carta.valor);
  return (carta.naipe === "♥" || carta.naipe === "♦") ? -valor : valor;
}

function desenharMao() {
  const divJogador = document.getElementById("mao-jogador");
  divJogador.innerHTML = "";
  jogador.forEach((carta, i) => {
    const div = criarCarta(carta);
    div.onclick = () => {
      if (cartaComprada && turno === "jogador") {
        jogador[i] = cartaComprada;
        descarte.push(carta);
        cartaComprada = null;
        document.getElementById("carta-comprada").innerHTML = "";
        atualizarDescarte();
        verificarVitoria("Você");
        turno = "bot";
        atualizarTurno();
        setTimeout(jogadaBot, 1000);
      }
    };
    divJogador.appendChild(div);
  });
}

function criarCarta(carta) {
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = carta.valor + carta.naipe;
  div.style.color = (carta.naipe === "♥" || carta.naipe === "♦") ? "red" : "black";
  return div;
}

function comprarCarta() {
  if (cartaComprada || turno !== "jogador") return;
  cartaComprada = baralho.pop();
  const div = criarCarta(cartaComprada);
  document.getElementById("carta-comprada").innerHTML = "";
  document.getElementById("carta-comprada").appendChild(div);
}

function atualizarDescarte() {
  const area = document.getElementById("pilha-descarte");
  area.innerHTML = "";
  const ultima = descarte[descarte.length - 1];
  if (ultima) area.appendChild(criarCarta(ultima));
}

function jogadaBot() {
  const carta = baralho.pop();
  bot.push(carta);
  let piorIndice = 0;
  let maiorValor = -Infinity;
  bot.forEach((c, i) => {
    let val = Math.abs(valorCarta(c));
    if (val > maiorValor) {
      maiorValor = val;
      piorIndice = i;
    }
  });
  descarte.push(bot.splice(piorIndice, 1)[0]);
  atualizarDescarte();
  verificarVitoria("Bot");
  turno = "jogador";
  atualizarTurno();
}

function verificarVitoria(jogadorAtual) {
  const soma = (jogadorAtual === "Você" ? jogador : bot).reduce((acc, c) => acc + valorCarta(c), 0);
  if (soma === 0) exibirVitoria(jogadorAtual);
}

function exibirVitoria(nome) {
  const modal = document.getElementById("modal-vitoria");
  document.getElementById("mensagem-vitoria").textContent = nome + " zerou a mão!";
  modal.style.display = "block";
}

function fecharModal() {
  document.getElementById("modal-vitoria").style.display = "none";
}

function atualizarTurno() {
  document.getElementById("turno-indicador").textContent = "Vez de: " + (turno === "jogador" ? "Você" : "Bot");
}

function novaRodada() {
  embaralhar();
  jogador = baralho.splice(0, 7);
  bot = baralho.splice(0, 7);
  descarte = [];
  cartaComprada = null;
  turno = "jogador";
  document.getElementById("carta-comprada").innerHTML = "";
  desenharMao();
  atualizarDescarte();
  atualizarTurno();
}

window.onload = novaRodada;
