const naipes = ['♥', '♦', '♣', '♠'];
const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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

function renderCartas(cartas, elementoId) {
  const div = document.getElementById(elementoId);
  div.innerHTML = '';
  cartas.forEach(carta => {
    const card = document.createElement('div');
    card.className = 'carta ' + (carta.naipe === '♥' || carta.naipe === '♦' ? 'vermelha' : '');
    card.textContent = `${carta.valor}${carta.naipe}`;
    div.appendChild(card);
  });
}

function somaCartas(cartas) {
  return cartas.reduce((soma, carta) => soma + valorNumerico(carta), 0);
}

function novaRodada() {
  const baralho = gerarBaralho();
  const maoJogador = baralho.splice(0, 7);
  const maoBot = baralho.splice(0, 7);

  renderCartas(maoJogador, 'cartas-jogador');
  renderCartas(maoBot, 'cartas-bot');

  document.getElementById('soma-jogador').textContent = `Soma: ${somaCartas(maoJogador)}`;
  document.getElementById('soma-bot').textContent = `Soma: ${somaCartas(maoBot)}`;
}

novaRodada();
