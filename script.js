const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

//x, y - posicionar o objeto
//w, h - definir o tamanho do personagem
//vx - define a velocidade do horizontal

const player = {
x: 40,y: 160,w: 32,h: 32,vx: 120,};

let lasttime = 0; //marca a posição do último frame

function update(dt) {
player.x += player.vx * dt;
//se ele bateu na parede esquerda o direita ele vai inerter o sinal do vx
if (player.x < 0 || player.x + player.w > canvas.width) {
player.vx *= -1;
}
}
function draw() {
ctx.fillStyle = "red";
ctx.fillRect(player.x, player.y, player.w, player.h);

ctx.fillStyle = "blue";
ctx.fillRect(player.x, player.y, player.w, player.h);

ctx.fillText("o deltatime - dt independe da taxa de quadros");
}

function loop(ts) {
if(!lasttime) 
    lasttime = ts;

const dt = Math.min(0.05, (ts - lasttime) );//ms=segundo
lasttime = ts;
update(dt);
draw();

requestAnimationFrame(loop);
}