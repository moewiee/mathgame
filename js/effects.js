// ====================================================
// EFFECTS
// ====================================================
function spawnCorrectParticles(x, y) {
  const colors = ['#FFD600','#FF6F00','#FF4081','#00E676','#40C4FF','#FF80AB'];
  for (let i = 0; i < 24; i++) {
    particles.push({
      x, y,
      vx: (Math.random()-0.5)*350,
      vy: (Math.random()-0.5)*350 - 100,
      life: 1, decay: 0.6 + Math.random()*0.5,
      color: colors[Math.floor(Math.random()*colors.length)],
      size: 3 + Math.random()*5,
      star: Math.random() > 0.4
    });
  }
}

function spawnWrongParticles(x, y) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x, y,
      vx: (Math.random()-0.5)*200,
      vy: (Math.random()-0.5)*200,
      life: 1, decay: 1.2,
      color: '#FF5252', size: 3+Math.random()*3, star: false
    });
  }
}

function spawnBurstParticles(x, y) {
  const colors = ['#FFD600','#FFF','#40C4FF','#FF6F00'];
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const speed = 120 + Math.random() * 100;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 2.0,
      color: colors[Math.floor(Math.random()*colors.length)],
      size: 3 + Math.random()*4,
      star: Math.random() > 0.5
    });
  }
}

function spawnFireworks(x, y, intensity) {
  const colors = ['#FFD600','#FF4081','#40C4FF','#00E676','#FF6F00','#E040FB','#FF80AB','#FFAB40'];
  const count = intensity * 22;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = 150 + Math.random() * 200;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 60,
      vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 60 - 50,
      life: 1,
      decay: 0.4 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 4,
      star: true
    });
  }
}

function addFloatingText(x, y, text, color, size) {
  floatingTexts.push({ x, y, text, color, vy: -70, alpha: 1, size: size || 30 });
}

function updateEffects(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vy += 280 * dt; p.life -= p.decay * dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy * dt; ft.alpha -= 0.55 * dt;
    if (ft.alpha <= 0) floatingTexts.splice(i, 1);
  }
  if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 18);
}
