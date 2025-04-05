import readline from 'readline';

// Game configuration
const width = 20;
const height = 10;
const frameRate = 100; // milliseconds
const initialSnakeLength = 3;

// Game state
let snake = [];
let direction = 'right';
let food = { x: 0, y: 0 };
let score = 0;
let gameOver = false;

// Initialize the game
function init() {
  // Create initial snake in the middle of the board
  const startX = Math.floor(width / 2);
  const startY = Math.floor(height / 2);
  
  snake = [];
  for (let i = 0; i < initialSnakeLength; i++) {
    snake.push({ x: startX - i, y: startY });
  }
  
  // Place initial food
  placeFood();
  
  // Set up input handling
  setupInput();
  
  // Start game loop
  gameLoop();
}

// Place food at a random position not occupied by the snake
function placeFood() {
  let foodPlaced = false;
  
  while (!foodPlaced) {
    food = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    
    // Check if food is on snake
    foodPlaced = true;
    for (const segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        foodPlaced = false;
        break;
      }
    }
  }
}

// Set up keyboard input
function setupInput() {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    }
    
    switch (key.name) {
      case 'up':
        if (direction !== 'down') direction = 'up';
        break;
      case 'down':
        if (direction !== 'up') direction = 'down';
        break;
      case 'left':
        if (direction !== 'right') direction = 'left';
        break;
      case 'right':
        if (direction !== 'left') direction = 'right';
        break;
      case 'r':
        if (gameOver) {
          gameOver = false;
          score = 0;
          direction = 'right';
          init();
        }
        break;
    }
  });
}

// Main game loop
function gameLoop() {
  if (gameOver) return;
  
  // Move snake
  moveSnake();
  
  // Check collisions
  checkCollisions();
  
  // Draw game
  draw();
  
  // Schedule next frame
  setTimeout(gameLoop, frameRate);
}

// Move the snake based on current direction
function moveSnake() {
  // Create new head based on direction
  const head = { x: snake[0].x, y: snake[0].y };
  
  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  // Add new head to snake
  snake.unshift(head);
  
  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    placeFood();
  } else {
    // Remove tail if no food was eaten
    snake.pop();
  }
}

// Check for collisions with walls or self
function checkCollisions() {
  const head = snake[0];
  
  // Check wall collisions
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
    gameOver = true;
    return;
  }
  
  // Check self collisions (starting from index 1 to avoid checking head against itself)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      return;
    }
  }
}

// Draw the game board
function draw() {
  // Clear console
  console.clear();
  
  // Create empty board
  const board = Array(height).fill().map(() => Array(width).fill(' '));
  
  // Draw snake
  for (const segment of snake) {
    if (segment.x >= 0 && segment.x < width && segment.y >= 0 && segment.y < height) {
      board[segment.y][segment.x] = segment === snake[0] ? 'O' : 'o';
    }
  }
  
  // Draw food
  board[food.y][food.x] = '*';
  
  // Draw board
  let output = '';
  
  // Top border
  output += '+' + '-'.repeat(width) + '+\n';
  
  // Board content
  for (const row of board) {
    output += '|' + row.join('') + '|\n';
  }
  
  // Bottom border
  output += '+' + '-'.repeat(width) + '+\n';
  
  // Score and instructions
  output += `Score: ${score}\n`;
  output += gameOver ? 'Game Over! Press R to restart or Ctrl+C to exit\n' : 'Use arrow keys to move, Ctrl+C to exit\n';
  
  console.log(output);
}

// Start the game
init();