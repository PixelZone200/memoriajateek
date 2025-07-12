/* ======== DOM ======== */
const qs = s => document.querySelector(s);
const startBtn = qs('#startBtn'), startScreen = qs('#startScreen'),
      gameMenu = qs('#gameMenu'),  gameModes  = document.querySelectorAll('.gameMode'),
      gameBoard = qs('#gameBoard'), cardContainer = qs('#cardContainer'),
      timerDisplay = qs('#timer'),  gameOverScr = qs('#gameOver'),
      finalTime = qs('#finalTime'), restartBtn = qs('#restartBtn');

/* ======== Állapot ======== */
let selectedMode = null;
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = 20;
let timer = 0, timerInt = null;

/* ======== Kezdés / Menü ======== */
startBtn.onclick = () => {
  startScreen.classList.add('hidden');
  gameMenu.classList.remove('hidden');
  setTimeout(() => (gameMenu.style.opacity = 1), 50);
};

gameModes.forEach(el => el.onclick = () => { selectedMode = el.dataset.mode; startGame(); });
restartBtn.onclick = () => location.reload();

/* ======== Játék indítása ======== */
function startGame() {
  gameMenu.classList.add('hidden');
  gameBoard.classList.remove('hidden');
  setupGame();
  startTimer();
}

/* ======== Pakli összeállítása ======== */
function setupGame() {
  cardContainer.innerHTML = '';
  flippedCards = [];
  matchedPairs = 0;

  const ext = '.jpg';                         // minden kép .jpg
  let imgs = [];

  if (selectedMode === 'kozos') {
    const all = [];
    for (let i = 1; i <= totalPairs; i++) {
      all.push(`images/beata${i}${ext}`, `images/dominik${i}${ext}`);
    }
    shuffle(all);
    imgs = all.slice(0, totalPairs);          // véletlen 20
  } else {
    for (let i = 1; i <= totalPairs; i++) {
      imgs.push(`images/${selectedMode}${i}${ext}`);
    }
  }

  const deck = shuffle([...imgs, ...imgs]);   // párok duplázva
  deck.forEach(src => cardContainer.appendChild(createCard(src)));
}

const shuffle = arr => {                      // Fisher–Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/* ======== Kártya‑DOM ======== */
function createCard(src) {
  const card = Object.assign(document.createElement('div'), { className: 'card' });
  const inner = Object.assign(document.createElement('div'), { className: 'card-inner' });
  const front = Object.assign(document.createElement('div'), { className: 'card-front' });
  front.style.backgroundImage = `url('${src}')`;
  const back  = Object.assign(document.createElement('div'), { className: 'card-back' });

  inner.append(front, back); card.appendChild(inner);
  card.onclick = () => onCardClick(card, src);
  return card;
}

/* ======== Kattintás‑logika ======== */
function onCardClick(card, src) {
  if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
    card.classList.add('flipped');
    flippedCards.push({ card, src });
    if (flippedCards.length === 2) checkMatch();
  }
}

/* ======== Párok ellenőrzése (üres kártya helyett eltűnő párok) ======== */
function checkMatch() {
  const [a, b] = flippedCards;

  if (a.src === b.src) {
    a.card.classList.add('matched');
    b.card.classList.add('matched');

    setTimeout(() => { 
      // Üres átlátszó kártyák helyezése a megtalált kártyák helyére
      const emptyCardA = createEmptyCard();
      const emptyCardB = createEmptyCard();

      a.card.parentElement.replaceChild(emptyCardA, a.card);
      b.card.parentElement.replaceChild(emptyCardB, b.card);
    }, 1000);

    if (++matchedPairs === totalPairs) endGame();
    flippedCards = [];
  } else {
    setTimeout(() => {
      a.card.classList.remove('flipped');
      b.card.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

/* ======== Üres kártya létrehozása ======== */
function createEmptyCard() {
  const emptyCard = Object.assign(document.createElement('div'), { className: 'empty-card' });
  const inner = Object.assign(document.createElement('div'), { className: 'card-inner' });
  const front = Object.assign(document.createElement('div'), { className: 'card-front' });
  const back  = Object.assign(document.createElement('div'), { className: 'card-back' });

  front.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Átlátszó háttér
  inner.append(front, back);
  emptyCard.appendChild(inner);

  return emptyCard;
}

/* ======== Időmérő ======== */
function startTimer() {
  timer = 0; updateTimer();
  clearInterval(timerInt);
  timerInt = setInterval(() => { timer++; updateTimer(); }, 1000);
}
const updateTimer = () =>
  (timerDisplay.textContent = `${Math.floor(timer / 60)} perc, ${timer % 60} másodperc`);

/* ======== Vége ======== */
function endGame() {
  clearInterval(timerInt);
  gameBoard.classList.add('hidden');
  gameOverScr.classList.remove('hidden');
  finalTime.textContent = `${Math.floor(timer / 60)} perc, ${timer % 60} másodperc`;
}
