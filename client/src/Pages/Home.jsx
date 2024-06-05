// src/PaginaCrearFactura.js

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import companyData from '../CompanyData.js';
import './Css/Home.css';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';


const Home = () => {
  const [productos, setProductos] = useState([{ nombre: '', cantidad: 0, precio: 0, total: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIVA] = useState(0);
  const [totalGeneral, setTotalGeneral] = useState(0);


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('loggedIn', 'false');
    navigate('/');
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
        title: "Oops...",
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

  const handleSubmit = event => {
    event.preventDefault();
    generarPDF();
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
      <button class="btn-logout" onClick={handleLogout}>

        <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

      </button>
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Orden de Compra</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <th>Número de orden</th>
            <th>Fecha orden</th>
          </thead>
          <tbody>
            <tr>
              <td><input type="number" name='nroOrden' placeholder='Ingresa número de orden' required /></td>
              <td><input className='fecha-input' type="date" name='fecha' required /></td>
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
              <td><input type="text" name='rutEmpProv' placeholder='Ingresa rut empresa' required minLength="10" maxLength="10" /></td>
              <td><input type="text" name='nomEmpProv' placeholder='Ingresa nombre empresa' required minLength="10" maxLength="10" /></td>
              <td><input type="text" name='dirEmpProv' placeholder='Ingresa direccion empresa' required minLength="10" maxLength="10" /></td>
              <td><input type="number" name='telEmpProv' placeholder='Ingresa teléfono' required /></td>
              <td><input type="email" name='mailEmpProv' placeholder='Ingresa correo' required /></td>
              <td><input type="text" name='webEmpProv' placeholder='Ingresa página web' /></td>
              <td><input type="text" name='servEmpProv' placeholder='Ingresa tipo de servicio' /></td>
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
              <td><input type="text" name='rutEmpCliente' placeholder='Ingresa rut' required minLength="10" maxLength="10" /></td>
              <td><input type="text" name='nomEmpCliente' placeholder='Ingresa nombre' required minLength="10" maxLength="10" /></td>
              <td><input type="text" name='dirEmpCliente' placeholder='Ingresa direccion' required minLength="10" maxLength="10" /></td>
              <td><input type="number" name='telEmpCliente' placeholder='Ingresa teléfono' required /></td>
              <td><input type="email" name='mailEmpCliente' placeholder='Ingresa correo' required /></td>
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
                <td><input type="text" name="nombre" value={producto.nombre} onChange={e => { if (e.target.value === '' || !e.target.value.match(/^ *$/)) { handleInputChange(index, e); } }} placeholder='Ingresa nombre de producto' required minLength="4" maxLength="45" /></td>
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
          <button type="submit" className="botones-form">Generar Factura</button>
        </div>
      </form>
    </div>
  );
};

export default Home;