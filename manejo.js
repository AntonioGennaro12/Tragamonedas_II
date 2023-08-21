// MAQUINA TRAGAMONEDAS II - Release 2 (3 x 24 figuras)
// con 16 figuras distintas tomadas de una librería de 32...
const apuestaVal  = document.querySelector("#ap-valor");
const resultado   = document.querySelector("#result");
const miPremio    = document.querySelector("#mi-premio");
const miSaldo     = document.querySelector("#mi-saldo");
// librería de símbolos -- posición 0 fija...
const symbLib     = [ "💎", "🍀", "🔔", "🎰", "🌟", "💰", "🕰️", "📀",
                      "🍊", "🍒", "🍋", "🍇", "🍉", "🍓", "🍎", "🍍",
                      "🍄", "🎲", "🌈", "🎁",  "🎩","📯", "🎸", "🎹",
                      "⚽", "🏈", "🏉", "🥎", "🏀", "🏐", "🎾", "🎱" ];

const maquina     = document.querySelector(".slot-machine");
const linea1      = document.querySelector(".line1");
const linea2      = document.querySelector(".line2");
const linea3      = document.querySelector(".line3");
const spinButton  = document.querySelector("#spin-button");

// DEFINICIÓN DE PREMIOS (la probabilidad al 98,5%, el 1,5% queda para la máquina)
// el premio Multiplica el valor de la apuesta
const DIAMANTESX3 = 3000; // 1/(24*24*24)   
const FIGURASX3   = 130;  // (1/(24*24) - (1/(24*24*24)) 
const DIAMANTESX2 = 40;   // 3*23/(24*24*24)
const FIGURASX2   = 2;    // 3/24 - 3*23/(24*24*24)
// Se eligieron 24 figuras para poder pagar un premio mínimo de 2 veces lo apostado cuando 
// salen dos figuras iguales por lo que el apostador recupera la apuesta y gana otro tanto.

// ARMADO DE MÁQUINA DE 3 RUEDAS QUE GIRAN, CADA UN NÚMERO ALEATORIO  
// DE VUELTAS Y CON UN NÚMERO VARIABLE DE FIGURAS   

let   rueda1      = [];   // cada rueda tiene el nro_figuras que se 
let   rueda2      = [];   // cargan aleatoriamente al inicio
let   rueda3      = [];   // cada vez que se da Girar
let   nro_figuras = 32;   // 24 + random de 12+1 => de 24 a 36 => promedio 32)

// define el array de 24 figuras que luego se llena con el "💎" en en posición 1 
// fijo y en forma aleatoria 23 mas tomados al azar sin repetir....
const symbols     = ["💎", "🍒", "🍋", "🍇", "🍉", "🍓", "🍍", "🍎",
                     "🍀", "🔔", "⚽", "🌟",  "💰", "🎱", "🕰️", "📀", 
                     "🍄", "🎲", "🌈", "🎁", "🎩", "📯", "🎸", "🎹"];
let index = Math.floor(Math.random()*symbLib.length); // nro de 0 a symlib.lenght
// carga de la librería a paetir de una posición módulo longitud de la librería salteando la pos "0" 
for (let i=1;i<symbols.length;i++){
  if (++index >= symbLib.length) {index = 1;}
  symbols[i] = symbLib[index];
}
console.log(symbols);
// ARMADO DE LA PANTALLA DE LA MÁQUINA - MUESTRA SOLO 3 LINEAS 
// SE TOMAN DE LAS 3 RUEDAS EN FROMA ROTATIVA HASTA QUE SE DETENGA LA ÚLTIMA
// El resultado se evalúa en la 2fa fila (symbols 2)
let symbols1  = ["🍒", "🍓", "🍋"];
let symbols2  = ["🍇", "🍍", "🍓"]; // <<< Linea que se evalúa
let symbols3  = ["🍊", "💎", "🍍"];

// VARIABLES GENERALES
let spinning = false;
let symbIndx = 0; 
let contador = 0;

// contadores estadísticos
let ciclos     = 0;
let contDiam_3 = 0;
let contFig_3  = 0;
let contDiam_2 = 0;
let contFig_2  = 0;

// VARIABLES DE JUEGO
let tipoCambio  = 10;
let saldoDevC   = 0;
let saldoPesos  = 0;
let apuesta     = 1;
let premio      = 0;

// INICIO
resultado.textContent   = "Intenta una vez grátis. Dale hacela Girar";
printApuesta();

