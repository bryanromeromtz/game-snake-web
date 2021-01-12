let juegoCanvas = document.getElementById("juegoCanvas");
let ctx = juegoCanvas.getContext("2d");


/*
ctx.beginPath();
ctx.fillStyle = "orange";
ctx.fillRect(0, 0, 100, 100);
ctx.stroke();

ctx.beginPath();
ctx.fillStyle = "blue";
ctx.ellipse(300, 300, 50, 50, 0, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

ctx.font = "20 px Arial";
ctx.fillStyle = "black";
ctx.fillText("SNAKE!", 200, 200);
*/
for (let x = 20; x <= 600; x += 20) {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 600);
  ctx.stroke();
}

for (let y = 20; y <= 600; y += 20) {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.moveTo(0, y);
  ctx.lineTo(600, y);
  ctx.stroke();
}
