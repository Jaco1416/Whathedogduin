import './Components/factura/facturaform.'

var boton=document.getElementById('agregar');
var guardar=document.getElementById('guardar');
var lista=document.getElementById('lista');
var data = [];
var cant = 0;
boton.addEventListener('click',agregar);
guardar.addEventListener('click',save);
function agregar(){
    var nombre = document.getElementById('nombre').value;
    var precio = parseFloat(document.getElementById('precio').value);
    var cantidad = parseFloat(document.getElementById('cantidad').value);
    var total = precio*cantidad;
    console.log(total);
    data.push({"id":cant,
        "nombre":nombre
        ,"precio":precio
        ,"cantidad":cantidad
        ,"total":total});
    var id_row = "row"+cant;
    var fila = '<tr id="'+id_row+'"><td>'+nombre+'</td><td>'+precio+'</td><td>'+cantidad+'</td><td>'+total+'</td><td><a hhref="#" onclick="eliminar('+cant+')">ELIMINAR</a><a hhref="#" onclick="cantidad('+cant+')">Cantidad</a></td></tr>';
    $('#lista').append(fila);
    $("#nombre").val("");
    $("#precio").val("");
    $("#cantidad").val("");
    $("#nombre").focus();
    cant++;


}
function save(){

}




