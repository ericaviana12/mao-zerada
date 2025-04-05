const naipes = ['♥', '♦', '♣', '♠'];
const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let monte = [];
let descarte = [];
let maoJogador = [];
let cartaComprada = null;

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

function renderCartas() {
  const div = document.getElementById('cartas-jogador');
  div.innerHTML = '';
  maoJogador.forEach((carta, index) => {
    const card = document.createElement('div');
    card.className = 'carta ' + (carta.naipe === '♥' || carta.naipe === '♦' ? 'vermelha' : '');
    card.textContent = `${carta.valor}${carta.naipe}`;
    card.onclick = () => descartar(index);
    div.appendChild(card);
  });

  document.getElementById('soma-jogador').textContent = `Soma: ${somaCartas(maoJogador)}`;
  atualizarPilhas();
}

function somaCartas(cartas) {
  return cartas.reduce((soma, carta) => soma + valorNumerico(carta), 0);
}

function novaRodada() {
  const baralho = gerarBaralho();
  maoJogador = baralho.splice(0, 7);
  monte = baralho;
  descarte = [monte.pop()];
  cartaComprada = null;
  renderCartas();
}

function atualizarPilhas() {
  document.getElementById('monte').textContent = monte.length ? 'Monte' : 'Vazio';
  const cartaTopo = descarte[descarte.length - 1];
  document.getElementById('descarte').textContent = cartaTopo ? `${cartaTopo.valor}${cartaTopo.naipe}` : 'Descarte';
}

function comprarCarta(origem) {
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
    renderCartas();
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
  renderCartas();

  if (somaCartas(maoJogador) === 0) {
    alert("Parabéns! Você zerou a mão!");
  }
}
