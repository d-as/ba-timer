const audio = new Audio(
  'https://oldschool.runescape.wiki/images/a/a3/Runecraft_level_up_%28with_unlocks%29.ogg?d0756'
);

audio.volume = 0.25;

const timeDiv = document.getElementById('time');

const startButton = document.getElementById('button-start');
const resetButton = document.getElementById('button-reset');
const incButton = document.getElementById('button-inc');
const decButton = document.getElementById('button-dec');

const defaultDuration = 30_000;

timeDiv.innerHTML = `00:${`${Math.ceil(defaultDuration / 1000)}`.padStart(2, '0')}`;

let running = false;
let duration = defaultDuration;
let timestamp;
let timeout;

const getElapsed = () => (
  timestamp ? Date.now() - timestamp : 0
);

const update = () => {
  const elapsed = getElapsed();
  const timeLeft = Math.ceil((duration - elapsed) / 1000);
  timeDiv.innerText = `00:${`${timeLeft}`.padStart(2, '0')}`;

  if (timeLeft <= 5) {
    timeDiv.classList.add('timer-low');
  } else {
    timeDiv.classList.remove('timer-low');
  }
};

const tick = () => {
  const elapsed = getElapsed();

  if (elapsed >= duration) {
    audio.play();
    duration = defaultDuration;
    timestamp = Date.now();
    timeDiv.classList.remove('timer-low');
  }

  update();
  timeout = window.setTimeout(tick, 100);
};

const start = () => {
  running = !running;

  if (running) {
    timestamp = Date.now();
    startButton.disabled = true;

    timeout = window.setTimeout(tick, 100);
  } else {
    startButton.disabled = false;
  }
};

const reset = () => {
  timestamp = null;
  startButton.disabled = false;
  running = false;
  duration = defaultDuration;
  timeDiv.innerText = '00:30';
  timeDiv.classList.remove('timer-low');
  window.clearTimeout(timeout);
  audio.pause();
  audio.currentTime = 0;
};

const increment = () => {
  if (duration <= 58_000) {
    duration += 1000;
    update();
  }
};

const decrement = () => {
  if (duration >= 1000) {
    duration -= 1000;
    update();
  }
};

startButton.addEventListener('click', () => start());
resetButton.addEventListener('click', () => reset());
incButton.addEventListener('click', () => increment());
decButton.addEventListener('click', () => decrement());
