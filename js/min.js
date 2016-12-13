
$.noConflict();

const URL = "http://localhost:2403/alumno";

jQuery(document).ready(function ($) {

    $("#listado-alumnos thead input").prop("checked", false);

    var numAlumnos = 0;

    var promesaCarga = $.ajax('http://localhost:2403/alumno', {type: "GET"});
    promesaCarga.success(function(data) {
        numAlumnos = data.length;

        for(var i=0; i<data.length; i++){
            var id = data[i].id;
            var dni = data[i].dni;
            var nombre =  data[i].nombre;
            var apellidos = data[i].apellidos;
            var notas = new Array();

            if(data[i].notas != undefined){
                notas['UF1841'] = parseInt(data[i].notas.UF1841);
                notas['UF1842'] = parseInt(data[i].notas.UF1842);
                notas['UF1843'] = parseInt(data[i].notas.UF1843);
                notas['UF1844'] = parseInt(data[i].notas.UF1844);
                notas['UF1845'] = parseInt(data[i].notas.UF1845);
                notas['UF1846'] = parseInt(data[i].notas.UF1846);
            } else{
                notas['UF1841'] = 0;
                notas['UF1842'] = 0;
                notas['UF1843'] = 0;
                notas['UF1844'] = 0;
                notas['UF1845'] = 0;
                notas['UF1846'] = 0;
            }

            insertarAlumnoVista(id, dni, nombre, apellidos, notas);
            totalNumeroAlumnos();
        }
    });

    function insertarAlumnoBDA(dni, nombre, apellidos, notas) {
        var promesaAgregar = $.ajax('http://localhost:2403/alumno', {
            type: "POST",
            data: {
                dni: dni,
                nombre: nombre,
                apellidos: apellidos,
                notas: notas
            },

            success: function(todo) {
                //alert("Alumno insertado correctamente.");
            },
            error: function(xhr) {
                alert("Error Insertar: " + xhr.responseText);
            }
        });
    }

    function insertarAlumnoVista(id, dni, nombre, apellidos, notas) {
        var html_text = "<tr>" +
                "<td align='center'><input id='idCheck' type='checkbox' value='" + id + "'/></td>" +
                "<td>" + dni + "</td>" +
                "<td>" + nombre + "</td>" +
                "<td>" + apellidos + "</td>" +
                "<td>" + notas['UF1841'] + "</td>" +
                "<td>" + notas['UF1842'] + "</td>" +
                "<td>" + notas['UF1843'] + "</td>" +
                "<td>" + notas['UF1844'] + "</td>" +
                "<td>" + notas['UF1845'] + "</td>" +
                "<td>" + notas['UF1846'] + "</td>" +//GET ByID (dni)-->
                "<td>" + calcularMedia([notas['UF1841'], notas['UF1842'], notas['UF1843'], notas['UF1844'], notas['UF1845'], notas['UF1846']]).toFixed(2) + "</td>" +
                "<td><button type='button' data-toggle='modal' data-target='#myModal' class='btn btn-info' value='" + id + "'>Editar</button></td>" +
            "</tr>";

        $('#listado-alumnos tbody').append(html_text);
    }

    function totalNumeroAlumnos() {
        //$("#alumnos div span.totalAlumnos").text("Total Alumnos: " + dnies.length);
        //$("#alumnos div span:eq(0)").append(" " + dnies.length);
        $("#alumnos div span:eq(0)").text("Total Alumnos: " + numAlumnos);
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

    /*
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
    */

    function mediaAlumnos() {
        var mediaAlumnos = Array();
        /*
        mediaAlumnos.push(notas['UF1841']);
        mediaAlumnos.push(notas['UF1842']);
        mediaAlumnos.push(notas['UF1843']);
        mediaAlumnos.push(notas['UF1844']);
        mediaAlumnos.push(notas['UF1845']);
        mediaAlumnos.push(notas['UF1846']);
        */

        var nota = calcularMedia(mediaAlumnos);

        var html_text = "<tr>" +
            "<td colspan='10'>Nota Media:</td>" +
            "<td colspan='2'>" + nota.toFixed(2) + "</td>" +
            "</tr>";

        $("#listado-alumnos tfoot").append(html_text);
    }

    /* BOTON EDITAR */
    $("#listado-alumnos tbody").on("click", "button", function (e) {
        var id = $(this).val();
        var datos = {id: id};

        ajax({url:URL,type:"GET",data:datos}).then(function (data) {
            console.log(data);

            $('#myModal').on('shown.bs.modal', function () {
                $('#dni').focus();

                $('#id').val(data.id);
                $('#dni').val(data.dni);
                $('#nombre').val(data.nombre);
                $('#apellidos').val(data.apellidos);
                $('#nUF1841').val(data.notas.UF1841);
                $('#nUF1842').val(data.notas.UF1842);
                $('#nUF1843').val(data.notas.UF1843);
                $('#nUF1844').val(data.notas.UF1844);
                $('#nUF1845').val(data.notas.UF1845);
                $('#nUF1846').val(data.notas.UF1846);
            });
        }).catch(function(error){
            console.log(error);
            alert(error.status + ": Datos no encontrados.");
        });

    });

    function ajax(opciones) {
        return new Promise(function (resolve, reject) {
            $.ajax(opciones).done(resolve).fail(reject);
        });
    }

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
        $('#myModal').on('shown.bs.modal', function () {
            $('#dni').focus()
        })
    });

    /* BOTON AÑADIR ACEPTAR */
    $("#myModal .btn-success").on("click", function (e) {
        //alert("Has pulsado Enviar");

        var valido = true;

        var id = $("#listado-alumnos tbody #idCheck").val();
        var dni = $("#myModal #dni").val();
        var nombre = $("#myModal #nombre").val();
        var apellidos = $("#myModal #apellidos").val();
        var UF1841 = parseInt($("#myModal #nUF1841").val());
        var UF1842 = parseInt($("#myModal #nUF1842").val());
        var UF1843 = parseInt($("#myModal #nUF1843").val());
        var UF1844 = parseInt($("#myModal #nUF1844").val());
        var UF1845 = parseInt($("#myModal #nUF1845").val());
        var UF1846 = parseInt($("#myModal #nUF1846").val());

        if(!validarDNI(dni)){
            alert("Atencion! DNI no valido.")
            valido=false;
        }

        if(!validarTexto(nombre, 3)){
            alert("Atencion! Nombre no valido. Longitud minima 3.");
            valido=false;
        }

        if(!validarTexto(apellidos, 4)){
            alert("Atencion! Apellido no valido. Longitud minima 4.");
            valido=false;
        }

        if(!validarNota(UF1841)){
            alert("Atencion! UF1841 no valido.");
            valido=false;
        }

        if(!validarNota(UF1842)){
            alert("Atencion! UF1842 no valido.");
            valido=false;
        }

        if(!validarNota(UF1843)){
            alert("Atencion! UF1843 no valido.");
            valido=false;
        }

        if(!validarNota(UF1844)){
            alert("Atencion! UF1844 no valido.");
            valido=false;
        }

        if(!validarNota(UF1845)){
            alert("Atencion! UF1845 no valido.");
            valido=false;
        }

        if(!validarNota(UF1846)){
            alert("Atencion! UF1846 no valido.");
            valido=false;
        }

        if(valido){
            if(id!=undefined){
                alert("ID: " + id);
            } else{
                alert("Estas jodido.");
            }

            var notasVista = new Array();
            notasVista['UF1841'] = UF1841;
            notasVista['UF1842'] = UF1842;
            notasVista['UF1843'] = UF1843;
            notasVista['UF1844'] = UF1844;
            notasVista['UF1845'] = UF1845;
            notasVista['UF1846'] = UF1846;

            var notasBDA = {
                UF1841: UF1841,
                UF1842: UF1842,
                UF1843: UF1843,
                UF1844: UF1844,
                UF1845: UF1845,
                UF1846: UF1846
            };

            insertarAlumnoBDA(dni, nombre, apellidos, notasBDA);
            insertarAlumnoVista(id, dni, nombre, apellidos, notasVista);

            $('#myModal').modal('hide');
        }

        totalNumeroAlumnos();
    });

    /* BOTON BORRAR */
    $("#alumnos .btn-danger").on("click", function (e) {
        // Recoger DNI de la Vista
        $("#listado-alumnos tbody input:checked").each(function(e){
            var id = $(this).val();

            // Borrado BDA
            $.ajax({
                type: "DELETE",
                url  : URL,
                data: {
                    id: id
                },
                success: function(data) {
                    //alert("Borrado OK");
                },
                error: function(xhr) {
                    alert("Error Borrado: " + xhr.responseText);
                }
            });

            /*
            ajax({url: URL, type: "DELETE", data: {id: id}})
                .then(cargarMensaje("El alumno ha sido borrado"), recogerErrorAjax)
                .catch(function errorHandler(error) {

                });
            */
        });

        // Borrado Vista
        borrarAlumnoVista();

        // Actualizar Numero Alumnos
        totalNumeroAlumnos();
    });

    function borrarAlumnoVista() {
        $("#listado-alumnos tbody tr input:checked").parents("tr").remove();
    }

    function validarDNI(dni) {
        var len = 9;
        var valido = false;

        if(dni.length==len){
            var dniNumero = dni.substring(0, dni.length-1);
            var dniLetra = dni.substring(dni.length-1, dni.length);
            var letraCalculada=calcularDNI(parseInt(dniNumero, 10));

            if(letraCalculada==dniLetra){
                valido=true;
            }
        }

        return valido;
    }

    function validarNota(nota) {
        var valido = false;

        if(nota>=0 && nota <= 10){
            valido=true;
        }

        return valido;
    }

    function validarTexto(texto, len) {
        var valido = false;
        if(texto.length>=len){
            valido=true;
        }

        return valido;
    }

    mediaAlumnos();

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