const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // Importa multer
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Whathedogduin"

});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ajusta esta ruta según la estructura de tu proyecto
        cb(null, path.resolve(__dirname, '..', 'client', 'src', 'Components', 'Assets'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname);
    }
});

const upload = multer({ storage: storage });



app.get("/empresa", (req, res) => {
    db.query('SELECT * FROM empresa', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/facturas", (req, res) => {
    const rut_proveedor = req.query.rut_proveedor;
    db.query('SELECT * FROM facturas WHERE rut_proveedor = ?', [rut_proveedor], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Ruta para obtener detalles de una factura por numero_orden
// Nueva ruta para obtener los detalles de una factura por numero_orden
app.get('/factura/:id', (req, res) => {
    const numero_orden = req.params.id;
    const query = 'SELECT * FROM facturas WHERE numero_orden = ?';

    db.query(query, [numero_orden], (err, result) => {
        if (err) {
            console.error('Error al obtener los detalles de la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.status(404).send({ error: 'Factura no encontrada' });
        }
    });
});

app.get('/api/next-invoice-number', (req, res) => {
    const query = `SELECT AUTO_INCREMENT as nextInvoiceNumber
                   FROM information_schema.TABLES
                   WHERE TABLE_SCHEMA = 'Whathedogduin' AND TABLE_NAME = 'facturas'`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener el próximo número de factura:', err);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        res.send({ nextInvoiceNumber: result[0].nextInvoiceNumber });
    });
});



// Nueva ruta para el login
app.post('/api/login', (req, res) => {
    const { rutEmpresa, password } = req.body;
    const query = 'SELECT * FROM usuario WHERE rut = ? AND password = ?';

    db.query(query, [rutEmpresa, password], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Database query error' });
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            res.send({ success: true, user });
        } else {
            res.send({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Ruta para insertar una nueva factura
app.post('/facturas', (req, res) => {
    const facturaData = req.body;
    const query = 'INSERT INTO facturas SET ?';

    db.query(query, facturaData, (err, result) => {
        if (err) {
            console.error('Error al insertar la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        console.log('Factura insertada correctamente');
        res.send({ success: true, numero_orden: result.insertId });
    });
});

app.get('/rechazos/:id', (req, res) => {
    const numero_orden = parseInt(req.params.id, 10);
    if (isNaN(numero_orden)) {
        return res.status(400).send({ error: 'Invalid ID format', message: 'ID must be a number' });
    }

    const query = 'SELECT * FROM rechazos WHERE numero_orden = ?';
    db.query(query, numero_orden, (err, result) => {
        if (err) {
            console.error('Error al rescatar rechazos:', err.message);
            return res.status(500).send({ error: 'Database query error', message: err.message });
        }
        if (result.length === 0) {
            return res.status(404).send({ error: 'Not Found', message: 'No rechazos found for the provided numero_orden' });
        }
        console.log('rechazos rescatado', result);
        res.send({ success: true, detalles: result });
    });
});

// Ruta para actualizar una factura existente
// Ruta para actualizar una factura existente
app.put('/factura/:id', upload.single('foto_evidencia'), (req, res) => {
    const numero_orden = req.params.id;
    let updatedFactura = req.body;

    // Si existe un archivo de foto_evidencia, incluir el nombre del archivo en updatedFactura
    if (req.file) {
        updatedFactura.foto_evidencia = req.file.filename;
    }

    // Establecer el estado de la factura a "rectificada"
    updatedFactura.estado_factura = 'rectificada';

    // Generar la consulta de actualización
    const query = 'UPDATE facturas SET ? WHERE numero_orden = ?';

    // Pasar updatedFactura como parte del array de valores para la consulta
    db.query(query, [updatedFactura, numero_orden], (err, result) => {
        if (err) {
            console.error('Error al actualizar la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        if (result.affectedRows > 0) {
            res.send({ success: true, message: 'Factura actualizada con éxito' });
        } else {
            res.status(404).send({ error: 'Factura no encontrada' });
        }
    });
});

app.put('/facturaAnulada/:id', (req, res) => {
    const numero_orden = req.params.id;
    let updatedFactura = req.body;

    // Establecer el estado de la factura a "rectificada"
    updatedFactura.estado_factura = 'anulada';

    // Generar la consulta de actualización
    const query = 'UPDATE facturas SET ? WHERE numero_orden = ?';

    db.query(query, [updatedFactura, numero_orden], (err, result) => {
        if (err) {
            console.error('Error al actualizar la factura:', err.message);
            res.status(500).send({ error: 'Database query error', message: err.message });
            return;
        }
        if (result.affectedRows > 0) {
            res.send({ success: true, message: 'Factura actualizada con éxito' });
        } else {
            res.status(404).send({ error: 'Factura no encontrada' });
        }
    });
});


// Ruta para subir el archivo PDF y asociarlo con el numero_orden
app.post('/upload', upload.single('pdf'), (req, res) => {
    const numeroOrden = req.body.numero_orden;

    if (!req.file) {
        return res.status(400).send('No se subió ningún archivo');
    }

    const pdfBuffer = req.file.buffer;
    const query = 'UPDATE facturas SET pdf = ? WHERE numero_orden = ?';

    db.query(query, [pdfBuffer, numeroOrden], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Archivo subido y guardado en la base de datos');
    });
});

app.listen(3001, () => {
    console.log('Corriendo en el puerto 3001');
});