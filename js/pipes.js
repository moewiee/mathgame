// ====================================================
// PIPE SYSTEM
// ====================================================
function getPipeSpacing() {
  return Math.max(140, 200 - score * 4);
}

function initPipes() {
  pipes = [];
  const spacing = getPipeSpacing();
  let startX = CW * 0.75;

  for (let i = 0; i < 8; i++) {
    const minGap = PIPE_GAP / 2 + PIPE_CAP_H + 20;
    const maxGap = SKY_H - (PIPE_GAP / 2 + PIPE_CAP_H + 20);
    let gapY;

    if (pipes.length === 0) {
      gapY = minGap + Math.random() * (maxGap - minGap);
    } else {
      const prevGapY = pipes[pipes.length - 1].gapY;
      do {
        gapY = minGap + Math.random() * (maxGap - minGap);
      } while (Math.abs(gapY - prevGapY) < 35);
    }

    pipes.push({
      x: startX + i * spacing,
      gapY: gapY,
      scored: false
    });
  }
}

function findTargetPipe() {
  for (let p of pipes) {
    if (!p.scored && p.x + PIPE_W > BIRD_X - BIRD_R) {
      return p;
    }
  }
  return null;
}

function ensurePipes() {
  pipes = pipes.filter(p => p.x + PIPE_W + PIPE_CAP_EXTRA >= -10);

  while (pipes.length < 8) {
    const lastPipe = pipes[pipes.length - 1];
    const spacing = getPipeSpacing();
    const minGap = PIPE_GAP / 2 + PIPE_CAP_H + 20;
    const maxGap = SKY_H - (PIPE_GAP / 2 + PIPE_CAP_H + 20);

    let gapY;
    do {
      gapY = minGap + Math.random() * (maxGap - minGap);
    } while (Math.abs(gapY - lastPipe.gapY) < 35);

    pipes.push({
      x: lastPipe.x + spacing,
      gapY: gapY,
      scored: false
    });
  }
}
