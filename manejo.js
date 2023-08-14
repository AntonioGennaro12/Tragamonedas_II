const resultado   = document.querySelector("#result");
const symbols     = ["🍊", "🍒", "🍋", "🍇", "🍉", "🍓", "🍍", "💎"];
const maquina     = document.querySelector(".slot-machine");
const linea1      = document.querySelector(".line1");
const linea2      = document.querySelector(".line2");
const linea3      = document.querySelector(".line3");
const spinButton  = document.querySelector("#spin-button");

// DEFINICIÓN DE PREMIOS (la probabilidad al 90%, el 10% queda para la máquina)
const DIAMANTESX3 = 450; // 1/8 * 1/8 * 1/8 * 0,9 = Multiplica la apuesta  
const FIGURASX3   = 50;  // 1/8 * 1/8 * 0,9 
const DIAMANTESX2 = 25;  // 1/8 * (2*1/8) *.9
const FIGURASX2   = 3;   // 2 * 1/8 * 0,9

// ARMADO DE MÁQUINA DE 3 RUEDAS QUE GIRAN, CADA UN NÚMERO ALEATORIO  
// DE VUELTAS Y CON UN NÚMERO VARIABLE DE FIGURAS   

let   rueda1      = [];   // cada rueda tiene el nro_figuras que se 
let   rueda2      = [];   // cargan aleatoriamente al inicio
let   rueda3      = [];   // cada vez que se da Girar
let   nro_figuras = 10;   // 7 + random de 8 => de 7 a 14 => promedio 10)

// ARMADO DE LA PANTALLA DE LA MÁQUINA - MUESTRA SOLO 3 LINEAS 
// SE TOMAN DE LAS 3 RUEDAS EN FROMA ROTATIVA HASTA QUE SE DETENGA LA ÚLTIMA
// El resultado se evalúa en la 2fa fila (symbols 2)
let symbols1  = ["🍒", "🍓", "🍋"];
let symbols2  = ["🍇", "🍍", "🍓"];
let symbols3  = ["🍊", "💎", "🍍"];

// VARIABLES GENERALES
let spinning = false;
let symbIndx = 0; 
let contador = 0;

// VARIABLES DE JUEGO
let tipoCambio  = 10;
let saldoDevC   = 0;
let saldoPesos  = 0;
let apuesta     = 1;
let premio      = 0;


// INICIO
resultado.textContent = "Intenta una vez grátis. Dale hacela Girar";

function getRandomSymbol() {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}

function initRuedas() { // por cada intento genera un número de entre 7 y 14 figuras por rueda
  rueda1.length = 0;    // primero vacía los 3 arrays.
  rueda2.length = 0;
  rueda3.length = 0;
  nro_figuras = 7 + (Math.floor(Math.random() * symbols.length)); // genera el nro entre 7 y 14 
  for (let i=0; i < nro_figuras; i++) {
    rueda1.push (getRandomSymbol());  // carga incialmente en forma aleatoria...
    rueda2.push (getRandomSymbol());  // las 3 ruedas con nro_figuras
    rueda3.push (getRandomSymbol());
  }
}

function fillSymbols(symArray) {      // llena el array de simbolos que se muestran en 
    symArray[0] = rueda1[symbIndx];   // empezando en 0 linea 1 a linea 3 
    symArray[1] = rueda2[symbIndx];   // en forma circualr módulo el nro_figuras
    symArray[2] = rueda3[symbIndx];
    symbIndx = (symbIndx+1) %nro_figuras;
  }

function muestraRuedas() {
  fillSymbols(symbols1);  // llena la priemra línea y muestra
  linea1.innerHTML = `    
    <div class="reel" id="reel11">${symbols1[0]}</div>
    <div class="reel" id="reel12">${symbols1[1]}</div>
    <div class="reel" id="reel13">${symbols1[2]}</div>
  `;
  fillSymbols(symbols2);  // llena la segunda línea y muestra
  linea2.innerHTML = `
    <div class="reel" id="reel21">${symbols2[0]}</div>
    <div class="reel" id="reel22">${symbols2[1]}</div>
    <div class="reel" id="reel23">${symbols2[2]}</div>
  `;
  fillSymbols(symbols3);  // llena la tercera línea y muestra
  linea3.innerHTML = `
    <div class="reel" id="reel31">${symbols3[0]}</div>
    <div class="reel" id="reel32">${symbols3[1]}</div>
    <div class="reel" id="reel33">${symbols3[2]}</div>
  `;
  }

function giraRueda(rueda) { // se llama rueda por rueda 
  let spins = 0;            // y genera un número aleatorio
  let maxSpins = 36 + Math.floor(Math.random() * 15); // de 36 a 50...
  function doSpin() {       // para luego ir llenado los arrays 
    for(let i=0;i<nro_figuras; i++) {
    rueda[i] = getRandomSymbol(); // va llenando en forma aleatoria todas las posiciones
    }                             // de cada rueda de 36 a 50 veces...
    muestraRuedas();
    spins++;
    if (spins < maxSpins) {
      //console.log("MaxSp: "+maxSpins+" , Spins: "+spins);
      requestAnimationFrame(doSpin);
    } 
    else {
      if (spinning === true) {
        checkWin();
      }
    }
  }
  doSpin();
}

function checkWin() {
  // console.log("entró check "+contador);
  if (++contador == 3 ) {
    contador = 0;
    spinButton.style.color = "darkgreen";
    const symbol1 = symbols2[0];
    const symbol2 = symbols2[1];
    const symbol3 = symbols2[2];
    // console.log("S1: "+symbol1+"S2: "+symbol2+"S3: "+symbol3);
    if (symbol1 === symbol2 && symbol2 === symbol3) {
      if (symbol1 === "💎") {premio = apuesta * DIAMANTESX3 }
      else { premio = apuesta * FIGURASX3}
      saldoDevC += premio;
      console.log(premio+" , "+saldoDevC);
      resultado.textContent ="¡FELICIDADES!!! Tres figuras iguales.";
    } else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
      if ((symbol1 === "💎")&&(symbol2 === "💎") || (symbol2 === "💎")&&(symbol3 === "💎")|| 
            (symbol1 === "💎")&&(symbol3 === "💎")) {premio = apuesta * DIAMANTESX2 }
      else { premio = apuesta * FIGURASX2}
      saldoDevC += premio;
      console.log(premio+" , "+saldoDevC);
      resultado.textContent = "¡Ganaste! --- Dos figuras iguales.";
    } else {
      premio = 0;
      saldoDevC -= apuesta;
      console.log(premio+" , "+saldoDevC);
      resultado.textContent = "Intenta de nuevo, No hubo coincidencias.";
    }
  }
}

function girarRuedas() {
  if (!spinning) {
    spinButton.style.color = "yellow";
    resultado.textContent = "Ahí vamos... Suerte!!!";
    spinning = true;
    initRuedas ();
    giraRueda(rueda1);
    giraRueda(rueda2);
    giraRueda(rueda3);
    setTimeout(() => {
      spinning = false;
    }, 2000);
  }
}

function apuesta1() {
  apuesta = 1;
}
function apuesta2() {
  apuesta = 2;
}
function apuesta5() {
  apuesta = 5;
}
function apuesta10() {
  apuesta = 10;
}