// ====================================================
// SCREEN MANAGEMENT
// ====================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ====================================================
// MODE HELPERS
// ====================================================
function isGameOver() {
  if (gameMode === 'survival') return lives <= 0;
  if (gameMode === 'timed') return globalTimer <= 0;
  if (gameMode === 'questions') return (stats.correct + stats.wrong + stats.timeout) >= questionCount;
  return false;
}

function getRecoveryTime() {
  return gameMode === 'survival' ? 2.0 : 1.3;
}

// ====================================================
// GAME LOGIC
// ====================================================
function startGame() {
  initAudio();
  score = 0; lives = 3;
  stats = { correct: 0, wrong: 0, timeout: 0 };
  particles = []; floatingTexts = [];
  bird.y = SKY_H / 2; bird.vy = 0; bird.rotation = 0;
  bird.expression = 'normal'; bird.frame = 0; bird.targetY = null;
  pipes = [];
  targetPipe = null;
  groundOffset = 0; groundScrolling = true;
  phase = 'idle';
  combo = 0;

  // Mode-specific init
  if (gameMode === 'timed') {
    globalTimer = timedDuration * 60;
  }

  resetTheme();
  initClouds();
  initPipes();
  showScreen('game');
  doCountdown(() => { startMusic(); nextRound(); });
}

function doCountdown(cb) {
  const overlay = document.getElementById('countdown-overlay');
  const text = document.getElementById('countdown-text');
  overlay.classList.add('active');
  let count = 3;
  text.textContent = count;
  text.style.animation = 'none'; void text.offsetWidth; text.style.animation = '';
  playCountdownBeep(false);
  const iv = setInterval(() => {
    count--;
    if (count > 0) {
      text.textContent = count;
      text.style.animation = 'none'; void text.offsetWidth; text.style.animation = '';
      playCountdownBeep(false);
    } else if (count === 0) {
      text.textContent = 'GO!';
      text.style.animation = 'none'; void text.offsetWidth; text.style.animation = '';
      playCountdownBeep(true);
    } else {
      clearInterval(iv); overlay.classList.remove('active'); cb();
    }
  }, 700);
}

function nextRound() {
  // Check if game should end before starting a new round
  if (isGameOver()) { gameOver(); return; }

  currentQuestion = generateQuestion();

  ensurePipes();
  targetPipe = findTargetPipe();

  if (!targetPipe) {
    initPipes();
    targetPipe = findTargetPipe();
  }

  const distance = targetPipe.x - (BIRD_X + BIRD_R);

  if (distance < 50) {
    const shift = 50 - distance + 20;
    pipes.forEach(p => {
      if (!p.scored) p.x += shift;
    });
    targetPipe = findTargetPipe();
  }

  const newDistance = targetPipe.x - (BIRD_X + BIRD_R);
  scrollSpeed = newDistance / timeLimit;
  questionTimer = timeLimit;

  bird.vy = 0;
  bird.rotation = 0;
  bird.expression = 'normal';
  bird.targetY = null;
  if (phase !== 'idle') bird.targetY = SKY_H / 2;

  collided = false;
  hitGround = false;
  phase = 'asking';
  phaseTimer = 0;
  inputEnabled = true;
  groundScrolling = true;

  document.getElementById('question-text').textContent = currentQuestion.text;
  document.getElementById('feedback-text').innerHTML = '&nbsp;';
  document.getElementById('answer-input').value = '';
  document.getElementById('answer-input').focus();
  updateTimerBar();
}

function submitAnswer() {
  if (!inputEnabled || phase !== 'asking') return;
  const val = document.getElementById('answer-input').value.trim();
  if (val === '') return;

  spawnBurstParticles(BIRD_X, bird.y);
  playFlapSound();

  inputEnabled = false;

  const num = parseInt(val, 10);
  if (num === currentQuestion.answer) {
    onCorrect();
  } else {
    onWrong();
  }
}

function onCorrect() {
  phase = 'correct';
  phaseTimer = 0;
  score++;
  stats.correct++;
  combo++;
  bird.expression = 'happy';
  bird.targetY = targetPipe.gapY;
  scrollSpeed = Math.max(scrollSpeed, 280);
  playCorrectSound();

  // Fireworks at combo milestones
  if (combo > 0 && combo % 5 === 0) {
    spawnFireworks(BIRD_X, bird.y, combo >= 10 ? 2 : 1);
    addFloatingText(BIRD_X, bird.y - 50, 'x' + combo + '!', '#FF4081', 36);
  }

  // Check for theme change
  updateTheme();

  const msgs = ['Great!','Awesome!','Super!','Yay!','Nice!','Cool!','Wow!','Yes!'];
  document.getElementById('feedback-text').textContent = msgs[Math.floor(Math.random()*msgs.length)];
  document.getElementById('feedback-text').style.color = '#FFEB3B';
}