// FUNCIONES 
function printApuesta() {
  apuestaVal.textContent  = "Apuesta: "+apuesta+" coin/s";
}

function getRandomSymbol() {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}

// construye 3 ruedas iguales con un número variable de 24 a 36 figuras   
function initRuedas() { // por cada intento genera un número de entre 24 y 36 figuras por rueda
  rueda1.length = 0;    // primero vacía los 3 arrays.
  rueda2.length = 0;
  rueda3.length = 0;
  nro_figuras = symbols.length + (Math.floor(Math.random() * (symbols.length/2)+1)); // genera el nro entre 24 y 32 
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

function fillLinea(linea, symArray) {
  linea.innerHTML = `    
    <div class="reel" id="reel11">${symArray[0]}</div>
    <div class="reel" id="reel12">${symArray[1]}</div>
    <div class="reel" id="reel13">${symArray[2]}</div>
    `;
}

function muestraRuedas() {
  fillSymbols(symbols1);        // llena la priemra línea del array desde las ruedas
  fillLinea (linea1, symbols1); // y muestra la 1ra linea
  fillSymbols(symbols2);        // llena la segunda línea 
  fillLinea (linea2, symbols2); // y muestra la 2da linea
  fillSymbols(symbols3);        // llena la tercera línea 
  fillLinea (linea3, symbols3); // y muestra la 3da linea
}

function giraRueda(rueda) { // se llama rueda por rueda 
  let spins = 0;            // y genera un número aleatorio
  let maxSpins = 40 + Math.floor(Math.random() * 25); // de 40 a 64 vueltas...
  function doSpin() {       // para luego ir llenado los arrays 
    for(let i=0;i<nro_figuras; i++) {
      rueda[i] = getRandomSymbol(); // va llenando en forma aleatoria todas las posiciones de la rueda (de 8 a 16)
    } // la cantidad de vueltas van de 2,5 a 4 si son de 16 figuras o de 5 a 8 si son de 8 figuras..
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
    saldoDevC -= apuesta;
    // Primero busca 3 💎
    if (symbol1 === symbol2 && symbol2 === symbol3) {
      if (symbol1 === "💎") 
        { premio = apuesta * DIAMANTESX3; 
          resultado.textContent ="¡¡¡ FABULOSO GANASTE EL PREMIO MAYOR !!!";
          contDiam_3++;}
      else { premio = apuesta * FIGURASX3;
             resultado.textContent ="¡¡FELICIDADES!! 3 figuras iguales";
             contFig_3++;}
      saldoDevC += premio;
    } else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
      if ((symbol1 === "💎")&&(symbol2 === "💎") || (symbol2 === "💎")&&(symbol3 === "💎")|| 
            (symbol1 === "💎")&&(symbol3 === "💎")) {
                premio = apuesta * DIAMANTESX2;
                resultado.textContent = "¡GENIAL! 2 Diamantes";
                contDiam_2++; }
      else { premio = apuesta * FIGURASX2;
             resultado.textContent = "¡Ganaste! 2 figuras iguales";
             contFig_2++;}
      saldoDevC += premio;
    } else {
      premio = 0;
      resultado.textContent = "Intenta de nuevo, no hubo coincidencias...";
    }
    console.log("Ciclo: "+ciclos+" Premio: "+premio+" Saldo: "+saldoDevC+" "+symbol1+symbol2+symbol3);
    if (ciclos %100 == 0) {
      console.log("Diam3: "+contDiam_3+" Fig3: "+contFig_3+" Diam2: "+contDiam_2+" Fig2: "+contFig_2);
    }
    miPremio.textContent  = "Ganaste: "+" "+premio+" coins";
    miSaldo.textContent   = "Tu saldo: "+saldoDevC+" coins";    
  }
}

function girarRuedas() {
  if (!spinning) {
    ciclos++;
    spinButton.style.color = "yellow";
    resultado.textContent = "Ahí vamos... Suerte!!!";
    spinning = true;
    initRuedas ();
    giraRueda(rueda1);
    giraRueda(rueda2);
    giraRueda(rueda3);
    setTimeout(() => {
      spinning = false;
    }, 1000);
  }
}

function apuesta1() {
  apuesta = 1;
  printApuesta();
}
function apuesta2() {
  apuesta = 2;
  printApuesta();
}
function apuesta5() {
  apuesta = 5;
  printApuesta();
}
function apuesta10() {
  apuesta = 10;
  printApuesta();
}



