
$.noConflict();

var nombres = ["Borja", "Adrian", "Erasmo", "Anabel", "Alvaro", "Alvaro"];
var apellidos = ["Garduño Santamaria", "York", "Seebold", "Montecino", "Parga", "Gonzalez"];

var nUF1841 = Array();
nUF1841['Borja'] = 10;
nUF1841['Adrian'] = 8;
nUF1841['Erasmo'] = 5;
nUF1841['Anabel'] = 7;
nUF1841['Alvaro'] = 8;
nUF1841['Alvaro'] = 10;


var nUF1842 = [10, 9, 7, 8, 9, 5];
var nUF1843 = [10, 9, 7, 8, 9, 5];
var nUF1844 = [10, 9, 7, 8, 9, 5];
var nUF1845 = [10, 9, 7, 8, 9, 5];
var nUF1846 = [10, 9, 7, 8, 9, 5];

jQuery(document).ready(function ($) {

    function cargarAlumnos() {
        for(var i=0; i<nombres.length; i++){
            var nombre = nombres[i];
            var apellido = apellidos[i];

            var html_text = "<tr>" +
                                "<td><input type='checkbox' value='' /></td>" +
                                "<td>"+ nombre +"</td>" +
                                "<td>"+ apellido +"</td>" +
                                "<td>"+ nUF1841[nombre] +"</td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td></td>" +
                                "<td><button>Editar</button></td>" +
                            "</tr>";

            $("#listado-alumnos tbody").append(html_text);
        }
    }

    cargarAlumnos();
    
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

    $("#main button.btn").click(function(){
        var dni = $("#busqueda").val();
        var letra = calcularDNI(dni);
        console.log(letra);
        $("#main span.resultado").text("Resultado: " + letra);
        e.preventDefault();
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