// ====================================================
// EVENT HANDLERS
// ====================================================

// Mode selection
function updateModeUI() {
  document.getElementById('timed-options').classList.toggle('visible', gameMode === 'timed');
  document.getElementById('questions-options').classList.toggle('visible', gameMode === 'questions');
}

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    gameMode = btn.dataset.mode;
    updateModeUI();
  });
});

document.querySelectorAll('.timed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.timed-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    timedDuration = parseInt(btn.dataset.val, 10);
  });
});

document.querySelectorAll('.qcount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.qcount-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    questionCount = parseInt(btn.dataset.val, 10);
  });
});

// Difficulty
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    difficulty = btn.dataset.diff;
  });
});

// Time per question
document.querySelectorAll('.time-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    timeLimit = parseInt(btn.dataset.time, 10);
  });
});

// Game controls
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('submit-btn').addEventListener('click', submitAnswer);
document.getElementById('answer-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitAnswer();
});

document.querySelectorAll('.num-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const inp = document.getElementById('answer-input');
    const val = btn.dataset.num;
    if (val === 'del') inp.value = inp.value.slice(0, -1);
    else if (val === 'ok') submitAnswer();
    else if (inp.value.length < 4) inp.value += val;
    inp.focus();
  });
});

document.getElementById('replay-btn').addEventListener('click', startGame);
document.getElementById('menu-btn').addEventListener('click', () => {
  stopMusic();
  showScreen('menu');
  phase = 'idle';
  pipes = [];
});

document.getElementById('sound-toggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  document.getElementById('sound-toggle').textContent = soundEnabled ? '\u{1F50A}' : '\u{1F507}';
  if (!soundEnabled) stopMusic();
  else if (phase === 'asking' || phase === 'correct') startMusic();
});

document.addEventListener('dblclick', e => e.preventDefault());

// ====================================================
// INIT
// ====================================================
// On touch devices, make input readonly to prevent any keyboard/cursor behavior
if (isTouchDevice) {
  document.getElementById('answer-input').setAttribute('readonly', 'readonly');
}

updateModeUI();
initClouds();
bird.y = SKY_H / 2;
requestAnimationFrame(gameLoop);
