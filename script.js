const naipes = ['♠', '♣', '♥', '♦'];
const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let jogador = [];
let bot = [];
let pilhaDescarte = [];
let cartaComprada = null;

const playerHand = document.getElementById("player-hand");
const botHand = document.getElementById("bot-hand");
const deckDiv = document.getElementById("deck");
const discardPile = document.getElementById("discard-pile");
const newGameBtn = document.getElementById("new-game");
const turnIndicator = document.getElementById("turn-indicator");

function criarDeck() {
  const cartas = [];
  for (const naipe of naipes) {
    for (const valor of valores) {
      cartas.push({ valor, naipe });
    }
  }
  return cartas.sort(() => Math.random() - 0.5);
}

function valorNumerico(carta) {
  let valor = carta.valor;
  let numero = valor === 'A' ? 1 : ['J', 'Q', 'K'].includes(valor) ? 10 : parseInt(valor);
  return ['♥', '♦'].includes(carta.naipe) ? -numero : numero;
}

function renderizarCarta(carta) {
  const div = document.createElement("div");
  div.className = `card ${['♥', '♦'].includes(carta.naipe) ? 'red' : ''}`;
  div.textContent = `${carta.valor}${carta.naipe}`;
  return div;
}

function renderizarMao(jogadorAtual, container, clicavel = false) {
  container.innerHTML = '';
  jogadorAtual.forEach((carta, index) => {
    const divCarta = renderizarCarta(carta);
    if (clicavel) {
      divCarta.addEventListener("click", () => descartarCarta(index));
    }
    container.appendChild(divCarta);
  });
}

function atualizarPilhaDescarte() {
  discardPile.innerHTML = '';
  if (pilhaDescarte.length > 0) {
    const ultimaCarta = renderizarCarta(pilhaDescarte[pilhaDescarte.length - 1]);
    discardPile.appendChild(ultimaCarta);
  }
}

function atualizarIndicadorDeTurno(vez) {
  turnIndicator.textContent = vez === 'player' ? 'Sua vez!' : 'Bot está jogando...';
}

function iniciarJogo() {
  deck = criarDeck();
  jogador = deck.splice(0, 7);
  bot = deck.splice(0, 7);
  pilhaDescarte = [deck.pop()];
  cartaComprada = null;

  renderizarMao(jogador, playerHand, true);
  renderizarMao(bot.map(() => ({})), botHand); // Ocultar cartas do bot
  atualizarPilhaDescarte();
  atualizarIndicadorDeTurno('player');

  deckDiv.onclick = comprarCarta;
}

function comprarCarta() {
  if (cartaComprada || deck.length === 0) return;
  cartaComprada = deck.pop();
  jogador.push(cartaComprada);
  renderizarMao(jogador, playerHand, true);
  atualizarIndicadorDeTurno('player');
}

function descartarCarta(indice) {
  if (!cartaComprada) return;
  const descartada = jogador.splice(indice, 1)[0];
  pilhaDescarte.push(descartada);
  cartaComprada = null;

  renderizarMao(jogador, playerHand, true);
  atualizarPilhaDescarte();
  verificarVitoria(jogador, 'Você');

  setTimeout(() => turnoBot(), 500);
}

function turnoBot() {
  atualizarIndicadorDeTurno('bot');
  bot.push(deck.pop());

  // Bot descarta a carta que piora a soma
  let melhorIndice = 0;
  let menorModulo = Infinity;
  for (let i = 0; i < bot.length; i++) {
    const copia = bot.slice();
    copia.splice(i, 1);
    const soma = copia.reduce((a, c) => a + valorNumerico(c), 0);
    if (Math.abs(soma) < menorModulo) {
      menorModulo = Math.abs(soma);
      melhorIndice = i;
    }
  }

  const descartada = bot.splice(melhorIndice, 1)[0];
  pilhaDescarte.push(descartada);
  renderizarMao(bot.map(() => ({})), botHand);
  atualizarPilhaDescarte();
  verificarVitoria(bot, 'Bot');

  atualizarIndicadorDeTurno('player');
}

function verificarVitoria(mao, nome) {
  const soma = mao.reduce((acc, carta) => acc + valorNumerico(carta), 0);
  if (soma === 0) {
    alert(`${nome} venceu!`);
    deckDiv.onclick = null;
  }
}

newGameBtn.onclick = iniciarJogo;
window.onload = iniciarJogo;
