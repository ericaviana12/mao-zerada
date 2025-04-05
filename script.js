const suits = ['♠', '♣', '♥', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [], playerHand = [], botHand = [], discardPile = [], currentPlayer = 'player';

function createDeck() {
  deck = [];
  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({ value, suit });
    });
  });
  shuffle(deck);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function startGame() {
  createDeck();
  playerHand = deck.splice(0, 7);
  botHand = deck.splice(0, 7);
  discardPile = [deck.pop()];
  renderHands();
  updateSums();
  renderDiscard();
  currentPlayer = 'player';
}

function renderHands() {
  const player = document.getElementById('player-hand');
  const bot = document.getElementById('bot-hand');
  player.innerHTML = '';
  bot.innerHTML = '';

  playerHand.forEach((card, index) => {
    const el = createCardElement(card);
    el.onclick = () => discardCard(index);
    player.appendChild(el);
  });

  botHand.forEach(() => {
    const botCard = document.createElement('div');
    botCard.className = 'card';
    botCard.textContent = '?';
    bot.appendChild(botCard);
  });
}

function createCardElement(card) {
  const el = document.createElement('div');
  el.className = 'card';
  el.textContent = card.value + card.suit;
  el.style.color = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
  return el;
}

function updateSums() {
  document.getElementById('player-sum').textContent = calcSum(playerHand);
  document.getElementById('bot-sum').textContent = '?';
}

function cardValue(card) {
  const face = card.value;
  let base = (face === 'A') ? 1 : ['J','Q','K'].includes(face) ? 10 : parseInt(face);
  return (card.suit === '♥' || card.suit === '♦') ? -base : base;
}

function calcSum(hand) {
  return hand.reduce((sum, c) => sum + cardValue(c), 0);
}

function renderDiscard() {
  const discard = document.getElementById('discard-pile');
  const top = discardPile[discardPile.length - 1];
  discard.textContent = top ? top.value + top.suit : '';
  discard.style.color = top && (top.suit === '♥' || top.suit === '♦') ? 'red' : 'black';
}

document.getElementById('draw-pile').onclick = () => {
  if (currentPlayer !== 'player' || deck.length === 0) return;
  const card = deck.pop();
  playerHand.push(card);
  animateDraw();
  renderHands();
};

function animateDraw() {
  const draw = document.getElementById('draw-pile');
  draw.style.backgroundColor = '#cfc';
  setTimeout(() => draw.style.backgroundColor = '#eee', 500);
}

function discardCard(index) {
  if (playerHand.length <= 7) return;
  const discarded = playerHand.splice(index, 1)[0];
  discardPile.push(discarded);
  renderDiscard();
  renderHands();
  updateSums();
  if (calcSum(playerHand) === 0) return showVictory('Você venceu!');
  currentPlayer = 'bot';
  setTimeout(botTurn, 1000);
}

function botTurn() {
  const botCard = deck.pop();
  botHand.push(botCard);
  if (botHand.length > 7) {
    let idx = botHand.findIndex(c => cardValue(c) !== 0) || 0;
    const discarded = botHand.splice(idx, 1)[0];
    discardPile.push(discarded);
  }
  updateSums();
  renderDiscard();
  renderHands();
  if (calcSum(botHand) === 0) return showVictory('O bot venceu!');
  currentPlayer = 'player';
}

function showVictory(msg) {
  document.getElementById('winner-text').textContent = msg;
  document.getElementById('victory-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('victory-modal').classList.add('hidden');
  startGame();
}
