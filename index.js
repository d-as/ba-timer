const audio = new Audio(
  'https://oldschool.runescape.wiki/images/a/a3/Runecraft_level_up_%28with_unlocks%29.ogg?d0756'
);

audio.volume = 0.25;

const timeDiv = document.getElementById('time');

const startButton = document.getElementById('button-start');
const resetButton = document.getElementById('button-reset');
const incButton = document.getElementById('button-inc');
const decButton = document.getElementById('button-dec');

resetButton.disabled = true;

const defaultDuration = 30_000;

const formatTime = time => (
  `00:${`${Math.ceil(time / 1000)}`.padStart(2, '0')}`
);

timeDiv.innerHTML = formatTime(defaultDuration);

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
  timeDiv.innerText = formatTime(duration - elapsed);
  resetButton.disabled = running ? false : timeLeft === (defaultDuration / 1000);

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
    timeDiv.classList.add('flash');
    window.setTimeout(() => timeDiv.classList.remove('flash'), 400);
  } else {
    startButton.disabled = false;
  }
};

const reset = () => {
  timestamp = null;
  startButton.disabled = false;
  resetButton.disabled = true;
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
