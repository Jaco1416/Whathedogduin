// src/PaginaCrearFactura.js

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import companyData from '../CompanyData.js';
import './Css/Home.css';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/Auth/AuthContext.js';

import axios from 'axios';
import Swal from 'sweetalert2';


const Home = () => {
  const [productos, setProductos] = useState([{ nombre: '', cantidad: 0, precio: 0, total: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIVA] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const [numFactura, setNumFactura] = useState(null); // Inicializar con null o un valor que indique carga inicial
  const [fechaOrden, setFechaOrden] = useState('');
  const [fechaDespacho, setFechaDespacho] = useState('');
  const [rutCliente, setRutCliente] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [direccionCliente, setDireccionCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');

  const [regionDespacho, setRegionDespacho] = useState('');
  const [comunaDespacho, setComunaDespacho] = useState('');
  const [direccionDespacho, setDireccionDespacho] = useState('');
  const [usarDireccionCliente, setUsarDireccionCliente] = useState(false);


  const handleNumFactura = (e) => setNumFactura(e.target.value);

  const handleRutChange = (e) => setRutCliente(e.target.value);
  const handleNombreChange = (e) => setNombreCliente(e.target.value);
  const handleDireccionChange = (e) => setDireccionCliente(e.target.value);
  const handleTelefonoChange = (e) => setTelefonoCliente(e.target.value);
  const handleCorreoChange = (e) => setCorreoCliente(e.target.value);
  const handleRegionChange = (e) => setRegionDespacho(e.target.value);
  const handleComunaChange = (e) => setComunaDespacho(e.target.value);
  const handleDireccionDespachoChange = (e) => setDireccionDespacho(e.target.value);
  const handleFechaOrdenChange = (e) => setFechaOrden(e.target.value);
  const handleFechaDespachoChange = (e) => setFechaDespacho(e.target.value);

  const handleSubtotalChange = (e) => setSubtotal(e.target.value);
  const handleIvaChange = (e) => setIVA(e.target.value);
  const handleTotalGeneralChange = (e) => setTotalGeneral(e.target.value);

  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('empresa'));
  const auth = useAuth();

  const handleLogout = () => {
    auth.signout(() => {
      window.location.href = '/';
    });
  };

  const volverInicio = () => {
    navigate('/Inicio');
  };

  const agregarProducto = () => {
    setProductos([...productos, { nombre: '', cantidad: 0, precio: 0, total: 0 }]);
  };

  const eliminarProducto = (index) => {
    if (productos.length > 1) {
      const newProductos = productos.filter((_, i) => i !== index);
      setProductos(newProductos);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Debe haber al menos un producto!",
      });
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newProductos = [...productos];
    newProductos[index][name] = value;
    if (name === 'cantidad' || name === 'precio') {
      const cantidad = parseFloat(newProductos[index].cantidad) || 0;
      const precio = parseFloat(newProductos[index].precio) || 0;
      newProductos[index].total = cantidad * precio;
    }
    setProductos(newProductos);
  };

  /**useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      handleLogout();
    } else {
      obtenerSiguienteNumeroFactura();
    }
  }, []);**/

  const obtenerSiguienteNumeroFactura = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/next-order-number');
      console.log(response.data); // Asegúrate de que este log muestra el valor esperado
      const nextOrderNumber = response.data.nextOrderNumber;
      if (nextOrderNumber) {
        setNumFactura(nextOrderNumber); // Asegúrate de que nextOrderNumber no es undefined o null
      } else {
        console.error('El número de orden siguiente recibido es undefined o null.');
      }
    } catch (error) {
      console.error('Error al obtener el siguiente número de orden:', error);
    }
  };

  const handleCheckboxChange = (event) => {
    setUsarDireccionCliente(event.target.checked);
    if (event.target.checked) {

      setDireccionDespacho(direccionCliente);
    } else {

      setDireccionDespacho('');
    }
  };


  useEffect(() => {
    calcularSubtotal();
  }, [productos]);

  useEffect(() => {
    calcularIVA();
    calcularTotalGeneral();
  }, [subtotal]);

  const calcularSubtotal = () => {
    let total = 0;
    productos.forEach(producto => {
      total += parseFloat(producto.total) || 0;
    });
    setSubtotal(total);
  };

  const calcularIVA = () => {
    const ivaValor = subtotal * 0.19;
    setIVA(ivaValor);
  };

  const calcularTotalGeneral = () => {
    const total = subtotal + iva;
    setTotalGeneral(total);
  };


  const enviarFactura = async (facturaData) => {
    try {
      const response = await axios.post('http://localhost:3001/facturas', facturaData);
      console.log('Factura enviada correctamente:', response.data);
      if (response.data.success) {
        return response.data.numero_orden;
      } else {
        console.error('Error al enviar la factura:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error al enviar la factura:', error.message, error.response?.data);
      return null; // Ensure that null is returned if there's an error
    }
  };
  
  const enviarDetallesFactura = async (numero_orden) => {
    if (!productos || productos.length === 0) {
      console.error('No hay productos para enviar');
      return;
    }

    for (let producto of productos) {
      const detalleFacturaData = {
        numero_orden,
        nombre_producto: producto.nombre,
        cantidad: producto.cantidad,
        precio: producto.precio,
        total: producto.total
      };

      console.log('Enviando detalle de factura:', detalleFacturaData);

      try {
        const response = await axios.post('http://localhost:3001/api/detalles_facturas', detalleFacturaData);
        console.log('Detalle de factura enviado:', response.data);
      } catch (error) {
        console.error('Error al enviar el detalle de la factura:', error.message, error.response?.data);
        return; // Stop on first error
      }
    }

    console.log('Detalles de factura enviados correctamente');
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('empresa'));

    if (user) {
      const { NOMBRE, RUT, DIRECCION, TELEFONO, EMAIL, SITIO_WEB, TIPO_SERVICIO } = user;
      generarPDF(
        numFactura,
        NOMBRE, RUT, DIRECCION, TELEFONO, EMAIL,
        nombreCliente, rutCliente, direccionCliente, telefonoCliente, correoCliente, subtotal, iva, totalGeneral, regionDespacho, comunaDespacho, direccionDespacho, fechaDespacho
      );

      // Convertir productos a JSON
      const productosJSON = JSON.stringify(productos);

      // Construir los datos de la factura, incluyendo la lista de productos


      const facturaData = {
        numero_orden: numFactura,
        fecha_orden: fechaOrden,
        rut_proveedor: RUT,
        razon_social_proveedor: NOMBRE,
        direccion_proveedor: DIRECCION,
        telefono_proveedor: TELEFONO,
        correo_proveedor: EMAIL,
        sitio_web_proveedor: SITIO_WEB,
        tipo_servicio: TIPO_SERVICIO,
        rut_cliente: rutCliente,
        nombre_cliente: nombreCliente,
        direccion_cliente: direccionCliente,
        telefono_cliente: telefonoCliente,
        correo_cliente: correoCliente,
        subtotal: subtotal,
        iva: iva,
        total: totalGeneral,
        productos: productosJSON, // Enviar productos como cadena JSON
        regionDespacho: regionDespacho,
        comunaDespacho: comunaDespacho,
        direccionDespacho: direccionDespacho,
        fechaDespacho: fechaDespacho

      };

      // Enviar los datos de la factura al servidor
      const numero_orden = await enviarFactura(facturaData);
      if (numero_orden) {
        await enviarDetallesFactura(numero_orden);
      }
      Swal.fire({
        title: "Factura creada con éxito!",
        text: "Se ha descargado el pdf.",
      }).then(() => {
        navigate('/Inicio')
      });
    } else {
      console.log('No user data found in localStorage');
    }
  };


  const generarPDF = async () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Factura', 14, 22);

    // Información de la empresa
    doc.setFontSize(12);
    doc.text(`Razón Social: ${companyData.nombreEmpresa}`, 14, 30);
    doc.text(`RUT: ${companyData.rutEmpresa}`, 14, 36);
    doc.text(`Dirección: ${companyData.direccion}`, 14, 42);
    doc.text(`Teléfono: ${companyData.telefono}`, 14, 48);
    doc.text(`Comuna: ${companyData.comuna}`, 14, 54);
    doc.text(`Región: ${companyData.region}`, 14, 60);
    doc.text(`Correo: ${companyData.correo}`, 14, 66);
    // Información de la factura
    doc.text('Fecha: ' + new Date().toLocaleDateString(), 14, 72);
    doc.text('Subtotal: $' + Math.round(subtotal), 14, 78);
    doc.text('IVA (19%): $' + Math.round(iva), 14, 84);
    doc.text('Total General: $' + Math.round(totalGeneral), 14, 90);

    // Encabezado de la tabla
    const tableColumn = ["Nombre del Producto", "Cantidad", "Precio Unitario", "Total por Producto"];
    const tableRows = [];

    // Datos de la tabla
    productos.forEach(producto => {
      const precio = parseFloat(producto.precio) || 0;
      const total = parseFloat(producto.total) || 0;
      const productoData = [
        producto.nombre,
        producto.cantidad,
        `$${precio.toFixed(2)}`,
        `$${total.toFixed(2)}`,
      ];
      tableRows.push(productoData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 96,
      theme: 'grid',
    });

    // Guardar el PDF
    doc.save('factura.pdf');

  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button class="Btn" onClick={handleLogout} style={{ marginRight: '100px' }}>
          <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

          <div class="text">Logout</div>
        </button>
        <button class="Btn-volver" onClick={volverInicio}>
          <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

          <div class="text">Inicio</div>
        </button>
      </div>
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Orden de Compra</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <th>Número de orden</th>
            <th>Fecha orden</th>
          </thead>
          <tbody>
            <tr>
              <td><input type="number" name='nroOrden' placeholder='nro orden' required disabled/></td>
              <td><input className='fecha-input' type="date" name='fecha' required value={fechaOrden} onChange={handleFechaOrdenChange} /></td>
            </tr>
          </tbody>
        </table>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Datos empresa proovedora</h3>
        <table>
          <thead>
            <th>Rut empresa*</th>
            <th>Razón social*</th>
            <th>Direccion*</th>
            <th>Teléfono*</th>
            <th>Correo*</th>
            <th>Sitio web</th>
            <th>Tipo servicio</th>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" value={userData.RUT} name='rutEmpProv' placeholder='Ingresa rut empresa' required minLength="10" maxLength="10" /></td>
              <td><input type="text" value={userData.NOMBRE} name='nomEmpProv' placeholder='Ingresa nombre empresa' required minLength="10" maxLength="10" /></td>
              <td><input type="text" value={userData.DIRECCION} name='dirEmpProv' placeholder='Ingresa direccion empresa' required minLength="10" maxLength="10" /></td>
              <td><input type="text" value={userData.TELEFONO} name='telEmpProv' placeholder='Ingresa teléfono' required /></td>
              <td><input type="email" value={userData.EMAIL} name='mailEmpProv' placeholder='Ingresa correo' required /></td>
              <td><input type="text" value={userData.SITIO_WEB} name='webEmpProv' placeholder='Ingresa página web' /></td>
              <td><input type="text" value={userData.TIPO_SERVICIO} name='servEmpProv' placeholder='Ingresa tipo de servicio' /></td>
            </tr>
          </tbody>
        </table>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Datos empresa cliente</h3>
        <table>
          <thead>
            <th>Rut*</th>
            <th>Nombre o razón social*</th>
            <th>Direccion*</th>
            <th>Teléfono*</th>
            <th>Correo*</th>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" name='rutEmpCliente' placeholder='Ingresa rut' required minLength="10" maxLength="10" value={rutCliente}
                onChange={handleRutChange} /></td>
              <td><input type="text" name='nomEmpCliente' placeholder='Ingresa nombre' required minLength="3" maxLength="30" value={nombreCliente}
                onChange={handleNombreChange} /></td>
              <td><input type="text" name='dirEmpCliente' placeholder='Ingresa direccion' required minLength="10" maxLength="30" value={direccionCliente}
                onChange={handleDireccionChange} /></td>
              <td><input type="text" name='telEmpCliente' placeholder='Ingresa teléfono' required value={telefonoCliente}
                onChange={handleTelefonoChange} /></td>
              <td><input type="email" name='mailEmpCliente' placeholder='Ingresa correo' required value={correoCliente}
                onChange={handleCorreoChange} /></td>
            </tr>
          </tbody>
        </table>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Datos de despacho</h3>
        <div className='dirCheckbox'>
          <input type="checkbox" className='dirCheckbox' checked={usarDireccionCliente} onChange={handleCheckboxChange}/> 
          <div className='checkmark'></div>
          <p>Usar la misma dirección del cliente para despacho</p>
        </div>
        <table>
          <thead>
            <th>Región*</th>
            <th>Comuna*</th>
            <th>Dirección*</th>
            <th>Fecha estimada de entrega*</th>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="regionDespacho"
                  placeholder='Ingresa la región'
                  required
                  value={regionDespacho}
                  onChange={handleRegionChange}
                  minLength="5"
                  maxLength="80"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="comunaDespacho"
                  placeholder='Ingresa la comuna'
                  required
                  value={comunaDespacho}
                  onChange={handleComunaChange}
                  minLength="3"
                  maxLength="80"
                />
              </td>
              <td>
                <input
                  type="text"
                  name='dirDespacho'
                  placeholder='Ingresa direccion de despacho'
                  required
                  minLength="5"
                  maxLength="45"
                  value={direccionDespacho}
                  onChange={handleDireccionDespachoChange}
                />
              </td>
              <td>
                <input className='fecha-input' type="date" name='fechaDespacho' required value={fechaDespacho} onChange={handleFechaDespachoChange} />
              </td>
            </tr>
          </tbody>
        </table>
        <h3 style={{ textAlign: 'center', marginTop: '30px' }}>Datos productos</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total por Producto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td><input type="text" name="nombre" value={producto.nombre} onChange={e => { if (e.target.value === '' || !e.target.value.match(/^ *$/)) { handleInputChange(index, e); } }} placeholder='Ingresa nombre de producto' required minLength="2" maxLength="45" /></td>
                <td><input type="number" placeholder='Ingresa cantidad del producto' name="cantidad" value={producto.cantidad} onChange={e => handleInputChange(index, e)} min="1" required /></td>
                <td><input type="number" name="precio" placeholder='Ingresa precio' value={producto.precio} onChange={e => handleInputChange(index, e)} min="0.01" step="0.01" required /></td>
                <td><input type="text" value={producto.total} readOnly /></td>
                <td><button type="button" className="botones-form" onClick={() => eliminarProducto(index)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="boton-agregar" onClick={agregarProducto}>Agregar Producto</button>
        <div className="total-container">
          <br /><br />
          <label>Subtotal:</label>
          <p>{Math.round(subtotal)}</p>
          <br />
          <label>IVA (19%):</label>
          <p>{Math.round(iva)}</p>
          <br />
          <label>Total General (IVA incluido):</label>
          <p>{Math.round(totalGeneral)}</p>
          <br /><br />
          <button type="submit" className="botones-form-generar">Generar Factura</button>
        </div>
      </form>
    </div>
  );
};

export default Home;