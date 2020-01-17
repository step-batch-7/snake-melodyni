class Game {
  constructor(snake, ghostSnake, food, gridSize, score) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.gridSize = gridSize;
    this.score = score;
  }

  hasFoodEaten() {
    const headOfSnake = [this.snake.head];
    const foodPosition = this.food.positions;
    return isInSameCell(headOfSnake, foodPosition);
  }

  generateFood() {
    const colId = getRandomNumUnder(NUM_OF_COLS);
    const rowId = getRandomNumUnder(NUM_OF_ROWS);
    this.food = new Food(colId, rowId, 1, "food");
    if (this.score % 10 === 0) {
      this.food = new Food(colId, rowId, 5, "powerFood");
    }
  }

  hasTouchedEdges() {
    const [gridWidth, gridHeight] = this.gridSize;
    const [headCol, headRow] = this.snake.head;
    const touchedHorizontalEdge = 0 > headCol || headCol > gridWidth;
    const touchedVerticalEdge = 0 > headRow || headRow > gridHeight;

    return touchedHorizontalEdge || touchedVerticalEdge;
  }

  hasPlayerWon() {
    return this.score >= this.gridSize[0];
  }

  turnSnake() {
    this.snake.turnLeft();
  }

  update() {
    if (this.hasFoodEaten()) {
      this.score = this.score + this.food.point;
      this.snake.grow();
      this.generateFood();
    }
    this.snake.move();
    this.ghostSnake.move();
  }

  isOver() {
    return this.snake.hasTouchedItself() || this.hasTouchedEdges() || this.hasPlayerWon();
  }

  status() {
    return {
      food: this.food.status(),
      snake: this.snake.status(),
      ghostSnake: this.ghostSnake.status(),
      score: this.score
    }
  }

  turnGhostSnake() {
    let x = Math.random() * 100;
    if (x > 50) {
      this.ghostSnake.turnLeft()
    }
  }
}

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }
}

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get head() {
    return this.positions[this.positions.length - 1];
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  move() {
    const [headX, headY] = this.head;
    this.previousTail = this.positions.shift();
    const [deltaX, deltaY] = this.direction.delta;
    this.positions.push([headX + deltaX, headY + deltaY]);
  }

  grow() {
    this.positions.unshift(this.previousTail);
  }

  hasTouchedItself() {
    const bodyOfSnake = this.location.slice(0, -1);
    return isInSameCell(bodyOfSnake, this.head);
  }

  status() {
    return {
      positions: this.location,
      species: this.species,
      previousTail: this.previousTail
    }
  }
}

class Food {
  constructor(colId, rowId, energy, type) {
    this.colId = colId;
    this.rowId = rowId;
    this.energy = energy;
    this.type = type;
  }

  get positions() {
    return [this.colId, this.rowId];
  }
  get point() {
    return this.energy;
  }
  get quality() {
    return this.type;
  }
  status() {
    return {
      positions: this.positions,
      point: this.point,
      quality: this.quality
    }
  }
}
