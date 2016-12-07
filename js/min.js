
$.noConflict();

var dnies = ["16068603K", "12345678Z", "87654321B", "15978561C", "74125831N", "95162626L"];

var nombres = new Array();
nombres["16068603K"] = "Borja";
nombres["12345678Z"] = "Adrian";
nombres["87654321B"] = "Erasmo";
nombres["15978561C"] = "Anabel";
nombres["74125831N"] = "Alvaro";
nombres["95162626L"] = "Alvaro";

var apellidos = new Array();
apellidos["16068603K"] = "Garduño";
apellidos["12345678Z"] = "York";
apellidos["87654321B"] = "Seebold";
apellidos["15978561C"] = "Montecino";
apellidos["74125831N"] = "Parga";
apellidos["95162626L"] = "Gonzalez";

var nUF1841 = Array();
nUF1841['16068603K'] = 10;
nUF1841['12345678Z'] = 8;
nUF1841['87654321B'] = 5;
nUF1841['15978561C'] = 7;
nUF1841['74125831N'] = 8;
nUF1841['95162626L'] = 10;

var nUF1842 = Array();
nUF1842['16068603K'] = 7;
nUF1842['12345678Z'] = 6;
nUF1842['87654321B'] = 9;
nUF1842['15978561C'] = 10;
nUF1842['74125831N'] = 3;
nUF1842['95162626L'] = 8;

var nUF1843 = Array();
nUF1843['16068603K'] = 5;
nUF1843['12345678Z'] = 10;
nUF1843['87654321B'] = 7;
nUF1843['15978561C'] = 6;
nUF1843['74125831N'] = 8;
nUF1843['95162626L'] = 3;

var nUF1844 = Array();
nUF1844['16068603K'] = 2;
nUF1844['12345678Z'] = 8;
nUF1844['87654321B'] = 5;
nUF1844['15978561C'] = 9;
nUF1844['74125831N'] = 7;
nUF1844['95162626L'] = 8;

var nUF1845 = Array();
nUF1845['16068603K'] = 8;
nUF1845['12345678Z'] = 7;
nUF1845['87654321B'] = 8;
nUF1845['15978561C'] = 6;
nUF1845['74125831N'] = 10;
nUF1845['95162626L'] = 7;

var nUF1846 = Array();
nUF1846['16068603K'] = 7;
nUF1846['12345678Z'] = 9;
nUF1846['87654321B'] = 5;
nUF1846['15978561C'] = 3;
nUF1846['74125831N'] = 8;
nUF1846['95162626L'] = 5;


jQuery(document).ready(function ($) {

    $("#listado-alumnos thead input").prop("checked", false);

    function totalNumeroAlumnos() {
        //$("#alumnos div span.totalAlumnos").text("Total Alumnos: " + dnies.length);
        //$("#alumnos div span:eq(0)").append(" " + dnies.length);
        $("#alumnos div span:eq(0)").text("Total Alumnos: " + dnies.length);
    }

    function calcularMedia(numeros) {
        var media = 0;
        var len = numeros.length;

        for(var i=0; i<len; i++){
            media += numeros[i];
        }

        media = media/len;
        return media;
    }

    function cargarAlumnos() {
        for(var i=0; i<dnies.length; i++){
            var dni = dnies[i];
            var nombre = nombres[dni];
            var apellido = apellidos[dni];

            var notas = [nUF1841[dni], nUF1842[dni], nUF1843[dni], nUF1844[dni], nUF1845[dni], nUF1846[dni]];
            var notaMedia = calcularMedia(notas).toFixed(2);

            var html_text = "<tr>" +
                                "<td><input type='checkbox' value='" + dni + "' /></td>" +
                                "<td>"+ dni +"</td>" +
                                "<td>"+ nombre +"</td>" +
                                "<td>"+ apellido +"</td>" +
                                "<td>"+ nUF1841[dni] +"</td>" +
                                "<td>"+ nUF1842[dni] +"</td>" +
                                "<td>"+ nUF1843[dni] +"</td>" +
                                "<td>"+ nUF1844[dni] +"</td>" +
                                "<td>"+ nUF1845[dni] +"</td>" +
                                "<td>"+ nUF1846[dni] +"</td>" +
                                "<td>" + notaMedia + "</td>" +
                                "<td><button class='btn btn-info' value='"+dni+"'>Editar</button></td>" +
                            "</tr>";

            $("#listado-alumnos tbody").append(html_text);
        }
    }

    function mediaAlumnos() {
        var mediaAlumnos = 0;

        for(var i=0; i<dnies.length; i++){
            var dni = dnies[i];
            var notaMedia = (nUF1841[dni] + nUF1842[dni] + nUF1843[dni] + nUF1844[dni] + nUF1845[dni] + nUF1846[dni])/6;
            mediaAlumnos = mediaAlumnos + notaMedia;
        }

        mediaAlumnos = mediaAlumnos / 6;

        var html_text = "<tr>" +
            "<td colspan='10'>Nota Media:</td>" +
            "<td colspan='2'>" + mediaAlumnos.toFixed(2) + "</td>" +
            "</tr>";

        $("#listado-alumnos tfoot").append(html_text);
    }

    /*
    $("#listado-alumnos tbody button").click(function (e) {
        alert("Has pulsado en editar click");
    });
    */

    /* BOTON EDITAR */
    $("#listado-alumnos tbody").on("click", "button", function (e) {
        alert("Has pulsado en editar con ON");
    });

    /* OPCION PARA CHECK DE TODOS LOS BOTONES */
    $("#listado-alumnos thead input").click(function (e) {
        if ($(this).prop("checked")) {
            $("#listado-alumnos tbody input").prop("checked", true);
        } else {
            $("#listado-alumnos tbody input").prop("checked", false);
        }
    });

    /* BOTON AÑADIR */
    $("#alumnos .btn-success").on("click", function (e) {
        //alert("Has pulsado añadir");

        $('#myModal').on('shown.bs.modal', function () {
            $('#myInput').focus()
        })

    });

    /* BOTON BORRAR */
    $("#alumnos .btn-danger").on("click", function (e) {
        //alert("Has pulsado borrar");

        // Recoger DNI de la Vista
        $("#listado-alumnos tbody input:checked").each(function(e){
            var dni = $(this).val();
            alert(dni);

            // Borrado BDA
            borrarAlumnoBDA(dni);
        });

        // Borrado Vista
        borrarAlumnoVista();

        totalNumeroAlumnos();
    });
    
    function borrarAlumnoVista() {
        $("#listado-alumnos tbody tr input:checked").parents("tr").remove();
    }
    
    function borrarAlumnoBDA(codigo) {
        var i=0;
        var found = false;
        var pos = -1;

        while(i < dnies.length && found == false){
            if(codigo==dnies[i]){
                found = true;
                pos = i;
            }
            i++;
        }

        if(pos!=-1){
            dnies.splice(pos, 1);
            nombres[codigo] = null;
            apellidos[codigo] = null;
        }
    }

    cargarAlumnos();
    totalNumeroAlumnos();
    mediaAlumnos();
    
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