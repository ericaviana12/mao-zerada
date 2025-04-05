let baralho = [];
let maoJogador = [];
let maoBot = [];
let pilhaDescarte = [];
let turno = 'jogador';

function criarBaralho() {
  const naipes = ['♠', '♣', '♥', '♦'];
  const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  baralho = [];

  for (let naipe of naipes) {
    for (let valor of valores) {
      let pontos = (valor === 'J' || valor === 'Q' || valor === 'K') ? 10 : valor;
      let cor = (naipe === '♥' || naipe === '♦') ? 'vermelha' : 'preta';
      baralho.push({ valor, naipe, cor, pontos });
    }
  }

  baralho = baralho.sort(() => Math.random() - 0.5);
}

function iniciarJogo() {
  criarBaralho();
  maoJogador = baralho.splice(0, 5);
  maoBot = baralho.splice(0, 5);
  pilhaDescarte = [baralho.pop()];
  renderizar();
}

function renderizar() {
  const areaJogador = document.getElementById('cartas-jogador');
  const areaBot = document.getElementById('cartas-bot');
  const cartaDesc = document.getElementById('carta-descarte');

  areaJogador.innerHTML = '';
  maoJogador.forEach((carta, i) => {
    const div = document.createElement('div');
    div.className = `carta ${carta.cor === 'vermelha' ? 'vermelha' : ''}`;
    div.innerText = `${carta.valor}${carta.naipe}`;
    div.onclick = () => descartarCarta(i);
    areaJogador.appendChild(div);
  });

  areaBot.innerHTML = '';
  maoBot.forEach(() => {
    const div = document.createElement('div');
    div.className = 'carta';
    div.innerText = '?';
    areaBot.appendChild(div);
  });

  if (pilhaDescarte.length > 0) {
    const carta = pilhaDescarte[pilhaDescarte.length - 1];
    cartaDesc.innerText = `${carta.valor}${carta.naipe}`;
    cartaDesc.className = `carta ${carta.cor === 'vermelha' ? 'vermelha' : ''}`;
  }
}

function comprarCarta() {
  if (turno !== 'jogador') return;

  const carta = baralho.pop();
  if (!carta) return;

  maoJogador.push(carta);
  renderizar();

  const divs = document.getElementById('cartas-jogador').lastChild;
  divs.classList.add('carta-nova');
  setTimeout(() => divs.classList.remove('carta-nova'), 800);
}

function descartarCarta(indice) {
  if (turno !== 'jogador') return;

  const carta = maoJogador.splice(indice, 1)[0];
  pilhaDescarte.push(carta);
  renderizar();

  if (maoJogador.length === 0) return exibirVitoria('Você venceu! Mão zerada!');
  turno = 'bot';

  document.getElementById('turno-indicador').innerText = 'Turno do Bot...';
  setTimeout(() => botJoga(), 1000);
}

function botJoga() {
  const carta = baralho.pop();
  if (carta) maoBot.push(carta);

  const descartar = Math.floor(Math.random() * maoBot.length);
  const descartada = maoBot.splice(descartar, 1)[0];
  pilhaDescarte.push(descartada);
  renderizar();

  if (maoBot.length === 0) return exibirVitoria('O Bot venceu... tente outra vez!');

  turno = 'jogador';
  document.getElementById('turno-indicador').innerText = 'Sua vez!';
}

function exibirVitoria(mensagem) {
  const modal = document.getElementById('modal-vitoria');
  const texto = document.getElementById('mensagem-vitoria');
  texto.innerText = mensagem;
  modal.style.display = 'flex';

  setTimeout(() => location.reload(), 4000);
}

window.onload = iniciarJogo;
