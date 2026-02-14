// ====================================================
// THEME SYSTEM
// ====================================================
const THEMES = {
  meadow: {
    skyTop: '#87CEEB', skyBottom: '#B3E5FC',
    groundColor: '#4CAF50', groundStripe: '#66BB6A', grassColor: '#81C784', dirtColor: '#6D4C41',
    pipeBody: '#388E3C', pipeCap: '#2E7D32',
    cloudColor: 'rgba(255,255,255,0.75)',
    hasStars: false, hasMoon: false, hasBubbles: false
  },
  night: {
    skyTop: '#0D1B2A', skyBottom: '#1B2838',
    groundColor: '#2E7D32', groundStripe: '#388E3C', grassColor: '#43A047', dirtColor: '#3E2723',
    pipeBody: '#1B5E20', pipeCap: '#145214',
    cloudColor: 'rgba(180,180,200,0.25)',
    hasStars: true, hasMoon: true, hasBubbles: false
  },
  desert: {
    skyTop: '#FF8F00', skyBottom: '#FFE082',
    groundColor: '#D4A843', groundStripe: '#C49A38', grassColor: '#BFA44E', dirtColor: '#8D6E63',
    pipeBody: '#A1887F', pipeCap: '#8D6E63',
    cloudColor: 'rgba(255,255,255,0.5)',
    hasStars: false, hasMoon: false, hasBubbles: false
  },
  space: {
    skyTop: '#1A0033', skyBottom: '#2D1B4E',
    groundColor: '#616161', groundStripe: '#757575', grassColor: '#9E9E9E', dirtColor: '#424242',
    pipeBody: '#4527A0', pipeCap: '#311B92',
    cloudColor: 'rgba(150,130,200,0.12)',
    hasStars: true, hasMoon: false, hasBubbles: false
  },
  underwater: {
    skyTop: '#006064', skyBottom: '#00838F',
    groundColor: '#FF8A65', groundStripe: '#FF7043', grassColor: '#4DB6AC', dirtColor: '#5D4037',
    pipeBody: '#00695C', pipeCap: '#004D40',
    cloudColor: 'rgba(255,255,255,0.15)',
    hasStars: false, hasMoon: false, hasBubbles: true
  }
};

let currentThemeName = 'meadow';
let currentTheme = THEMES.meadow;
let themeStars = [];
let themeBubbles = [];

function getThemeNameForScore(s) {
  if (s >= 20) return 'underwater';
  if (s >= 15) return 'space';
  if (s >= 10) return 'desert';
  if (s >= 5) return 'night';
  return 'meadow';
}

function updateTheme() {
  const newName = getThemeNameForScore(score);
  if (newName !== currentThemeName) {
    currentThemeName = newName;
    currentTheme = THEMES[newName];
    initThemeEffects();
    const texts = {
      night: 'Night Falls!',
      desert: 'Desert Heat!',
      space: 'Blast Off!',
      underwater: 'Deep Dive!'
    };
    if (texts[newName]) {
      addFloatingText(CW / 2, SKY_H / 2 - 20, texts[newName], '#FFD600', 38);
    }
  }
}

function resetTheme() {
  currentThemeName = 'meadow';
  currentTheme = THEMES.meadow;
  initThemeEffects();
}

function initThemeEffects() {
  if (currentTheme.hasStars) initStars();
  else themeStars = [];
  if (currentTheme.hasBubbles) initBubbles();
  else themeBubbles = [];
}

// ====================================================
// STARS
// ====================================================
function initStars() {
  themeStars = [];
  for (let i = 0; i < 60; i++) {
    themeStars.push({
      x: Math.random() * CW,
      y: Math.random() * (SKY_H - 30) + 5,
      size: 0.5 + Math.random() * 2,
      twinkleSpeed: 0.5 + Math.random() * 2,
      offset: Math.random() * Math.PI * 2
    });
  }
}

function drawStars() {
  themeStars.forEach(s => {
    const alpha = 0.3 + 0.7 * Math.abs(Math.sin(globalTime * s.twinkleSpeed + s.offset));
    ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ====================================================
// MOON
// ====================================================
function drawMoon() {
  const mx = CW - 120, my = 55, mr = 22;
  // Glow
  ctx.fillStyle = 'rgba(255,248,225,0.08)';
  ctx.beginPath();
  ctx.arc(mx, my, mr + 15, 0, Math.PI * 2);
  ctx.fill();
  // Moon body
  ctx.fillStyle = '#FFF8E1';
  ctx.beginPath();
  ctx.arc(mx, my, mr, 0, Math.PI * 2);
  ctx.fill();
  // Crescent shadow
  ctx.fillStyle = currentTheme.skyTop;
  ctx.beginPath();
  ctx.arc(mx + 9, my - 4, mr * 0.82, 0, Math.PI * 2);
  ctx.fill();
}

// ====================================================
// BUBBLES
// ====================================================
function initBubbles() {
  themeBubbles = [];
  for (let i = 0; i < 18; i++) {
    themeBubbles.push({
      x: Math.random() * CW,
      y: Math.random() * SKY_H,
      r: 3 + Math.random() * 8,
      speed: 20 + Math.random() * 40,
      wobbleOffset: Math.random() * Math.PI * 2
    });
  }
}

function updateBubbles(dt) {
  themeBubbles.forEach(b => {
    b.y -= b.speed * dt;
    b.x += Math.sin(b.wobbleOffset + globalTime * 2) * 15 * dt;
    if (b.y + b.r < 0) {
      b.y = SKY_H + b.r;
      b.x = Math.random() * CW;
    }
  });
}

function drawBubbles() {
  themeBubbles.forEach(b => {
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateThemeEffects(dt) {
  if (currentTheme.hasBubbles) updateBubbles(dt);
}
