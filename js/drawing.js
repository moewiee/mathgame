// ====================================================
// CLOUDS
// ====================================================
function initClouds() {
  clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: Math.random() * CW,
      y: 15 + Math.random() * 80,
      w: 45 + Math.random() * 65,
      h: 18 + Math.random() * 14,
      speed: 10 + Math.random() * 18
    });
  }
}

function updateClouds(dt) {
  clouds.forEach(c => {
    c.x -= c.speed * dt;
    if (c.x + c.w < 0) { c.x = CW + 20; c.y = 15 + Math.random() * 80; }
  });
}

function drawClouds() {
  ctx.fillStyle = currentTheme.cloudColor;
  clouds.forEach(c => {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w/2, c.h/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - c.w*0.28, c.y+4, c.w*0.28, c.h*0.38, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x + c.w*0.25, c.y+3, c.w*0.32, c.h*0.42, 0, 0, Math.PI*2);
    ctx.fill();
  });
}

// ====================================================
// DRAWING
// ====================================================
function drawBackground() {
  const t = currentTheme;
  const grd = ctx.createLinearGradient(0, 0, 0, SKY_H);
  grd.addColorStop(0, t.skyTop);
  grd.addColorStop(1, t.skyBottom);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, CW, SKY_H);
  if (t.hasStars) drawStars();
  if (t.hasMoon) drawMoon();
  drawClouds();
  if (t.hasBubbles) drawBubbles();
}

function drawGround() {
  const t = currentTheme;
  const gy = SKY_H;
  ctx.fillStyle = t.groundColor;
  ctx.fillRect(0, gy, CW, GROUND_H);
  ctx.fillStyle = t.groundStripe;
  const sw = 32;
  const off = groundOffset % (sw * 2);
  for (let x = -off - sw; x < CW + sw * 2; x += sw * 2) {
    ctx.fillRect(x, gy, sw, 7);
  }
  ctx.fillStyle = t.grassColor;
  for (let x = -off % 18; x < CW + 18; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + 4, gy - 6);
    ctx.lineTo(x + 8, gy);
    ctx.fill();
  }
  ctx.fillStyle = t.dirtColor;
  ctx.fillRect(0, CH - 10, CW, 10);
}

function drawPipe(px, gapY) {
  const t = currentTheme;
  const gapTop = gapY - PIPE_GAP / 2;
  const gapBot = gapY + PIPE_GAP / 2;
  const ce = PIPE_CAP_EXTRA;
  const ch = PIPE_CAP_H;

  // --- Top pipe ---
  const topBodyH = Math.max(0, gapTop - ch);
  ctx.fillStyle = t.pipeBody;
  ctx.fillRect(px, 0, PIPE_W, topBodyH);
  ctx.fillStyle = t.pipeCap;
  ctx.fillRect(px - ce/2, topBodyH, PIPE_W + ce, ch);
  ctx.fillStyle = 'rgba(255,255,255,0.13)';
  ctx.fillRect(px + 5, 0, 7, topBodyH);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(px + PIPE_W - 6, 0, 6, topBodyH);

  // --- Bottom pipe ---
  const botTop = gapBot;
  const botCapTop = botTop;
  const botBodyTop = botTop + ch;
  const botBodyH = SKY_H - botBodyTop;
  ctx.fillStyle = t.pipeCap;
  ctx.fillRect(px - ce/2, botCapTop, PIPE_W + ce, ch);
  ctx.fillStyle = t.pipeBody;
  if (botBodyH > 0) ctx.fillRect(px, botBodyTop, PIPE_W, botBodyH);
  ctx.fillStyle = 'rgba(255,255,255,0.13)';
  if (botBodyH > 0) ctx.fillRect(px + 5, botBodyTop, 7, botBodyH);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  if (botBodyH > 0) ctx.fillRect(px + PIPE_W - 6, botBodyTop, 6, botBodyH);
}