function onWrong() {
  phase = 'wrong';
  phaseTimer = 0;
  stats.wrong++;
  combo = 0;
  bird.expression = 'sad';

  const gapTop = targetPipe.gapY - PIPE_GAP / 2;
  const gapBot = targetPipe.gapY + PIPE_GAP / 2;

  if (bird.y < targetPipe.gapY) {
    bird.targetY = Math.max(BIRD_R + 10, gapTop - BIRD_R * 1.5);
  } else {
    bird.targetY = Math.min(SKY_H - BIRD_R - 10, gapBot + BIRD_R * 1.5);
  }

  scrollSpeed = Math.max(scrollSpeed, 320);

  const inp = document.getElementById('answer-input');
  inp.classList.add('shake');
  setTimeout(() => inp.classList.remove('shake'), 500);

  document.getElementById('feedback-text').textContent = 'Answer: ' + currentQuestion.answer;
  document.getElementById('feedback-text').style.color = '#FF8A80';
}

function onTimeout() {
  phase = 'timeout';
  phaseTimer = 0;
  stats.timeout++;
  combo = 0;
  bird.expression = 'sad';
  inputEnabled = false;
  bird.vy = -50;
  if (gameMode === 'survival') lives--;
  groundScrolling = false;
  playTimeoutSound();

  document.getElementById('feedback-text').textContent = "Time's up! Answer: " + currentQuestion.answer;
  document.getElementById('feedback-text').style.color = '#FFB74D';
}

function onCollision() {
  if (collided) return;
  collided = true;
  if (gameMode === 'survival') lives--;
  screenShake = 10;
  scrollSpeed = 0;
  groundScrolling = false;
  spawnWrongParticles(BIRD_X + BIRD_R, bird.y);
  playWrongSound();
}

function onPipePassed() {
  if (targetPipe.scored) return;
  targetPipe.scored = true;
  playPassSound();
  spawnCorrectParticles(BIRD_X, bird.y);
  addFloatingText(BIRD_X + 40, bird.y - 30, '+1', '#FFD600', 34);
}

function gameOver() {
  phase = 'idle';
  inputEnabled = false;
  pipes = [];
  groundScrolling = false;
  stopMusic();
  playGameOverSound();

  const goTitle = document.getElementById('go-title');
  const goScore = document.getElementById('go-score');
  const goMsg = document.getElementById('go-message');
  const goStats = document.getElementById('go-stats');

  if (gameMode === 'timed') {
    goTitle.textContent = "Time's Up!";
    goTitle.style.color = '#FF7043';
    goScore.textContent = score;
    if (score >= 30) goMsg.textContent = 'Incredible speed!';
    else if (score >= 15) goMsg.textContent = 'Amazing math skills!';
    else if (score >= 5) goMsg.textContent = 'Good effort!';
    else goMsg.textContent = 'Keep practicing!';
  } else if (gameMode === 'questions') {
    goTitle.textContent = 'All Done!';
    goTitle.style.color = '#42A5F5';
    goScore.textContent = score + ' / ' + questionCount;
    const pct = score / questionCount;
    if (pct >= 0.9) goMsg.textContent = 'Nearly perfect!';
    else if (pct >= 0.7) goMsg.textContent = 'Great job!';
    else if (pct >= 0.5) goMsg.textContent = 'Good effort!';
    else goMsg.textContent = 'Keep practicing!';
  } else {
    if (score >= 20) { goTitle.textContent = 'AMAZING!'; goTitle.style.color = '#FFD600'; goMsg.textContent = 'You are a Math Superstar!'; }
    else if (score >= 10) { goTitle.textContent = 'Great Job!'; goTitle.style.color = '#66BB6A'; goMsg.textContent = 'You are getting really good!'; }
    else if (score >= 5) { goTitle.textContent = 'Good Try!'; goTitle.style.color = '#42A5F5'; goMsg.textContent = 'Keep practicing!'; }
    else { goTitle.textContent = 'Nice Try!'; goTitle.style.color = '#FF7043'; goMsg.textContent = 'Practice makes perfect!'; }
  }

  goStats.innerHTML = 'Correct: '+stats.correct+'<br>Wrong: '+stats.wrong+'<br>Timed Out: '+stats.timeout;
  showScreen('gameover');
}

function updateTimerBar() {
  if (phase !== 'asking' || !targetPipe) return;
  const pct = (questionTimer / timeLimit) * 100;
  const bar = document.getElementById('timer-bar');
  bar.style.width = pct + '%';
  if (pct > 50) bar.style.background = '#4CAF50';
  else if (pct > 25) bar.style.background = '#FFC107';
  else bar.style.background = '#F44336';
}

