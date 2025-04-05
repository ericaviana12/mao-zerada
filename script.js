const naipes = ['♥', '♦', '♣', '♠'];
const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let monte = [], descarte = [], maoJogador = [], maoBot = [];
let cartaComprada = null;
let turno = 'jogador';

function gerarBaralho() {
  let baralho = [];
  for (let naipe of naipes) {
    for (let valor of valores) {
      baralho.push({ naipe, valor });
    }
  }
  return baralho.sort(() => Math.random() - 0.5);
}

function valorNumerico(carta) {
  const vermelho = carta.naipe === '♥' || carta.naipe === '♦';
  let valor = parseInt(carta.valor) || 10;
  if (carta.valor === 'A') valor = 1;
  return vermelho ? -valor : valor;
}

function somaCartas(cartas) {
  return cartas.reduce((soma, carta) => soma + valorNumerico(carta), 0);
}

function atualizarTurno() {
  document.getElementById('turno-indicador').textContent =
    turno === 'jogador' ? 'Seu turno' : 'Turno do Bot';
}

function novaRodada() {
  const baralho = gerarBaralho();
  maoJogador = baralho.splice(0, 7);
  maoBot = baralho.splice(0, 7);
  monte = baralho;
  descarte = [monte.pop()];
  cartaComprada = null;
  turno = 'jogador';
  renderizar();
}

function renderizar() {
  renderCartas(maoJogador, 'cartas-jogador', true);
  renderCartas(maoBot, 'cartas-bot', false, true);
  document.getElementById('soma-jogador').textContent = `Soma: ${somaCartas(maoJogador)}`;
  document.getElementById('soma-bot').textContent = `Soma: ${somaCartas(maoBot)}`;
  atualizarPilhas();
  atualizarTurno();
}

function renderCartas(mao, divId, clicavel, ocultar = false) {
  const div = document.getElementById(divId);
  div.innerHTML = '';
  mao.forEach((carta, index) => {
    const el = document.createElement('div');
    el.className = 'carta ' + (carta.naipe === '♥' || carta.naipe === '♦' ? 'vermelha' : '');
    el.textContent = ocultar ? '🂠' : `${carta.valor}${carta.naipe}`;
    if (clicavel) el.onclick = () => descartar(index);
    div.appendChild(el);
  });
}

function atualizarPilhas() {
  document.getElementById('monte').textContent = monte.length ? 'Monte' : 'Vazio';

  const cartaTopo = descarte[descarte.length - 1];
  const el = document.getElementById('carta-descarte');
  el.innerHTML = '';
  if (cartaTopo) {
    const cartaEl = document.createElement('div');
    cartaEl.className = 'carta ' + (cartaTopo.naipe === '♥' || cartaTopo.naipe === '♦' ? 'vermelha' : '');
    cartaEl.textContent = `${cartaTopo.valor}${cartaTopo.naipe}`;
    el.appendChild(cartaEl);
  }
}

function comprarCarta(origem) {
  if (turno !== 'jogador') return;
  if (cartaComprada) {
    alert("Você já comprou! Precisa descartar.");
    return;
  }

  if (origem === 'monte' && monte.length > 0) {
    cartaComprada = monte.pop();
  } else if (origem === 'descarte' && descarte.length > 0) {
    cartaComprada = descarte.pop();
  }

  if (cartaComprada) {
    maoJogador.push(cartaComprada);
    renderizar();
  }
}

function descartar(indice) {
  if (!cartaComprada) {
    alert("Você precisa comprar uma carta antes de descartar!");
    return;
  }

  const descartada = maoJogador.splice(indice, 1)[0];
  descarte.push(descartada);
  cartaComprada = null;
  renderizar();
  checarVitoria(maoJogador, 'Você');
  turno = 'bot';
  setTimeout(jogadaBot, 1000);
}

function jogadaBot() {
  if (turno !== 'bot') return;

  let carta;
  if (Math.random() < 0.5 && descarte.length > 0) {
    carta = descarte.pop();
  } else {
    carta = monte.pop();
  }
  maoBot.push(carta);

  let idxDescartar = 0;
  let menorValor = Math.abs(valorNumerico(maoBot[0]));
  for (let i = 1; i < maoBot.length; i++) {
    const v = Math.abs(valorNumerico(maoBot[i]));
    if (v < menorValor) {
      menorValor = v;
      idxDescartar = i;
    }
  }
  const descartada = maoBot.splice(idxDescartar, 1)[0];
  descarte.push(descartada);

  renderizar();
  checarVitoria(maoBot, 'O bot');
  turno = 'jogador';
  atualizarTurno();
}

function checarVitoria(mao, nome) {
  if (somaCartas(mao) === 0) {
    setTimeout(() => {
      alert(`${nome} venceu zerando a mão!`);
      novaRodada();
    }, 300);
  }
}
