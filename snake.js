/** CONSTANTES **/

let DIRECCIONES = {
  ARRIBA: 1,
  ABAJO: 2,
  IZQUIERDA: 3,
  DERECHA: 4
};

let FPS = 1000 / 15;

let JUEGO_CANVAS = document.getElementById("juegoCanvas");
let CTX = JUEGO_CANVAS.getContext("2d");

let PUNTAJE_TEXTO = document.getElementById("puntuacion");

let SONIDO_GANASTE_PUNTO = new Audio("sonidosDelJuego/comida.mp3");
let SONIDO_COLISION = new Audio("sonidosDelJuego/gameover.mp3");


/** ESTADO DEL JUEGO **/

let culebra;
let direccionActual;
let nuevaDireccion;
let comida;
let ciclo;
let puntaje;


/** DIBUJAR **/

function dibujarParedes(context) {
  context.beginPath();
  context.setLineDash([5, 3]);
  context.lineWidth = "5";
  context.rect(20, 20, 560, 560);
  context.stroke();
}

function rellenarCuadrado(context, posX, posY) {
  context.beginPath();
  context.fillStyle = "#2e490b";
  context.fillRect(posX, posY, 20, 20);
  context.stroke();
}


function dibujarCulebra(context, culebra) {
  for (let i = 0; i < culebra.length; i++) {
    rellenarCuadrado(context, culebra[i].posX, culebra[i].posY);
  }
}

function dibujarComida(context, comida) {
  rellenarCuadrado(context, comida.posX, comida.posY);
}

function dibujarTexto(context, texto, font, posX, posY) {
  context.font = `${font}`;
  context.textAlign = "center";
  context.fillStyle = "black";
  context.fillText(texto, posX, posY);
}

function dibujarTextoFlechas(context) {
  context.font = "40px Arial";
}


/** CULEBRA **/


function moverCulebra(direccion, culebra) {
  let cabezaPosX = culebra[0].posX;
  let cabezaPosY = culebra[0].posY;

  if (direccion === DIRECCIONES.DERECHA) {
    cabezaPosX += 20;
  } else if (direccion === DIRECCIONES.IZQUIERDA) {
    cabezaPosX -= 20;
  } else if (direccion === DIRECCIONES.ABAJO) {
    cabezaPosY += 20;
  } else if (direccion === DIRECCIONES.ARRIBA) {
    cabezaPosY -= 20;
  }
  // Agregamos la nueva cabeza al principio de la lista.
  culebra.unshift({ posX: cabezaPosX, posY: cabezaPosY });
  // Borramos la cola de la culebra.
  return culebra.pop();
}

function culebraComioComida(culebra, comida) {
  return culebra[0].posX === comida.posX && culebra[0].posY === comida.posY;
}

/** COMIDA **/

function generarNuevaPosicionDeComida(culebra) {

  while (true) {
    let columnaX = Math.max(Math.floor(Math.random() * 29), 1);
    let columnaY = Math.max(Math.floor(Math.random() * 29), 1);


    let posX = columnaX * 20;
    let posY = columnaY * 20;

    let colisionConCulebra = false;
    for (let i = 0; i < culebra.length; i++) {
      if (culebra[i].posX === posX && culebra[i].posY === posY) {
        colisionConCulebra = true;
        break;
      }
      if (colisionConCulebra) {
        continue;
      }
    }

    return { posX: posX, posY: posY }
  }

}

/** COLISIONES **/

function ocurrioColision(culebra) {
  let cabeza = culebra[0];

  if (
    cabeza.posX < 20 ||
    cabeza.posX === 580 ||
    cabeza.posY < 20 ||
    cabeza.posY === 580
  ) {
    return true;
  }

  if (culebra.length === 4) {
    return false;
  }
  for (let i = 1; i < culebra.length; i++) {
    if (cabeza.posX === culebra[i].posX && cabeza.posY === culebra[i].posY) {
      return true;
    }
  }
  return false;
}

/** PUNTAJE **/

function mostrarPuntaje(puntaje) {
  PUNTAJE_TEXTO.innerText = `PUNTAJE: ${puntaje}`;
}

function incrementarPuntaje() {
  puntaje++;
  mostrarPuntaje(puntaje);
  SONIDO_GANASTE_PUNTO.play();
}


/** CICLO DE JUEGO **/


document.addEventListener("keydown", function (e) {

  if (e.code === "ArrowUp" && direccionActual != DIRECCIONES.ABAJO) {
    nuevaDireccion = DIRECCIONES.ARRIBA;
  } else if (e.code === "ArrowDown" && direccionActual != DIRECCIONES.ARRIBA) {
    nuevaDireccion = DIRECCIONES.ABAJO;
  } else if (e.code === "ArrowLeft" && direccionActual != DIRECCIONES.DERECHA) {
    nuevaDireccion = DIRECCIONES.IZQUIERDA;
  } else if (e.code === "ArrowRight" && direccionActual != DIRECCIONES.IZQUIERDA) {
    nuevaDireccion = DIRECCIONES.DERECHA;
  }
});

function cicloDeJuego() {
  let colaDescartada = moverCulebra(nuevaDireccion, culebra);
  direccionActual = nuevaDireccion;

  if (culebraComioComida(culebra, comida)) {
    culebra.push(colaDescartada);

    comida = generarNuevaPosicionDeComida(culebra);
    incrementarPuntaje();
  }

  if (ocurrioColision(culebra)) {
    gameOver();
    SONIDO_COLISION.play();
    return;
  }

  function gameOver() {
    clearInterval(ciclo);
    ciclo = undefined;
    dibujarTexto(CTX, "¡Fin del juego!", "40px Arial", 300, 260);
    dibujarTexto(CTX, "Click para volver a jugar", "40px Arial", 300, 310);
  }


  CTX.clearRect(0, 0, 600, 600);
  dibujarParedes(CTX);
  dibujarCulebra(CTX, culebra);
  dibujarComida(CTX, comida);
}

function empezarJuego(params) {
  culebra = [
    { posX: 60, posY: 20 },
    { posX: 40, posY: 20 }
    // { posX: 20, posY: 20 },
  ]

  direccionActual = DIRECCIONES.DERECHA;
  nuevaDireccion = DIRECCIONES.DERECHA;

  comida = generarNuevaPosicionDeComida(culebra);
  puntaje = 0;
  mostrarPuntaje(puntaje);
  ciclo = setInterval(cicloDeJuego, FPS);
}


dibujarParedes(CTX);
dibujarTexto(CTX, "¡Click para comenzar!", "40px Arial", 300, 260);
dibujarTexto(CTX, "Muevete con ↑ ↓ → ←", "40px Arial", 300, 310);



JUEGO_CANVAS.addEventListener("click", function () {
  if (ciclo === undefined) {
    empezarJuego();
  }

});