// ====================================================
// AUDIO ENGINE
// ====================================================
let audioCtx = null;
let soundEnabled = true;
let musicPlaying = false;
let musicTimeoutId = null;

function initAudio() {
  if (audioCtx) { audioCtx.resume(); return; }
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

const NF = {
  'C3':130.81,'D3':146.83,'E3':164.81,'F3':174.61,'G3':196.00,'A3':220.00,'B3':246.94,
  'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'G4':392.00,'A4':440.00,'B4':493.88,
  'C5':523.25,'D5':587.33,'E5':659.25,'F5':698.46,'G5':783.99,'A5':880.00,'C6':1046.50
};

function playTone(freq, when, dur, vol, type) {
  if (!audioCtx || !soundEnabled) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type || 'square';
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, when);
  g.gain.linearRampToValueAtTime(0, when + dur);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(when); o.stop(when + dur + 0.05);
}

function playCorrectSound() {
  if (!audioCtx || !soundEnabled) return;
  const t = audioCtx.currentTime;
  playTone(NF['C5'], t, 0.12, 0.13, 'square');
  playTone(NF['E5'], t+0.1, 0.12, 0.13, 'square');
  playTone(NF['G5'], t+0.2, 0.12, 0.13, 'square');
  playTone(NF['C6'], t+0.3, 0.25, 0.15, 'square');
}

function playWrongSound() {
  if (!audioCtx || !soundEnabled) return;
  const t = audioCtx.currentTime;
  playTone(200, t, 0.15, 0.13, 'sawtooth');
  playTone(150, t+0.15, 0.3, 0.13, 'sawtooth');
}

function playTimeoutSound() {
  if (!audioCtx || !soundEnabled) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(600, t);
  o.frequency.linearRampToValueAtTime(100, t + 0.8);
  g.gain.setValueAtTime(0.13, t);
  g.gain.linearRampToValueAtTime(0, t + 0.8);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(t); o.stop(t + 0.85);
}

function playCountdownBeep(high) {
  if (!audioCtx || !soundEnabled) return;
  playTone(high ? 880 : 440, audioCtx.currentTime, 0.15, 0.10, 'square');
}

function playGameOverSound() {
  if (!audioCtx || !soundEnabled) return;
  const t = audioCtx.currentTime;
  playTone(NF['G4'], t, 0.35, 0.10, 'square');
  playTone(NF['E4'], t+0.35, 0.35, 0.10, 'square');
  playTone(NF['C4'], t+0.7, 0.55, 0.10, 'square');
}

function playFlapSound() {
  if (!audioCtx || !soundEnabled) return;
  const t = audioCtx.currentTime;
  playTone(400, t, 0.06, 0.06, 'sine');
  playTone(500, t+0.03, 0.06, 0.06, 'sine');
}

function playPassSound() {
  if (!audioCtx || !soundEnabled) return;
  playTone(NF['E5'], audioCtx.currentTime, 0.1, 0.08, 'square');
}

function startMusic() {
  if (musicPlaying || !audioCtx || !soundEnabled) return;
  musicPlaying = true; scheduleMusic();
}
function stopMusic() {
  musicPlaying = false;
  if (musicTimeoutId) { clearTimeout(musicTimeoutId); musicTimeoutId = null; }
}
function scheduleMusic() {
  if (!musicPlaying || !audioCtx || !soundEnabled) return;
  const bpm = 160, beat = 60/bpm, t = audioCtx.currentTime + 0.05, vol = 0.04;
  const mel = [
    ['C5',0],['E5',1],['G5',2],['E5',3],
    ['F5',4],['A5',5],['G5',6],['E5',7],
    ['D5',8],['F5',9],['E5',10],['C5',11],
    ['D5',12],['E5',13],['C5',14],['C5',15],
  ];
  const bas = [['C3',0,4],['F3',4,4],['G3',8,4],['C3',12,4]];
  mel.forEach(([n,b]) => playTone(NF[n], t+b*beat, beat*0.7, vol, 'square'));
  bas.forEach(([n,b,d]) => playTone(NF[n], t+b*beat, d*beat*0.9, vol*0.8, 'triangle'));
  musicTimeoutId = setTimeout(scheduleMusic, 16*beat*1000 - 50);
}
