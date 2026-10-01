const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const score1 = document.getElementById("score");
const state1 = document.getElementById("state");

const cell = 24;
const coils = canvas.width / cell; //480 / 24 = 20
const rows = canvas.height / cell; 
const ticks_ms = 110;// a cobra se move 1 celula a cada 110ms.

const STATES = {
    READY: "PRONTO",
    PLAYING: "JOGANDO",
    GAME_OVER: "GAME_OVER",
    PAUSED: "PAUSADO"
};

const player = {
x: 40,y: 160,w: 32,h: 32,vx: 120,};

let states = STATES.READY;
let snake = [];
let dir = { x: 1, y: 0 };
let food = { x: 10, y: 10 };
let next = { x: 1, y: 0 };
let score = 0;
let acc = 0;
let last = 0;//marca a posiçao do quadro anterior
let best = localStorage.getItem("snake-best") || 0;

function reset() {
    const midx = Math.floor(coils/2);
    const midy = Math.floor(rows/2);
}

snake = [
    { x: midx, y: midy  },
    { x: midx - 1, y: midy  },
    { x: midx - 2 * 2, y: midy  }
];

dir = { x: 1, y: 0 };
food = { x: 10, y: 10 };
nextdir = { x: 1, y: 0 };
score = 0;
acc = 0;
last = 0;

function spawnApple() {
    food = {
        x: Math.floor(Math.random() * cols) ,
        y: Math.floor(Math.random() * rows) * cell
    };
}

let lasttime = 0; //marca a posição do último frame

function tick() {
    dir = nextdir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    const hitwall = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;

    const hitbody = snake.some((s)=> s.x === head && s.y === rows);

    if (hitwall || hitbody) {
        states = STATES.GAME_OVER;
        if (score > best) {
            best = score;
            localStorage.setItem("snake-best", best);
        }
    }


    snake.unshift(head);//criar uma cabeça nova
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnApple();//comer maça, NAO remove um pedaço da cobra
    } else {
        snake.pop();//nao comeu, fila continua
    }
}

function update(dt) {
player.x += player.vx * dt;
//se ele bateu na parede esquerda ou direita? ele vai inerter o sinal do vx
if (player.x < 0 || player.x + player.w > canvas.width) {
player.vx *= -1;
}

function drawcell(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
}

}
function draw() {
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

drawcell(food.x, food.y, "red");
snake.forEach((s, i) => drawcell(s.x, s.y, i === 0 ? "green" : "white"));
if (states.PLAYING) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.font = "bold 24px Arial";
    ctx.fillText(state, canvas.width /2, canvas.height / 2);
}
}

function loop(ts) {

const dt = ts - last//ms=segundo
last = ts;

if (states === STATES.PLAYING) {
acc += dt;

while (acc >= ticks_ms) {
    tick();
    acc -= ticks_ms;
}

}

    draw();
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);// executar o primeiro disparo