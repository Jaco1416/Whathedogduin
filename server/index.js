const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // Importa multer

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Whathedogduin"

});




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/imagenes'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        if (!file) {
            return cb(new Error('No se recibió ningún archivo'));
        }
        cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 50 MB
});





app.post("/create",(req,res)=>{
    const rut = req.body.rut;
    const nombre = req.body.nombre;
    const apePaterno = req.body.apePaterno;
    const apeMaterno = req.body.apeMaterno;
    const direccion = req.body.direccion;
    const telefono = req.body.telefono;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    const tipoUsuario = req.body.tipoUsuario;


    db.query('INSERT INTO usuarios(RUT,NOMBRE,APE_PATERNO,APE_MATERNO,DIRECCION,TELEFONO,CORREO,CONTRASENA, TIPO_USUARIO) VALUES(?,?,?,?,?,?,?,?,?)',
    [rut,nombre,apePaterno,apeMaterno,direccion,telefono,correo,contrasena,tipoUsuario],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.post("/createClient",(req,res)=>{
    const rut = req.body.rut;
    const nombre = req.body.nombre;
    const apePaterno = req.body.apePaterno;
    const apeMaterno = req.body.apeMaterno;
    const direccion = req.body.direccion;
    const telefono = req.body.telefono;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;

    db.query('INSERT INTO cliente(RUT,NOMBRE,APE_PATERNO,APE_MATERNO,DIRECCION,TELEFONO,CORREO,CONTRASENA) VALUES(?,?,?,?,?,?,?,?)',
    [rut,nombre,apePaterno,apeMaterno,direccion,telefono,correo,contrasena],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.post("/createProducto",upload.single('imagen'),(req,res)=>{
    const cod_producto = req.body.cod_producto;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const stock = req.body.stock;
    const descuento = req.body.descuento;
    const imagen = req.file.filename;
    const marca = req.body.marca;
    const categoria = req.body.categoria;

    db.query('INSERT INTO producto(COD_PRODUCTO,NOMBRE,DESCRIPCION,PRECIO,STOCK,DESCUENTO,IMAGEN,MARCA,CATEGORIA) VALUES(?,?,?,?,?,?,?,?,?)',
    [cod_producto,nombre,descripcion,precio,stock,descuento,imagen,marca,categoria],
    (err,result)=>{
        if(err){
            console.error(err);
            res.status(500).send("Error al subir el archivo");
        }else{
            res.send(result);
        }
    }
    );
});


app.get("/empresa",(req,res)=>{

    db.query('SELECT * FROM  empresa',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.put("/update",(req,res)=>{
    const rut = req.body.rut;
    const nombre = req.body.nombre;
    const apePaterno = req.body.apePaterno;
    const apeMaterno = req.body.apeMaterno;
    const direccion = req.body.direccion;
    const telefono = req.body.telefono;
    const correo = req.body.correo;
    const contrasena = req.body.contrasena;
    const tipoUsuario = req.body.tipoUsuario;


    db.query('UPDATE usuarios SET RUT=?,NOMBRE=?,APE_PATERNO=?,APE_MATERNO=?,DIRECCION=?,TELEFONO=?,CORREO=?,CONTRASENA=?, TIPO_USUARIO=? WHERE RUT = ?', [rut,nombre,apePaterno,apeMaterno,direccion,telefono,correo,contrasena,tipoUsuario,rut],
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.delete("/delete/:rut",(req,res)=>{
    const rut = req.params.rut;


    db.query('DELETE FROM usuarios WHERE RUT = ?', rut,
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});




app.get("/cliente",(req,res)=>{

    db.query('SELECT * FROM  cliente',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});

app.get("/producto",(req,res)=>{

    db.query('SELECT * FROM producto',
    (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    }
    );
});


app.listen(3001,()=>{
    console.log('Corriendo en el puerto 3001')
})