function drawBird(x, y, rot, wingFrame, expr) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  ctx.beginPath();
  ctx.ellipse(3, 4, BIRD_R, BIRD_R * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = '#FFD600';
  ctx.strokeStyle = '#F9A825';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Belly
  ctx.fillStyle = '#FFF9C4';
  ctx.beginPath();
  ctx.ellipse(2, 5, 10, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  const wy = Math.sin(wingFrame) * 7;
  ctx.fillStyle = '#FFB300';
  ctx.strokeStyle = '#F57F17';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(-5, wy - 2, 13, 6, -0.2, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Eye
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(9, -6, 7, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  if (expr === 'happy') {
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(11, -6, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(12, -8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,138,128,0.45)';
    ctx.beginPath();
    ctx.ellipse(4, 5, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (expr === 'sad') {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(7, -9); ctx.lineTo(13, -3);
    ctx.moveTo(13, -9); ctx.lineTo(7, -3);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(11, -6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(12, -8, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Beak
  ctx.fillStyle = '#FF7043';
  ctx.beginPath();
  ctx.moveTo(16, -1);
  ctx.lineTo(28, 3);
  ctx.lineTo(16, 7);
  ctx.closePath();
  ctx.fill();

  // Graduation cap (perfect streak)
  const isPerfect = phase !== 'idle' && stats.correct > 0 && stats.wrong === 0 && stats.timeout === 0;
  if (isPerfect) {
    // Board (diamond shape)
    ctx.fillStyle = '#1A237E';
    ctx.strokeStyle = '#0D1752';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-14, -BIRD_R);
    ctx.lineTo(0, -BIRD_R - 5);
    ctx.lineTo(14, -BIRD_R);
    ctx.lineTo(0, -BIRD_R + 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Tassel
    ctx.strokeStyle = '#FFD600';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -BIRD_R);
    ctx.quadraticCurveTo(12, -BIRD_R + 4, 11, -BIRD_R + 10);
    ctx.stroke();
    ctx.fillStyle = '#FFD600';
    ctx.beginPath();
    ctx.arc(11, -BIRD_R + 11, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawHeart(cx, cy, size) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.4);
  ctx.bezierCurveTo(cx, cy - size*0.2, cx-size, cy-size*0.5, cx-size, cy+size*0.1);
  ctx.bezierCurveTo(cx-size, cy+size*0.6, cx, cy+size, cx, cy+size*1.1);
  ctx.bezierCurveTo(cx, cy+size, cx+size, cy+size*0.6, cx+size, cy+size*0.1);
  ctx.bezierCurveTo(cx+size, cy-size*0.5, cx, cy-size*0.2, cx, cy+size*0.4);
  ctx.fill();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function drawHUD() {
  // Score (left side) - all modes
  ctx.font = 'bold 22px "Comic Sans MS", cursive';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillText('Score: ' + score, 13, 29);
  ctx.fillStyle = '#fff';
  ctx.fillText('Score: ' + score, 11, 27);

  // Right side - mode specific
  if (gameMode === 'survival') {
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < lives ? '#EF5350' : 'rgba(0,0,0,0.15)';
      drawHeart(CW - 18 - i * 30, 18, 11);
    }
  } else if (gameMode === 'timed') {
    const timeStr = formatTime(globalTimer);
    ctx.font = 'bold 24px "Comic Sans MS", cursive';
    ctx.textAlign = 'right';
    const timerColor = globalTimer > 60 ? '#fff' : globalTimer > 30 ? '#FFC107' : '#F44336';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillText(timeStr, CW - 9, 29);
    ctx.fillStyle = timerColor;
    ctx.fillText(timeStr, CW - 11, 27);
  } else if (gameMode === 'questions') {
    const answered = stats.correct + stats.wrong + stats.timeout;
    const qStr = answered + '/' + questionCount;
    ctx.font = 'bold 20px "Comic Sans MS", cursive';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillText('Q ' + qStr, CW - 9, 29);
    ctx.fillStyle = '#fff';
    ctx.fillText('Q ' + qStr, CW - 11, 27);
  }

  // Combo display
  if (combo >= 2 && phase !== 'idle') {
    ctx.font = 'bold 18px "Comic Sans MS", cursive';
    ctx.textAlign = 'left';
    const comboColor = combo >= 10 ? '#FF4081' : combo >= 5 ? '#FFD600' : '#40C4FF';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillText('x' + combo + ' Combo!', 13, 51);
    ctx.fillStyle = comboColor;
    ctx.fillText('x' + combo + ' Combo!', 11, 49);
  }
}

function drawStar(c, x, y, r) {
  c.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
    c[i === 0 ? 'moveTo' : 'lineTo'](x + Math.cos(a)*r, y + Math.sin(a)*r);
  }
  c.closePath(); c.fill();
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    if (p.star) drawStar(ctx, p.x, p.y, p.size);
    else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); }
  });
  ctx.globalAlpha = 1;
}

function drawFloatingTexts() {
  floatingTexts.forEach(ft => {
    ctx.globalAlpha = Math.max(0, ft.alpha);
    ctx.font = `bold ${ft.size||28}px "Comic Sans MS", cursive`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillText(ft.text, ft.x+2, ft.y+2);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  });
  ctx.globalAlpha = 1;
}
