// ====================================================
// QUESTION GENERATOR
// ====================================================

// Returns random int in [1, max], biased toward higher values
function biasedRand(max) {
  return Math.floor(Math.pow(Math.random(), 0.55) * max) + 1;
}

function generateQuestion() {
  let a, b;
  const r = Math.random();

  if (difficulty === 'easy') {
    // +/- only, numbers 1-10, uniform
    if (r < 0.5) {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      return { text: a + ' + ' + b + ' = ?', answer: a + b };
    } else {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * a) + 1;
      return { text: a + ' \u2212 ' + b + ' = ?', answer: a - b };
    }

  } else if (difficulty === 'medium') {
    // +/- (1-20) biased high, × (1-10) — equal 1/3 split
    if (r < 0.34) {
      a = biasedRand(20);
      b = biasedRand(20);
      return { text: a + ' + ' + b + ' = ?', answer: a + b };
    } else if (r < 0.67) {
      a = biasedRand(20);
      b = Math.floor(Math.random() * a) + 1;
      return { text: a + ' \u2212 ' + b + ' = ?', answer: a - b };
    } else {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      return { text: a + ' \u00D7 ' + b + ' = ?', answer: a * b };
    }

  } else {
    // hard: +/- (1-100) biased high, × (1-20 × 1-10) — 30/30/40
    if (r < 0.3) {
      a = biasedRand(100);
      b = biasedRand(100);
      return { text: a + ' + ' + b + ' = ?', answer: a + b };
    } else if (r < 0.6) {
      a = biasedRand(100);
      b = Math.floor(Math.random() * a) + 1;
      return { text: a + ' \u2212 ' + b + ' = ?', answer: a - b };
    } else {
      a = biasedRand(20);
      b = Math.floor(Math.random() * 10) + 1;
      return { text: a + ' \u00D7 ' + b + ' = ?', answer: a * b };
    }
  }
}
