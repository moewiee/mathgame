// ====================================================
// QUESTION GENERATOR
// ====================================================
function generateQuestion() {
  let maxNum;
  switch (difficulty) {
    case 'easy': maxNum = 10; break;
    case 'medium': maxNum = 20; break;
    case 'hard': maxNum = 100; break;
  }
  const isAdd = Math.random() > 0.5;
  let a, b;
  if (isAdd) {
    a = Math.floor(Math.random() * maxNum) + 1;
    b = Math.floor(Math.random() * maxNum) + 1;
    return { text: a + ' + ' + b + ' = ?', answer: a + b };
  } else {
    a = Math.floor(Math.random() * maxNum) + 1;
    b = Math.floor(Math.random() * a) + 1;
    return { text: a + ' \u2212 ' + b + ' = ?', answer: a - b };
  }
}