// ====================================================
// GAME LOOP
// ====================================================
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;
  globalTime += dt;

  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  updateClouds(dt);
  updateEffects(dt);
  updateThemeEffects(dt);
  if (groundScrolling) groundOffset += Math.max(scrollSpeed, 30) * dt;

  // Decrement global timer for timed mode during active play
  if (gameMode === 'timed' && phase !== 'idle') {
    globalTimer = Math.max(0, globalTimer - dt);
  }

  bird.frame = globalTime * 8;

  const recoveryTime = getRecoveryTime();

  if (phase === 'asking') {
    pipes.forEach(p => p.x -= scrollSpeed * dt);

    questionTimer -= dt;
    updateTimerBar();

    if (bird.targetY !== null) {
      bird.y += (bird.targetY - bird.y) * 4 * dt;
      if (Math.abs(bird.y - bird.targetY) < 1) { bird.y = bird.targetY; bird.targetY = null; }
    } else {
      bird.y = SKY_H/2 + Math.sin(globalTime * 3) * 12;
    }
    bird.rotation = Math.sin(globalTime * 2.5) * 0.06;

    // Check timed mode global timer
    if (gameMode === 'timed' && globalTimer <= 0) {
      gameOver();
    } else if (questionTimer <= 0) {
      onTimeout();
    }

  } else if (phase === 'correct') {
    phaseTimer += dt;

    scrollSpeed = Math.max(scrollSpeed, 280);
    pipes.forEach(p => p.x -= scrollSpeed * dt);

    if (bird.targetY !== null) {
      const diff = bird.targetY - bird.y;
      bird.y += diff * 6 * dt;
      bird.rotation = diff > 2 ? 0.25 : diff < -2 ? -0.25 : 0;
      if (Math.abs(diff) < 1) bird.targetY = null;
    } else {
      bird.rotation = -0.15;
    }

    if (!targetPipe.scored && targetPipe.x + PIPE_W < BIRD_X - BIRD_R) {
      onPipePassed();
    }

    if (targetPipe.scored && phaseTimer > 0.6) {
      ensurePipes();
      if (isGameOver()) gameOver();
      else nextRound();
    }

  } else if (phase === 'wrong') {
    phaseTimer += dt;

    if (!collided) {
      scrollSpeed = Math.max(scrollSpeed, 320);
      pipes.forEach(p => p.x -= scrollSpeed * dt);

      if (bird.targetY !== null) {
        const diff = bird.targetY - bird.y;
        bird.y += diff * 5 * dt;
        bird.rotation = diff > 2 ? 0.25 : diff < -2 ? -0.25 : 0;
        if (Math.abs(diff) < 1) bird.targetY = null;
      }

      if (targetPipe.x <= BIRD_X + BIRD_R) {
        onCollision();
      }
    } else {
      bird.vy += GRAVITY * dt;
      bird.y += bird.vy * dt;
      bird.rotation = Math.min(bird.rotation + 5 * dt, 1.5);

      if (bird.y >= SKY_H - BIRD_R) {
        bird.y = SKY_H - BIRD_R;
        if (!hitGround) {
          hitGround = true;
          bird.vy = -150;
          screenShake = 6;
        } else if (Math.abs(bird.vy) < 30) {
          bird.vy = 0;
        }
      }

      if (phaseTimer > recoveryTime) {
        if (isGameOver()) gameOver();
        else nextRound();
      }
    }

  } else if (phase === 'timeout') {
    phaseTimer += dt;

    bird.vy += GRAVITY * dt;
    bird.y += bird.vy * dt;
    bird.rotation = Math.min(bird.rotation + 5 * dt, 1.5);

    if (bird.y >= SKY_H - BIRD_R) {
      bird.y = SKY_H - BIRD_R;
      if (!hitGround) {
        hitGround = true;
        bird.vy = -200;
        screenShake = 8;
        spawnWrongParticles(BIRD_X, bird.y);
      }
    }

    if (phaseTimer > recoveryTime) {
      if (isGameOver()) gameOver();
      else nextRound();
    }

  } else {
    bird.y = SKY_H / 2 + Math.sin(globalTime * 2.5) * 15;
    bird.rotation = Math.sin(globalTime * 2) * 0.08;
    bird.expression = 'normal';
  }
}

function render() {
  ctx.save();
  if (screenShake > 0) {
    ctx.translate(
      (Math.random()-0.5) * screenShake * 2,
      (Math.random()-0.5) * screenShake * 2
    );
  }

  drawBackground();

  pipes.forEach(p => {
    if (p.x + PIPE_W + PIPE_CAP_EXTRA >= -10 && p.x - PIPE_CAP_EXTRA <= CW) {
      drawPipe(p.x, p.gapY);
    }
  });

  drawGround();
  drawBird(BIRD_X, bird.y, bird.rotation, bird.frame, bird.expression);
  drawParticles();
  drawFloatingTexts();
  drawHUD();

  ctx.restore();
}
