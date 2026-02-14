// ====================================================
// GAME STATE
// ====================================================
let difficulty = 'easy';
let timeLimit = 20;
let score = 0;
let lives = 3;
let stats = { correct: 0, wrong: 0, timeout: 0 };
let currentQuestion = null;
let inputEnabled = false;
let combo = 0;

// Game modes: 'timed', 'survival', 'questions'
let gameMode = 'survival';
let timedDuration = 5;    // minutes for timed mode
let questionCount = 20;   // number of questions for questions mode
let globalTimer = 0;      // seconds remaining for timed mode

// Bird
let bird = { y: 0, vy: 0, rotation: 0, frame: 0, expression: 'normal', targetY: null };

// Pipes - array of {x, gapY, scored}
let pipes = [];
let targetPipe = null;
let scrollSpeed = 0;
let questionTimer = 0;

// Phases: idle, asking, correct, wrong, timeout
let phase = 'idle';
let phaseTimer = 0;
let collided = false;

// Scrolling ground
let groundOffset = 0;
let groundScrolling = true;

// Effects
let particles = [];
let floatingTexts = [];
let screenShake = 0;
let clouds = [];
let hitGround = false;

// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Timing
let lastTime = 0;
let globalTime = 0;
