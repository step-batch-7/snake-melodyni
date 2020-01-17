const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

const getRandomNumUnder = function(number) {
  return Math.floor(Math.random() * number);
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

const showScore = function(score) {
  const cell = document.getElementById(SCORE);
  cell.style.width = `${score}%`;
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.positions.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const clearFood = function() {
  const foodElement =
    document.querySelector(".food") || document.querySelector(".powerFood");
  foodElement.classList.remove("food", "powerFood");
};

const drawFood = function(food) {
  const [colId, rowId] = food.positions;
  const cell = getCell(colId, rowId);
  cell.classList.add(food.quality);
};

const handleKeyPress = game => {
  game.turnSnake("snake");
};

const moveAndDrawSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const setUp = function(game) {
  const { snake, ghostSnake, food } = game.status();
  attachEventListeners(game);
  createGrids();
  drawSnake(snake);
  drawSnake(ghostSnake);
  drawFood(food);
};

const animateSnakes = function(snake, ghostSnake) {
  moveAndDrawSnake(snake);
  moveAndDrawSnake(ghostSnake);
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

const drawGame = function(game) {
  const { snake, ghostSnake, food, score } = game.status();
  animateSnakes(snake, ghostSnake);
  clearFood();
  drawFood(food);
  showScore(score);
};

const animateGame = function(runGame, game) {
  game.update();
  if (game.isOver()) {
    clearInterval(runGame);
  }
  game.turnGhostSnake();
  drawGame(game);
};

const createGame = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(45, 25, 1, "food");
  const game = new Game(snake, ghostSnake, food, [99, 59], 0);
  return game;
};

const main = function() {
  const game = createGame();
  setUp(game);
  const runGame = setInterval(() => {
    animateGame(runGame, game);
  }, 100);
};
