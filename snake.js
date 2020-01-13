const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

const getRandomNumUnder = function(number) {
  return Math.round(Math.random() * number);
};

const isInSameCell = function(body, cell) {
  const [cellCol, cellRow] = cell;
  return body.some(([col, row]) => col === cellCol && row === cellRow);
};

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = "grid";
const SCORE = "progress";

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + "_" + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const fillScores = function(score) {
  const cell = document.getElementById(SCORE);
  cell.style.width = `${score}%`;
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const clearFood = function(food) {
  let [colId, rowId] = food.positions;
  const cell = getCell(colId, rowId);
  cell.classList.remove("food");
};

const drawFood = function(food) {
  const [colId, rowId] = food.positions;
  const cell = getCell(colId, rowId);
  cell.classList.add("food");
};

const handleKeyPress = snake => {
  snake.turnLeft();
};

const moveAndDrawSnake = function(snake) {
  snake.move();
  eraseTail(snake);
  drawSnake(snake);
};

const attachEventListeners = snake => {
  document.body.onkeydown = handleKeyPress.bind(null, snake);
};

const setUp = function(game) {
  attachEventListeners(game.snake);
  createGrids();
  drawSnake(game.snake);
  drawSnake(game.ghostSnake);
  drawFood(game.food);
};

const animateSnake = function(snake, ghostSnake) {
  moveAndDrawSnake(snake);
  moveAndDrawSnake(ghostSnake);
};

const randomlyTurnSnake = function(snake) {
  let x = Math.random() * 100;
  if (x > 50) {
    snake.turnLeft();
  }
};

const initSnake = function() {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), "snake");
};

const initGhostSnake = function() {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(EAST), "ghost");
};

const drawUpdatedGame = function(game) {
  animateSnake(game.snake, game.ghostSnake);
  randomlyTurnSnake(game.ghostSnake);
  clearFood(game.previousFood);
  drawFood(game.food);
  fillScores(game.score);
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(10, 10, 2);
  const game = new Game(snake, ghostSnake, food, [99, 59], 0);
  setUp(game);
  const runGame = setInterval(() => {
    game.update();
    if (game.isGameOver()) {
      alert("GAME OVER");
      clearInterval(runGame);
    }
    if (game.score === NUM_OF_COLS) {
      alert("YOU WON");
      clearInterval(runGame);
    }
    drawUpdatedGame(game);
  }, 200);
};
