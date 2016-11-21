var juego = {};

juego.filas = [[],[],[]];

juego.espacioVacio = {
    fila:2,
    columna:2
};

var nivel = 1;

juego.crearPieza = function(numero,fila, columna){
    var nuevoElemento = $("<div>");
    nuevoElemento.addClass('pieza');
    nuevoElemento.css({
      backgroundImage:"url(piezas/" + numero + nivel + ".jpeg)",
      top: fila * 200,
      left: columna * 200
    });
    return {
      el:nuevoElemento,
      numero:numero,
      filaInicial:fila,
      columnaInicial:columna,
    };
};

juego.instalarPiezas = function(juegoEl){
    var contador = 1;
    // Creación de las piezas (del 1 al 8)
    for (var fila = 0; fila < 3; fila++) {
      for (var columna = 0; columna < 3; columna++) {
        if(fila == this.espacioVacio.fila && columna == this.espacioVacio.columna) {
          this.filas[fila][columna] = null;
        }
        else{
          var pieza = this.crearPieza(contador++,fila,columna);
          juegoEl.append(pieza.el);
          this.filas[fila][columna] = pieza;
        }
      }
    }
    return juegoEl;
};

juego.moverFichaFilaColumna = function(ficha,fila,columna){
  // Modificación del CSS desde javascript
    ficha.el.css({
      top: fila * 200,
      left: columna * 200
    })
};

// Guardamos el espacio vacío para colocar la posicion el el array

juego.guardarEspacioVacio = function(fila,columna){
    this.espacioVacio.fila = fila;
    this.espacioVacio.columna = columna;
    this.filas[fila][columna] = null;
};

// Mediante esta función hacemos que la ficha se mueva hacia el espacio que quedó vacío, y luego eligiremos la dirección.

juego.intercambiarPosicionConEspacioVacio = function (fila, columna){
    var ficha = this.filas[fila] && this.filas[fila][columna];
    if(ficha){
      this.filas[this.espacioVacio.fila][this.espacioVacio.columna] = ficha;
      this.moverFichaFilaColumna(ficha,this.espacioVacio.fila,this.espacioVacio.columna);
      this.guardarEspacioVacio(fila,columna);
    }
};

// Mediante estas funciones, y la funcion capturarTeclas, vamos a lograr mover las piezas dependiendo la tecla que toquemos, hacia el espacio vacío.

juego.moverAbajo = function(){
    var filaOrigen = this.espacioVacio.fila-1;
    var columnaOrigen = this.espacioVacio.columna;
    this.intercambiarPosicionConEspacioVacio(filaOrigen,columnaOrigen);
};

juego.moverArriba = function(){
    var filaOrigen = this.espacioVacio.fila+1;
    var columnaOrigen = this.espacioVacio.columna;
    this.intercambiarPosicionConEspacioVacio(filaOrigen,columnaOrigen);
};

juego.moverDerecha = function(){
    var filaOrigen = this.espacioVacio.fila;
    var columnaOrigen = this.espacioVacio.columna-1;
    this.intercambiarPosicionConEspacioVacio(filaOrigen,columnaOrigen);
};

juego.moverIzquierda = function(){
    var filaOrigen = this.espacioVacio.fila;
    var columnaOrigen = this.espacioVacio.columna+1;
    this.intercambiarPosicionConEspacioVacio(filaOrigen,columnaOrigen);
};

juego.checkGanar = function(){
    for (var f = 0; f < this.filas.length; f++) {
      for (var c = 0; c < this.filas.length; c++) {
        var ficha = this.filas[f][c];
        if(ficha && !(ficha.filaInicial == f && ficha.columnaInicial == c)){
          return false;
        }
      }
    }
    $(".ganador").fadeIn(200);
    $(".pieza").fadeOut(200);
    juego.contarTeclas();
};

// Cada número (37,38,39 y 40) indica cada tecla de las flechas

var contadorTeclas = 0;

juego.contarTeclas = function() {
  $(".contadorTeclas").html(contadorTeclas);
};

juego.capturarTeclas = function(){
    var that = this;
    $(document).keydown(function(evento) {
        switch(evento.which) {
            case 37:
              that.moverIzquierda();
              $(".botonIzquierda").css({
                "transition":"210ms",
                "background-color":"#CDDC39"
              });
              setTimeout(function(){
                $(".botonIzquierda").css({
                  "transition":"210ms",
                  "background-color":"#2196F3"
              })},100);
              contadorTeclas++;
            break;
            case 38:
              that.moverArriba();
              $(".botonArriba").css({
                "transition":"210ms",
                "background-color":"#CDDC39"
              });
              setTimeout(function(){
                $(".botonArriba").css({
                  "transition":"210ms",
                  "background-color":"#2196F3"
              })},100);
              contadorTeclas++;
            break;
            case 39:
              that.moverDerecha();
              $(".botonDerecha").css({
                "transition":"210ms",
                "background-color":"#CDDC39"
              });
              setTimeout(function(){
                $(".botonDerecha").css({
                  "transition":"210ms",
                  "background-color":"#2196F3"
              })},100);
              contadorTeclas++;
            break;
            case 40:
              that.moverAbajo();
              $(".botonAbajo").css({
                "transition":"180ms",
                "background-color":"#CDDC39"
              });
              setTimeout(function(){
                $(".botonAbajo").css({
                  "transition":"180ms",
                  "background-color":"#2196F3"
              })},100);
              contadorTeclas++;
            break;
            default: return;
        }
        that.checkGanar();
        evento.preventDefault();
    });
};

// Mediante Math.random() logramos que siempre el orden inicial de las piezas sea diferente.

juego.mezclarFichas = function(veces){
    if(veces<=0){return;}
    var that = this;
    var funciones = ["moverAbajo","moverArriba","moverIzquierda","moverDerecha"];
    var numeroRandom = Math.floor(Math.random() * 4);
    var nombreDeFuncion = funciones[numeroRandom];
    this[nombreDeFuncion]();
    setTimeout(function(){
      that.mezclarFichas(veces-1);
    },10);
};

// Configuracion audio

juego.bajarVolumen = function(){
  document.getElementById("audio").volume = 0.5;
};

//Estas son las funciones que hacen que funcione todo, ya que de otra manera nunca estaríamos llamando a ninguna de las fucniones anteriormente creadas.

juego.iniciar = function(el){
    this.instalarPiezas(el);
    this.mezclarFichas(200);
    juego.bajarVolumen();
    document.getElementById("audio").play();
};

$(function(){
  var elemento = $('#juego');
  juego.capturarTeclas();
  $(".botonIniciar").click(function(){
    $(".botonIniciar").hide();
    juego.iniciar(elemento);
  });
  $(".botonReinicio").click(function(){
    location.reload();
  });
  $("#nivel1").click(function(){
    nivel = 1;
    juego.restart();
    juego.iniciar(elemento);
  });
  $("#nivel2").click(function(){
    nivel = 2;
    juego.restart();
    juego.iniciar(elemento);
  });
  $("#nivel3").click(function(){
    nivel = 3;
    juego.restart();
    juego.iniciar(elemento);
  });
});

juego.restart = function(){
  $('.ganador').fadeOut();
  $('#juego .pieza').remove();
};
