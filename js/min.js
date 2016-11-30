
$.noConflict();
jQuery(document).ready(function ($) {

    function tracear() {
        var valor;

        // RECOGE EL VALOR DEL ATRIBUTO
        valor = $("#busqueda").val();
        console.log(valor);

        // ESTABLECE UN VALOR
        $("#busqueda").val("Borja");
        valor = $("#busqueda").attr("value");
        console.log(valor);
    }

    //tracear();
    //var valor;
    //valor = $("#busqueda").val();
    //calcularDNI(valor)

    $("#main a.btn").click(function(){
        var dni = $("#busqueda").val();
        var letra = calcularDNI(dni);
        console.log(letra);
        $("#main span.resultado").text("Resultado: " + letra);
        //e.preventDefault();
        return false;
    });
});

function calcularDNI(dni){
    cadena="TRWAGMYFPDXBNJZSQVHLCKET";
    posicion = dni % 23;
    letra = cadena.substring(posicion,posicion+1);
    //alert("Letra DNI: " + letra);
    return letra;
}