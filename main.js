const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector(".up");
const btnLeft = document.querySelector(".left");
const btnRight = document.querySelector(".right");
const btnDown = document.querySelector(".down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);
let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemiesPositions = [];

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.75;
  } else {
    canvasSize = window.innerHeight * 0.75;
  }

  canvasSize = Number(canvasSize.toFixed(0));

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = Number((canvasSize / 10).toFixed(0));

  playerPosition.x = undefined;
  playerPosition.y = undefined;

  startGame();
}
function startGame() {
  /* Metodos del Canvas */
  //game.fillRect(0, 0, 100, 100);
  //game.clearRect(0, 50, 50, 50);
  //game.font = "25px Verdana";
  //game.fillStyle = "purple";
  //game.textAlign = "center";
  //game.fillText("juego", 50, 50);
  game.font = `${elementSize}px Verdana`;
  game.textAlign = "end";
  //game.fillText(emojis["X"], 0, elementSize);

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(() => {
      showTime();
    }, 100);
    showRecord();
  }
  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));

  showLives();
  //console.log({ mapRows, mapRowCols });
  enemiesPositions = [];
  game.clearRect(0, 0, canvasSize, canvasSize);
  mapRowCols.forEach((row, iRow) => {
    row.forEach((col, iCol) => {
      const emoji = emojis[col];
      const posX = elementSize * (iCol + 1.3);
      const posY = elementSize * (iRow + 1);

      if (col === "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          //console.log({ playerPosition });
        }
      } else if (col === "I") {
        giftPosition.x = Math.trunc(posX);
        giftPosition.y = Math.trunc(posY);
        //console.log({ giftPosition });
      } else if (col === "X") {
        enemiesPositions.push({
          x: Math.trunc(posX),
          y: Math.trunc(posY),
        });

        //console.log({ enemiesPositions });
      }

      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function showLives() {
  const heartArray = Array(lives).fill(emojis["HEART"]);
  //console.log(heartArray);
  spanLives.innerHTML = "";
  heartArray.forEach((heart) => {
    spanLives.append(heart);
  });
}

function showTime() {
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
}
function movePlayer() {
  const colissionX = Math.trunc(playerPosition.x) === giftPosition.x;
  const colissionY = Math.trunc(playerPosition.y) === giftPosition.y;
  const giftColission = colissionX && colissionY;
  //console.log({ playerPosition, giftPosition });
  if (giftColission) {
    levelUp();
  }
  const enemyColission = enemiesPositions.find((enemy) => {
    //console.log(enemy);
    const enemyColissionX = enemy.x === Math.trunc(playerPosition.x);
    const enemyColissionY = enemy.y === Math.trunc(playerPosition.y);
    //console.log(enemy.x, Math.trunc(playerPosition.x));
    return enemyColissionX && enemyColissionY;
  });

  if (enemyColission) {
    levelFail();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelUp() {
  console.log("subiste de nivel");
  level++;
  startGame();
}

function gameWin() {
  console.log("Terminaste el juego");
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem("record_time");
  const playerTime = Date.now() - timeStart;

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem("record_time", playerTime);
      pResult.innerHTML = "Superaste el Record";
    } else {
      pResult.innerHTML = "No superaste el record";
    }
  } else {
    localStorage.setItem("record_time", playerTime);
    pResult.innerHTML = "Primera vez? Muy bien, pero ahora trata de superarte";
  }
  console.log({ recordTime, playerTime });
}

function levelFail() {
  lives--;

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  //console.log({ level, lives });
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".up")) moveUp();
  if (e.target.matches(".left")) moveLeft();
  if (e.target.matches(".right")) moveRight();
  if (e.target.matches(".down")) moveDown();
});
document.addEventListener("keydown", (e) => {
  //console.log(e.code);
  if (e.code === "ArrowUp") moveUp();
  if (e.code === "ArrowLeft") moveLeft();
  if (e.code === "ArrowRight") moveRight();
  if (e.code === "ArrowDown") moveDown();
});

function moveUp() {
  //console.log("Quiero ir arriba");
  if (playerPosition.y - elementSize < elementSize) return;
  playerPosition.y -= elementSize;
  startGame();
}
function moveLeft() {
  //console.log("Quiero ir izquierda");
  if (playerPosition.x - elementSize < elementSize) return;
  playerPosition.x -= elementSize;
  startGame();
}
function moveRight() {
  //console.log("Quiero ir derecha");
  if (playerPosition.x + elementSize > canvasSize) return;
  playerPosition.x += elementSize;
  startGame();
}
function moveDown() {
  //console.log("Quiero ir abajo");
  if (playerPosition.y + elementSize > canvasSize) return;
  playerPosition.y += elementSize;
  startGame();
}
