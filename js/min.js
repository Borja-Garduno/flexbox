
$.noConflict();

const URL = "http://localhost:2403/alumno";
//const URL = "https://gestion-alumnos.firebaseio.com";
var numAlumnos = 0;
var arrayNotas = {
    cero: 0,
    uno: 0,
    dos: 0,
    tres: 0,
    cuatro: 0,
    cinco: 0,
    seis: 0,
    siete: 0,
    ocho: 0,
    nueve: 0,
    diez: 0
};

jQuery(document).ready(function ($) {

    /* BUSQUEDA EN DIRECTO */
    (function ($) {
        $('#filtrar').keyup(function () {
            var rex = new RegExp($(this).val(), 'i');
            $('.buscar tr').hide();
            $('.buscar tr').filter(function () {
                return rex.test($(this).text());
            }).show();
        })
    }(jQuery));

    /* BOTON BUSCAR */
    $("#alumnos .input-group-btn").on("click", function (e) {
        var valor=$("#alumnos div input.form-control").val();
        buscar(valor);
    });

    /* BUSCADOR ENTER INPUT */
    $("#alumnos .form-control").keyup(function(event){
        if(event.keyCode == 13){
            $("#alumnos .input-group-btn").click();
        }
    });

    function buscar(valor) {
        console.log("Valor: " + valor);

        $("#listado-alumnos tbody").find(valor).each(function () {
            var $input = $("#listado-alumnos tbody td[value="+valor+"]");
            alert($input);
        });
    }

    function cargarHora() {
        var fecha = getCurrentDate();
        $("#alumnos div p.fecha").text(fecha);
    }
    setInterval(cargarHora, 0);

    var promesaCarga = $.ajax(URL, {type: "GET"});
    promesaCarga.success(function(data) {
        numAlumnos = data.length;

        for(var i=0; i<data.length; i++){
            var id = data[i].id;
            var dni = data[i].dni;
            var nombre =  data[i].nombre;
            var apellidos = data[i].apellidos;
            var fechaNacimiento = data[i].fechaNacimiento;
            var direccion = data[i].direccion;
            var notas = {};

            if(data[i].notas != undefined){
                notas['UF1841'] = parseInt(data[i].notas.UF1841) || '';
                notas['UF1842'] = parseInt(data[i].notas.UF1842) || '';
                notas['UF1843'] = parseInt(data[i].notas.UF1843) || '';
                notas['UF1844'] = parseInt(data[i].notas.UF1844) || '';
                notas['UF1845'] = parseInt(data[i].notas.UF1845) || '';
                notas['UF1846'] = parseInt(data[i].notas.UF1846) || '';
            } else{
                notas['UF1841'] = 0;
                notas['UF1842'] = 0;
                notas['UF1843'] = 0;
                notas['UF1844'] = 0;
                notas['UF1845'] = 0;
                notas['UF1846'] = 0;
            }

            insertarAlumnoVista(id, dni, nombre, apellidos, fechaNacimiento, direccion, notas);
        }

        var html_text = "<tr>" +
            "<td colspan='12'>Nota Media:</td>" +
            "<td colspan='2'></td>" +
            "</tr>";

        $("#listado-alumnos tfoot").append(html_text);

        calcularMediaClase();
        totalNumeroAlumnos();
    });

    function insertarAlumnoBDA(dni, nombre, apellidos, fechaNacimiento, direccion, notas) {
        var codigo = 0;
        ajax({url:URL,type:"POST",data:{
            dni: dni,
            nombre: nombre,
            apellidos: apellidos,
            fechaNacimiento: fechaNacimiento,
            direccion: direccion,
            notas: notas
        }}).then(function (data) {
            // console.log("ID Alumno 1: " + data.id);
            codigo = data.id;
            console.log("ID Alumno: " + codigo);
            //alert("Alumno insertado correctamente.");
            numAlumnos = numAlumnos + 1;
            totalNumeroAlumnos();
        }).then(insertarAlumnoVista(codigo, dni, nombre, apellidos, fechaNacimiento, direccion, notas))
            .then(calcularMediaClase)
            .then(drawBasic)
            .catch(function (xhr) {
                alert("Error Insertar: " + xhr.responseText);
            });
    }

    function insertarAlumnoVista(id, dni, nombre, apellidos, fechaNacimiento, direccion, notas) {
        var media = calcularMedia([notas['UF1841'], notas['UF1842'], notas['UF1843'], notas['UF1844'], notas['UF1845'], notas['UF1846']]);

        if (media != '') {
            media = media.toFixed(2);
        }
        var enlace = 'javascript:cargarMapa("' + direccion + '", "'+modo+'")';
        var edad = getAge(fechaNacimiento);

        var html_text = "<tr class='fila'>" +
            "<td align='center'><input type='checkbox' value='" + id + "'/></td>" +
            "<td>" + dni + "</td>" +
            "<td>" + nombre + "</td>" +
            "<td>" + apellidos + "</td>" +
            "<td>" + edad + "</td>" +
            "<td><a href='"+enlace+"' title='Direcciones a Ipartek'>" + direccion + "</a></td>" +
            "<td>" + notas['UF1841'] + "</td>" +
            "<td>" + notas['UF1842'] + "</td>" +
            "<td>" + notas['UF1843'] + "</td>" +
            "<td>" + notas['UF1844'] + "</td>" +
            "<td>" + notas['UF1845'] + "</td>" +
            "<td>" + notas['UF1846'] + "</td>" +
            "<td class='media'>" + media + "</td>" +
            "<td><button type='button' data-toggle='modal' data-target='#myModal' class='btn btn-info' value='" + id + "'>Editar</button></td>" +
            "</tr>";


        $('#listado-alumnos tbody').append(html_text);
    }

    function actualizarAlumnoBDA(id, dni, nombre, apellidos, fechaNacimiento, direccion, notas) {
        ajax({url:URL,type:"PUT",
            data:{
                id: id,
                dni: dni,
                nombre: nombre,
                apellidos: apellidos,
                fechaNacimiento: fechaNacimiento,
                direccion: direccion,
                notas: notas
            }
        }).then(function () {
            actualizarAlumnoVista(id, dni, nombre, apellidos, fechaNacimiento, direccion, notas);
        }).then(function () {
            calcularMediaClase();
        }).then(function () {
            drawBasic();
        }).catch(function (xhr) {
            alert("Error Actualizar: " + xhr.responseText);
        });
    }

    function actualizarAlumnoVista(id, dni, nombre, apellidos, fechaNacimiento, direccion, notas) {
        var $input = $("#listado-alumnos tbody input[value="+id+"]");

        var media = calcularMedia([notas['UF1841'], notas['UF1842'], notas['UF1843'], notas['UF1844'], notas['UF1845'], notas['UF1846']]);

        if (media != '') {
            media = media.toFixed(2);
        }

        var enlace = 'javascript:cargarMapa("' + direccion + '", "'+modo+'")';
        var edad = getAge(fechaNacimiento);

        var html_text = "" +
            "<td align='center'><input type='checkbox' value='" + id + "'/></td>" +
            "<td>" + dni + "</td>" +
            "<td>" + nombre + "</td>" +
            "<td>" + apellidos + "</td>" +
            "<td>" + edad + "</td>" +
            "<td><a href='"+enlace+"' title='Direcciones a Ipartek'>" + direccion + "</a></td>" +
            "<td>" + notas['UF1841'] + "</td>" +
            "<td>" + notas['UF1842'] + "</td>" +
            "<td>" + notas['UF1843'] + "</td>" +
            "<td>" + notas['UF1844'] + "</td>" +
            "<td>" + notas['UF1845'] + "</td>" +
            "<td>" + notas['UF1846'] + "</td>" +
            "<td class='media'>" + media + "</td>" +
            "<td><button type='button' data-toggle='modal' data-target='#myModal' class='btn btn-info' value='" + id + "'>Editar</button></td>" +
            "";

        $input.parent().parent().removeClass('fila').addClass('nueva_fila').html(html_text);
    }

    function totalNumeroAlumnos() {
        //$("#alumnos div span.totalAlumnos").text("Total Alumnos: " + dnies.length);
        //$("#alumnos div span:eq(0)").append(" " + dnies.length);

        if(numAlumnos==0){
            console.log("No hay alumnos.");
        } else{
            console.log("Numero Alumnos: " + numAlumnos);
        }

        $("#alumnos div span.totalAlumnos").text("Total Alumnos: " + numAlumnos);
    }

    function calcularMedia(numeros) {
        var media = 0;
        var len = numeros.length;

        for(var i=0; i<len; i++){
            media += numeros[i];
        }

        media = media/len;

        // Calculo de las medias para las Estadisticas
        var aux = Math.floor(media);
        switch (aux){
            case 0:
                arrayNotas.cero++;
                break;

            case 1:
                arrayNotas.uno++;
                break;

            case 2:
                arrayNotas.dos++;
                break;

            case 3:
                arrayNotas.tres++;
                break;

            case 4:
                arrayNotas.cuatro++;
                break;

            case 5:
                arrayNotas.cinco++;
                break;

            case 6:
                arrayNotas.seis++;
                break;

            case 7:
                arrayNotas.siete++;
                break;

            case 8:
                arrayNotas.ocho++;
                break;

            case 9:
                arrayNotas.nueve++;
                break;

            case 10:
                arrayNotas.diez++;
                break;
        }

        return media;
    }

    function calcularMediaClase() {
        var valor = 0;
        var media = 0;

        $("#listado-alumnos").find(".media").each(function () {
            var nota = parseFloat($(this).text()) || -1;
            if(nota > -1) {
                valor += nota;
                media++;
            }
        });

        media = valor / media;

        $("#listado-alumnos").find("tfoot tr td:eq(1)").text(media.toFixed(2));
    }

    /* BOTON EDITAR */
    $("#listado-alumnos tbody").on("click", "button", function (e) {
        var id = $(this).val();
        var datos = {id: id};

        ajax({url:URL,type:"GET",data:datos})
            .then(function (data) {
                $('#myModal').on('shown.bs.modal', function () {
                    $('#dni').focus();

                    $('#id').val(data.id);
                    $('#dni').val(data.dni);
                    $('#nombre').val(data.nombre);
                    $('#apellidos').val(data.apellidos);
                    $('#fechaNacimiento').val(data.fechaNacimiento);
                    $('#direccion').val(data.direccion);
                    $('#nUF1841').val(data.notas.UF1841);
                    $('#nUF1842').val(data.notas.UF1842);
                    $('#nUF1843').val(data.notas.UF1843);
                    $('#nUF1844').val(data.notas.UF1844);
                    $('#nUF1845').val(data.notas.UF1845);
                    $('#nUF1846').val(data.notas.UF1846);
                });
            })
            .catch(function(error){
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
            $('#dni').focus();
            $('#id').val("");
            $('#dni').val("");
            $('#nombre').val("");
            $('#apellidos').val("");
            $('#fechaNacimiento').val("");
            $('#direccion').val("");
            $('#nUF1841').val("");
            $('#nUF1842').val("");
            $('#nUF1843').val("");
            $('#nUF1844').val("");
            $('#nUF1845').val("");
            $('#nUF1846').val("");
        })
    });

    /* BOTON AÑADIR ACEPTAR */
    $("#myModal .btn-success").on("click", function (e) {
        //alert("Has pulsado Enviar");

        var valido = true;

        var id = $("#myModal #id").val();
        var dni = $("#myModal #dni").val();
        var nombre = $("#myModal #nombre").val();
        var apellidos = $("#myModal #apellidos").val();
        var fechaNacimiento = $("#myModal #fechaNacimiento").val();
        var direccion = $("#myModal #direccion").val();
        var edad = getAge(fechaNacimiento);
        var UF1841 = parseInt($("#myModal #nUF1841").val()) || '';
        var UF1842 = parseInt($("#myModal #nUF1842").val()) || '';
        var UF1843 = parseInt($("#myModal #nUF1843").val()) || '';
        var UF1844 = parseInt($("#myModal #nUF1844").val()) || '';
        var UF1845 = parseInt($("#myModal #nUF1845").val()) || '';
        var UF1846 = parseInt($("#myModal #nUF1846").val()) || '';

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

        if(!validarEdad(edad)){
            alert("Atencion! La edad no puede ser inferior a 18 ni superior a 64.");
            valido=false;
        }

        /*
         if(!validarTexto(direccion, 5)){
         alert("Atencion! La longitud de la direccion no puede ser inferior a 5.");
         valido=false;
         }
         */

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
            var notasBDA = {
                UF1841: UF1841,
                UF1842: UF1842,
                UF1843: UF1843,
                UF1844: UF1844,
                UF1845: UF1845,
                UF1846: UF1846
            };

            if(id!=""){
                // ACTUALIZAR ALUMNO
                console.log("Alumno actualidado - DNI: " + dni);
                actualizarAlumnoBDA(id, dni, nombre, apellidos, fechaNacimiento, direccion, notasBDA);

            } else{
                // CREAR USUARIO
                console.log("Alumno creado - DNI: " + dni);
                insertarAlumnoBDA(dni, nombre, apellidos, fechaNacimiento, direccion, notasBDA);
            }

            $('#myModal').modal('hide');
        }
    });

    /* BOTON BORRAR */
    $("#alumnos .btn-danger").on("click", function (e) {
        var cont = 0;

        // Recoger DNI de la Vista
        $("#listado-alumnos tbody input:checked").each(function(e){
            var id = $(this).val();
            cont = cont + 1;

            // Borrado BDA
            ajax({url:URL,type:"DELETE",
                data:{
                    id: id
                }
            }).then(function() {
                // Borrado Vista
                borrarAlumnoVista();
            }).then(function () {
                calcularMediaClase();
            }).then(function () {
                drawBasic();
            }).catch(function (xhr) {
                alert("Error Insertar: " + xhr.responseText);
            });
        });

        // Actualizar Numero Alumnos
        numAlumnos = numAlumnos - cont;
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
        if((nota>=0 && nota <= 10) || nota==''){
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

    function validarEdad(edad) {
        var valido = false;
        if(edad > 17 && edad < 65){
            valido=true;
        }
        return valido;
    }

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function getCurrentDate() {
        Date.prototype.ddmmyyyy = function() {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
            var dd  = this.getDate().toString();

            var hour = this.getHours();
            var min = this.getMinutes().toString();
            var seg = this.getSeconds().toString();

            var hora = hour + ":" + (min[1]?min:"0"+min[0]) + ":" + (seg[1]?seg:"0"+seg[0]);

            //return yyyy + "/" + (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]); // padding
            return (dd[1]?dd:"0"+dd[0]) + "/" + (mm[1]?mm:"0"+mm[0]) + "/" + yyyy + " - " + hora; // padding
        };

        var date = new Date();
        var fechaActual = date.ddmmyyyy();
        return fechaActual;
    }

    $("#main button.btn").click(function(){
        var dni = $("#busqueda").val();
        var letra = calcularDNI(dni);
        console.log(letra);
        $("#main span.resultado").text("Resultado: " + letra);
        e.preventDefault();
        return false;
    });

    function calcularDNI(dni){
        cadena="TRWAGMYFPDXBNJZSQVHLCKET";
        posicion = dni % 23;
        letra = cadena.substring(posicion,posicion+1);
        //alert("Letra DNI: " + letra);
        return letra;
    }

    /* MAPA */

    /*
    function getPreciseLocation() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("Latitud: " + position.coords.latitude);
                console.log("Longitud: " + position.coords.longitude);
                resolve({latitude: position.coords.latitude, longitude: position.coords.longitude});
            });
        });
    }
    */

   /* getPreciseLocation()
        .then(cargarMapa)
        .catch(function errorHandler(error) {
            console.log(error);
        });
    */
});

const ipartek={lat:43.256398, lng: -2.913550};
var destino;
var modo="TRANSIT";

function cambiarTransporte(transporte) {
      switch (transporte){
        case "pie":
            modo="WALKING";
            break;

        case "coche":
            modo="DRIVING";
            break;

        case "publico":
            modo="TRANSIT";
            break;

        case "bicicleta":
            modo="BICYCLING";
            break;

        default:
            modo="TRANSIT";
            break;
    }

    cargarMapa(destino, modo);
}

function cargarMapa(direccion, modo) {
    destino=direccion;

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
   // var ipartek =
    var geocoder = new google.maps.Geocoder();

    var element = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(ipartek.lat, ipartek.lng),
        zoom: 16,
        scrollwheel: true,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    var map = new google.maps.Map(element, mapOptions);
    map.setTilt(0); // Quitar la inclinacion de 45º



    // Marcador Rojo
    /*
     var marker = new google.maps.Marker({position: myCenter});
     marker.setMap(map);
     */

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));

    var posicion;

    geocoder.geocode( { 'address': direccion}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            posicion = results[0].geometry.location;
            //console.log(posicion);

            directionsService.route({
                origin: posicion,
                destination: ipartek,
                travelMode:  google.maps.TravelMode[modo]
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    // Visualizar el DIV Localizacion
                    document.getElementById("localizacion").style.display = "block";

                    // Codigo necesario para visualizar el mapa correctamente
                    var center = map.getCenter();
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);

                    // Vaciar el Panel Izquierdo (Indicaciones)
                    document.getElementById("right-panel").innerHTML = "";
                    directionsDisplay.setDirections(response);

                    // Bajar hasta el ancla del mapa
                    location.hash = "#alumnos";
                    location.hash = "#map";
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {
    var data = google.visualization.arrayToDataTable([
        ['Notas', 'Estadisticas Notas'],
        ['0',  arrayNotas.cero],
        ['1',  arrayNotas.uno],
        ['2',  arrayNotas.dos],
        ['3',  arrayNotas.tres],
        ['4',  arrayNotas.cuatro],
        ['5',  arrayNotas.cinco],
        ['6',  arrayNotas.seis],
        ['7',  arrayNotas.siete],
        ['8',  arrayNotas.ocho],
        ['9',  arrayNotas.nueve],
        ['10', arrayNotas.diez]
    ]);

    var options = {
        title: 'Estadisticas Notas Alumnos',
        hAxis: {title: 'Notas',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}