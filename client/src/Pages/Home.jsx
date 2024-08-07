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
  const [fechaDespacho, setFechaDespacho] = useState('');
  const [rutCliente, setRutCliente] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [direccionCliente, setDireccionCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');

  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');
  const [errorRegion, setErrorRegion] = useState('');
  const [errorComuna, setErrorComuna] = useState('');

  const regionesYComunas = {
    "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Región de Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Región de Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Región de Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Región de Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Región del Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Región de Ñuble": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
    "Región del Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    "Región de La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Región de Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Región de Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Región de Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"],
    "Región Metropolitana de Santiago": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
  };

  const [direccionDespacho, setDireccionDespacho] = useState('');
  const [usarDireccionCliente, setUsarDireccionCliente] = useState(false);


  const handleNumFactura = (e) => setNumFactura(e.target.value);

  const handleRutChange = (e) => setRutCliente(e.target.value);
  const handleNombreChange = (e) => setNombreCliente(e.target.value);
  const handleDireccionChange = (e) => setDireccionCliente(e.target.value);
  const handleTelefonoChange = (e) => setTelefonoCliente(e.target.value);
  const handleCorreoChange = (e) => setCorreoCliente(e.target.value);

  const handleRegionChange = (event) => {
    const valor = event.target.value;
    setRegionSeleccionada(valor);
    setComunaSeleccionada(''); // Resetear comuna al cambiar la región
    //Aquí se establece el mensaje de error si no se selecciona una región
    setErrorRegion(valor ? '' : 'Debes seleccionar una región');
    //Resetea y limpia el mensaje de error de la comuna
    setErrorComuna('');
  };

  const handleComunaChange = (event) => {
    const valor = event.target.value;
    setComunaSeleccionada(valor);
    //Aquí se establece el mensaje de error si no se selecciona una comuna
    setErrorComuna(valor ? '' : 'Debes seleccionar una comuna');
  };


  // const comunaOptions = regionDespacho ? comunasPorRegion[regionDespacho] : [];

  const handleDireccionDespachoChange = (e) => setDireccionDespacho(e.target.value);
  // const handleFechaOrdenChange = (e) => setFechaOrden(e.target.value);
  const handleFechaDespachoChange = (e) => setFechaDespacho(e.target.value);

  // const handleSubtotalChange = (e) => setSubtotal(e.target.value);
  // const handleIvaChange = (e) => setIVA(e.target.value);
  // const handleTotalGeneralChange = (e) => setTotalGeneral(e.target.value);

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

  const obtenerFechaActualFormateada = () => {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = (`0${fechaActual.getMonth() + 1}`).slice(-2); // Asegura el formato de dos dígitos
    const dia = (`0${fechaActual.getDate()}`).slice(-2); // Asegura el formato de dos dígitos
    return `${año}-${mes}-${dia}`;
  };

  const [fechaOrden, setFechaOrden] = useState(obtenerFechaActualFormateada());

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
        nombreCliente, rutCliente, direccionCliente, telefonoCliente, correoCliente, subtotal, iva, totalGeneral, regionSeleccionada, comunaSeleccionada, direccionDespacho, fechaDespacho
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
        regionDespacho: regionSeleccionada,
        comunaDespacho: comunaSeleccionada,
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
    const user = JSON.parse(localStorage.getItem('empresa'));

    // Título
    doc.setFontSize(18);
    doc.text(`Factura de compras realizada en ${user.SITIO_WEB}`, 14, 18);

    // Información de la empresa
    doc.setFontSize(12);
    doc.text(`Razón Social: ${user.NOMBRE}`, 14, 28);
    doc.text(`RUT: ${user.RUT}`, 14, 34);
    doc.text(`Correo: ${user.EMAIL}`, 14, 40);
    doc.text(`Teléfono: ${user.TELEFONO}`, 14, 46);
    doc.text(`Dirección: ${user.DIRECCION}`, 14, 52);
    doc.text(`Comuna: ${comunaSeleccionada}`, 14, 58);
    doc.text(`Región: ${regionSeleccionada}`, 14, 64);
    doc.text(`Fecha: ${fechaOrden}`, 14, 70);
    //datos cliente
    doc.text(`Razón Social Cliente: ${nombreCliente}`, 100, 28);
    doc.text(`RUT Cliente: ${rutCliente}`, 100, 34);
    doc.text(`Correo de cliente: ${correoCliente}`, 100, 40);
    doc.text(`Teléfono Cliente: ${telefonoCliente}`, 100, 46);
    doc.text(`Dirección Cliente: ${direccionCliente}`, 100, 52);
    doc.text(`Comuna de despacho: ${comunaSeleccionada}`, 100, 58);
    doc.text(`Región de despacho: ${regionSeleccionada}`, 100, 64);
    doc.text(`Fecha de despacho: ${fechaDespacho}`, 100, 70);

    doc.text(`Subtotal: ${subtotal}`, 14, 128);
    doc.text(`IVA (19%): ${iva}`, 14, 134);
    doc.text(`Total General: ${totalGeneral}`, 14, 140);

    doc.addImage(imgData, 'JPEG', 62, 200, 90, 90); // Adjust coordinates and dimensions as needed
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

    doc.save('factura.pdf');

  };

  const imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAADxSklEQVR4nOydd3xT1RvGn4ymTbr33ntCy957iCJTQfEHKKKCIKIiIoiAOBDEheIGFVRUZIiITJG9Ct17772TZv/+KIWO5I6MtpTz/Xz4AMnNvadNcp9zzvu+z8tRq9UgEAgEAoFwb8Pt7gEQCAQCgUDQHyLoBAKBQCD0AoigEwgEAoHQCyCCTiAQCARCL4AIOoFAIBAIvQAi6AQCgUAg9AKIoBMIBAKB0Asggk4gEAgEQi+ACDqBQCAQCL0AIugEAoFAIPQCiKATCAQCgdALIIJOIBAIBEIvgAg6gUAgEAi9ACLoBAKBQCD0AoigEwgEAoHQCyCCTiAQCARCL4AIOoFAIBAIvQAi6AQCgUAg9AKIoBMIBAKB0Asggk4gEAgEQi+ACDqBQCAQCL0AIugEAoFAIPQCiKATCAQCgdALIIJOIBAIBEIvgAg6gUAgEAi9ACLoBAKBQCD0AoigEwgEAoHQCyCCTiAQCARCL4AIOoFAIBAIvQAi6AQCgUAg9AKIoBMIBAKB0Asggk4gEAgEQi+ACDqBQCAQCL0AIugEAoFAIPQCiKATCAQCgdALIIJOIBAIBEIvgAg6gUAgEAi9ACLoBAKBQCD0AoigEwgEAoHQCyCCTiAQCARCL4AIOoFAIBAIvQAi6AQCgUAg9AKIoBMIBAKB0Asggk4gEAgEQi+ACDqBQCAQCL0AIugEAoFAIPQCiKATCAQCgdALIIJOIBAIBEIvgAg6gUAgEAi9ACLoBAKBQCD0AoigEwgEAoHQCyCCTiAQCARCL4AIOoFAIBAIvQAi6AQCgUAg9AKIoBMIBAKB0Asggk4gEAgEQi+ACDqBQCAQCL0AIugEAoFAIPQCiKATCAQCgdALIIJOIBAIBEIvgAg6gUAgEAi9ACLoBAKBQCD0AoigEwgEAoHQCyCCTiAQCARCL4AIOoFAIBAIvQAi6AQCgUAg9AKIoBMIBAKB0Asggk4gEAgEQi+ACDqBQCAQCL0AIugEAoFAIPQCiKATCAQCgdALIIJOIBAIBEIvgAg6gUAgEAi9ACLoBAKBQCD0AoigEwgEAoHQCyCCTiAQCARCL4AIOoFAIBAIvQAi6AQCgUAg9AKIoBMIBAKB0Asggk4gEAgEQi+ACDqBQCAQCL0AIugEAoFAIPQC+N09AAKBQM2NjcEOpXVyp7I6qVNZrcyhpFbhVFonc65skNs0NqtFzTK1QCJXm0lkaoFUBkGTQm0mU8FMqYaZpvPxOGgWcNFszuc0mwogEwo4MqEJp9lMwJFZmHHEDpYmtS7WgjJXG365s42g0tnatNzZil/Zf0N6eVf/7AQCgTkctVrd3WMgEO5rsraFC9JKxAFpReKAlOLmgORCiX9CkTygXgaHNofFdNsAW4ht/YcFH9WRHvzMMA9hVoibKDPEXZQZ4mKWHvBqsqw7B0gg3O8QQScQuogr64Nc0oolASkl4oCUwqbApEJ5QGa1ygctO2XdLdj6EgtA5WXFyQ/zEGSHuosyQt3NMoNdRZkj38nM7+7BEQj3A0TQCQQjELc5xCY+ryniRm5jRGxOY/jVXEWEVAkr3PvCzZZYPgfiGC9+cn9f86RoH4vEvt6iRLJ9TyAYHiLoBIIBOPaKf8il9Pr+59Pq+p3LlMfIVbDA/SfeTIk14aJxXIjp1QkRNufGhFufj16fVt3dgyIQ7nWIoBMILInbHGJzOaOh/4W0+v7/pYgH5NWrfG4/RQRcN2JNeaifGGZ2eXykzbnRYdYXo9am1nb3oAiEew0i6AQCQ75c4D7+18sVD55Olw8H0L+7x9OLibUTcMpnDLQ4NTXa/vi0T3Liu3tABMK9ABF0AkEL+dsjuPuvVjz0y+XqB6/mKVoFnKzCu5ZYDqAYFWBy+eF+tqceirE/HvhqcnN3D4pA6IkQQScQ2pC/PYK773Llw/suVk69UaTsix4g4FGuPDhZ82Ap5MLKlA9LIQ8WQh4sTVv+tjDjwsKUDwshF5ZmPFiY8mDR5m9LSxMAQH29HI1SJRqbW/40yZSol6ju/L+xWYmG1n9LWv5d36xEg0SJwhoF0spV3fybAADEulty8ucNtf3z0SEOh/u9mVbZ3QMiEHoKRNAJ9z2ZW8MFv10uf/jnizVTE0qVEegGEXez4CDMwwRh7iKEupkh2E2EIBcR3J00esN0G0XlzUgrESOtWIKUYgmSi8RILpSjpKlb7iOxjkJO6bxh1n/OGeJwePCmjOLuGASB0FMggk64L0l+N9TityuVD+89Xz01o0oVhC4QcTMeEOnOR5ibGULdRQhxEyHI1Qyh3hbGvrTRUUhVSC8VI71YjNSSZqQWiZFULEFCkRJSZZcMIdZWwCmfN8zqr0cGOxwmte+E+xEi6IT7in9W+QV9/k/JgsMJzRNh5MQ2RyEHk6PMMTbCBqPDrOHjIjTm5XosOSVi/Jtci1OJtfgnToJKqdHvObEj/PkXX53q/uVDH+YmGvtiBEJPgQg64b5g80ynRz/9p/J/5WK1G4y0GicCzozsYjH+TanFaeMLfKybBadw1VTnr1/8qeSIsS5CIPQUiKATei0dVuNcGFjI7YUcPBApvC3gNvB1FRny9PcNrQJ/KqEOx+PFxhD4WBMuGpeNs927/Xj1V4Y+OYHQUyCCTuh1/LLEe+B7h4qWxJUoo2BAEScC3jVkFYvxb3IdTifW4licGNUyg92jYgGopkWZHl/9sOdnQ94iSXSE3gURdEKvYeujLtO3HClfXCVRu8BAQi7iA4tGWmHBSBf0C7QyxCmNjkquwqWsJjRIlHC3NUWAkwmEonu3U/L19DrsOluOXefqIDFcgl1sXzde/GvT3HfO+TzvqsHOSiB0I0TQCfc0udsjuNv/Knju8zP1jynVEMFAQj69rxCLRjvhoQGOhjgdaxRSFRqalbC1NmH92k2/l+L9o+17nzhb8+BhJ4CdiAeRKRcCHgc8HsDncsDlcGBmwkWAswlC3cwQ6mYKF1sTgMs11I9jMA5fqcB3/5biULzUUKeMdRRySl+d6vT1K/tKDxrqpARCd0AEnXDPsnKC7XMfn6xdoAYGG+J8A7z4WDTaCfOGOcLCgr2Q6oNcqsCtvGZcyhTjTEoj/ktvglSuxta5Llgy0YnVuSa9m4kLGWK9xmMl5KKPlxBPDLXF7P7WMBXy9DqfoWlokGPvhTJ8c7oCN4oMsmyPNeGicd1Uh53rD1b8YogTEghdDRF0wj3HpumOczf/WbnEEB3N3Cw4eHqMPZ4c7dylWemF5TLcyBHjWm4TrmSJcT1HArkGXTI35SB7WyjMzZlvmX99qgIr95YYbKzWIi4WjrDFohF28HPreZn72cVi7Dpbhq9OV6NcrPf9LNZKgMq3H3H9cNme4mOGGB+B0FUQQSfcM+x4wm3y2t9KVtbL4AA9hNyEC8wfaomFo5wxPMzGcAPUQlmlFLeKmhGXK8GNHAkuZzehqpG5jeqH89yweJwD4+Nr6uTwXJkMgKPDaKlQ483pzlj1kFOP3I4HgP8Sa7Drv3LsvdQAuX5OtbFuFpzCrY97vPv4l/mXDTQ8AsGoEEEn9Hi+fcpj9Opfilfpm+wW7c7Dq1PdMXugA/imBhYkpRolNTLkVsmQVSZHSokEyYVSxOaJWYm3JoKcBYjdHAzwmAu01/IkVDcZx6JtWowVvn3KA2Y9ONFOLlXgt8tV2PJnMeJL9Po9xIY6cVO3PeH19pQPcpINNT4CwRgQQSf0WGI3Bjs89132u9fyFTHQQ8hHB5jgzdmeGB1pZ8DRtVBbL8fLP5fgz5t1EBuuvKoTPy/xxtQB1oyPd12SiAap8ZqpRHqY4t81AT0utq6JM/HVePP3fJzLUuhzmthR/iYXv3k28OWAVUkyQ42NQDAkRNAJPZKFQyxf/f5y4xzoIeRTwk2x6RFvo5ab/XyuCot3FRnt/K2EugpwbWMwwGewSleoYfFMgtHH9MJEB7wz183o1zEUNzLqse7XPBxL1itD/urKCbbfEoMaQk+ECDqhR/HR464Prd5XukqmR8LbI/1E2DTbCyFexm96ci65AQ9syzH6dQDg9+VemBxtQ3tcXYMC7iu6YndYjdOv+WNgkP6/5/xyGa5mNeF6ThOqmlSQSFVQqtTwshfA28EEIa5CDAsUGWRHIDGnARv252H/TZ3bqseK+Kjd/rjbu89+X3RS7wERCAaCCDqhR3BqtX/AU1/kbMmvV/tARyFfOMwSb8706nIP9Td/LcEHxyqMeg13Gz7+eskPAR707VTzypoRvibdqONpJcRVgOtvBemcJHcuuQEbD5TicpaE9lhTEw7Ghppjej8bzBloo3ceRFaxGJv25+OHy426niI20oWX+MUi37VDN2cU6jUYAsEAEEEndDvzB1u+9uOVxkegg5BzOcDS0dZ4fZonXB316x3eLFbg9+v16OMlRKQP80mBVKJE+OupKK1jn3wlNOGgj6cZIj2FCHEzRbCLKbzsTeBq0+LuppSpUCNWwM6cD64JMwGLzxFj6FuZrMeiKxfXByDKh50NbnFFMxZ/V4SzaU06XdPFmocXJjhi8Wg7vV3wSiqaselAHr4426DrKWLnD7b47ftLDe/pNRACQU+IoBO6jZ+f8xz87HeFbzXIYQeWYm7CBVZOsMOrD3vA3kag30CUauy9WIM3/yhBaZ0S5qYcXHojgFXN9Yrdhfj2v2rGx88dbI1XH3BCkKsZs7g4C84lNeCBD5iHAVY94ISXH3BAeqkUh2/WYdvfFWBT8rb2YUesme7K+Pj4XDFmfpyj0wSoI552JvhioTtGReifJ1FRI8WWQ4X46GQNlOxvi7GWJqj+apHX2rk7iZUsoXvomcWkhF7PpDDTDx7/svCzBjnGg6WYzx9sgbIdUdgy309vMb+Q0ohhmzPw7K7COwLTJFUjNo9dfHWwP7tt/lkDrBHkKdQu5ioVDlypxdJvC3Ayro7VuWvF7LLbp/ezgoUFHzEB5tjwiBu+e9qD1esP32S+sj2bWI8JW7IMIuYAUFAtx4Pbc/HyD0VQ6Vl47mhrim0L/VH6aRTmDWTdeCemQY7xj32Rv3NSmOkHeg2EQNARIuiELuWTea5TTLicc8dTZKPBUsiDHLi4+mYgvl8eAltr/YQ8LluMxz7JwaSt2YjTIN5SBbslWowvO0EvrJZrfLyuQYEj1+sw4b0s/O/LfPxwoQbP7S4EVMzFqkbMrjzLwbJ9otmjQ+0R4W7K+PUJBc2oqtX887Qlr6wZj+3MR5MR+p9/+W8V5n6eB7lUr9I0AICDrQB7VoTh4roABNixvkXGHE+RjTbhcs7teMJtst6DIRBY0HOdIQi9jklhph/oIuQmXGDbXBe88CC7lWNHVHIVjtyqx5enq2hjt8nF9ElabQl2EUJowoFEzkysfrpYi7EhliitVyAuX4zY3GZcyxYjq6JziXNpnRLlNXI42TMT2Toxu9Wvrahz5vjsAdZILCrXcLRmimrlsLfR7n+vlKkw/6sC1EuMVxt/NK4BMz/Nw4HlvgYxDhoSaoOMT2Pw4eF8rP6tnI3zXIxCDSzfW/L2LxcFU89ny57XezAEAgPICp1gdM685u9nZ8r9WxcxnzdQhOJPovQW830XqhG8OhWP78xnlIi150INpGx6dfI5iPZmvkq/liNBnzfSMWlrNl7dV4pfrtRqFPNWUkqY107XNDFXHg7UEJl1FnQHS3bNaSrrqX9Xbx4owY0cdpMkXTiT3IQ3/ig16DlXPuyFwo8j8Wg/9tvwF3Lkg0V8zqkzr/n7GXRQBIIGiKATjMqaB+0Xjt2S/VuNTD0ZLMQ8wI6Li+sCsGdFGBxs9dtezygUY9G3BSipZb4dW9Wowq7zzJPcAKCfr35Z9lQkFjEX9FoWlq+25nyNlrIi5jvuAAC1WvskoqxSis9OVrE7oR58eqISp1jmHdDhZGeKfS+F4ewaf3hbsbptxkiUGDt2S/Zv6x5ymG/QQREIHSCCTjAaw/0En713tHo5WAi5CRfYPscJGZ/GYEiojU7XVctV7VbXDpYmsDRlb0iy7Wg5ZM3MxZHNCp0tlzKYl3exiaHbWWj+vRRWs4tFm/C130o+PlmlsZOcMVn3R5lRzjsywha5O2Pw/iPObKz1ASDm7b+qVsR48L/N3x5B7rsEo0A+WASDc+QlvwgRn3PqQo58MFiI+Zz+QhR/EoWVD3vpdmGlGrvPVMH/lRT4vZqKuOyWnuC21iY4sNIHPo7sVvqldUp8d475Kr2vJ+stWcb8m9bEODGulkUM3cFcs6DfKmCX5e/vpPl3W1Mnxzf/6rY6D3AW4JN5btg61wV+zuzeu4SCZsTn6NcTnopV0z1R/EkkZkWz2pWJuVmkfCpgVdKZIy/5RRhrbIT7FyLoBIPyxlSH+VM/zPleosRYMBTz1u31X1aG67y9fiOjCSPezsSyH4tQ3qBEXZMSH/xz171tcJAFLqwLQBBLYdh6tJxxLD3I1QwigaFblrbA46gZu7FVsxB0Gw2CXl0nx8lE5qVoVkIu3O01x9x/uVKjU9OaAb5CXN8QhKfGOWDJRCdcfSMAwS7s3ru9F2tYX5cNTnam+P2VCNbb8HIVRk79MOf716bYP2XE4RHuQ0iWO8FgjA4QfHo2Sz4ULFblL4yzwcdPBeh8zfQCCd76swwHrtd3eq6jaZK1JR/vPOqC2Z/mMz5/WZ0S352rwpKJTvQH306Mu5Ch28rQ0pSLfn5CRHkKEeAogKWQh6omBUprFJgzmLlxSlUjc0G37JgQp1Rj3e+lrLLRIz3MtE42Tiayd4KzNOXix2e922Wqm4n4eHKkPV77tYTxea51QRIe0LoNb4vnv87A5/8yjt3HbPm7+vlrwYLIU2mylcYcH+H+gQg6QW8urgv0mLo16+tqmdoJDMXclAccWumLSdH27C+oVONcaiO+OFOFQ7F10OZqVl7XOQ48OdoGg/0rGHmHt7Lt7wo8NcKeUWOQfr4iVoIe6WGKFyY4YJC/CH7OZrQ9zxsbFfg7vgH9fEXwc9WcuVbTxDz+fSNfgqvpjbAWcZFbJceOE5U4k8xOhKO8NOcOyKUK/JvG3if9qdG28NCwhe9sxe52lV6mV1c11ny2OBATIyvxyGe5TEvcYk6ny+FuyT104vXgeWFrUnQ2lScQACLoBD15/xHnmat/L18DoD/T10S68HB8TShcHNhlhSukKnx/oRqfnqhEZllriZd2AbySLUZlrQwOHdzk1j3sjIc+zGV83bI6Jb79rwpLJ9Gv0mNYJsa9Mc0FU/rR9zmXSxXYe7EOmw+XorROCS97EyRvDe18oFJ9uw6d2dZ/dpkMY9/LZjXmjkyK0Nxt7UZeM6QM6/Jb4UCNJWMcNT7XxLK/e22TEo2NClhYdN1tbtpgB2T7mmPSlhQklzEab0xxozomam3qP78W+SyfuSM31thjJPReSAydoDNTIsy2rP69fC1YiPnLE2wR/0E0azEHgEd35GLFnuI2Yk6NQgl8dqJzUtvoSCv08WZ3/W1HKxjF0vt6shP03ErqVWReWTM+/bscYWvSsezHojuWqdoS3xpYiLkhiHA3xfhIS43PldWwd22bEG6pcXUOALfy2G+h6+DJrjcezkIkbY/B8rE2jF+jVGPorM/yviZxdYI+EEEn6ER/D/63fydJGfuwm/KAY6/4YttCf52vmabDFurnpytQU9fZlnR6NLtmHuUNSnzDoPlKgKspzE2ZC+q5tiY3KhUKy2X460Yd1u4rQsyaVISvScea30o71dB7O2gWvWqWtq/68soUJ63x8/JG9mOZ3Efz5AAAjiV2zpOgRg1rDS54XcUniwJwcLkPGDbJA27H1ceHmH5oxGERejFE0AmsyN8ewfWx5u2/UaTsC4ZiHu3OQ+72CN3i5W3YOseNdRZ5k1SNj/6pbPdYbmkz/rjO3njkg6PlaKZbpfPYOcb9easBozdlYMxbGXBbnoyQ11Ix57M8fPxPFdIpdiKctMSTa1gkxOmLl4MJZvXXHi6oYxHLb2V8mObt+/hcMevaeHsLHm1OgrGZNtgB2dvC0ceV8cQi5lSabGSgA2+fMcdF6J2QGDqBMbfeCrEbtTnt53oZJjJ9zauT7LBlvmFcL6f0s8Zl1wA8sC0HRSxc3z49WYGH+lrC3oKHHSerseucbkYn5Q1KfHO2Gssma47xttLfV4jz6cwT467nst9KNjPRLFT5Wpq+GBorIRe/LPUGh2L5aa9D7NrDTvPOw2cnKjU+ToWvA0u7OwCJeRJczWzCxUwxSmrl4PIADjjwdxRgsL8IA/yErNrqAi1b8Le2ReOl3Vn48ASjUrqYzCoVLE04J06vDZw3YEM6c1N9wn0NEXQCI06+6hcweVvOLqUaw5kcL+QBf73ihzFRdgYdh5+bEN8/54XxLBK5ZApgjJ6JX61sO1qOp0fZwYwi4z3aSwTAuFan2mR0/zXDWp5qwoQH7HveG1E+1EY62mrTtaOGQMMEoahCip+v1LI8FzAuXPv2fTtUKhxPaMC7h8u1lrqdBvD12ZaQS6SnGVZMcMCsAVYwMWV+C92+0B/jIysx8+NcSOknlDGNCmDQxoxDP5d7r5jzOemxTqCHbLkTaNnxhNvkCVtzfmYq5kN8+Mj9MNLgYt7K4CALTO3L8GZtYCoblfiaxvksmmXCnS5wOJ1X6BdSGrFfh1ACGwR84IdnvDEijP737896hczBpcz2lVsquQpPfVPApnvsHcaEmdMeU1olxYT3sjDz4zzGdesJBc14+rtCBK5Kw1cnK1hl3k3p54CcDyLQ34vZFrwaGDx3Z/7ON6YSH3gCPUTQCZR8/aTb2OV7S94Gw0z2R/uJcPHtvoxbferKuukMjF6MxAd/V0BCkXzm52wGSwO076SCq2HH/XgCc3c3XZg5wBrxm0MwdQB9mR0A+LubsXbme+mnEmQWttjOlldJsfCbAp2MekQCDgb7UQv6pbQGDN2UiUuZuhnQVDYq8dJPJRj7bhZSC5ifw9XRDNfejcb0KMZb9zGbj1StWDHedqlOAyXcNxBBJ2hl66Mu05/ZXbIVDJPfVj9gh30vhbG6Rl2DAmt+LsaqvUWoqmUe/w33MseM/uwy1Q1FZWNLLF0rPA6ivIy7SrfSsOU/MdLS4BMJDtQYHiTCidW++GGJt9aSMm3MHWzD6viEgmb0XZ8Oj+VJCFmThj90DCEsGGFH2RP9aGwtHtiWg/IG/ZMIr2aLMXhTBrb/VcbYbx8ADqwOx7IxzCZHAGI+OVW7aOFQi1d1GiThvoDT0R6TQABaPNk3H6laAYZi/tVCVyye4M7qGhXVMjzwQTZSS1qyub3sTXB4hS8CPJiJYUp+EwZsyGJ1TUNhb8FF6nshEIo0x1BX7C7EtwzK3NjC57X4nH/wmDuifDvHsMVNCuRXy+8k/SmVKjTJWsxmyurkKKmTo7hWgZIaBYprZSioUUAqU0Eo4EJkyoG5gAtbcx6GBFpgVLAIwwLNtf6MTCiqkCJybRpkXVhNx4EaCe8Ew8dF8+foZlYTJr6fDQlL0xsmzBxgjW+fcmcVW996sACv/sa4O1zsjGizo3/ESt7QaYCEXg0RdEInlo+1WbbjTN2TYCjmB5Z5YfoQdlvgFTUyTN6ajbTS9qVZ1uY87F/ujcFBmsuXOrLg8zyjx4218dYsZ6x80Fnjc8t3F2KXnoLuZW+Cvl5CRHiYIsJDiDBXM/g5C8BlUdjcE9h6uBQbD3ZdovbsAdbYvcRb43P55TKMfjvDICtzbYwONcdvz3uzmgjtO1+OuTsZ9xggok7QCBF0QjvYiLkJF/h3TQCGhtmwukZ5lRRTtufcWZl3RMAHvl3khRmD6M+bWiBB/zfToY87mrU5D8MCRDiV3MjKqtRaxEXc5qBO1rIAMGR9GhIKmRnh8HlAmJsZYryF6ONthnB3M0S6C2Fp2TuKUBRSFQZtTO80eTMGIgEHVzYEwlfT6lypxqT3s3RunsOGieEW+G25D3gC5pOvswm1GLslEypmH8HY8SGCf0+kSF/WdYyE3gcRdMIdFo+0fOmbc43zwEDMrQTAtU2hCPKkzyRuS3axBA99lIv8Svp4+SuTHbFhpgvApxbr+TvzdIq1Wgm5WPOQE54eZQehiI/9l2qw4OsCVufo5yvE/uXe7US9sVEBlxeSNR4v4AMxXkJE+4rQ10uISE8zhLmaUcZ7ewN5Zc2YuCWblX+ALuz4nzsWjtFsYLT7TBWW/Vhk1Ou3Ze4gG3zztCcrc5tbWQ0YtikNDA3/iKgT2kEEnQAAeGWi3TMfnKh5FgzE3NuKi4ubwuDmyC7x62p6I2Z/mofqJubbnWPDLPDTc16UDTbSCsXotz4DbFfpF98I6BSHnvRuJusVnJ05D3+97IdIn7tZy3M+ysFf8Q0wNeFgVJA5RodaYFigOfp6C1mt2noTWUXNmPB+ltG2u6f2tcTPy7w1WtFWVMvQd3066sQ61L/pwZJx9tj6mCvjXvYAkF8qwYA3klEuZnRvjp0aaXb8cLxkjc6DJPQaiKATWIl5lCsP59+MgKUlO9OQw9dqsfDrfJ2SoyZHWuD3ldRucwt35uF3lqv0axv8EerVfofhQmoDJr2fw3qML0x0wDtz3e4+oFSjuFoKRys+qwSp3k5RhRRPf1fY3sPeADwYZYk9Szy1/q7X/FyMT3VwmzMEHrZ8WIl42DzbBRP7MMtqr6yRYfimRKSVM5qAxM4bKNq/50rTO3oNlHDPc38uFQh3YCPm44IFuLY5irWYf3S0HI/vzNM50zm3kj72umaqIwB2k9Pvz3e24RwWYolhgdQOaJro39E1jceBm6MZEfMOuDua4u9X/PDuIy4w1WJfy5ZHBljj5+e9tf6uZc1K/HCRkeWqBtQYFijCc2PtsXC4LUJc2ZXtAUBhjQLJRVI8uiMPdQ3MvgQOtgLcfDsKg7wZfX5i9l4Vz1o2xmYZ68ERehVkhX4fw0bMH+0nYl1jrpKr8MKeIuw+p9vN1N6Ci7Ghllj5gCOtzSgAPLkzD7+xWKULTThIfi8Yjrbtb9JnEuoxlUG/dFMTDh4dYI1nx9ijrz+7XAICUFUrx5dnKvH56WrUsgjDtOJuw8d7c9xokyf3XajGom8LWZ9/gK8QXzzpjmCP9p+9i6kNWP1rKW6y9OC3NOUid3soTClsgzUxY0sSDsYzulbs2gftP958pPIHVhcg9BqIoN+nsBHz5WNt8MmiAFbnr66TY94X+TptrYoEHLwxzRnPjbVjtcJNL5AghmXG+/IJDnj3Mbd2j6nkKlg/mwC1lvPYmPOwfJw9Fo+xh501W79yQkeaJUocvFGHfxIacDypgTbO3d9HiFkDrLF4lB3MGJSGPfZJDv68xc5Fb1y4BX573hsCMy3iq1Bj44EybP2beTne5tkueHGKbg6Hz32Zji//Y9Q+loj6fQwR9PuQb570GLt4dxEjB7jZMSL89jK7lXlsZhMe35mHwhrd9tg3zXTGSw9pru+m46kv8vHr1VrGxwv4QOLbQZ0S/HxeSEJlh1akduY8rJriyFhICDqgUCM2V4zsChlK6xQoq1eAB8DVlg9XGxPEeItYu9WFrUpBfhVzF0JPOxNc3xgIc3P69/jHs9VY8n0B6CaRHnZ8xG8O1j5BYMCc7cn49QajhM3Yrxe6r3p6V+FpnS9GuCchgn6fcXZNoM+Y9zL3qYGBdMdODBXgn3VRrM7/9alKvPpLsU7tSVvp7yPEydX+OpVyZRSKEc0y431MmDn2L/Npd7NtK+hCEw5WTnbAixMdIWJwkyf0HMRNCjgt11xCqI1dT3vikaG2jI///VINnvw6X+uODgB8/IQbFo11YDUOTYzbGIfT6fSTEw5w9dIbgdMGbUov1fuihHsGkhR3H5H6Xqho4vuZ3zMR8xgPHv5aFcH43HKpAk99kY+Ve/UTc6ClP/hz3xew8sVuJdBDhDmDmN+MAeBMchMmbM1GdvHdOOWH89zhZMnDg30tkfBOEF6f4UrE/B6khGXde7ibKR7REpM/cKUWe/6r7tRdbfYQW3y2wEPrOa2EXMwbwu4zqY2jr0agjyv9Kl8NDJy4JeP7rG3h7LP4CPcsZIV+H+Ek4v5VIVFPoTvO35aDuPf6wJyi9rsjL/1QhK9o2oqyZc1Dzlg7k/3We2ZhM/quTwPbuvTB/kKcXBvI+no9DpUKULf52Vu/4m1/HRw1q9roe5XyKin8VqUxPv7pkXb4aGFncb6Q0ohJW7MBAMMCRfj+GU+4dOgo+M6BErzzZ0Wn184fZovPF3myHLl26uvliFqdgLx6+glvgB3314wq5RyDXZzQoyFLjvuEcBfejxUStQvdcfZCDi5uimAl5gBwK1+3FpRUvHukDD6OJpg3gl1f9QAPM8wZZIt9V2pZva5B0rWmI2woKJMg8/afjBIJMkqkKKmTo6FZhUaJGvXNajTIWbXmBtBiYmZpAliZcWAh5MDSjAtXaxMEuQoR4GqKQBch/J2E8HRm3OqzR2HJMqPc21FzkqO16O55LmSI0X9DJr5d5I5JfW3uPP76wy64ld+Mo3HtE/BmD7CBIbGyMsGlTWEIfzUJNTLqNzyzWhUwJcJsy9HE5tUGHQShR0JW6PcB40NMPzyVJhsJmiQ4Mx6Q9F4Y/NzY12Hv+a8az+1mXxpEB58HHH7RFyPDLVm9rsXjPYPx8RMjLLFtrgv83LpXuCRiBW7kNuJWbhNu5DbiRpYYiaVKlhX2hocDINKVh/5+IsT4WiDa2xx9vS3uiTCE/8oklNUxiwNNi7HC3mU+Gp8b81YGruW0n7iumGSPTTNc77j/1dbLMXhTBgqrW7b6bcx5yN8eapSGOmn5TYhcmwI5/TyUZL7fJxBB7+W8NcNp7vqDFatAI+ZcDnB9YxCi/XXsMa5SYdqHuTiV1Kjb6ymwEnJxZo1fp3pgOsZvzsDlbO07B1ZCLhaNssfTo2zh7Wzc/uXaKKuS4kxyHc6m1OBUYhMyqnruLoEmghy4GB9hiZGh1hgdag3nDtvQPYEXdxfiG4ad70xNOEjYHKjR1lhbS9wBvkJ8/6w3vG5n39/IaML497MgV962fp3Hrq0wG66k1mHwW4wmrrHfPuX28lPfFv1rtMEQuh0i6L2Yf1b5BU3elrMXQH+6Y0+v9sOYKHZb2x0prZIiZn0G6o2wde1pZ4L/XveHox3zHJ9luwo0mtpYi7h4abIjnh1tT+kRb3BUKmQUS/Bfaj3OJtfhZGITSpp61/fP1ZyD8RHmGBVmjZEhVgj06H7DnX/i6jDr4zzGxwc4C3DiVb92hkONjQoEr0lDnRYDHCshF18s9MDDt7fXk/KbkFggxcz+VuzdAlUqqJUAh+Gq/uiNSjy4PZf2OB4H529sCp7aZ11qLbsBEe4ViKD3Ysz4nDNSJUbTHXfoBW88PMjRINf89nQlVuwp1vicuSkHTVLdP2/RPkIcf8WXcZ/pJd/k48eLtXf+b8IDVkx0wCsPOHWNkKtUSCkQ47/UepxOqsWJBAltzLO3YSvgYEKkEGPDbTA61BrBHsIuT8ZTSFXo80Ya8hh0+GvF3YaPddNcMDJEhOJaOVb9UoJbec20r1syzh7vP+rKWIw7UlQhxfSPclBUq8C+pd4YwTDU9Mu5cjz2BX0/dTcLzuGiBtU0nQZH6PEQQe+lRLvzd90qVkaBZqv964XueHqCq+EurFAj5o00pJe191/fOtcFS8Y74PMTlXh1n+6lsQ/2tcS+530YtaQ8fK0Wj+/MA8DB9BgrvP2IS5dsrUslShyOrcSecxX4M6G52+PfPQUOgIejTPG/4S54KMaOtQWqPvx5rQ6P7WS+SteHlZMd8dajun2n2k5CnSx5uL4piLEb4fsH8rH6d1rnutiHI82OHYqXrNVpgIQeDW/Dhg3dPQaCgfnfIPPXj6fKxoBGzNc9ZI9XphmunAYAwOXAyZKPAzfueqo/GGWJLfM8AA4HAwLMIZGqcDmTXYvSVjJKZagTKzEhij7WH+xuholhFnhmrD2WTHSEjRFX5Sq5CsduVWHjb7mY90UB9l2rR1q5cXt/34uklSnx67U6vPdnKdILaiES8ODnYAoOi57huhDsboZzqY2sHON0pa+XEBMZfD47Epctxsqfi9G6xmqSqVFYLcd0hlnyw0KtUV0rxtUcyp0E17RyhTkv7vP6UXNXJbIeJKFHQ1bovYwdT7hNXr635G3QiPnkMFP8vTbSOINQqjF8c8adLcp9z3vjwX7W7Z5f8GU+9l9n1+60Le/MdsELOvpiGxJxkwJ7LpTj42OlSC7rOQltIj5gY8aBtYgDO3Me5Co16iQqNIjVqG1WQ9yD5hphzly8+IAznhjmzDicogtFFVKMfCeTcca7LoS7meL0Gn9GtrFtuZHRhFmf5nayGwaA/S94tSuPo2PcpnicTqPtUHj93NqAGcM3Zxi+NIXQbRBB70WkvRcmCl2TckoNDKY6zlHIQc5H7Ixj2BKfI8bLPxch0kOErXPvlvW0ImtWYsq2bMosdDo+nOeKxeMME/tnS1JuIz78uwi7LzSwrv3WFQs+EOnBR5iHEEEuQkR5W8DBggdLMz4szHiwNOPByopds5j6ejkampVoaFagsVmJigY5EvLFSCuRIKlQgoQiRZeJvwkXeGakNZ4e64K+/uzKFJlyK6sJE97PhkRu+DfNWsTF+XUB8HVhF9b59nQlXvlZu8OikyUPVzcGwsGGWUJobb0c/iviUU2Tr2Er4ByrlqoeYDVYQo+GCHovIsyZtzelXPU43XGxm/QoTzMg1XVyjHwnC7kV9P3OtTHYX4iFI+zxxHCbLkm2yihswsb9edh7VbeQARMchRwMDzFFuLs5gl3NEOQqQqSnuVFXr1SImxRILGxCeokYqcXNSCoS40JaMyokxrt3PDFQhLUzvBDiZWHwc/91ow7zvsiDwsALdbYr6WaxAs//WMzIAGlUsDmOvOTLONmOYTlb7EBv/vUrufJnGZ2U0OMhgt5LeGmi3TMfMmiH+sGjznjJ0HFzPcgulmDku9k69cNuy9dPuuOxEfYGGlVnbmTUY/1veTiaJDX4uZ1EHDwQZY5xETYYHWZ9z7iy5ZdK8G9yHU4m1uJYfJNRBP6hCDOsm+GJQSHW9Aez4FxSA+buzKNt1cqUlyc7YiOLRLj0Agke/yIPqSXMJ7PPjLbH9vnMa9o3/56HNw50tqLtQOz7jzi/terX0oOMT0zosRBB7wWcXRPoM/q9zP2gEfMxQSY4/WafLhoVcy6mNuDBD3L0auryxsNOWD2d1tmWNafjqvHm7/k4n224fWdHIQeTo8wx/raAe7ncGwJOR+5tgT+VUI2/EySoMqDAj/DnY9MjXhgdqZ9XQluyipoxY0cusst03yECWroDnl7jz9gN7teLVVj2QzHEOpQwbn/cFc+MZx5mGr4uDhdyqBMBOcDl5HdDxoW8lmK8bSdCl0AEvRdgb8r9u1qmnkx1jK2Ag9yPo1jHWLuK3y/VYOHXBTq9dkSwOX573tugteVHb1Tizd8LcD3fMPuyzuYcLBxpi8eHOSLK1zjx4Z5GXHYDfjpfgd3nalAuNsx9pr8XD5tme+KBfvq3IgVa4s0r9hTrnKApNOHgypsBjCyD5VIFVv1cyti1ThMcqLF/hQ8m9mG2Y1FZI4Pfyng00CT3hzlz9ySVKv+n88AIPQIi6Pc4j/Qz3/h7rPgh0KzOr6wPxMBgw25bGppth0ux4SBtHW0b1Hh9qhNen+oC8A1T9pRfKsGy3Vn4M4HeRIQOGwHwv+FWmDfM2eBbxvcal1Nrsfd8Bb4/X0crLkyYGmmGHQv9Dba78cflWry4twjVLEM/789xwdJJ9NUWeWXNmPdFPiNzGjrMTTn4d40fQr2YufCdTazB6Hez6A6LXTra+vvPztR+ovcACd0GEfR7mG+e9Bi7eHfRVtCI+ZbZTnh1hlcXjUo/ln1XgN3nO9u1dsRaxMVPz3lhVIRhkvuUMhU2H8zHxsOV0OcrYcoD5g22xBPDHfW20u2tnI6rxo8XKvDTpQbI9AhhczjAhocdsHa6V6cqCl2oa1Bg+98V2HGqElIGWfCRHqa4+EYgbaLa0Rt1ePq7AoNaIge7CHDxjUDG5jwb9uVi4+FKusNiT6/2e2TMe1nZeg+Q0C0QQb+HMTfhnBIrMJbqGLZx81/OV2PnmSo0iJXwcRAg3FOI/t5CDAoQdur/bAxUchUe2JaNCxnaw3l+zgIcWOYDf3fDuL4di63Gc1/nMuovrY1JoaZYNskFDw3onjK6e5XDVyrw+YlS/JOie7KhtxUXPzzvi5ERtgYZU2mVFDtOVuLHCzWoatT+mTj5mh8GB2nPwlfLVVh/oAwfHqNNTNOJZePt8N7jnXu3a4NJPN1RyDlaLlY9qO/YCN0DEfR7lCkRZlv+TpKOB8XqnG3cPCFXgqGb0qGG5u1rL3sTjA6xwKhgc4wOMYezg3EEvrpOjv7r01He0Hn7s7+PEPtf8IG9jf65AJU1Mrz4Q6ZeJWgzos2waZY3Iu6TuLixSMxpwBu/5+PgLd19CZ4YKML2+f5wtDXM51IpU+FoXAOOJdTjVHLDnZaogBqrH3TGG7O0J2GWVUrxv68KcFFHR0SmnF/rj77+zLbeGcbTYxcOs9y363z9+4YYH6FrIYJ+D7L3Ga+hT3xd8CkMGTdXqTDxvWxWN6BwN1NM6WONB/pYYKCfucHi2ACw9XApNnaIp48Ns8C+pV7612OrVPjqZCle2FMMqY45b/MHW2D9LC/469A7nqCdjMImbNqfhz06TrJMecCn/3PF4nGuBvclKKqQIqtcBmdrHmUr37OJ9VjwVYFG1zdDMyrYHH+t9md8PNN4+rFXfB+btDU7Xa/BEbocIuj3IEy22t+Z6YA1s3wYn3Pf+Wos+k53F0g7cx4e7GOJB/taY0K4hd6NN+KyxRi2OfPO/yeGW+CX570hMNPvvBmFTViwMwOXcnUrQ1s62hrrpnvCVUO/bILhKCyTYPPBAnz5X71Orx/ux8fXiwOMYkyjFaUa7x8pw6ZDZYCWXS5j8PcrvhgRxnyH6I2fc7D5SBXlMWTr/d6ECPo9xow+orcOxkumgGJ1HubMRdJ2ysV7OypqZIhen6G3uUsrIgEHD/axwsz+NhgfrqPDmVKNeTvzcCi2HrMHWOObpzzBN9VvxbX/QgUe+yIPcpahcj4HWDnRBqsf9oI9Q/tNgmGoqJFiy6FCfHSyhrXFrhkP2POsN2YNM35eQ2mVFIt3FeJMcpPe57ISchHoYoobOczCD7MHWGP3Em9W1wh8IRaZVZRfBLL1fg9CBP0eYv/zPjGzP8/7GjRb7Tc3BbPywp63IxeHYnVbCdEhNOFgWow1HhtsjXHhVqy35csqpXrH6psaFXjmmwz8dI39zXbuAHN8usAfDrZEyLuTyhoZlu7KxG832G/FPz7AHF89HWjw3gV5Zc04ntiI69liHIytQ5NU/3vpuHALfPOkBxztBFj6bQF+uEBf8cHnAbkfhMKGhcfE1bQ6DNpEbw1Ltt7vLYig30O4WXAPlTSpH6Y65rlRltj5TDDjc/5wtgpLvy/Se2xMcLfhY8EIWywcbgu3LtqyPptYg0c+ymZtS+puycFPy/wMljlNMAz/Jdbg0U+yUdbE7v10FHLw16sBGBBkGD+AugYFotelaUzc1A011j7shDVTXYDbrWRLq6QIfS2NkYPiT0u88DDDNqutLPw0Fd9fbqQ8hmy931sYv5sFwSCse8hhfkmTmrJGxYwHbHuceYJMdrEEr/xcrPfYmFJUq8A7f1YgeHUaZm7Pwef/lOPAlVqcS2pAs8TwCUS7T5dizLtZrMV84zQHFH7Rj4h5D2RkhC0KP43G+qnsnOIqJGoM2ZSB3adLDTKOrDKpwcTcwYKHv17yxZrprnfEHABc7E3R14uZcc6/Omz1f7TAH3RutRUStcu6hxzmsz45oVsgK/R7BC6Xc0mtpm6L+sPTHvjfGGZ+5nKpAqPfy0acAZyrDIGfswCX1gWw7iOtCZVchSXfZeIrlglVI/z52LM0uNd4q/d2sorF+N9n6awTHJ8ZaYWdTwUw9l7XxtNf5eGXy7pZxrYyNECEH5/x1BpWGrI+DQmF9DX6o0PNcWQV88l8K1/+U4znfqCe1HM4uKxSqYewPjmhyyEr9HuAxwZarFOrQRnE7efOYyzmALD8x+IeI+YAkF0mQ6aeTTKAliSqIW/GsxJzWwEHvyzxwn+b+hIxv4fwdxPh4tt98dOzHrBikeLw1X/1GPJmPCpq9Ouct3OBO4YG6F62uHKyI/5Z5adVzBPzJEgoZPYdLazWzU/32UluCHemlgG1GoLHBlqs0+kChC6FCHoPJ3ZjsMMv15pmgCYRbs+yQMbn/P7fKuy5WKvnyAzLlD6W6OOjX1w9v1SCAa8n4Woe8xXbpFBT5H4chTnD6f24CT2Tx0a6IPejKIwNZq7qV/MUGPB6EvJLdTeyMTHlY9/z3vB3ZJ8wuXm2C9561FWrbaxSpsJrvxaDafmbPpsNPz4fQHdIzC/Xmmbc2BhsmI44BKNBBL2H89x32e+CRsxXTrBlVW/7501m24QvT3bE5tkueLCvJcxNjVdX6+Vggm+f8tTLCORWVgMi1ySxsm99d5YTjq2L7LEd6AjMsbUW4NT6KLw1g3mJWl69CpFrknArq0GP65rg9+VesGRZUsmj+DrJmpWY81ku/k1hHhe3MdfdnyHa3wrPjaKtiolZuiv7bZ0vQugSiKD3YPY/7xNzLV9BKeaWJsDbj7KrQe3rxWybcEyoOV6c4oR9L/ii4MMw7H/BC/OH2UJoYjhxN+EBPz/nDUtL3WPnJ29Vof+baahnuGNvJ+DgwtoAvDbz3mhYQ2DOutneuLA2gPEWfL0M6P9mGk7eojZaoSLQQ4TPFzL3VAeADQfL8NeNzhPrq+mNGP1uFo4lUGefdySKwrmOCdse9wedZ9PVPEX//c/7MDe4IHQ5JCmuB+NpxT1Q2KCeTnXMr0s98cgwZ1bnLauUImQNfTlMP18hzq4J6FQ7XtegwMs/FeOXK7WsrquJ7Y+74pnxuht/7L9Qgdmf5zE+fpS/CQ68HApba1JX3puprJHh4W3JrBLmflnipVfohWnd+F3UmDPIFsMDRaiVKHEhvYm1kLfy/WJPzBqiX1XGj2dKMf8bardINwvO4aIG1TS9LkQwGmSF3kP55kmPsYUNasol5BAfPmsxBwBnB1OsZNDD+UaOBO8e6VzmY23Jx4uT9XffmtLHEs+Mtdf59btOFbMS8/VTHfDvpj5EzO8DHGwFuPh2X6x9kPnna+7OfHx9QndPhu2PucLPmc1ni4N9V2qxfE8x3thfprOYC004mNJH/+ZA/xvjghgP6mV6caPaY8cTbpP1vhjBKBBB76G8+lPxKtDEzn98Pkj3809xgLsN/Tb3O4fLcSG1c4xx97lqna8NtNTefrHQQ+e4+fsH8vHUd8xr6I+s9MXGuT46XYtw77L5cV8cWMY8tPLM7hJsPVig07XMRHzsesrT0D1haFk0ylb/hkW32bOUNrk2ZuPvpcsNcjGCwSGC3gPZ+qjL9BqZmnIJve4he706fZmJ+Pjof260x6nBwVNfFaCi+m6A+lxyA744XanztQFg++PusLPWIRlNpcJzX6Zj9e/l9MeiJfv32puBeLC/7jsBxqagTIIj16vw3h/5mLktEYHLY8GZd73dn6Frb+Fqmn41z/cr04c44cLaAMpEtLa8+lsZ3vg5R6dr9Qs0x9qHuq5iwtyUg1emGO56od4WWDmBeuu+Uqp2Iav0ngmJofdAzPicM1IlRmt9ngfUfBkNMz07mgHAoi/zsY9BLLyPtxkOr/CFUqnCiLezUFRLHZu0t+BisJ85TiQ3QNbh0MmRFvh9pZ9O4133Uw7e/otZApOdgINLm0IQ5MmsX7SxkYgVuJXXiPh8MW7lNSAuT4KreQpWTUfefNgBG+b4GG2MvZmk3EYM3ZjKOHly7YP22Py4L+vrqOUqTNyahUuZupfEMeXLJz0wb4SdQc/Z2CiH3ZI4yiZGDqacoxXNxBK2p0EEvYfx1gynuesPVlBut781wxHrZrPLbNdGdZ0c0W+koaqRvtzLStiyoVMvoT7Ww5aPs2v84exgitjMJox8527/ZVMTDmI3BcLbmX3N+daDBXj1tzJGx3pbcXFlczic7fVr7KIryXmNSCpsQny+GHF5TbiaLWXtP64Npn7955NrIeBxMDDYMP7lvYHiimYMWJeE4kZm78X7jzhj1XRP1teprpNjwpYspJXqb5akjceG2ODrxcap1GAwcY79dJ7r2mV7io8ZZQAEnSCC3sOgW52bcIGanX0N2jnqz2t1eGwn8+QyKjhQ4/Rr/hgQdLcufuHOPPx+rWW7eMN0J7zyMHNHu1Y+OlKIlT8z8+Hu587DmTciYGnZNfXlFTVS/HG1CpfS6xGXL8GtYsP70ndk77MeeHyk9t/jtfQ6DNzY0k3LjAcsGGaFx4Y6YVSkjdHH1tOpqZNh9FtJiC9h9j5995QbnhxHH57qSGmVFGPfy0Z+lW4ublRMjrTAr8t89Lav1UZNnQx2S+MpjyGr9J4Hb8OGDd09BsJt3prhNPdkingsAFdtx6yZYo/J/QwbDw52N0NZjRw38/TfIlz9oDMe67AFOC7EAjwuB08MtcWSCfYAh10d+65TxVj6YwmjY8cFC/DvG1EGSxKiIqdEjCXfpGPhN0U4EteAuEIZSht0nyALBAK4uroiMCAQfaP6wsbGBsUlmhP//rxZj8Uj7WCh5ed0tzfDwUtlKGtUQ6EGbuRJsft8NT7/uwSmPBWiPEQwMZIY9HSEZjwsGumES2nVyKmiF/VDNxvgbQNE+7HLJLcQ8fFApBX+uFFrkNaqrcwZZIPdiz3AF+gfctOG0IyHunoxLmdrt54VK9HgkPlV/sCZL2cabSAEVpAVeg9CxOeckigxVtvzPA5Q+XkfVn2PmdIsUWLE5gyklOi+RRjlaYZzawPAExhOKK7fXmky+ZT+b5AFfnghxGDXpmLz73l440CFTq/l8XhwcnKCs6MznJwc4ejkBAd7BwhM75Y8FRUV4aeff6I8z5z+QvyyMlzr84cuV2L6p7kan+NzgOXjbfHuHB+YGiAX415lzvZk/MqgxzqPA1xeH4j+OrRfzS6WYO7OfCQX6ecdz+cB66c746UHHPVyVYRSTW1Vd5vyaimclydQHkPaq/YsiKD3EHY84TZ5+d6St0ERO185wRbbF7LvqMSUpPwmjNic1SmJjQkmPODymwEI1tOxqi05JWL0WZOMBgY7lvMGirBnRZjBrk3Fa3uyseVv5mV7Tk5O8PTwhLuHOzzdPSAyv5ukJ5PKIJfLYG5xN0RRWlqKPXv3gMl3s+yTSDjdzhOoqpUhpVgMHgeI8DCHpaUJzOZfh/T2IpTD4XQ6p48NBwdeCkJff/3rmO9VmIq6pQkQ924YfF3Zf8abJUq8/mspvjpbCab+7G2J8jTDF096IMpH9+9XbmkzHtuZj9xyGX5d5o0R4fTv+ZKv0vDFWUpr3Njfl3ovnvVZbqzOAyMYDCLoPQQHEfevKol6CtUx5Tsi4Whr3CSvb09XYsUe9j3Sl09wwLuPsY8zakMiViD81Tjk1NB/PieGCvDPuiiDXZuK/xJrMOrdLK3PCwQCeHl4wsPLEx7uHnB1bR89qa+rQ2NTI6SSZtQ31KOhoQHOt7fZAaCiogI//PgDVCpmnvTrHrLHW4+1ZGIv+jwN3124e/Md5W+CK7lyNN8W9GnTpiE+Ph45OZ1LsrbMdsKrM+5fK9wH3k7AsWT6FbSvLQdJ7/fROaRzK6sJbx0qxz+JzPzjQ10FWP2QM2YPtGG0qtZGY6MCE7dmI76gZQt9oJ8Ip9fRNmVBUXkzPFYmUh4T48H77kaBYpHOgyMYDCLoPYD9z/vEzP4872tQrM6ZZjYbgme/zsfeS7WsXvPDM16YOdjGINdXy1WY+F4iTqbSb//HePBwZVMf8Fk2x9CVsRvjcCa9/ZaBubk5RgwbAX9/v3arb3FTE+rq6yGVSFDX2IDG+noole1jtqZmZujffwB4PB5qamqwa/euTsdQIeIDVV+0lDCejqvG9A+zte5oTJgwAeHh4cjMzMTRo0c7TRoe6SfCnqXBENCZeutAYZkEiUUSJOQ3wc6CjwBnYY9K0FNIVRiyIQ7X8+l/9+NDBDj+WoTWTmlMyCpqxqGbdfg3tQlpxc0orpWDw+XARshDpIcZBvqZY1qMJfr661dy2SxWYO/lWnzwd0Wn5Lykd4MYVZss/DQV31+mdLGLPfmq35xxW7JILL2bIYLeA+jvwf/2RpHyKapjij6KgJujfu1FmSJrVmLMlixW/dL7+wixY4EHIjxN9YvvAXhpdxY+PEHvie1vy0Hce30MmvFPRXmVFM4vtI8pWlpa4rlnnwMANDY0oKysDBKJGPX19VAo6GMX/gGBcHd3R0N9Pb7bvQsyGfschv5ePDwcY4eaJgUOXKtFbq3m73R0dDRGjRrVMtbGRhw+fBjl5e0Nevq68XD89TCD7QSdvFWFpd/lIaOq846DvZCDN2c64blxrjAx7Zr3kIqmRgX6rolHZjX97oiuNepaYRjXZkp2sQRfn63B9+ertZaZbp3rgiUT6U1psovF8F+VTHnMpFDTbceSm1fpNFiCwbg/01x7EKdW+wfcKFL2pTpmwRDzLhNzABCY8fDzEh9WLRmv50oweGMG7JckYdb2HMiadSvd+uNiBSMxdzbn4OKmiC4TcwD4N6WzU9ugQYMAAE2NjYiLu4WiokJUV1czEnNra2u4u7ujWSLBD3t+1EnMAeB6vhLrD7b83jSJOY/X8j7W1bWMPzE+Hvm5uZgyZQrCwtrnHdwqViLs5UTczKrXaSxtWfFdJiZszdEo5gBQJVHjhb1lcH0+DvvOM3P+MybmFnxc2BgOeyG9sL79VxV+NeSYDSDmKrkKR67XYdoH2Yhal4FPT1RSekYcvMHsPfZzE+GRftSx+39SpGOztoWTJgndDBH0bmbHsZIFoPFsf3OWYUxk2ODlJMCPz3iCwyi//C5SuRr/JDZg93n2Xu+JOQ14lEGzFQs+cO2tMDjZda1pTGFV5xirk2PLCqeouJjVVjkA+Pm1JDju+WkvxGL6pCxd4fP5iImOhrm5OSoqKiAwM0NlVRXi4+Lg4+0ND4/2rT8rpWrErE/Hwh0puJhcq9M1Z2xNwienmL22SqLG3J35iHr5ps7XMxROdqa4simUtpUoADz+RT7ic3TvpW4oskuk2PR7KQJfTcHcz/NwKolZk5cLGWLklzObRL5Fb2QVs/lgwYuMTkYwGkTQu5mD8ZKJVM8/2k+kU1atIRgTaYWPnnDX6bVh7ux2FGrqZBj/bjqtDSqPA1zZFAJPZ6FO49KHJlnn1Y5a1TLgpkZ2N3ZHZ2dYWllh36/7UFPDpuUme6RSKbKzsmDC5yMlORnVlXd9+EtLS2FnZwc+v/NOx/eXmjDs7Uw4L76BN37OQWZhE6PrzdiahIO32HsaJJQqMeztTDy6PRn5pca3TdWGv5sIF9cHgUuzaFaqgcnvpqO61nhucNpoaFBgz3/VmPRuJqLWpuH9o+Uoq2O/K7bnAjMb5WAvc0yNpP5Of3+hYRbrARAMCjGW6UbemuE090yqeAQojGT+WBEAe4btPtVyVUtBDN2diAUxviI0SpS4ksV8Bbl+mhMeG87O/OapL9JxJZf+xvjXSz4YGmrD6tyGIjarHv8ktRc1P38/ONg7ICszk1GZWSvhYeE4eeIEMjL1yyPicDhwcXFBcHAw+vXrh+joaAwaNAgREREQiUSws7GBu7s7bO3umv0oOyTDcblcONjbo7a2VuMuQ5Mc+C9dgk9PVuLIlTKYcNVaTVYWfJqKfdepPyuPPPIILC0tUVysuZoiuUSOj45XoL5BgmEBlhAY0UBFG652pohy5WPfVeqGOI1yIL+iEbMH699OmA5ZsxIHr9Vh44FSLPuxCIdv1qOgWj8XuvQyKZaNdQCXwZZ/qKsQX56hnACUEaOZ7oUkxXUjbhbcQyVN6oe1PT810gyHX4tgdK7tR8qw/o8yhLuZ4tBKH7gY0sNcqcbjn+fh8E36mNu0GCvsXerFKjFu779leOJr+paVK8bb4KMn6UttjMXBS+WYsSO/3WMTxo1HUFAQrl+/xvg81tY2kEibce7cOZ3G4ezsDF9fX3h5ecHZ2fnO47W1taivr0dNTQ0aG3TbCq6urkZ+QQFt2ZylCbBikj2WT3K7E/rY+GsuNhyi78I3fvx4REZGQiKR4Ny5c0hKStJ6rJAHfPCYK5Y8oNtOkb48/3UGPv+Xvsvd70u9MWuYcURdIVVh1/lqbDlShlIdVuF07F7sidlDqDustTJuUzxOp2mfeIc5c/cklSr/Z6ixEdhBBL2bOLXaP2D8+9n7QBE/P/6KLyZE06905VIF3F5IgUTe8l562Zvgh2c80T/QguaVzGmWKDHlgxxczda++vKw5ePKhiBYWzJPVCssk8D35SQoaD6G4c5cJG6nTDUwOkm5jYhYm9ruscGDByM4KAipKSmMz1NVVYXM7GxW1xYIBOjXrx/Cw8MhFN4NN1RVVaGqqgq11dWQM0jEY0p9QwMqy8tR39hIK+5PDBRBrlJj33Vm2+Tu7u549NFH7/y/qqoK//zzD8rKtDfe8bXlYMeT3pjSz4HZD2AgFFIVwl+9hfRK6t+BkAekbQ03eCgou0SKxz/PRaKeLnNURHqY4tKbQYwS847eqMSD23OpDok9tzZg2vDNGYWGGh+BOUTQu4kZfURvHYyXrNP2vJUAqNvVn9G5ziU34IFtnc1CBvsJ8ehgGzwcbWWQFXtNnRzj3stCepnmGfqhFd4Y14eFNaZSjYHr4nAtn1qITLhA7vauK9vTRlOjAhbP3mr3WHBwMAYOHIj01FTNL+pAc3Mz4hKo7TQ7MnDgwDvZ9ACgVCpRXlqK0rIyoybTtSKRSFBUXIz6ev0z31tZsmQJzMzav59ZWVn4559/IJVqF69R/ib4anFAl7bEzS2VIOCVJNr8joHefFx5q4/Bys+upjdi+se5tN0NDcGvy7wwJcaG0bGi+dchodgoWDjMcvWu8/XvG2ZkBDaQpLhugi4Z7pnRzLbAAODfFM3JSpezJXjppxIErErD+Lcz8Pk/5ShkmNWqCVtrE/yxwgfWos4fm/8NtWEn5gB2/FNMK+YAcOhFn24Xc6ClrMmmQzpDeVk52BQCJLFYyTs5OWHBggV3xFwmkyE3Nxc3rl1Ddk5Ol4g5AAiFQgT4+6NPZCScnejrlpmQlXXXba+1xM/f3x9Lly7FyJEjwdHSwOdslhzBr6Xg2S+7LhnNx0WI356nd9G7mqfA3nOGKWUrLJfhkR1dI+YAsO0ofaiklcWjbSif33OxYaqewyHoCEmK6waYJMN99ZQPnDqqhxbW7y9BSS21MBbWKHAiqRE7TlbieFw96puUcLTgw5bF9jgA2FjwIeQBJ9qUxtiZ8/D7ch8IWTiMlVdJMWlbFlQ0YvjieBssm+JBfVAXcvBqOYrq7t5km5ubERocjNraWtrXZmZno6mJWab4yJEjMW7cOJiamkKhUCA7MxOZmZmor6tjbAvLBEtLSzg6OsLDwwO+Pj7wcHeHk7MzmpqaOtXFc7lcWFlZtdjZcjiMfxZNyOVyhIWFQSqV4vr16wDUMDc3B5fLhZubG6KiotDc3IyKCs0NcG7kSfHB32Uw4ygwLNT4/d5DPc1RWd2Ea7nUW9/H4+uxbJwjTE31S+SbtzMXyUVdlz1fVCPHygn2jDrwuVjxKZPjVEAlSY7rHsiWezcQaM/bl1mtelTb8wH2XGR8wixeXFsvh8eLydCl4QPQ0vRh1gBrTOtrjQAPZqvg4opmBK1Ou3PNz+a7Y8FodlntM7Yk4WA8dcy1J8TNO7JwRwq+v9ReyPr16wc+TRJgTU0N0hlktHO5XMyaNQsuLi29zhsbG5GemgpJM3PXvrZERUUhIDAQvr6+CAoIgKW1NSwsLGBubg5LS/rmHFeuXMHra9agQUOSnVKhQFFRESqr2XsOAMCyZctgYmKCs2f/BQCYmAjg4eEBNze3O2V0TOLrkS48HHg5GP5uxi3vZBpPXzjMEruW6m7TfDW9EWPfY5djoQsCPqBSAwolsPpBJ7wxy4Xxa72X3EB+vXbtiHTh/RBfolhgiHESmNP9fov3GUnvhFplVqsoU7WXjmee+HM8sR66ijkAxBc0I76gGW/+UYZQVwFmDrDG9BgrhHppj1G6OZrhjYedsflwGR7qa4UFHfqf03HkehWtmJtwgeNruqZ7GhuCXYUA2gt6Q0MDbK21rxJlcjljMZ83bx5sbGwAACUlJcjO0t4IpiNOjo6YOHEigkJCEBgYCH9/3Tvz5ebmYscnn+A/ikx8Hp8PL29vODg5IS0tjVXZHgBkZ2cjODgYAoEAMllL17mcnGwUFhbeEXZ7e3s8/vjjyMrKwokTJyCRdP7cJJQqEflaMvI/joKDrfHMyvimXPyzJhRBq5Igp9D03RcasGh0LYaH2eh0ncM36bPqdcXL3gQLhtnikUG28HM1BRRqSGRK1s1mlk5wxGv7tYcXEkqVEZlbwwUBq5K6vkj/Poas0LuYdQ85zH/7r6rvqY6p/jwKtgxrz2duz8Fxhp2b2BDgLMCs/jaYFmOFKG8zjWVocqmCtQe3UqaC+7KbKGui/tx9v8gD88cyXzF0FX9crMCsz9q72fl4e1PGlm/FxUHKwNZ1+vTp8PT0BABkpqejrJxdPNbO1haHjxyBQKCfqH368cf4cc8eVq9RKhRIS0tDMwv72uDgYEyZMgWxsTc07gBoWrHfuHED58+f1xh2GBsswKn1xu+69/WJIjyzu4TymCAHLpK39gVPwD5NafJ7mTifbrj8CA7UmBptjUUjbTEuwkp70h4LP/myKilcXqBO7tw03fGxNw6U/8J2vATdIUlxXcyP56qnUT0/PkTAWMyLKqS3V+iGJ7NMhi1/lWPoW5kIW52GVXuLsPtMFT77pwIrdhfiyPU6nRpqbD9aRCvm/dx5PVLMASDKu/PORTPFdnheQQEjMe/Xrx88PT0hlUoRHxeHsvJyKBUKlJSUIDU1FWnp6SgpKYFMrt1IpLqmBr/++iuzH0QDlRUVeHrRItZiDrSs1sPCw2Fuzjz7PCMjAwDA55tofL51xX7t2lXk57fU//fr1w+LFy+Gk4YJ1Ok0WZdYxy6e4I5wZ+pbZ3qlCtuPFul0/tRiw5SoedqZYMN0J2RtDcFPy31aklY1CbZSjWW7CmD1bAI2/Eo9UWnF2d4Uo/w1v2+t/PBf1Qxdxk3QHSLoXcj5dYEe+fVqH6pjFo1mLmTfnq2BPtvtTMmvkmPnqSos+7EIq/eV4Nv/qjH38zzEUdSka6K2Xo61+7XHQlvZsyxQ16EanQB3UScjvqZGzd7ZDU1NKC0tpT2niYkJhg4dCqlUiqSEBDQ0NKCmpgZxCQkoKS2FWCJBU1MTSkpLkZiYiDqKBLy9P/7I5se5w/Xr1/HYY48hPj5ep9e3EhwUBBsrK0bHqlQqlJWVwdSUegIrk7UI++XLl5CfnweRSIR58+bB27uzv/jnJzS7zxmaH5+nNzhat78MNXXsd5zVLPsntIUDNR6OtsKhFd5I2RKCVx52gRNNyeqaX4uw+1wNVCpg27EKJOYx8xNYNMaZ8vnMalVA5lbSsKUrIYLehfx8oWImKIxk+Bxg9kBm8XOVXIXd55j5MBsLFctwzco92ZSxRwB4YZwNQrwMZ4hjDPq6t89gbtIQ1wWAVIa16ePHj4dCoUBKcjIkzc2QymTIyc3VenxWTo5WUa+qrr6dNc6cv//+G0uXLLnTjU1ffHx8IDRl5nuQmZkJDofZbUgqlSInJwfXrl1BfX09Jk+e3OmYxALjGbC0JdrfCs+Nok4qlKmAdb/SNxvqCF+HOnZ/RwE2znSmX423olTj6I06jHkrA5+eaJ/U+OfNWkbXnD2I9l4V8/PFipmMTkYwCETQu5CfLtY9SPX8E0MtwTdl9pZUNShQ3mB4G0imhLoKEO3L3BXrZlY9dl+gjvVbmgDvzfXRc2TGp79f+21lTfHcrKwsRuVl5ubmCAgIQHp6+p0ysNzbYu5gZ4fgoCDEREcjIiwMjvb2d+qzs3JyoNLS3e3c2bOMf5avvvgCb65fz/h4JnB5PNjb2zOK5WdmZt5p78oUsViChIR4yOXydq55AJBT1XXfiW2P+9N2Zfv83zrcyGAXFnNiUUo6LFCEy28GIm5LCF5+yJl2NV5RLcP2I2UIW5OKRz/Lw7WczpPRwzeZ5eQIRXw8PoA6xEK23bsWIuhdxKnV/gG1MlBOaReOZG7a4WhlgvnDWsxnPOz4GOwvhCXDyYAheGasAyu/9pXfd3ay68gXT3mwzrZljJ3hkqWivTuXR9W1cVGrq6/XWMr1zMjOW9FRUVHIzc1FTZvjPT08EBURAS9v7zsxaYGpKTy9vNAnMhJ2txutaEuau3z5MqOfY/u2bfjm228ZHcsWBwcHmJqYgE8j1tXV1VCr2dfVKxQKZGVldqqVd7Louu+AuQUfOxfSeySs3cdulR7hyXyivOc5L0R40xyvVONMQj2e2JEL/1dTsf6PMuRXas/FSChoRm4pszLJhaOo71lk271rIYLeRfx1s2YsKLbb7YUcjIpg7g4HPgefL/JE/ZcRSN0WhpNrA1H8SRj+edUXKybZw9OOOmFFH0x4wNyBNoyPPxVXjbNZ1F2hhvjw8fhIIyXC2UUCDpEGO10f784hgfrbWdoKpRJp6emdnt+3xAvl9Z1/By4uLigqbG97LRKJwDfR/P5xeTz4eHsjJDgYDVpi91Tb9a2cPH4cv+zbR3ucrnB5PIjMzSE0M9Pq+tZKCgv3vLbU1NR06g4X6t612rFwrAtiPKgnLf+kSHGeRbJeJMPWw3weYGeufQJcXiXF9r/KEPZaKqZ+mIuDsfVg6km09yKz8MuEaPtO7okdINvuXQgR9C7izxt146ieXzKOXS13K9w2zk4cEy6GhVji7TnuSNkSgj9X+hhF2B+IsoIli23B5btzaY/58fkgPUZEg304YBdqsNP11SDorWVXmRkZneqxX59ih0eHO+HPuPbbm3weD/l57GOsQIvoB/j5aX2+NStcE1lZWXh97VqdrtskFqOBoae7jW3LBFVoRi1QZWW62aVqar86PJhZQp4h2bOUPonztZ+Yv88jgplVCiiUwMnkDu+FUo3T8Q14YkcuAlanYf3+MuRXsW+x+vnpCjQ1MWv2s2gU9ULkz9gaynsfwXAQQe8CMreGC+jMZBaMpM4YbUtxRTN+OFtFnWXO42BMpBUeZbGSZsojLM65/0IFUsqplwVPDbM0rsuXQ2SLqBsIoYiPQPv2Xx2xWIzq6mrUdainHuHPx9vz/HA1ra5Tcw9nFxfWZixt4VJsZ2vLrheLxXjllVdYXUepUCAnJwexN28iLS0NGVlZiL15E5lZWVrj+ABgLmp5T3lcLuXWuy4WshKJBJWVnZNCl4zX6qZsNEK9LfDEQOrP74UcOY5cZ5bEGu0rhIcdswnzyz+XIqNQjLoGBb44UYGwNal4+KMcVqtxTdSJVfj8FDN/9/k02+7X8hU9y+6xF0MEvQs4Fke93e5ry0GAO0NBU6rx8Ee5WPp9EUa9m4mTcdRbYzfyDNvAg88DJkUwzEJXqbBmH32f83UzPPUcFQ2ugwALF8DCx2CnHBbSfhWlVCo7tUR1FHJw5JWWicStvM6iZXfbEU4bDfX1OjdgkWrJvN+6dWunLX4qxGIx4hMTUaMhq76+vh7xiYmUot6a8Ea1SlepVFCp2CWzpadndHrs2ZFWsLQ0XqiJinUzOpfQdWTTfvrvAgCAy8WsAcz86XMrZIhenwn3Fcl45ecSytg4Wz49UYVmqrZqt4nytYSdgDqssvcZr6GGGhdBO0TQu4AjsdWUW06TopiXacXnS5Ba0pIIpFACMz7Oxeb9paio7lzvWlUrx9kUzXHWtpjwAGtzZpnGY0MsIKKI27XlVEItMqqolwmP9BPB19WIq3O7KMDktvi6DjbYaYdq6DXfcbV9cm0QrKxaBOZmbvuVO4fDgYmGLPDm5makpqUh9uZNZGRl3fl3QmIiGjW4qWlDk9nNhQsX8NeRI4zPobqdD6BWq2EqEMDGxgbWlpYw4d99/1UqFWVvdzPR3feWKpu9ro75z1ZYWNQpdm7CBd6e48P4HIYm2MscD0dShxau5SsYZ7y3Jrx2J9VNSpxNY/a+TO1H+R2OOXKreqxBBkWghAh6F3A8RTqc6vkJEczj5/+ltV/pqcHBe3+Vw/eVFEzdloVdpytRWtVSi/vt2SqoaY1n1Di3LhBFn4YjfnMgtsxxRX8f7VmzE6PoG3q0suMYveuU0VfnPlPa/Ltz3bKuDPSnjtXueMIVUb53f1c3c9uvmE07JL2plEqkJCcjOSVF46pcftsPPik5mdH4Oiai1dTUsC5PU6lUCPT3R0x0NMLDw+Hn6wv/gABERkYiJjoadrdj5I2NjVBocbBrW1Ym4GufCDY0MBM6iUSCcg3Z/V8sdIM9w+6ExmLjI/Sr9G1/MXOPC/YQ4cG+zL9rxiDIWYAYDRUdmpgYSX0POxDbROLoXQARdCOz/3mfGDVAeacZHca8/eOJJG0zZg7OJDdh+Z5iBKxKg/cLidh0iD7ZaFy45Z2yFz83IZ6f5Ih/1wcifnMg3njYCaIOW2nDg5jtJpRVSWkbsEwKNW0negbHzB4IbOO0axcMOPY3yKn7+Flq9e14KMIMzz/g3u6xuML2CUYWFu1/jwlJSZBIWyZiQUFB+Oyzz1BRUQGZTIb4+HisXr0aQIu5SmJSEu342q6MAeDjjz9GPcNktlb4JiawoOjI5uPjA5/bbm3VWjquCdpMXPgUgl5fT78SVKmUSEvrXEEwzNcET41zo329senrb4kxQdRb/r9ca0JpJbOSsFcmOxpiWIwY4CvEJ/PccHNTABLfCcLp1/xw8Y0AODJsdjOKpoWtVAmrGxuDmXedIugEEXQjcyGjvj8o4udBDlzYMVxZSCVKnEuj30IHgKpGZhkx06M1rzT93IRYPd0FB1/0gcntnVJXGz4iGJbUfPoPvQXnm7OMvDrvs6LzYzErDXb6CaGdTTxsBRz8sjyk3WP19XI0dwhFitoIbkZmJpRKJQQCAfbt24fExEQsXrwY1rc7uHl6emL58uU4c+YM+Hw+ZDIZCguo47HmbVbGKSkpOPrXX2x/PEbY2dkhJDgYtraat4h5FCLelo715JrIysrpZNbD5wA/LTNihQRL3pxJv0rfcZyZX/qAIAs8MdRGzxFpx0rIxXNj7XFlgz/OvBGIp8Y5INBDBB8XMwwMsoAZC08IdyczeFlR7gbGHLhWNYXqAIL+EEE3MicT6odRPT+5D/MymwsZYsiYVZIwJsiVWqCHhlji3zUB2DLHFUdf8mm5g9Iga1biw3+oM3r7uvEwJNSGxUhZ4jUF8JnQ+XEbPyBimUEuMTGy86rk6Gp/mFu0vxGml3beQhfeFvTm5uY7JW+HDx/GjBktxlrJbbbWExMT4eHhgQ8//BCffvopAKC8shJKhfYPg2Wbdq7vvPMO0x9JJ0QikcZ8AADg0dSgt0Us1r6jU1lZobEj284F7vByYW7EYmxGRdqgnzt1PsrH/1RB1nGGp4Wtc9zgYs3OSY+OMHdT7PifO7K2hmDbE+4Ip2iVzIbJNCGC4wl1IwxyIYJWiKAbmYRSJWVT7/HhzLfbD8Qavk/ym/tLcDOLumyoj58Iz09yRKAHs3jab5crIaaZeLz3uBfTIbIn7GlgyBvanw+fB/Rfp/dlxkW2X5VumOaAwSE2nY5LLuwsVK1Z37m369Dnz5+PsWNb8oZWrFiBefPm3Tm21fnt8OHD2Llz552mJJrqsFtp7UZ27O+/kcbQU14bKqUSTU1NGnuR08Ft4yaooJiAAC2xeE1IpVLk53fOzJ8UaoqnJ3R9mRodGx6hdo9rVLR8R5hgacnHniXenUJfujAmzByHX/TF1Y2BWDjG3uCujOPCbSifjy1QUN4LCfpjJJ9NAgAceckvAjSTprHhzLJZJWIF9l+rNcCo2nM5W4IRb2chxFWAmf2t8XCMDb2VJA0f/0O9pRjsxMWkaHu9rtEJ62DAYyzgPQ6wdKc/3v9BwG0wkH8GyD8BVLPvMhblawkTLiBXAf29eHjzUR+Nx8XmtRcqDodzp4a8NQGutTY8NjYWO3fuBNDSL9zR0RFXr16989r4+Hi4u7f8fDW1tfD06jwxMjM1hdXtjmdffPEF658LAKQyGfLz89HY2Ngpe9/U1BSe7u6wsqafjLbdIlfSFEY3NTUC6Bw3Tk1N6/SYpQnwywshnR7vCTw0wBH+tvnIqtHuMfDxPyWYN5qZ98TgIAv8vtwHMz7JhVTOzreAywVm9bPGi5Mc0cfPiNUkAMaG2wDQbmikVMPs/LpAj+GbM5jXTRJYQQTdiFxOr48BRfw8ypXXaXtWG/uu1KFeoodTBA2pJTK882cF3vmzAi7WPAQ4m6K2SYn0MinmDbXDx/Pc2rnSaeNGRj2u5VOvxF6ewtxERys8IeAyFHAZCLgPA4Q6TBCE9kDw7JY/0jqg5CpQcgUo+Q+QMyvXeaSfOX6/0YSDK7U70d3Kab8DYnZ7e7p1y5zP5yMkpEWcfvvttzvH5eTkICenswd+a9MTbQLp5taSILb/998pV/HaqCgvR0HR3Wzsfv36QSAQIC4uDmKxGFKpFJnZ2bCwsEBQILVLWtvJAL2gdw5N5OTkdCpRA4CDK/1gY9U9NedMWDXVFc/9oP13fy1fgaTcRoT7MEsyHRluictv+OOZXUUaG6p0xNqch8UjbfHsGHu4OjDrfKcvDrYCBNhzkam9VDXmTFLd8OHAL10yoPsQsuVuRM6n1g+gen5iJPP4+Vf/dl2r1NI6Jc6ni5FYJIVMAez6rxoJBcwyc3ecoE/4eXyInoLuPRWYuBsYvhkIeFg3Me+IqXVLzH3IOmDKr0DYIoBLn6z44Xw/ZG4Lh7uT9lyEC9ntS7pEtzPcW0vL2m5LM0kO0xRLboubmxtkMhm+/uor2nN1pKy09I6YP/jgg7hx4wYuXbqMs2f/Q21tHc6e/Q/TprVUDjQ2NiIzK4vyfG1FnK77XMefvaamBjU1tZ2Oe3WSHcb20c0quauYN4w+Q/1zBt+VtgR6iHBmTQB+WeqNqX0tO2zDq+Fhx8eC4bb4bbkXst8PwYZH3LpMzFuZTFPWeiGtvl8XDeW+hKzQjci5bDml5WHHGKw2sosliGcoqMbASshFsCv9jUEtV2HvJWqxmRVtxnhXQit5f7b8EToBjv0Al0EtbnBmNrqdTy4Gym8BZdeAsutAfSbjlzrZUf9ebmbWQ9Fhl9TqdilY67a7TCZDUlISwsPDMXTo0DuJb9qorGyJv3K1dLtzc3PDsWPHUF1Tw+RHuENDfT2KSlpE5qmnFmncrh8yZAh+++13/Pbbr5g3bx7q6+tRX1endfu9raB33Lr3suIgv779Y83NzTAzM0NzczNycnI7nW90gAm2zNfuYd9TsLAwwfQoIWXp5tf/1eHThSpGO1934HPwUH9rPNS/5ffd2KhAo1QJJysTducxEuPCrbHjjPZcn4uZ0r5dN5r7j+7/BPRSzq8L9FCpQZlCPoamdrMVRfe1PQcAzBtqCzMhfabtX3E1kNNEBZ4cbcAkJkk5kP83cHUDcOgB4MKbQE1nS1CtNJUDsR8Dh6YA518GMn5hJeZMOB5f2+kxa6u7OzOt2+etW+2zZs1CQIB22/+2tdzWWkTU0dkZv/z0E+uxZt3e3ndzc4OLS/vOd0OGDIatrc2dcT7yyKNYtWoVACBPSwldc7MEuL1drtLgWb9glC0che2TvZqamqBQKJCS0jmRz0nEwaGX7528qidHU3ucy1XAGRZd2DRhYcGHi71pjxBzABhH0zGyQQ67pHdCu76Dzn1Cz/gU9EIupTdQ1p/HePBgykAkASDIU4hflnrj0YE2eH2qI959xAULh9vCydKw5SzaeJqmm1Ire89TG9mY8YAH+xs4Ga4thceB4/OBa9sAGU0MPPEH4Mi0FhFXSo02pCM32xuu8Hi8dk1VvD1bavG/+OILVFW1hFUOHjyI0NDOMfkpU6Zg0KBBd/7v5qK53WxxURHtVnhH6uvq7myJu7i4YMuW91B72799375fcePGDTQ1NWHevMfx0UcfAgDWrXsDfD4fcrkcMqnm36FY2rKzpCnDfWy4DQb5t9/haGxsREpKqsamNafXBt+x0r0XeHiQI+h0ds+Fiq4ZjA4UVUjxxI5cPLkzD8UVzHYILS1NEOZM+UPHXMpoMIy7E6ETZMvdSMTmNkZQPf9AHxtW52u7zXYHpRqXs5pw6EY9DlyvRWGNgYvUAfTzFSKYQbmaWq7C/hvU5W+LR9kYaFQ0ZO8HalOBCd9ofv7SZiDfOEYrbWlslON8dvv3JCys/QrT0soKfD4f1dXVmDt3Lv78808EBQUhLi4OR48eRWxsLOzs7DBq1Ch8//33+OijjwAAtjY2EJhq3u7/7+xZ1mNt7a3u7OqKmzdvQq1Ww9nZCS4uLigpaR/rXb16NRYvfhbm5iLMmDETv/32K2rq6uDsdHdF2irIrf7tCg2JbUMDrXHKpw5HEu+KRVWVZse5Qy94M04g60ksHmmNz//VvgW991IDvl3MctvdyFRUy7D/Rh3eOlyOuqaW981ayMNHC6nL8VqZFGWN5BPawz03W+6Npw0xVkJ7iKAbietZkkiq58eyqD/XCo+DwUEWGBxkgXfnuCA2W4JDsfX47XqtwbouPTbYhtFxjLbbadosGpTqJCDxRyDif+0fL/ivS8QcAPacL+v0mK+vbyeXt/DQUMQnJuLs2bOIjIzEhx9+iD59+mDKlCmIiorCpUuXMHfuXKSltZRvCQQC+Pr6ar1ulRYbVirkt1fQ9ra2KLst4Gq1upOYtz5+48Y1jBw5Cp6eLTf5jl7u0tsr89Y4f8eEuCAHLgRmPER6mgOgTvhcP9UBDw/qOhtUQ7JwlBOloMtVwNG4GjxkzJ0rLTQ1KZBWIkVKiRQpxRIkF8kQXyBGaV3nydetfOYeBOMibPAhhaBfy26ivDcSdIcIupHIrFZRZu70N7SHOZeLmABzxASYY+NsZ8TnNeNQbD1+v1qLrAr6zGltPMywQcT+q9RGGR6WHEQHdHHoLHUXEDwLMGmzwxC/o8suv+XP9oJuZ2ensa0pj89HeGgoklNTkZeXh5kzZ2o9p42NDfwoxFxXWj3X6cxfOmJ22yCn7QpcrVZDqVSAx+O3e6wtA/xaXhfpSb37MynUFBvn+rAaU09iQJC1xuS/tuy/WmlUQZeIW4Q7tUSKlGIpkookSCxqRmE18/e6oIb5PWSAL/VOys0CRc80EOgFEEE3ArebEGjdQzPhwrixQC4XUb4iRPmK8MYsFyTlN+FwbD3+uFaHlBLmX8wId1O4OTLwblepcPQmtcf88kndsMJSSoCMg0DY4y3/LzgLNDLsSa0nNzLqkVvb/iYeExODJi39zQWmpujbpw+qq6uRn5/fLomMx+MhICAAo0aNwowZM+Dg4AClUgm5XA6xWIzGxkbU1dUhKzMTV69c0WmFbnpbmEtLS+Hi4oLS0lKtx3I4HAwc2BLLj49vMeQxa9PvvLlZ0k7MNdHHu2WiGOqt/eYf5MDFQYMkwXEBGM/DgY6nxzpg/UHtsfLjccz6M7RSUS1DSb0CUV5mLc4xt5GIFUgvlSG1pBkpxc1IKZIioagZ+VX679ZVNCgBpRpaOxK1wcmeuvJDoYYoc2u4IGBVku4rDYJGiKAbgZu5TVGgSojz7Npfe7iXOcK9zLFmuisyCsU4fKsBv1+ro60tn8SwTj4pX4xyMbWD1YwBXb+lCAAo/LeNoP/bZZftWI8vEong6OhIa8NqZ2cHOzs7CM3MENO/PyZNmoTJk9m1fc3MzMTNmzdx5M8/kZKSwug11rdL6err67F+/Zt45ZWXtR772WefwczMDHV1dTh+/DiAu6V4CqWiXetWHgCFhvrzAOe7N/0gBy7SK9sf42vLwaWNEYyqK2gJfLQl+bGbmDnAnlLQixvVyCwSI8CdPlflekYjpnyQA7FMDXcbPvp6CSFTqpFWJjVYmE0TKhVQ2SCHA8NGUn1ceYgr0VqeExOX2xQRAMQabIAEAETQjcJNmoS4cI/uayYR6CHCyx4ivPyQM7JLpDh8sw77LtcgobBzlvLIYGZWkUdvUdc72wiAQA/DNIBgTU0CIGsEBBZA6YUuuWRafhN2X2ifZT9kyBBUV9L7d0dFReGhqVMxffp0na8fEBCAgIAAPPLII0hOTMShw4dx4MABytfwTUxgJhCgWSbDrl278Oeff+Hxx+e2M7HhcDjYs+cnPPLIbADAunVrIZPJwOPxIBQKoVarIZM2g8ttI8IcDtQaEuI82qzi+vsKkV55N6HSx4aDq29FMu5CSIvLIKA6BaiKM8z5WBLuYwERH5T9DY7F1WAZA0G/mi2GWNYyeS6qVaColpmjoSHIrZAxFvRwDzPElWhPkr2Z1xgxiwi6wSGCbgTokj6CXXtGdyg/V1O86OqEF6c44WJqA57+rvDOLN+EBwwNZCbCf8VSb/E+1Ne4HtK0lF4HzF0Z27nqy2M72vfsdnBwgKurK1IpVsuhoaF4ZdUqREYyyxf6888/cfPmzXaP2dnZYejQoYiJubs5FBYRgbCICCxbvhy7v/sOP+7Zo/Wc3r6+SEtLQ1JSIt55ZzOys3OQlJSEf/89A3d3D4wfP/6Oj/yWLVvw5ZdfAgB8bzeLkXYUc7RMAjTt3XjY3hX0Pt7m+Olay83f3ZKDa5sj4cCwDzctpraAcwxQm91tgg4AD/YR4bcbmsMtAHAkthrLptD3IAhw6Vrnt7akFMvQn9rp9w7BbkIA2gX9enYjSYwzAkTQjUB8kUK7MwiAULeeIehtGRpiidOr/TBuSzbyKuV4ebITo25MCqkK57Kpt/omRHazTWdlHNDMzjVNV746XoybRXdXpBwOBxMmTEB5aalW69OnFy3CM889x/gaU6dOxd9//631eX9/f7z//vt3LFoBwNLSEstXrMCYcePw1saNyMnN7fQ6c5EITk5OKC8vx6VLlxAUFIiPP/4Yr7++FkBLI5m//voLW7a8d6cDnK2NDaysrTUaxwCACZ+nUdBtLe7mkER5WwAoh7cVF1c2hxtOzAEgdBHAEwABU4Gs3wCx9twAYzIh0ppS0E+mShnFqAf6dt/kOFFD10BthLhRj/NqloxyF5OgGz2n+LEXIVWCMvgc5NrNK1YtuNibIn5zMAo+DMW6GcxKzOLyG6GiaQA1LsJG/8HpQ0UcUNO5Y5ehKSpvxvMdGnKMGDECzc3NqKzqXJolEonwwfbtrMT8888/byfmkZGRWLp0KaZNmwZn5xaP/KysLMyaNQvz58/v9PqIiAjs++03LH76aY3n93B3v1NPXlNTg/nz50MgMEG/fv1gY2ONGTOm3xFzOzu7O+VzzRItqzEuD9Ag9m1j46NCrDB3gDli342AM01CFWNELsCgTS1VDgAgsATGfQV4TjLM+VkyjqarolINJBVQ+zgAgI2VCcLcu2eVfjVb+4SkI0E0u5A1MnUX1rDePxBBNzBMbA2DvZhtZVfWylBZ27WJoDwBF7bWJu2yZ6m4lEG9je1qzqFsXNIl1KYAFTeMegmJWIHRm5Pb+bZHRkbC09MTxYXtu0VKJBKUlpXh0x07MGLECFbXaWpqf9NPSEjAgQMHUFBQgCFDhsDe/m7y4U8//YQdOzSX6S1+9llsef99jc+5u7sj0M8PVhZ3M9ATEu62lxUJhQgOCoLP7a12mVzeaaudDUIRHz+/GGqYmLn7OGDIO8DUAy3NdtoicgSGbgCm7AdCnwL4XTex9nMTwY6mp/mZZO316m3prlX69RwxGhuZlboxCSsSC1jDQwTdwKQWSQJAkeHubklf9gEAv1+qge9LKfB9KQVrfi6GhCqjphs5lVBL+fxDMQaut9eVJuO2YJ70XmK7tpH+/v7o168fCvLz75i2lFdUICEhASmpqVi2bBnjeHlbFi5cCNMODnElJSWIjY3FwYMH79jHtpKcnKz1XGPGjMHX33yj0RPewsoKfn5+6BsZiYjQUAQE+MPf3x9REREICQmBuXnLpFSlUEClpP5sts16NzpFp4CEr4Dkn4GmzsY+KDwPJP8IpHwHKJivOA3B1BjqifyF9HpG54n07J4JshocXMyi30UAWiZpNBOYmJxKqZdBBka4AxF0A5NcLA6iej7Cg9kq5HRyI9TgQA0OPj1RiYDVaXjqi3x8/k85ziU1oKK6Z5Rwnk2lLn2bEGkAR7wezmMfpeBc1l1Rs7KygpenJ+Ju3UJOdjbSMzIQe/MmCgsLIVcoEBoaildffVWnazk6OuIrhm1RuVwunn/+ecpj+vTpg+++++5OslsrHA4HXB4PXD4fAjMzWFlawdrKCnyTu7FvuUIOmYK+VEpTRKax0XglVmjMBRI+AU4uai/qN3cAF1YBuQeNd20KJkZRb7v/l8JsghHm3n07XrdymcfRI2nKc3PLm5l5yRIYQ5LiDEx2RTPlrDPUnVlCnHMH45m6JiV+vVqLX6/efczBgof+vkIM8hdhoF/LHyaJbIaiqLwZNTLqADpd7PBe55kv0vHLtfarlsbGRvx79qzGBiMA7vix68q8efMgl8uxYsWKTlvwrXC5XBw6dAjh4eG05/P08sLHn3yCp556CvV19Nu+KrUSErGY1jymFYHApFOv83qJEhYWRm600lwFXN8GjNoKlMUC6XuNez0aWgRdu7FRcaMaReXNtCGqQGcDJg1SooaAz4GszQaMK4uwSIi7EGeztE/cssup75UE9hBBNzA5pc2eVM/TZX+2YmdBv3lS2ajEsYRGHEtocZri84DB/iKMDbXAyFALDPARgScw3iZMagn1iiLIgWu4WuIeSHm1FF+f67xNqi2bHQCcnZ0xbtw4va+9cOFCzJw5E3Pnzr1j7tLK1KlT8c4772js2KYNLy8vfPDBB1qT5YD2Qs5UzAHA1NQUjY3tJx4Nki7qCVx6vqVNbsbBrrkeBQ62AvjacpBTo30SnFoiphV0F1sTCE04kMhpslEZYmrCQaibKSLczRDmZoZgd1MEOZvCx14ADpeD1OJmHEtogK+9ANMGMA97h7qLAGgPI+SUUd8rCewhgm5gMsoUlLNOpoJuo8NKW6EEzqeLcT5dDBwqh6UpF5OiLDGljwUmhFu1JLsZkNgc6nja0OBuMpPpIpzsTHHmNT+cTKjD79dqkFZOby/62GOPGez6VlZWeO2113D8+HGMGDECGzduhJubG2U/dSr69OmDjZs24c3169s9rlarIZc2QwWwEvJWBCadJ3U5lVLGyaF6UxYLlF/qmmvRMDRQiJyr2ifCsTlNGNeHpsyTy4WrnQmyy9iF3QR8IMTVDOEeZghzM0WomymCXc3g62hKWS4X4ilEiCf7UtsgV+qJSVa5jKzQDQwRdANT0qjW3KT6NkEuzOJf1iL9V9YNUhV+v1aH36/VgYNCDA00x+yB1pgebQ1HO/1XzrG51B7UoT3EQMeYjI60w+hIO2x+3BcNDXIkF4mRXNSEzNJmXM5swOn09luOERGGLb+tr29ZAfXr1w8jR47U+3wPPPAAsrKy8MP33wMAVEolmmVScPVIbKurr+30WHxeIybHdJE/wa0PADk7v3RjEeJuDoBC0Gm+U604W/KQrSHnD2gxhQpxNUW4uxBhHqYIcTVFiIsp/JzMAH7XJSgG05TnZlQoiaAbGCLoBkZN8zt1ZdLsBACfa9gvnhocXMgQ40KGGC/tLcbECCssGmWHKX2tGDVc0MT1LOoEmZAeaKBjTCwtTTAoxBqDQloSAVd8l4nT6bXtjvHyMuw97MKFFjvbjpnv+rBs2TLs//1XVFRUgMvl6Szm0uZm5OTlawxBXMvuQoHtIWIOAME0q1a671QrrrYCAHePfbCvJWb1t0K0lxABzmbg9ID+6n40u5HNNH4dBPZ0/7vei8jcGk657A13Zv7rNkx0TNu5OfgnsQGPfpaHPq+nYfeZKkhZxjRlzUpkVlNvMdPN0HszcdkN+ORUbafH2ZRwlZeX47vvvtP6fFNTE7755hsAQCUDn3g2vLpqtc615TKpDHl5+cjKydWaT3Apg3m2dG8imEbkMqtVjL6Lz42xg6UpF3bmPPyxwhv7XvDFo0PtEegh6hFi3oq/LfXnne6eSWBHz3nnewGldTInUNSge9ozj2FLZF3T7jGrQoZlPxYh7PVUfP9vVYtlFQMySulvyF0WI+2BbD6gOZuZjfAeOnQIzzzzDL7++utOzzU0NOChhx5CTU2Lpe3Ro0ch0dBrXVceePBBCEyZ3WubxGLU1dejsqICOdk5yMzO1tomtpWiBjXSGTij9TaifOl9GSob6Ev6hoZYouSzMOR/GIaJfXpuaainPeWGZczteybBQBBBNyBlNXLKD6cli1aQNeIuygK+TVmdEs//UIQnduYxOj6nsnN3trZ4MDTQ6Y00Nsrxe6xmQUtISGB8nv79+wMAlixZglGjRmHjxo3YtGkTXnrpJYSFheHcuXN3ji0pKdFo9Xp3TI3466+/GF8bAMaPm0B/EID8/AIUFRWjvLIKEin156ItP1/S3lK0N+MopP5u5FRSezvcgcvt0pi4LtDd8+jumQR2EEE3ICU0s01LM+aC3iTtmhV6Rw7G1qOugd6VLrec+qYTztBApzdyMkF7I5iDBw8yPk90dDTWrVsHoCVW/tZbb2HTpk345JNPUFJS0un4AwcOICIiAkeOHGn3eHl5OcaOHYvFixczvjYAPDDlAUbH2djotkL85nRnf/v7gQgaw5W8cuaTop4O3T2vRqyw6ZqR3B+QpDgDUlpLLegWLAR9Zn8b7DpbjawKKWb1t8HD0VYY4G8OuVyF6iYF8qvkyKuSIaVEiqTCZiQXN0NhoEU9n8E0L5tG0Jka6PRGTidrr71NTk5GfHw8oqKiGJ1rw4YN8PPzw9atW5HSpv3qzJkzMWfOHIwdOxbx8fGYPXs2ampqkJqaiunTp8PLy+tOAt7FixehUqkwZswYVj+HrS2zLHQnRwfU1NSyOjcAFDao8df1KjzY357+4F5EmJsIZ9K1G/hkVzBcoQOASoWSanlLkpyOya3GxIJmhV7TpCCJcQaECLoBqWminm1asdhy93ISIG5LCORSBUxM279N/gAGdDheLlUgPl+KS1liHLxei8vZusdThQzMaHLK6AT9/k2Iy6O5Ib/66qs4duwY4/PNnz8f8+fPR21tLXJychASEgKh8O6EadSoUbhx4wamT5+O+PiWJir5+fnIz89vd57XX3+dxU/BfOXN4/EhEplBLGYhRLd571DBfSfoIe4iAIYR9PHvZOFytgTDAkV4f44b+vj1rO+dFc0ipoRmEURgBxF0A1JeL6e8M7HZcm+lo5hTHdcvkI9+geZYNtkRo97KwI0c9qLOgRpcBlmyRbXUiTv3c4Z7YQ317+bkyZM4cOAAZsyYweq8NjY2iI6O1vicl5cXYmNjsXbtWnz55Zeora0FAPB4PCxYsADr1q1jXTLHZtXtYGePfHERq/MDwPlsBW5m1iM64P5ZqNGVruWUMhP0/HLZnYn7hQwxhm3OhIs1Dz4OAtib82FjzoOViAcbIR/WIi6shTzYiHh3/m0p5MFKyIG1kMvoPlNRLcOp5EY4WZlgbIQ5o46MdCv0ynp5F5kR3B8QQTcg9RKFBdXzugg6W4ormrH7fA3i8nVboTNZnQNATSN1jN/N1sg+3T0YPoOtz8cffxypqanwvt2C1FC8/fbbePvttw1yrhvXrjE+1sJSc/b2z8+1TCJOJtYgoUCCgkolysRqqG4XU3hZcZBTLkW0buZ29yRuttSeAUU1zGJnmkoCS+uUKK1j/90X8AE7cx5sRTzYmN8WfiEflmZcCPgcFFTLcSyh/o6v+8nX/DA4iPJ2BwCwNKVJiquXObIeLEErRNANSE2TinKZwSaGDgBQqFFSK4Org/YbQFmlFNfzmnEpsxHHExuRXKRfQo1EpgJUKtrZd1UjdXmbBc0XuTfjbscH8lrufB6WHNx6LxKzP0zBv5l3V+5yuRwTJ07E9evXYalFDLubo8f+ZnysXKbZhvREQg2+XRqMuSPIzmor5jT3AbrvVitmJoaLmcsUrZMBZpOJ8jpm7ZzpY+jU90wCO4igG5BmmZoytdvSjHlRQUWNDEM2ZaC0Tok+3mZ4MMoSXvamqGlSoLhWhuRiGRLyJShvMGx5mxoc1DYqYWNFPdZamsYQbEr0ehsjQ2xw4GYpTLjA2fWhsLcR4KdlwfB+KRHyNouqrKwszJgxAydPnuy+wWqhtLQU6WlpjI4Vi8UoKdXsQ7r3cgO+XWrIkd370O3U0X23WlGpjGk/RY23PbMqFrp7Ht09k8AOIugGRCJTUwbH6GarbTmfLr4zW47La0ZcHvuEI10pr1PAxopiy1ylgpbOoHcwemvMHsz0/vZY+XMpTrwacMf+0tXRDD8+64W5O9snqv37778YOnQojh07BiurnrNYeWPdWkbH1dbVoba2DgqF5hWbVAlcSa27Y4dLoN+9UqvRYvBEE7qpFnefoLvbMZOO+3li3x2QOnQDIqYTdBZb7q623TfX4tMNU93zymN6Ej4uQuRvD8eoSJt2j88Z7oTlY206HX/16lVERkZi//79XTNAGm7duoUrV65QHiOTSlFYUHhHzJVK7TtF8QU9x0u9J2DKQOTUDFbfZbXsuq0ZCj4PcLBkNmGnu+fRLYII7CCCbkAkMlBuH7GJKzsx/MIYmmdH28NPz6YqFmTfB57Omn+HnywKwLIxnVerRUVFmDNnDvr374+//2YeuzY0WVmZeHKBdsc5hVyO0rIyFJeWQaFSQaFQQKYlft5Kbi8ySjEUdIUkSga+UrlV9BaxxsDV2oRxzTvdPY9uEURgBxF0A1IrV9tQPW8hZK50NgZon8ocNSaEW+DISh98MN+dyeGUWJmRFTwVnz4diNUPaK7WuXXrFqZOnYoBAwZ0ubCfP38es2bMgFJD9rRUJkNxSSkKi0vQ3Nwi0FKplFbMAaC8oXtWkj0Za5qENjXoFT27onsmSi7WzO9jlmbUx9ItggjsIGspA6JWG26FLjRgBqtm1BjsL8KM/jaY2c+KMpOeLdYiIuh0vPeEHwb7W2D2Z/ka++HcvHkTU6dORWRkJBYtWoQnnngCNjY2RhvPm+vX48CBP9o9JpNKUV/fgMYOjVaYrMrbwiHrhk5YiwCadgi0lNV2bb+HVmxFzO9jdFvuYiVZoRsSIuhdCJsYurEk0cWah7VTnfFQXys42uk2OVbTZMRZCskNnAnThzghxdMcsz9KR3yJ5ptzQkICXnzxRbz44ot44IEHsGDBAgwaNAienp56Xz85ORl/HjqEX375GfWNjZBKpZBKZZDLZRozqBUKBeRyOeX7/82T7vj2TBku5d5NkvNzIvfsjlgKuQBFvblKRX8HGBIowi9XagEAY8LMMSXKEhamfEjkSjQ0q1DTpECtWIWKOgUqGluudS27CWo97y5CU+bfb7oSPZkK5MNhQIigdyFmLDI+FUbqzWIu4IHD4UDOJEinI2zK8+53Aj3MEbctGl+fKMLyH0sgpVh0/f3333e24fl8Pvr374+oqCiEhoYiKioKYWFhcHTs7NNRUlKCsrIyZGRk4ObNmzh37hwSExMpE9laUSgUUCgUWvuat+WbJ92xaLwrFo13xfQtCTgU37IE7eN9/7oGasNayAVAIeh0ZSQAFo11wPAgEcxMuPB2ptdFtVyFEe9k4paeFTMmLDzjGWT0ky13A0IEvYciprqz60Fr/3MAiPQwxeyBNpg7yAbujobbcmdyMyK0Z/EEd8we6IjHd6ThWDL9XqxCocDly5dx+fLldo8LhULExMSgtrYWZWVlENP0JW+LWq2GUqmEUqmESqWi3YlpxdIEOLc+GH387hrk/P5iOAa+EYeEYiUmRBB3T2MR7MFssnQqrg7r/ihDQoH+5a8yBfPvN5/Fap6gP0TQuxCJWAGhiNmvvKHZ+KKYUChFQmEZNvxRihkDbLB8nD0GMLBzpKNO3D2tX+91bK0FGBZshWPJuvcJl0gkuHDhggFHRc+fr/i3E3Og5UZ+/s1InEysITd1DdRJqL8jXI5hgm7nkhqw8WApLmfp3qypI2yG1thInYnP4YBkTBoQIuhdSKNUyVjQmzVsh5rwAIVSrXcMrCNqcPDHtTr8ca0OswdY49tFnuBReLpzaL7RDRKyQteV00m17f6/Zs0aVFRU4I8//kB1dXX3DIoCER8YFWGr+TlzPh4eRKy6NdFAJ+hc/b5Dl9IasOlgOc6lNel1no5Yi7h45QHm72mDhHqnUcBF1zlm3QcQQTcgHA5kVLuUjc1KMP0qhHsI8cgAaxxPbsToYHO8Mc0ZIe6mAJcLWbMSxbVyFNbIkVLcjCuZElzMakJ+pf51qb9fq8OcwdZ4INpG53PUEUHXGXWH+3xAQBDeemszvvjiSyQlJeHvv//Gb7/9ihs3bnTPADtgbvRqjN5JHU0kRNfKgBsZTdh0uAynkgxr5sPlAotG2OH1h53gaMs87N1IEzoU8ThE0A0IEXQDYmPCqa2RaRezhmYWcXEuF7uWaO7EJTDjwceFBx8XMwwPtcTicS2PV9TIcD1XjOPxjfjhYg2kDD2hO9JIJ8g09/B6KRF0XYn0ErZr4vL55zuw4LbRS3h4OMLDw/HKK68gJycHv/76K/bu3YPk5GSjjsnOzg5ubm4IDg4Gny/Avn0/33muQqJmFUoitFBH891k0Jm0HXHZYmw+XIq/4w0r5ByoMW+oLdZMdWKUeNcRuhW6UEC23A0J+RYaEKEAshqKj2cTG0HXAUdbAR6wFeCBaBu4WPPx1uFync5jrqcxjJF/zF6NeQcjjhs3bmD+/P/h0093wNr6rsOcr68vVq9ejdWrV+PWrThcvXoZiYnJKCgoQEFBPvLycu/UiisUKigUMkaJbubm5pDL5Xde+8ADU+Dl5QUTExPExPRDQ0N9O0EHgGNx1ZgxhHRTY4OcJs2E6TcwtUCCtw6V4VBsvd5j6sjsAdZYN9UZAR66V5Y10K3QBWSFbkiIoBuQlg+n9htmYxcoXU5pM47GNeDLM1U6n8Ocric6h6zAjUFxRTO2/d05Tv7TTz/hwIED2LhxE5555hlYWLRPXOzbtw/69u1z5//p6RlISUnGzZs3kZWVjYaGekohVyjkOH78ONRqNdzd3eHv73+nPK5v376YOXMmQkNDcPXqVTz66KOdXr/oqwKMCLGBA4ut2PuZZppVKwBwuPSS/s6BErz7Z7nBc2qm9LHEG9NcEOmjnwU0ADQ0U89chETQDQoRdANC9+FkLehKNVKLm+HvZAITUw1vlUqFzGIZzmc04XxGI86mNqGkllmfYir4PBpB53LB4YCy41ptvZy6Y1tvQGANyOoMdrrZH6VCW0WQRCLBq6+uwmuvrcaCBQuwYMFCDB8+XOOxQUGBCAoKxLRp0+48VlFRjpycPBQU5CE+PgHFxUWorq6FQiEHn28CExMTyGQy9OnTB/Pnz78j6BMmjEdmZgaee+5ZrXH7Gpkaj36SgtNv9tH4PKE9Dc3U31EOB7Re6dnFErzzZwUMaUE1LtwCb05zRkyAucHO2UgzeTETcMiWuwEhgm5A6D6cdJmtHZn0fhYuZIhhY87DrH7WCHQxhUSmREmNEimlzYgvbEZdk+FX/XVi+nPamHBAlS/Q1Kzs3YLONwcCHweSdhrkdF8dL27nrqYNlUqFXbt2YdeuXfD29sa0adMwduxYDB8+gtIa1tHRCY6OThg4cABmzZp953GpVIaKinLMm/c4Lly4gLKyMpgJ7m6xPvjgg5BI6EuezqTLsfn3PKybrTnvg3AXuom9DYNEw5wKw+ng0AAR3pzhgmGh+pesdqShmTpRV2RCVuiGhAi6AbE151IGsujiSW2prZfjQkZLKmxtkxLf/td1JUsVDfTCYm/BQU1194YXuhXXkYD7EIMIenmVFM9+X9zp8ddeew0nTpzQujLOy8vDJ598gk8++QQAEBERgbCwMPj6+sLHxxfe3l5wcHCEtbU1bGxsYG9v3+71FRUVKC0tRU1NDerqWnYaSktLYWp6d+tcm5i/9tpr2LVrF8rKyu489saBCowMscJILWVshBbokmPtLbqucuCTeW54apwDo2NVchW4dG3iOkC3QjclK3SDQgTdgIhMeZTFKHQf7rZYC3ngwPA150yoaqQXdFsLLlCtfcehuFaKYC/Dbd31OML/B1j7As7DgbLzep3qncMFnR5bt24dNmzYgM2bNyMlJQVffvklvv76a0il2l3kEhMTkZiYqNdYCgsLIRBoj4VHR0fjgw8+wMiRIzFjxgwMGjSo3fPTP8hGxoeRsLe5R+Lpjv2BiutdesniGupVq7stvUW0/oG1Fq5ki5FdWQRLUx7sLPmwE/FgI+LCUsi7kxybW6HApycqcCG9CdNirLFnmQ/j89fTxNCdLPm6J/sQOkEE3YDYmPMbqJ6nq8lsC8eECxcbE4PExNki4NPPwsM9hbiWr/3HTS9pxpgoQ46qB8AzBRwGACFzWsQcAIa+CcR/BZScB8QlrE9ZWy/Hxydr2z3m7OyMDRs23Pl/aGgoPvroI3z00UfYt28fvvrqK5w9e1aPH0Q7YrEYHA05FAMGDMBrr73WLi7fr18/fPjhh1i5cuWdx2pkajz9ZQYOrA43yvgMjlMMIGsA6tK67JLpJdRF6L4u9FnlCgPdFvZeqmVxNAcHY+tRWSuDA8MJG90ixtHatJLFAAg0EE9GA+JuIyilep5JbLottubMm7kYioF+Ijw5gn7L1M+R+qaTUszcQ/yewNQWCF0E9H0WcOl/93GBBdDnOSByCeA+nvVpt/7ZeXX+6quvaj1+zpw5OHXqFEpLS/Hdd99hzpw5MDU1nA8/APz44493/v36668jMzMTly5daifmrSxfvhwjRoxo99jBeAkOX9HdvrZLsQsF7Lp28pFWTJ2TQPfdAgCJrHvslc1NOXCwZJ4bU08TXnC1EehWW0vQCFmhGxAXmg8nmxg6wK5/ur642/DxyoNOWDzKHuDTb/PT3XRSiwznHd0jkNYAiZ+3/PGdDgxc3fJ40QXgxjZAQjmX08qH/7TPjeDz+Vi0aBHt6xwcHDB//nzMn99iOnP9+nUkJiYiJSUFCQkJSExMRHFx57i8Jtzd3eHn54dz584BAHbs2AEAWLp0KTZt2kT7+m+++QbBwcHtHnvyi3zkh9vC3KKH32LswwFJFZDzB/2xBoJusstE0OtZLg4MhbeDgDYDvy10K3Rbc77hC+jvY3r4t+3ewtWaWtDZxNABQGRq/Ph5uJsplo53wLwhtqyaaHg7Ua8Kkwp7ca5LzkHAPgLwGg1c2QjIKSMtWjkdV42OH4nly5d3qjNnQv/+/dG/f/9Oj9fX16O+vh4NDQ2orq5u1zLV0tIS0dHRd/5/7do1rF27FnK5HKNGjWq37U+Fv78/nn76aXzzzTd3HquWqfHKT1nY+UwwxSu7Gfs+gKkl4DKgSy+bWEC9X0733QKA0nr9bZ51wZOl10A9naCL+LV6DIfQASLoBsTZ1oR6hc5S0HkMzCV0gQM1pvS1wtKx9hgVZsHeZxKArwP1KqKwoZebz+QcaSkY1lHMAeDnS50/LitWrNBnVJ2wsrKClZUVo2MHDBiA48eP63Sd9evXtxN0APjibAMWja5D/yBrLa/qZlwGt/xt7gRY+QP1WV1y2Qoaa2W67xYAFFZ3fW4NALjasJMMunse3T2TwA4SQzcgLi0r9FhtzxdUd8+suhV/RwHenO6EjK0h2PeCL0ZFWOkk5gDg7kR/00kvMGynpx5F1S2g9Kpep9hzsb3vdkxMDDw8PPQ6Z3fh5uaGZ555ptPjj33aNSKpEz6T7/7ba7L24wxIYg79BJDJdyu/unt2wMxZtsLNp554xLrQ7GoS2EEE3YAErEqi/JYll7FLZFGq9F/l+jkL8PJkR1xYF4C4LSFY9bALXOwNk0QVYEf98Ukv7WWJcR0p+Efnl564WdXJ837KlCl6Dqh7WbNmTafHMqtV+PBwfjeMhgbPSYCFy93/B04DePpbndKRXkLto0L3nWolv5sWBxyWts85NdTH090zCewggm5gOKDuHlRSwdwYSa7NB5Ty+moMDRDhrVnOuLEpAPHvhmDjo67o4ydifS46+vtT3wBTi4kJlDaO3qrp9NiECRO6YSSGw9PTE0891Tmhb9Wv5aio0V4/3+WY2QPRy9s/JrAE+mmvLjAUaSXUu1Z036lWRB0SV61FXFiLuDAxch6tTM48DJhNk/wn4MKwreEIJIZuaFwtOOXFjdqFOK1UDFcGWawAIGcYcnew4GF8hAUmR1phfLhFl1muxvhY4Jdr2m9QdDev+5kL6e3vZQKBAMOGDeum0RiOsaPH4NSpU8jLy73zmFINrNqTg93LQ7pvYK2YWALDtwJC+87P+U4GmkqApK+Mdnm6SW6MD7OEyA0znfHhsUqEuwvx/Dh7+LvfvacopCrUSZSok6jQIFG2/Fvc+pgSdWIF6sQq1IqVqBErUXf773qxEtVNSogpLJ3lNN362pJGU28f7MTLZXwyAiOIoBuYQGd+fnGj9u2wtOJmjI5kdq46seb4U5CzAEODzDHQT4RB/kIEu5npHAvXh1AP6lX/pfRevuWuB9fy27+3o0eP7p6BGJjhI4djzJgx+P773e06vH1/uREvTK5HTCCzBD2jYN8HGLyh/VZ7RyKeBCw8gNiteiU8auNiBvV3IsaXmbvi5GgbTI620fgc35QLe1Mu7DU/TYtKrkJ1kwIV9XJczW7GzlOVSCxq2WGJ9GAerqMLL/g7CXpgLObehgi6gQn3FGWczdLegSuVheGKaRvfZHNTDlZMdMCiEXZwdtAlBs4FYFgzihhv6ptPUpkKDQ1yWLIworgfiM3oXHobFdU7bPU8PDxgJhAgPDwCiYkJ7Z578sssxG2L1vJKI+I0BAh9jHl5ms8EwGM4kHEIyNoPNBUaZBjVtTJkVlF/B6N6gF0y14QLBxsBHGwECPUyxxNDbbH3Ug14XA4eHch8QpZaTL1D5+ts1tlViaAXRNANTKi7KB3QLugpLAxXNsx0xta/yhHgZIpNM13gaKeHP7bfDCB7v+6v14CboxlsBdRd104n1WHaYGbNH+4XrmR2XvmFhoZ2w0iMg6ubO6L7RiMpKbHdKj2+RIm9/5Zh3mhn4w7ANgJwiACc+7VYu5rokD/CFwKhc1v+NBQAxVeBqgSgMk5nE6GTibWUz7tZcOBoa1jXP0PAE3Axf5SGEAUNKYXUK3Q/JzOyQjcwJCnOwPg4mVFO59kYrkzsY40Trwdi59Ne+om5TWiLxaURGBVCnQ9wKqnrusTdKyQWdt6lCQnpAfFlAxHVJwqmpqaI7tt5Nf7S3kIopMayLeUCgXOB8CeBsAWA+3DdxLwjlp5A8Cwg4ikg8lnAdZROpzmVVEv5/MhQwyeuAmjJG+gGkgqpa+Xp7pUE9pAVuoHxdTDNR0steoym57vFcMV1COA60CinHhdpg4Px2ncd/o4jiawdydVQ6RAWFtYNIzEO7u5uAICYmH6Ii49r505XLlbjk2NFeGmapxGurAIyfmn5AwDWwYDrIMB1GOCkQ0hDKQOKLgJF54CySy32v3pw7BZ1TH5YkJHyCwJmASm7jXNuLTRLlKiUUt7rYm/fKwkGhKzQDUz46ym03sRdbrji9xAgcgSchxr81EMCqWf/mVUqVNaQUtO25FV2Tpq0tOyeVZQxcHd3v/Pv4cOGd3r+9f1laGjogjrqujQg9QfgzLPAiaeBEoZGQEoZkPILcGQmcGkNkH9UbzEvqWhGfj31ZH5MmJEc9ezDAQeN6wujQZfhDjC7VxLYQQTdCNgKOJTuR11quBK+GLBwbfl3zAsGP32Ul4i2V8Npmq3G+43syvZbzra29N3t7iWsrKyQld3iEBcYGNRpsiJVAm8dyOvaQVUnAf+tAP57DZBqz3FB+S3g73lA/MdAs+FadZ9OorgmAC4HCPc0UkKcc3/AZYhxzq0FuhaxdPdIgm4QQTcCYe78bKrnU4q6yHAldGFL3K8VK29gzOeA0MlglzAx5WN8CHUiD13s8H5CKlF2asjS2wRdKBSivLwM9XUtIjZq5OhOx2z9p5aVyZLBKDkLXN6s+bmmcuDcywbLam/LiUTqXJIJIaasupgxJng+wDcDAqYCJuyb/ugKXb39kEBBfBcN5b6CCLoR6OMtSqN6nsl2lE7Y9wXCngaGvAtMOwpEPdv5GKdo4OFDwOgdQNSLLT28eXok3AF4KMaO8nm62KHB0TFpqSuoaeq81Wxvzz6DuKfD4XCQV9ASInVxcYGHm3unY9b91sWr9FZKzwM5Gmx7L28EFMb5bh66QR1mo/sO6YSF790Jvak1EP2y4a+hhTSakrVoH4ukLhrKfQURdCMQ7WORSPW88VboakCtuv03XfIdB+BwW/5Av5UBXewvv16NovIuXI35T+26a7GkWYOdr7m57lutGzZsQFKS/vfGuLg47N9vuLLGpqYm1NXVory8ZWd12LARnY757kIDckuZl3EalOTv2v+//BZQqbWvkl7klkpQS5NGMrmPgXdpfGcAE74C+G12z3wnt0z2LbwNey0NJBdRW/1Ge1PfIwm6QbLcjUC0j3k8KDLdEwqNlBBUFdfyp5WQ+UCfJe2PKb/VshLRsZZWE+FeIriac1DSpH0ScfhGFZY80HmVZnAcYgDHPsa/jo7I5J1Ltng83Qy4S0pKsHnzZpibmyM8PFyvcb344os4d+4ckpOTERQUpNe5AKCiogIeHh4oLCyAk5MTLK0sERwcgrS01HbHrf81Dz+80A0le435QPElwO12bDntN6Nd6uB16li8mwUHAe56lqwJbICI5wDHcMAmQPtxXqNb/ogrgdpMoPgikPX/9u47vKnyiwP4N0n3pnvRXfZeskFAUIaACIiogMpPFByggCyZgoCCIKBsRUVAtigge8gmlO6990xHkqZJk98fpdA2N3u0DefzPD5Ccpt7W9Kc+77vec/R//f+KEtp3Wpu5wBbCugGQCN0A+i+PK4QSsqylYsBoYKyrnoVewCIPPDs72XpwJUP9RrMAQBsNkZ0Ub4+t+uykXJgvPoBFnY1ZT6bICFDQJdpUB+7rj//rPkgjotTusKjlkePHgEALl++rPNrZWdnQySqGaEJhAKkZ9QUBOvWRf7+9te7FUjIbKSa/9m36/xZ9+9bke3/Kn/vj+uhh+1qVTwgaicQsR+I/BmoyFF8bNplIPoAEP2zQYK5qkY8HBYE1GXNMCigG0iIM1tpYtzdJCPt2Ij6sSbZBwAebDDYaUZ2dlL6fFh2teE/uDnWQPComj+HTDDsubRUJdFfUZVDh2r2W8fExOj0Onl5eaioqKkXcPv2bRVHq5aTkwOJ5NkNa1ZWBkQiEWztbNGqVWu547862kjbkXOffK+5Dwx2isfJ5SrLvY7vqaf1c1FJzY1J1E7g79dqStfWJSwGzr8L3FlSE8jrzubp0YNk5Tkz3VqaxSo9gGiNArqB9Ai2jlD2/KVI5dtY9Cr1PFCWBhQ8NNgpRnd1gbmKd9Oey3kGOz+AmvaXlk/W8wNeAtwNU0xHF0w97rUdod+7V7OvOjJSt9nLW7duPf1zbKzun7X5+fn1vqfq6mqkpqYAAHp07yF3/KH7fESnNUIBIn4mUJ4N5D8y2Cn2X1P+njdnA0PbG2iXA/cboLBOfsXtVQBPt5s/dVyIUP7Z1jPIVulnI9EeBXQD6RVkq3Rbxj9hPCNdCYC8u0CO4UYhAGBtY4YJ3ZUnd+26YqAysJYtgL7f1CT91DVgPRD4mmHOqSU2Sz4BUZuAnpSU9PTPfD4f5eXa7yS4cePG0z9HROj+WZudnQ0AqKp6NqtaUFiAUh4PNjY2aBUiv0a/6I9Unc+rlcKI+kFPz3Ze4Sl9fmofe7BU3QnrImxbzf+zbgEFdw13njrOhysP6B1bWtMI3UAooBtIzxAHLmoS4xhxM6tR2XBDsqEUPARKDP87NLW/8v3tvCrgwiP9FetAi441iUCjjgItGbaqmVkBveYDI34DAsfVBP5GZs6w11ibgJ6RUb9RlS6j9LoBvaqq6un0u7bS09OfvlZdyak1q1A9esp3PTsdUcnYhc7giqKAYsNsiT7zoAiVKn7F3+rnZpBzP1UUBggKgLR/DXueJ/gVEkTnKV1i4A5o43THKBfzHKKAbiD91yRksllQulfrcrRu5SQ1kvaPwU8xsnMLldPue6/qISEv8DXglcPA8F1A+2mqG3A4BQO9FgLj/gH6fwtYG7jblxKP0+X3OZeWar78IhTW3+4VHx+v1fVUVlY+TYhT9Nqaqn09sbj+bg4+n4+M9DTY2NggNFg+E/vz31J0Oq9W0s8C1YbZOrf3ivL3ujkbGNLOySDnrif3fs0snRH8G6F8Fo7NQiWVfDUcCugG1L2lWbSy5y+qWGvSL0N1uHqGbc7GtH7Ks90PPxCiokLHbXspx4Gzk4Hz7wGR+2rWQZXJfQDc/xY49Spw8wtAaOC1fAbpuUK8tSUas36Wr0LG4/E0fj2BoP6NgbaZ7lyu/CSSrgH94cOaXI26iXG1MrIyUVBYAD8/P7nnriaKcT3SiDe5ACA2zNo9v0KCk2HKf44z+jsYdrq9Vua1mix4I7ioIjdoQJC5YTb7EwAU0A2qf2v7+8qeV7XW1BzNGuqt8pjDdwr1czJeNBC1G/hnAvDoB/nnK3JqsnqvfVzTC76yQD/n1dCCA4nw/zwKv98TQMQwBauPgB4drfTeUaEHD+RzKxqOrDXB4/GQl1dzwySVyt9ESqVSxMXFIisnm7Hk7YKDjVQ9Ts9+val6Jup/QzyNcCUAcq4b5zwAzj5WPvge2tHpPyNdynOJAroBDengdAtK1tGj86TG6TplRN1DHdDRU3mhlHUnVYyotRF/EIjY8+zvkkrg2jyjZPUqkp4rRPt5XGw8z1N6nD4CurbV4u7elZ+KtbHRvsjJ48fPtkLVbZvakEgkAp8vv43xbpoEvReHISzJyOWC9WzDGeWzQB09OegeaqB2qY2kmFeFlBLlLVNfbO9401jX8zyigG5AozclR0LFXPdFY08xGsH/hipPjksqkeGMiupZWoneC4ifBLrks0BFqv7PoaaHCWUImR+lKkFIa2x2/V/dlBTt1p+ZArqdnfZNPMLDnyWYMSX7lZeXIykpCSkpKXJJc0+vKU2Crl/FYer3MSqLlDRFp+8WqApsKn9HmqNzj5V/lrFZqOy/JkH/nW/IUxTQDayjJ0fpXOi/EaYX0Kf2c1NZHX7FEQMVE0l9ks2b8pdhXl8Nj5LK0GdVPBiKwskF4lqFhZotQ1hYyDfU0XQdPTMzE2lp8lPcuvRmr90bD9Q0aKkrKysLWVlZak/pH7zPh+8nEdhzQUnVsyZowaEMpc+zALylYkdIc6QqIU5VThHRHQV0Axve0UHpmtG5x41QUMPAWjhaYGov5dO2D7OqcVXFB4BWMq4C5ZmNNtVeVibG0DUJjMHc19cX7dq0gZmZfAuFggLN1vfNzc3lHtM007220lxd1tbWGr1GQ1euXGF8PCkpSau98lVSYObPWZi1U7ssfmO7GFaEuHzlszJTe9nAyUH+36+5U9VR7qUOyj8Lie4ooBvYYBXr6Kk8GQpLTK+s8WcjfVUes+JP5SMZrRTcNWihEFXGfx+Dkir56db+/fsjKDAQAPPourYrmbosLeV70Ndml6vr3NmzctPiHh7ab+nLzc1Fbu6zZLDa2YiEhAS5UTmLxUK3rl0xbuxYzPrf/zBj+nRMnDABfV54gXEWY+f1MszZnaD1tRnLV2q8pz8f3dIIV2JcKTkCVR3luK90db5opMt5blFAN7DRm5IjWSwofav/G2560+7dQx0wKFj5KORakhj34gyQ6R/9s/5fUw0HLuficpz8P3W/fv3g7u6O4qKavAGmgF43EKqDKXHtPsN6uDJ117tr6RLQ6xaoAQAzMzOkpaXJJcd5eHjgralT0atnT3g+OZ+lhQVcXFzQuXNnzJg+HSFBQXKvv/1qKQ7dMFKTHy3ciubhdqrypksj2lqiS7D2SxpN1eUo5b/HlhyU0fq54VFAN4KBQeZK666qWntqrpZNUD0SWXnMAGvpjZAMJ+BLGPeYd+7YCZ06dER25rPnLBkCek6OZuvETk5Oco/laTBtf/fuXcakNX9/7XtlX79ef3tUcXGx3J72oKAgjB87FhKxGGlpaYhPTER6Rka9TH9zMzMMGzaMsSXsWzvTkVuotF5To1Gnycz8MUZoIdwILqj4DBvfzfaSkS7luUYB3QhGdXNW+mb+66F89bDGIBJWIzlHhMz8KkCiXcOQuoZ2dEKIs/K32D9RIsSlN1L7TD369WY+Glbytbe3R9++fZGfn1evnKqllZXc12s6Qmfaw11YWIjcBjcGKSkpjNviLl26xLimHcQwMlbXtWvX6v294T50L09P9H7hBUREReHho0dISklBZmYmEpOSwA0Lw8NHj+pVzRvQrx9aNLhxqZYBH/+itJFhowhPKcclhtmZurr7cDC0o5NxLsjITj1SWkSHO7qLs+H605KnKKAbwfieLv9AyTp6cZUMj1W0HDSYahmO3i7BqPVJcPs4Cp2WxKHNl7Hw+jgKs/dlID1fh/V9NhvfvKF6lL7saPMvJrL/mvxU8MCBAwEARYX1t+gxJbTpI6CXl5bicVhYvccePHiASxflly7P/v03pAwj9ICAAI2u4+m5y8tVFrfx9PLCo7AwhQmApaWlCAsPR0HRs5/XyyNGyB13lCtAfnHT2s721ZFUlcesmOQHKNjl0JzdiytVWbN+6q70W8qPIPpgeu+uJihkflRViDM7Udkxv1w3/tpgUlYl+q5KwPTdGbgWx0fdAVW5SIpfbpbgheXxuBKhfenlCf3c0M5D+dvsz4eCZl1IJL9IhLtp9ddOLS0t4efbEpUiEQqL6m9Js2AI6JmZmi0vMq11l/P5uN1gHT0mJgbnz5+XOzY8IoJxyj3wSeKephpOtzfk4uICPp+vtNgMUFOMJjY2FlVPkugcHR0Zv9f9V41fvleRB/GlOBWu/AajT4AZRvdwMcj5o9L5+OlCAfZdKsTjZAHAUKHPkFR9dvX0M6Nyr0ZCAd1IxnR3VDrtvv+acRPj0vIqMWR9IsIzlK9HloukmLw9reaDQktbpwWoPGbq9qafwazIlRj5hKB27doBAEpK5NcWOQyjtIbd09Rha1u/Xa1MJpMLrI/DwnDxwoV6j9WOpPUZ0K9evarwOTabDRcX9YOZWCxGfMKz94O3t3w54QuRPE0uz6Cm/JCk8pgNUwP0fl4BX4LpP6bhhRVJ+OKPHHzyezb6rUlEpyXx2HE+HwK+8gQ9fdl1TXlC3JhuLWj93EgooBvJqK4tLkPJtLveW4vWEZPOR2l5/V/uxX/moqhCvTt5QZUM03anQ8q0uVoNQzs7q8x4j86TYvvZLK1ev7H9F8eTe8zfrya5jK+gFWnDoivaBPSGCWwymQwxDUrAPn78GEXFxYiJebYvX9nUuLZr6BcZpvVrubtrXkQlPz8flaKaUa+luTk4nPrlhG8kNI2tnptPpyOxWPnvxYi2luiv565qEpEUY7ek4Oh9+WCanFeFBYdzEbIgFsuO5CCn0HDLE3/dLVCVbsN9rWbJkRgBBXQjGbo+KbGFBUvp3NTPDOuwupCIpFj0RzZ6rkjCe3ueZeAK+BL8FabZNHpiXhX2XNP+huP7aaoDxdyDOc1yT35Bufw0cu2IlKleOSA/Sq+qqlJ4rCJMI9eqqqqnSXBlZWVP16vPnDnz9JhbN28ydkLTNphXVFQgIiKC8TkWiwUHB+1qluc9ySuQQn7ffZUUKClt3PdKXpEI84+o/p3d9LZ2sx7KfHMmH7cTlXdzKxNKsflcAVp/GYf3d6brNMumyD4V0+3BLViJ1C7VeCigG9GUvg5nlT1/8D4fQoF+psnuxFdgwNpE/HChZv2WX6fYSXyuSKtlth2XtA/oXYLt8UZPW6XHiKXAx7+onr5sasoY/s1q18kVBWk2R76BjaZb15hakJqbmyMpqeZn+F+dfeF7du16+udHjx8zrmV36NBBo/PXunlTcb8NpuQ9dQkra5aDJBIJY7GZHBWVTAztw/0JqFaxGeSNnrZo5699bXwm+UUibDqv/s2/VAocustDvzWJGLU+Cf88LNV6tq2u8nKxyhax0wa5ntD5RERtFNCNaEo/t+NQMu0OAMfu6dbiMzlbiFe/Tcawb5IRUWd93MHy2T91acP9VWpKzKtCRKr2vbI3TglQecyh+3zciGpehXYqFcw5VopEjIGzSiJhXL/OztasC52vr3w1PkFlJZITa/Ivf/vtt6eP5+bl4datmkTjnKwsxgx3pn3f6rh9+7bC55j2y6ur6smUe0VFBePPq0oPWyu1dflxMU48Up5/wmIB303V/+j8h0vFqNLyvv9aHB+TtqfB8+MoBM+NwuSt2jX1AYBDd1TeVHCn9HU7rvUJiMYooBtR/zUJmQFOLKWbaPfpOO2+62oRLkfLr9tW1/lAtDBX3DrF3pKNL15xRb9Q5lrstxO1rz3v62GNjwY7qjzurW1Nb5+xMi1s5H+NqsRiVArrf+BXS6XIzM5GZmYmY6DXdITesqX8lkBRZeXTG4MLDda1t2zeDKBme5iMYYqmTZs2Gp2/lqIMdw6Hw1i3Xl1VEgmKnmxhY2ro4mqn/Wvraso21YFw8UgXeLvJ1xzQhVgkwf4buheiElTJkFdajYwi7ds3772ifPDR0ZMTGTI/qvmtoTVjFNCNbGo/Z6VtwK7Ei5FXpH0Sy5xh7vBwlJ/OLa989gHuaqu4X/nCMe5YMdEbf80NhI+T/Afm7QTd1uFWTfSHpfJ26Ugvk2HdsVSdzmNMbX3klxJ4JSUQiZ4FdEl1NdIzMp62DG2YFAcAeXmabcViGqFLZTKkpqbi8B9/QCSq/z46d/48kpOTIRAKwTS2bd26tUbnr1U78m9Il65tACCTSpH75GfCGNAd5CvuGcOKw6nIFyifHbBgA0vG6b9m++WYCvD48jeDqyZ4YO3rnhq/3orXtCv1m5knlNuq2dDbA2i63dgooBvZlL5uJ6Fi2v2ADvWqfd0t8E5f+S1CD1KFEItqfgEdrBRHVOcnwd7CioORneWTmc6FlyMpS/vSmy5OFlg/SfUHz+LjhYhKbR6d6Fp5yncoyy8sQHWdUXBmVla9aWOmNWFNG7T4+MiXEZXJZMjIzMSq1asZv+adt95S+Hq1W+00weVyFe4t16WvOgDwBQLkPfmZNJxyd7NmwcpaxZ2hATxKKsPK06pb3X47xQPWNvqfQbjCMPvWL9QG80Z5oJ2PfMMeZXoEWGN4Z9UzZkz2XVN588kdT9ntRkcB3cjaL44pa+vOjlV2zDYNEl6YdAuQDzAisQyH79Ykm95NUbwOXlhne1u3APlp93KRFNsv6ra97tNXfNAvUHX7yBHfxOktSdCQ2vrI/7zT09Oflj6t4PPlyqAyjdCLijT7uSqqu37hwgWFhWoiIiMZR7u+vr6MDV9UefTokcLntHm9ump/ZnXLwdbqG2r80Tm/QoIR61TXS+gbaI6PR6juNqgpiUiKi1HyAf39QTU38H+H1S3OJMPBD/3wdl8nha83a4j2hW62/qv8vdrFmxNO0+3GRwG9EXww1P0PKBmlp5fpVgq2dzBzT+sPf85A98WxePNHxaVW88uefdi3YJiaH97eDrOGOGt9bQAADgu/zWkFxSv5NbLKZZi6Q+m9T5PQo5Uj2A2+mfT0dBQ+2TJWXKJekl9ZmWa7e2xtbRk7t6lSzbB+3rVrV41fBwDCGpSarVV337hEInm61KANplr0vYK12wqni9e3xKBAqHyq3YwF/DGnFcBR9e7W3IqTOYjNkf85Dm5Ts+RzNvzZ+6dnoA1e7emEH9/3YwzcFmbAKIYZOHXciytFkfKfA3fWMI/ftXpxohMK6I3g04M5Z1iA0qGnLqVg3Zwt0LGlfDKODCzE5VYBSkIpv87nhY3Fs7dHv1AbPFwVguOfB6FVS+YbBk0EeFpj/UTV63cnHlVi94WmX3BmSOv6gVUmkyE1LRUAGPd8M43QKxQUoVGGqbKbREV51YazBQDQqVMnjc8NKO/BnpmZiczMTOTm5iI/Px+ZmZnIzs4Gj8dj/Jko0jAXAACGd3LS5nK1tv1sFs5Fq85t2fymF/wYlmD0gcWS/7h2sGbDzdkCuUUiZJY8+5lWSZ8FXK8GuTAnP/XHpYXBsLfXbklA1WcThwXBB79kUe/zRkABvZGM7WT9r7LndS0FO7GndmtjtnXiUmsvC/g4meHLUe44Pz8YrX11m0JtaP64lujmq3od9H8/5zT59fRXOjF0PysqUhhcmdbQtQnoTNPuTBns9Z5n2ALWsWNHjc8NKA7oTN8fUHMzUVFRgdzcXBQUFDAG67qYRuf25jWzIsYSnVaBOb+p3oEwINgMc0Yarj3q6kleOPmpP0I8nv2SBrjW/DmxQROlx2mV+GhvBrafL8Cmc/Wz0S3N2OgarLwmhDL7bigv9fp2X3ulib/EcCigN5I5L3v9AgOWgp0+wBkO1pr/83aoE7R93CwRt6kdlk7wrJlLNICT89qo9dJNfT39zX5uco+JxWKFpV+ZRslMo3ZVmIrLML22KtokxOXk5ChMiGPqKNeQSCRCQUEBcnJywGfIMwBqWsI29EZv4023CwUSDF8Xp/I4aw5wcLZ2uwQ0MayzI+4tD8UHg2um0YPcagJ6BUO7swP/lWDh4RyUCur/XFMKtV/++OtugarOatw5L3nt0/oERCcU0BvJ0PVJid52LKUttjaf1azQSF3Ojub4cpRmNbTtLdl4pZNuW4001dLDGj+/r3p7T1NfT/d0tWJM9MvSYG+5olGtMkxb15hG4LWqFUx1axPQ09PTVR+khurqapSUlCA7Oxs5OTlPR+9paWmMQf7tAfI3T4by5g9xyCpXXcDm1w/84ethmKn2hiysOPjuHR+c+tQfG9/wAgA426o/fa7JsQ1t/Vf5+7mjJyey+/I41dsAiEFQQG9En73ivh9KRulno0SIS9esvnddc15yxdD26m8dWv6aB1ycVI+s9G3qYA+VZWGBmvX0fZe0v8kxtPdelA80UqmUcb2YKehqU4SFqfGJ0oCux4IymrZ8VUd1dTUkEglEIhFjNr6/AxsD2mtfTlYTP53LxMlw1ZUR3+hpiwkMMzSGNrSzI7xca7aqdfS1grWSglG1rM1ZGNRau+n28JRyXIxVOrrn/q8m4Zc0EgrojWj+kdyTqpLjlv6pOCNdFbY5G3/M8lNY9a2WOQdYP9kLs14y/odSrd3vh8DXXvUH0nv7snE3VvkaXmOZMdQbrpby3wNTYGIKuq6urhqfk+lrlI0nmUq+alvDPS1N+/emMrUBnWl0/vkY47xHr0eW4MNfc1Ue52vPwu73Q4xwRcpZ25jho6Gq3z8LR7lpnQz31ZFUpc9zWBDM+S37nFYvTvSCAnojm9rL5pSy549yBUjO1r46m42tGc4vCMbGNzwR5FE/E9vBmo2Zg5zxaHUrzB7ReMEcAOzszPH3wlZq7fYZ8HWCTjMXhrRqonzRHJlMJjdKZwpWXl5eGp/P2Vl+C6GyETpTwpy2Ndw13WbXUHV1NUQiEYRCIQQCwdP/qqqqFK7Nj++u+U2PpiJTyjH0G9VNgjgs4OzCVrCz031W63GyACPWJeLcI57Wr/HVOA9M6eOk8Pmx3Rww92XNW9kCQHwGH6fClScwzuhvR5XhGhkF9EY2e4T3z1BROW7VMR3XKjksfDjcHeHr2iB8TSjOLwjEw1UhyN7SHpun+SLAU7/1prXVKdAeB2fJJ3k1JJYCfZbHIqdA+4p1hvL+EA9YMPxWNQxSTEHXw0PzMpxMAV0ZplCvbYa7siQ+plkJoGb0XVlZCYFAANGT5jXKbkAa+vJQCiq1bC6kjvRcIfqsiFPV4xsAcOQjf3QI1EPOiVSKuQez8V+CAK//kI4P96SDz9c8AZRjwcbumX44+0Ug3ujtiJbO5nCwZqNnoDW2ve2D32f5g8P05lTDStWfQdxPR/js0erFid40XncDAgDovSohu+cv5tz76ZJuio755U4Fvp5cCR933QNvkLc1guTbaDcZk/q7405iOTZfUL5tr6RKhj5fRSN8fUc4OBh/3Z/J9cgSnH9cgioFSeYikQjm5uYwNzdnHKFrE1hr+66riyl4aruGrkxtQDc3N3+6Lq5o1K2J3+8J8CjtMS4tbgdPV/3eiBbxqtD7q2hUqBFLl4xywWt99TOr9esNHu7V6VX+6y0ersRWYOd0XwzqoHlG/4B29hjQTn/JrSk5Ahy8r3xGbERby8sdlsRS3/NGRiP0JuCrCS23QMUofe2pDCNdjXLVVVLsvVyICZtSkJZnmBHypunBGNJKdZBOK5Ni4KpIiAw4YlPH1r8zYTvtAQatS8Laf5R3whKLxRAImJdQevfurfG5FQV0qQbBU9uAriorv/Z7FSloI9uQt7c3BgwYoLCkba3oPClafRGp01JUQ0KBBANWRiKHr3po/mIrc6x5Uz9tURMyBVhwSD7RM7NYglGbUjHvQFajb9dce0r16Hz+GJ+dxrgWohwF9CZg9KbkyBBndqKyY3ZcLUV+sfZd2HTFKxNj54UCdFoah09/y8b5yHLsuqpbTXdlzsxvj8AWqhfUH+dUY+SGSINdhzKZeUK0n8fFpwdzoetnbtu2bbXqTmZlZVWvzGotppE4U5DXZXSuTdnZuszNzTF16lTs3rMHcfHxSEtPx+UrV5CYlASxRIK79+5hzZo1jEsR5WJgwMoYFPH0Uy78pbVRiMlXvX8/sAULf8/XLuegIaFAgjd2pKNcpPi8u64W4YXVibgT3ziFlQpKRNhzQ/m5Q5zZiUPXJyn9/CLGQQG9iVj4qtdOqBilf3umcUbpZx/xEPB5DD7/Iwdphc/WRn+6XIxrkYaZZbO2McOlJW1hr8Zs+uV4MSZvijbIdShyLbIEwV9EITqP+cM4KCgIkyZNwsIFC/HBzP9hwIABStfIp0yZovW1MGW6M10VU4a7ti1TgZrvURsBAQH48aefUFhUhJ9/+QXTp09nfK1u3bph4ZdfIiomBiNHjpR7PrtChle/jdHqGuqavCka/6Wo7gtubw5cWtJWb13UjtwrfVKKWbnkvCoM+yYJSw9nPe2YaCyrj6v8zOE++ewiTQAF9Cbi/f2Zl92sWUr3yWz6l4eKCtUfPPrmbmder657LZFYhonb0hCWZJiM80AvG1xeHKqyiQsAHHkowIwdqit66cOZ+wUYvC6Jca18xowZuH/3HuLj4nHw94P4+uuvsX3HDly5fAVZmVm4dIG5xPXkyZO1vh43N/m1XKZsdqZp7+DgYK3Pq0lAt7GxwfszZ+L69etISEzE+++/r3Y3NkcHB5w6fRpzP/9c7rlbKWIcVN3KU6HJm6Jx5KHqqXsOC7i8OBSBXvorfzyuuyMWj3FDnxB1CtKw8P35IvRdlYjHyfpbalCGVybGD5d5So+x5oD3/v7My0a5IKISBfQm5ItRbnuhZJReLQO+/dtwjUokIimO3CrC/N+zsPhQNv7h8gCJDN1DbXFzSTBae8pPsQqqZJjyYzrKyw0zcujRyhEHZqpXH/vn/8oxYk24QUcxGXlCjNsiv//a398f4WGPsXvXbnTtpjC/Ebfv3pF7bMCAAToFVsYROsNonGkaXtV6tTKtWrVSeYyNjQ3Wr1+P0rIy/Pjjj+jTt69G5+Dz+di6ZQsAYMP69Zi/cKHcMbN/1nzmSiKSYtiqcLWCOQAcne2n9/rxjvZmWDzeCxcWh+KvuQFqlWqOyanCgLWJWHsiB1Kx5iV+NbH+L9Wj88WvutHovAmhgN6ELPgz77glB0rnsNeeKTRIkszjZAE6LYvDu3uy8OOlImz9txCTtqWj27I43I+vQJC3NS4vCmFszZpRLMbcg4ar4PbWYC9sniK/v5vJvzFV6LsiAnx1UpW1sPJ4OqobxMXAwEA8fPAQ7ers5173zTq8OfXNesfxeDysWrVK7jU/++wzna6JqW464xo6w2NMlebUZW9vj/79+yt8/vP585GWkYF5DCNrJrdv3ZJ7jC8Q4KuvvkLXLl0QExODtV9/LXfzw6sCLoapn88h4EvQe9ljXIpTb/1937veGNdH+5+TOswa9t9VQioF1v5VgAFrExGbobqSnTb4FRJsPKs8wdOSg7Klx/OPGOQCiFYooDcxS8a4KV1LF0uBH87rN3iGJfExZH0S0gvlp/Pj86owdEMyDt0shqO9GU5+GohgN/mR+qG7PNyI1r6HuyqfjfbFBjXarQLAg/RqdFkcjoIS/SYRCgUS7L0p/z3+deo0nJycnv79peEvYdmyZcjJrl/3+seffpTrC+7v74+xY8fq9TqBmsI1deu2SyQSxiCv6ba3ht566y3Gx2/duoVv1q2Dk6N6o9pHjx5h4MCB2LhhQ73H3d3ccOjwYURGRmLE8OEQCAT4avlyua//8656AT2vSITOX4bjYZZ6uwA2TPTAjKGG3ed54FoRXvkuGWVCzUbcj9Mq0WdVAjb/nQe1Ns5r4Lt/MuVuXBvgrn7NY4teT0p0RgG9iVl2Iv+QlYpR+ooT+fqbVpbI8NauDIjEin97pVLg/X2Z+PNWCezszLDnPfmGIACw9i/te7irY/64llgySr0AlFgkRceFkUjN1d8I5mKE/N74t99+G23atn369wO//IIrV67AwcEBR48erXfs9u3b5b5+9erV9f5+8+ZNxMTIJ3odP36c8XEAqKxk3j5YWVUFvkAAvkAAURXzaJRp69mDBw9w9uxZxuMbmjhxIuPjgRouIXTt2hVBQUFYvHgxuNz697Mvv/wyJkyYgJycHGzftg1vvvkmbG3r1yM/9VD1zWRStgDtvohEYrF6gXPVODfMH6e6cZAusgsq8dnvWYBamSLyxNXAsmN5GPJNEm7Fluul6E6lsBrrzijvr9LCgpU//0juSZ1PRvSKAnoTtKrmzlfhKF1YDaz/Sz9r6ZeiypBaoN7U48z9GbgZU46erezg6Si/VepGHB85hYbdWrfmzUB8/pJ6zTny+DJ0XBiFyBT9zBzEZMvfHLw99e16f1+8dAkAYMmSJfVGv1GRkcjNrZ/z6O/vjzfffDYtn5GRgaFDh2Lr1q31jrt8+TImTZqE+/fvM1+XgkCvjvJy+Z/N9evXMWbMGISFhdV7fMWKFQgNDa3XlMXR0ZFxlP7zPs07aM5fsAAAsGTxYrnnPpo9GwCwc2fNku2gQYPqPZ+nYv94WFI52n8ZjeIq9UayC0Y4Y9lE7fML1PXd2SJUMdybv9TeDpFrW2HjG55qra3fSxZg+IYUuH8chUuPdet18PXJdJUtUje86b1Rp5MQg6CA3gTNP5J70tVSecb7shMFyMjTffSZkK84mPs4mcHV7lngllQDk7alYdqONOSWMv/Gh2cZvhzrt9OD1Q7qFRKg67I43IhSXnlOHUKGJCSR6NkNTNijR0+D9jtvv1PvOKZgPPtJkKq1cOFCVFdXY9asWfUenzt3LgDghRdekHuNsrIyxp7h6uLxeHKPDRgwAACwZs2aeo8PHz4cKSkpmDdvXr3H58yZI/ca6o7w66q9ubl48SKysusvKw0cOBBATUOYouJiPH78uN7z5ko+ya5F8NB9eRxEag5ePxnqhPXvaLclT1PnFGz7fLGtHQI8rfDhcHc8XBmKIe3U65oolQKVOkzeJWULsOaM8uULX3tWOmW2N00U0Juo5a97/gAV+9Kn70zQ+Tx2lvIjbQB4uaMd4ja2RfyGNnit57N10DKhFMceKB4BWJsZ5y2lSVCXyICBa5OwScdqey1d5HMHPvjwA4Q/CS61o92OHTvKbSWrEMhv7evatevTP5eUlODIkSPw9fVF586dnz5eUFCAqKgo2NraMu4Zv3NHPmteEw8ePJB7rGfPnuBwODh9+nS9x/v27Qt3d3ccP34cBQUFTx/v0aOH3GskJGj+3rSxsXmadV+QL798UzvjMWzIEGRl1Z+hauvB/D7+5ng6Bn+TCKmaS8yfDHXClneN1z2thM98l7HpXAGSn8wIebla4vS8AGye6gULFVvgZw5yxqju2mfjv709XtUh3G/e8KXReRNFAb2JmvNb9jlVo/TLcVX4626BskNU6htqC6aWHaGeVgCHBQsrDtZMULcLmAwh7sarq65JUAeAz4/kYcjKx+CVabeX/4Vg+bra2dnZ6NajOzp36YyVq2sy2HNycpCeXr9cplAoP5tSd6r85s2bAJ6NRGslJtYU4FJU551pXV4T584xd7ts27YtpFIpUlJS6j1ee311bwTy8uT3gefk5OCL+fOxY/t2HD12DNeuXUNMTAwKi5SP/tyfFN+JiIh4+tjDBw+we9cuFD352shI+cqAIzrVr7JXxKtC/6WPseiY+nkdxg7mAODvwvz7UlhRjRe/ScLViCcjeDYbM4e64chsxcsAXfyt8O0U7RP4jtzMx+1U5cP7jp6cyKm70uW3I5AmgZqzNGGrJ3ls+fDXXE8ACjc2v7szHVmdnWFhxTxCUSXIyxKTX2iBw3d59R7fdbUIAa7mqJbKsPm8elO6k19oAW8343Zu+3Z6MBxt0/DVSfVubK7EixH0aThOfRGEAe3VvxkAgPYBdugfZIabyfIfelFRUU//XFhYiKDgIPTu9QLyCvJRVFTE2Izls88+g4uLCyZPnvz0BiA0NLTeMRUVNWU3mTqbHT58GH///bdG30NDSUlJ2LhxI+bPn1/v8dqMeD6//sxC7Ta32hsNANi2bRvja2/ZvFnhec3MzGBjYwN7e3vY29vDxs4OFubmuH/vHgDg3Rkz8O6MGWp9D+ZsYPG4Z4HuSngxxm5KRrkG922rxrkZZc28oTFdHRCRyfzeLaqQYvTmVEwf0AJfveoOdxdLBHtYKnytrVN9tO6mJhRI8P4e1TXbt073l99iQJoMliatC4nxhbpyDicWSScpO2bxSGd8PVX7Nb9CXhUGr0tWOzmOSb9QG5z6NABWeiqLqam/HxRh7Pcpqrba1LNsjDNWvaHZz62IV4XWX0SgSKi/35v27dujoqICaWlpmDRpEg4ePPj0uePHj2PSpEnw8/NDcnIygJqp/e+//x4rV67U2zXMmzcPG+psGWvZsiVycnLw8OHDeksAgwYNwn///YepU6di8ODB2LdvH27fvq2369DG1UXBGNSh5ubsy9+SsV7F/um6OCzg1GeBGNVDt+172uKVidFuUZzKLWtsNtA3xAYJeSLk1clfae9tiR5BNnCz52DFRO1H53P3J+L7izylx4xoa/ntuejK+UoPIo2KAnoTd21xSMDgdUnHoGSUDgAJG9ohxEf7spQlpWKsPJGHP+6WgC/S7D0xe6gL1k700np0oC+RKeUY/HW8RsH2BX8znJzXRqNWnLHpFRi2Ng5Z5Yb53QkODoa3d82Hc2RkJEpKahL6WrdujaqqKrlpcH0KCgqClZUVoqNrauN/9NFHGDVqFFgsFk6ePIldu3YZ7NyaamHBejrTkpVfiXGbY/AgXf1tWz72LJxb2Eo/Pc11cOx2Cabt1i6/o52PJe6t1r4eP1Dzfm67KFbVYQ/i17cdELog2vBZr0RrFNCbgSm97JYeus8fDyVBvW+gOf5b01nR02qrqJCgx4p4ZBarTpUNcLPAzum+6NdWvQxcY8gvFmHMtzG4l6Z+qq8FG9gy1ROzXmbeX6/Iweu52H8tHxdj9dPxSx84LOCt3rYI9mC+uSsoE2H/9TK1en43VVYcYOYgJ2x4MxBW1hxsOZOJ+YdzoUkl1F7+ZrjwZXs4OOg35+P0fR62ni+Aky0Hu95tCWdH9V5/w6lcrDqleR0H3xZmiP2uncZfV1ePBY9UFdrhzn2pxc5N/xY3nbs5wogCejNhwWFdE0sxUNkxhz70w+T+upWoXHsiB2v/UrUeLcOcYS5YMd4LVtbard0bklQsxYf7ErHrumad4Np7sHHw41B00nDEJuBLcD2uDHcTy8BmsVAlkSI1X4iUAjFicyUoqZShoycHTjY1MxgCsQz30/UbUX3sWdgwxRevv+CqMp+ivFyMfisiEZGr/z7yI9paYvE4X0iqZcgtrUJhuQRF5RLklVYhv7wKxWXVqKiUolwkA7/2P0lNBURLDtDSkQ2vFmywnxRasbZkw8PBHG4O5ghyt8Kgdo5o519zA/kosQxv/JCI+ELNKqz9b6ADfnw3BGxle920sPLPXGw8+ywoLxrtgSWvqVfdEAB2nM/HwsM5kGlQZGZ8Dwf8+lGAJpdZz4HLuZi2N1PpMQ4W+LdUJBuh9UmI0VBAbyY2TvIct+DPvGVQMkq3NwfydnTRqb1jcrYQ/b9OUrimF+JhgZ9m+KJ3q6YzKlfk58u5eHdvJkMOv3KzBzti49RAvbXJZBKXzsf35zKx53q5zlU7l452weopgRp9TUlpFRYdSsVODW96FHGwADa/5Y13DVwmFaipMz73t2TsvqHZtXNYwJ53fTF9iHp9ATTx04UCfPFH/VK/+973waS+LsgqEMHHTXEyW123Ysvx7p4MtWbILM1ZuLooBB0D1OnWJo9fIYHrR2Eqi8jsnu4zn/adNw8U0JuRAEfOsbQy6WvKjvl0mBO+n6Hb1pvzj0sxoUFHMRZk+HSEK74a66l1Rn1jeJhQhlfWJ6BAwyQ2JwtgxwxfTBmo/w//hh4nl4ObUo5HqRW4kyiQG737O7DR0pUNTp1M9xb2ZhjQygFT+7vDw0W9YMGkpLQKOy/l4sidIoRnV2uUVBjizMbQDnZ4tYczRnaX7/hmCL9eycXsXzI1ymAHamYw/l3U+unoXp+Ss4XotjwBkjqBsWegNa4sDsEvN4ox+0AWNk/1xsyh6v2MhAIJvv4rDzsuMVeRA2qC+a8ftMTIbk5aX/esnfEqb+jaebB/i8qtflvpQaTJoIDejNxcGuo74OvEU1CRIBe9tg3a6vjBNXN3Ov64zQMAuNpx8PtHfujXRvPkIZlYiugcIdIKJOBwZOjc0hqeOgQgbfArJPjfngQcvK953/Y+AWb4dXYrBHvrrw92UyYRSSFSsRhtxmHB0oJdM+Q1koRMPqb9mKBynzSTN3vaYtf7obC1M8yMy2c/Z2LP9WeZ9b4tzHBtUTBKhVL0W5MIoVgGP1dzPFwRqtGsT0FxFX69XYJ/HpXhcUYlhGIZHG05eKWDPZaOdUeAp/ZbRMOSytH1qzhVh3FvLAkZ239NgvI5edJkUEBvZmb0d1jw83/lk6EkqHfz5eDh+q6KnlZLfpEIHZbEQ1Alw7n5gejfVrNgXsirwg//FmHvjWLwGlTDGtDaFusne6FTgHGD5LH/CjDlpzSNkqdqvdvPHisn+MHXQ7vpTaKd1Fwhlv+ZhgN3KjT+WisO8NsH/pjQz031wTr48mAmtl2sCeitPCxwcm4QrM2BlzYkIzHvWcLkgNa2OP6xv3ZLOVIppNXQ27p/+3lcROcp/UWgRLhmiAJ6M2RvzrpQIcEwZcd8N8kD88bq1inqfBgPeaXVeGeQZnt0/7hRhC+O5KJUQVlLADDjALtm1KwxGlNGnhCTt8ZpNdIDgLd62WDFxIDnZsTeWBIy+Vj2ZyoOP9CuX8HgEHMc/qQN3I0wG1QprMaW8wWwtmDjgxddUFBejVHfJSOJoa5D90BrnPwkAC3UzH43hLVH07DkhPLEVzdr1j/5AukoI10S0RMK6M3QsdkB3V7fkbYbKqbeuStboWuIfLlSg5HIsPBwNrZfUq83NQAc+sgfo3toX3taK1Ipdl/Kwce/5qjdsKOh17vZYPVEP7Txa/rJgc1JZEo5lh1Jx8lw7QK5nRnw04yWmDrQraYai5GFpwowfktKveIvDbXxssCZeYFGX3oCgHtxpXhhlco6+9y/5gZOG70pWb7GLmnSKKA3U+M726w+GS4cCSVB3d2GheTNnQ22dliPVIqP9mfhwH+adTVzsGbj1rIQndYDtVVQIsK8A0n47Z5A69d4taMVvp7s3+jFSZq7sKRyLD6cirNR2rffndrLBjtmhOp9b7kmZvyYhj/vq25f6udijjNzAxDkbbwlnLIyMQI+DUeJ8hay3Dd62p74417FGmUHkaaJAnozps7e9JHtLfH3YubGHvqk3v51Zh18LHH6swCjTI8yuRpRjGk7UpBepv3vwugOVpj1klejlRBtrs48KMK2c9k4H6N9IPdzYOGXjwIxuKOzHq9MO3mFIvxwqRAHbvJQrGTJCQDc7Tk4NTdI621nmhqy8jGuxCvfHmBjhst8sWyoUS6I6B0F9GZs21veL3/8e87XUDH1vnmKJz4brVkVNE1wE/kYtDZRo4IYDW2Y7ImPRuhWFEcX1VVSfH0yHStOF0KXXwl7c2DGQCdMH+SOrgzd2QjATSjDz9fzsf86T6eKdSwWsPxVVywd59foZYcbyikU4dXNKYjJUV5F0MGajWOf+KNPa8PO8Kw7lorFx1U2WeL+Mcvvwzd+TLtn0IshBkMBvZkb2tpi8+V48UA04nr66I1JuBqjfEtYp5ZW6BZgjTOPylBYUX/k0ivIBmc/D4RlE6g6l54rxJyfk/BXhO4lq0Oc2Xj/RVdMG+iuUa14U5RbWIn913Kx90oRkkp0/8wZ09EK26YHw8+z6e464JWJMe77VDxIVZ4PYGnOwh8f+WF4Z8Pkkqi7bv5WL5tjv97lrzXIRRCjoIBuAmzMWJeE1Rii7BhDracnZwvRaaniDwsWZNjwhhc+HF4z+s4tEqHXisSn05EBbha4vjhY7ZrXxnL+URGW/JGuqsa12gYFm+O9Fz0wsbdbkyyXawhCgQSHbudj39V8xpaz2ujuw8E3b/phWJfmsbRRKZBg4o40XIlWfsNrqF0faq6bw9eedTKjTDperycnRkcB3QSc/Ni/y/ht6XuhYpRuiPX0P24UYeb+LIXPb3nLG+8NqV8ha9fFAsw7mAMzDnD1y2B0CbbV6zXp09WIYnz1ZzpuJOmv9nr/IDO81NEJQzo4oX87J729bmOTiKS4lVCKy1GluBBRilspGpZzU6J/kBlWvu6HIZ0bf51cUxKRFNN2p+MUV3Wp2rf7OuGt/i20KuLERJ11cwAPHq5o9Uq35XEq5+RJ00YB3UTMftHpkx1XS6dBRVDfOtUDH4/UbX96XZvO5OGr43mMz7X3tsTdVaFy24ekYine35uJwW1tNd7j3ljuxpZizYkMnInUb/dINgsYFGqOlzo4YmiHFujV2shb+HR0O4aHS1GluBjOw7Uk/QXwWmM7WWLRWD+80KZ5/VzkSGSYfSATv9xUbxfI3RXBaO+n243uN8fTseiYyg5u3CWjXLasOVN4QKeTkSaBAroJ8XdkH0svkymt9Q7odz1954UCfN6gKUWtwW1tcWZ+sF7O01TEplfg6xPpOm11U6WjJwddA6zR0c8Wnf1s0LGlbaOvwecUVCI8k4/wNAEi0vngpgoQpbzSmE6m9rLB8gn+CPVtQrM3EhnORpTiemwFxNUs9A62wfjujuon5EmlWPJnDracV16nYWh7OxybEwAzS+0T/dRdN+/pZ8a9lyaeqfWJSJNCAd2EPFzZ2rXnivi/ZEBvZcfpcz39URIfA75OUvCsDOcXBOlt+rApycwTYt3pTOy8VqpRQxNtWXKA7n7m6Opvg45+tujkZ4POfnawsdVvTgS/QoLH6RWIyBAgPJ2PR6l8PEyXoMpwsfspczYwa7ADvnzVD95uTSuJMDZDiHf3ZCA8o/4MTQcfS/z2gT9CfNW/3u/O5GG5glmtcd0c8Mv/dMvaV3fd3IyFm2KpbIDWJyJNDgV0E/PtZM9x848ob7MK6HE9vVqGnl/FKdyeY2nOwndveGP6oBaNUrnL0PgVEhy8nYfvz+apqo1tMBwWYMauCfpWZixYmQEW5ixYm7NgbgbYW7IhlgKVYinEEkAolqFKLEOlBKiUyCCqrulHLm2kj4J2Hmx8+rIn3hng0SQTBsNTBXh5Y7LClsIudmz8uyAIrX3VLwe8/3IhPv4tC6iz1XNUJ3v8Mdtf53rtaq6bc0/M8Xtv3A9pYTqdjDQpFNBN0JiO1uvORFYOh4qgvvxVV6yYHKDz+c494uH1H9KVHjOtfwtsf1f9tfuETAH23+ThelwFcnhiWFtw0KWlFV7r4YTXejgCZsbr9KWuO7E87Pg3F3/cq9C5x7mpM2MB7/S1x+yXvNAttGnv1++zPB4RGcpzJ/xdzXFzSYhGNdo3ns7FypM1a9xdA6xxYX6Qzjc0c3YnYPtVlZXqqPGKiaKAbqJCXTmHE4ukk1Qd99M73vhghLfO51v0RyZ+uFDM+JwZB9gw2Qv/G6a665VULMXKE3n47lw+oKBQTRsvC/w03Rc9QptmHXWRsBpnuMX49WYuToeLQL9hNVio2T/+1gA3vNrNtUnUHVBF1bbMukZ0sMexTwPUbitbUSFB6y9jYcYGbi8L0XmZYePJDCz4k3kqvw7ugGCzW9cTxR/rdDLSJFFAN1GJG9tbtFkYfalahv6qjj0xxw/j+uhWpU0mluK9vZk4co9X7/F2PpbY815LtVqllpdLMHZLKu4lq044Y7OB3dN9Mbl/097GVFEhxvF7RTgTVowLEQLwlBcOMzlOFsBLHW0wuoszXuvlAju7plVvgElythB3kwRgs1jIK5Ng8dFctb927eue+GSk+r9LWQUisCDTOZj/+V8eJu3IUHmcly3rdHaFdKxOJyNNFgV0E3bkI/8ek39M3wkVU+8AcG1RMAZ2aKHbCatlWHs6F+v+yocMwOcvu2PZWA+1snVFwmqM3pyM24maddna977xW7DqIilbgGsxPFyNKsP5CD7yBab1++duw8KIjrYY3N4BA9s4IcSn+bSZFfAlmHswG7/f5mn9Gmw2cGVhMLqHGi87/xy3GK98l6zyOBZwL2xN6xGdlsTyDH9VpDFQQDdxS0e7vvP130WfQkVQN2MBj1a31kvXsKSsSvDFUrVG5bWm/5iGo2p0qWrIxoKFO8tbIcircRq76CqvSISrMaW4HlOKi5HliC9snMQ6bYW6sDG0gy0GtW2BF9s5wqORGuzoSsCXYNiGZLks9obmvuyGSrEUPyppEeznYo67X4XC3t7wXQ7vx5ei10q1lgS4u6f7zH9/f+ZlQ18TaTwU0J8D6tZ7tzMDwta1Q7C3cUdVp+7yMHWn8qQ6Mw4gqZaBaV19xkBn/DDdcM1njEnAlyAsrQKP0vjgplTgQbIAETnVjb4OzwLQwZOD7sE26B5ghy4BtugeYAdrGyO05jWCL37Lwk+Xle8Pb+1pgYdr2wCon9DG5NWuDjg428+gOzviM/josDgGYtX3gNxPhjrt3XKxZIfBLoY0CRTQnxNBzuw/U0pkr6s6zsWahegNHeDubJyRlkwsRfslcUgvVLzNZkofJ2yd6o07SQKM2Zwq97y9JRs529uZ5La4Whl5QiTlC5GQK0RijgjxOUKkFVUhs1iKAqF+fofdrFnwacFGgKsFQr0sEepljRCPmv9aejTdJii6qK6SgmPBRsAnUXJNg5jsf78lJvZtAVTL8PrWFJyLqFB47LdTvDDrJdWJoNrILaxE2/mR6uRkcMd3tfrnOFe4zCAXQpoUCujPiZTv2pt1XhR9tlyMYaqODXFmI2xdJ703cmFy4i4PbysZnU9+wQl7328JcFjIKhCh9cI4xuMSNrSGl2vznO7VC4kMkmoZJBpuJjdjs2DGYTXJbYAGVS3DsmO52HWlEN9N8cGsnzPV+jIzDnBhfhB6trJDSakYvVcmIIvHXOffjAOc+jQAgzrod1teWZkYHReGI71M5b81t50HOzoqt/ptvV4AabJMd0hD6gn8PEpyeXHoVA4Lt1Qdm1gsxeCvIyARGX499+8wxQ0rOvpa4sdpPk+3Ae2/rl4d7OeSGQtmlmxYWXM0+s/Mkv3cBfPiUjHe3JGGzecKwBfJ1A7mACCpBt7elQ5emRgtHM2x/38twVKwICKpBsZ8n4p5B7Kgr3KCVZXV6L8yUp1gDjdrVi4F8+cLBfTnSI8V8fnHP/b/EMADVcc+SK/GmG+jDH5Nt5OY20qacYB97/vCwqpmr3JcpgCbzjOvWbLZgLOeS6AS03T8Dg9dlsbj9CPFN5L9Qm3QysNC4fOZxRL8b38mIJWibxt7LB/nofBYqRTYfbUQBaX6aVwzYl0kInJVLw1YsHH9+letJ+rlpKTZoID+nHl1S2r4D1O9lgHgqjr2XLQI036INej1FJczfzjN6O+Mtk+6TYmE1Zi+OxNVCjqY9g6yaRZFSkjjSs4W4p1d6SjmKw6Inf2tcH5hEG5/FYp+oYqTQ/95XI5t/9Yk0X0xygND2zMXOfJ3NceZeYFwc1Z8g6Cuid9F42qi6hsDFnDv3wUh09p8GWO4DkKkSaKA/hya81v2uU+GOu2FGkH9wJ0KfLY/0WDX4mjD/Bbs36ommMvEUszYk6G09OabfXTcP0+eC0HuVvhwqIvCKXIASMgRISG7EpbWHPz2gR/c7RXfKC49lgNuIh/gsLD3PV94ONY/9sOhLni4spVe1tBn7YzHUa5a8Zl7fI7fB4PWJaTqfFLS7FBS3HNsSi+7pYfu88dDjcIzb/a0xe+ftdX/NWxNwV9h5XKPd/a3wrzhbth/sxhXY5in5QHAy8kM0etawdxS+ZR7WBIfv/7HQ0SmEDLI0M7bGqO62mN4Bwe1S3US03DpcSnGbUmFTEFp4SAPC9xeGgJbWzNciyzDqE0pUFSG2M/FHLeWhcDJwRz/xVTgle+SIZPK8MPbvpj+on4KHk3eFI0jD9UL5vve9Z47Y2/Wdb2cmDQ7FNCfc6M6WK3/J0o0DGoE9eFtLXBmfjuVwVMT58N4mLBV+R50ZY7M8cPIbk6KD5BKseJoHr49V8D4dFsvC3w7xVvvmcikaVPWwhQAxvdwwK8fBQAAvj6eh3VnFB/bysMCm970xuCODrgVWw4zNgu9WuneZ6CqshrD10biWpJa6+/czVM8l392MOeMzicmzRYFdKJRUO/hx8HVJR31t6WtWobXvk/Bv1GK9/Mqok5BmU1/5+GrYyobVmD+K+5Y/poHjdafF9UyjP8+BReUvO82T/XCzKFugESGl79Nws14xaNkNhvI39oOVnoqtFNeLkb/lZEIz1GdAAeAu2Gix+r5R3JP6uXkpNmigE4AAANDzH+4kSTpCzWCeogLGze+agdPV90aStQq4okxfEMS4nLV71wypJ0dTn4aoLR3dGpuJboui4dYrc/Emmn+N3o54eNXdGtUQ4ygWobbiRU4E1aGmKwqlAkkcHMww5D29pjY0xFODqqbwBTyqtB7ZQJyS5nfIOYc4NriEHQKtEF+kQg9VyagqEJ+K6elOQtLX3XH3FGKs901kVckwgtLo5BWpta2Ue6SUS5b1pwpPKCXk5NmjQI6eaqbr9neR1nVXaBGUHe1ZOH26rZ6a75RUirG5O1puJWoeq1wXDcH7H2vpcrM9sWHsrH130KNrsOMAxRu66BWQxnSOE7d5WH5yVwk5jHfADracrB+ohfeGqi6E9/NmHK8vDEZitbIgzwscGdpCGxszXDpcSnGbkmr93yfEGvsnO6LIG/9VNKLz+Cjz1exKK5S63OZu/AV5+3f/FO0Ty8nJ80efWqRp7iZkve6eHPCoUb2e6FIho6LovEoUfF+Xk20cDTHvwuCsX6yFxysmd+WTrYcbJ7qjd8+9Fdrm9rlKPlkO1Vm9HemYN5EiUUSvPtTOqbuTFcYzAGglF+NWT9nYvUx1W1P+7e1x5JXFc/IJOdV4YNfavacD+3siPl1Zm/eG+iM8/OD9RbMH8SXosPiGLWD+SdDnfZSMCd10QidyBnS2mLLlXhxf6gxUuewgAsLgvBiJ/31Ja8UVuMUtxQPUoXIL5XA1c4MfUJtMLqzvUZrlO3mxyC9iDmhaGofJ3Txt8Ka0/koFTyb2oxY2wqBnvpZSiB6JJXize3pSgvCMPlpuq/qkXq1DKM3JSvdTTGtfwusGO8BNwdzLDqSA19nc8weob867RfDivDSxhR1D+cuHe2yZfVfNM1O6qOAThi92sl63V8RlcOhRlAHgKMf+WNCP8M0otDWuz+l48g9HuNze971xRv9nZGcLcSQb5JRWFGN7oHWuLYs1LgXSdTyx40izNyfpfHXWZuzELamFXzclNf5LyiuwgsrE5CvoNARALjacZDyXVuwlORtaOPwzXy88aPaOz0oAY4oRHOLhNHpcOGiDwY6/Ao1pt8B4PUdadh5PtvAV6UekbDmQ3n+SBeYKZiZn/t7Nh4nCxDkbY3TcwPhaMvBhO6ORrxKoomN/zBvOzTjAC52ij/GhGIZ1pxSvcvBzdkC+2e2BJQUnenXylbvwfyb4+kaBfNd073mUzAnilBAJwr9dK30+4WvOG+HmkF91oFsLPo92cBXpdymM3nwmxeNyDQh2vrZYtvbzNvaykVSjNmcgvT8KnQKtEHGprb4ZGTjZrdfDi/HD2fz8TCBr7dmHk2aRKbW95mcLUS8gjXzo3P8kbapPd7orfhm7NdbJcguUFxpsNagDg744hX5WSZnWw5+mdkSv88JUPkampj5UywWHVPcU72Be4c+9Ptw5v7sy3q9CGJSaMqdqLR1qtfITw/mroaa0++vdrTC73Naw85O9dYhfeu5JBYxOVXwczXHf0tC0MLRXOle9D4h1rjwZXCT6KXefXHs0617jjZsdGlpjRAPS7T3tcTMQS56Hx0aG58vwaXoCkRlCZGYJ8aFyHIMamv7tICLIsqKD4WvCUWQtzWEAgk6LolTuAVtxTh3fPGqp8prFIskCPgiDqVP6r33CbHGwVn+eqnFXotXJsbELTG4GKv2Nk3u6U/8p43Zkhqpt4sgJql5f0IQo/jk95x/Tszxe4/Fwh11jj8dUYmgz8L1lgGvrqSsSsTk1HxIpheKMeGHNBQUV2HeK27wcmJOprudKMRVLYraGEKg27OgUSqQ4locH3uvF2PewRzE5Yoa8cp0U8QTY86+DPjNi8GbP6bj69MFOHyXh2J+NU48KEVukfLvrVrJdux7yUIAgLWNGRaMUjzDcoqhvDATc0szDHzSlGVKHyec/TxYr8H8bmwpgj4NVzuYW3Jw9c6y0FEUzIk6KKATtYz7IS3s5uKQiZYcXFXn+AKhDN2Wx2Pzae3Lumrq5//q90u/lyxA9+UJeH1LKnJ4Clq1AbiVqDi7We+kUoSnCnD6Pg+XHpciNffZVLClghE4CzIEuOovqBhTRKoQXZfF4+ebJRCJmWYDWTh4m6f0NfxcFCe0/Vrn3/ztvi0Ubnl8nC58mluhyta3fHBkjh92v+er1y2M646lovfqBJSouS3Nz4F1PGJt21deWBWvev8dIQCoiTRRW981CZnh9u1eGb427ve0MmkA1JiCn3c4HxciS3H44zawtzfcFLxYJMHea0Vyjxfzq3EuQvkI3MrCOPe1d+Ir8OmBLERl1x+RDmpti7UTvcBNFTJ+XTtvK1g1w/awpeUSjNmUrLRdKQBsv1SIOcNcYWHF/D2GuJmDBRljM5VrcXzEZQrQ2tcG1jZmmNTTCXuuF8sdJ5UChRUS+Kjxc3RztsBIPU+xj94Qjf9S1O6Jzu3qwwnjZkre09tFkOcCjdCJRlotjK5MLa2e0N2HEwY1k+XORokQPDcc9+NLDXZdUikL/i7a3TAM0kMjDVXOPeLh5Y3JcsEcqAlK/dYkIqOY+QO/a4B+CpcY27dnC1BYoXpUnFdajd8azK7UZWVTU9JVkVUnnyWW9W9tq/A4cSMkGtZOsWsSzCd0tTpDwZxogwI60cqDTMl74zpZ/wM1g3qBUIZeKxOw4YRhpuAtrTm4vao1kje2xuC2ij/UGxrc1hbdQ9U/XhupuZWYsSsTEjVryjfU1V/9gC4TS3E/vgJb/8nH4kPZ+OznTKw5lovD/xWjiKd2UNGdVIpDdxQHaQBwsGajpbM5gt0s4NlC+WThG70UZ7Gf4pbh6O2ac6UXM69Ns9lASz2OutWx8ohGU+wAwJ3zouP+o1zhckNeFzFdlOVOdPLlSJd3158tng01M+ABYGhrC/z5aRu0cDTMB6xMLMXio7n44UIBFNXoBmpKyd5ZFgpfd8N+0L+1LRUnudonCF5YGIg+rRWPUGv987AUi47kIKmAOaixIMP/Brti9QQP2NgadrUtJbcSHRfHK3x+29s+mD6ohdq7CyqF1eiwOFZhFjsgQwcfK0RmVYLp37x/Kxuc+zJErXPpqohXhbHfxmgyKgeolznRAxqhE51880/RvmOz/WdyWLil7tdciqtCyGcRuBXNM8g1sczZWDfFGzeWhGBIO+bp9K4B1rixJNjgwTw5W6hTMAeAzr6qR+g/nM3HpO1pCoM5AMjAws6rRXhlUwoqKhQnCepDjpLZgHY+lpj+ootGWwWtrDlYNlbZtjMWIrNEUHQDN3uocaoY3ogqQeBnmk2xe9uxTj9Y0WoEBXOiK0qKIzp7bVsqN9yn7YiX1sb9nl0h84Uao/XiKhn6fZ2Ir8e7YfHr/ga5rq7Btjj9RRBScitxK0GAtEIRnGw46BZog95GWDcHgN9vK84b8HIyw5ej3XHiYanCOuKtPCxUjqb/i6nAoj9zoGw2oq6HKULMP5SNH9/3U+t4bchkiq/FRsv99NMGOOOvR6Uqkxwbeq2nI8b0NHwVwGV/pGDNGfnETCW4Q1qZX78UVzXXUNdEni80Qid60W5RTEVWuXTskFbm16HmujoALDlRgK7zHyE8RfPOaOoK9LTC1AHOWDzeCx+NcDdaMAeAc5GKR+ffTvbGe0NcsXys4j7a3QJUt6ddeCQb6gbzWr/e4iEuU3WrWm052ijOJo/JqUR1lVq9vuvjsLDnvZbo1FL95jkTejhi93TmaoH68iixDB3mcTUO5l8Mb/EjBXOiTxTQiV5diquaO3+E04/QIKiHZVej89I4fLI3HkKBYaeCjYnPl+BxGvNWNHtLNsZ0cwBQU29ckS4qEuIeJwsQlsZc1rRPiDV2zvDF2CfnaejwHcMV/gl1twBLQV10vkiGMwxd01JyK1FVqTxz0MnBHP/OD8KoLspzCjwcOdgxzQe/fOCnVqtdbZSVifG/n+LRbXk8ovLUv0HhsHDzyEctP9h4vniPQS6MPLcooBO923CuZM/JjwNmWNUUoVE7sP9wuQzes8Nw8Lpp1NGIyWZO0AKAga1twX4y9RyVxRz0AaCLv/LR6LVYxdPPB2f5Y+oAZxz4nx9c7eSD2vU4w82KWFpz0EnJzciCw9mISq+pWR+ZJsR7O9PRcXE81p5WXdvczs4Mhz8JxPFP/TGumwNc7ThgQQYfJzOM7GyPfe/7IGptG7wzyKWmv68B7L+UDZ+PH2P3DY1uirh9Asx+il3fbujE7ekPDHJh5LlGa+jEIMZuTQkXbsWLYztZf306ohJQMwueVwVM3ZmJbedz8cuHoQj1NeyWMkNKK1SWGPYs2HEVjLAB1QlxDxTMAJhxgPLKaqC4CuJqKWws2UCDPeERmZU1FVcMVMf+1c4OeKzge8viSfDCiiS5gjFpRWrXN8fwzo4Y3tm4HfJi0irwzk8JeJCu2R5EFnBv3QT39QuP5h030KURQiN0YlinwoVL9r/nO9ecDY3W1m+nStBqYQwWHEhEpZolO5ua8krF07BeLZ6NmLkpzGvZ/q7msLdXfs+dpyCbXFINdFqagMAvYtFqYTzSi+SP44tkqBQZbtvq6z2dVB7TsPpbhoJ95I1NKJDg032JaLc4VtNgzg11YR8KX9P6JQrmxNAooBODm74n43pVtWxQnwCze9AgqAPAxvM8+H4chhO31W4z2WSYKZnuLRPUBIWC4qqnHdYa6hmoOiGuRKDbzY5Qm+Q0NQX7WOF1DbPL0xhuPBrbH9dz4TP7MbZe4mn6pdzPhjntji+sntJhSaxxOxWR5xIFdGI0t1LEH64a57YRGgb1IqEMr21Lx9CVj5Geq3i9ualp6ax4dL37ajH+vFWCuQezFR6jKiEOACzMdFkjlsHa3DBrzLVWTfBS2DCFSQ5PDKnYcDcZmkjKFqDvkjC8uTNTk2pvAMD1sWedvL44ePzmCyU/Ger6CGmIKsURo4v9pq3NzN2JG28mS3pDgwpztb4a44pl4/302gnLECqF1fCfFw2+ltPaZ+YGYHBH5gz1WqPWJ+FaHPMe9u3v+MCCA4ilQHW1DBKZDGKJDNXSmrrmwW6WGPuCk1bXpol/H5di8rY0iNWYTHCwZiP1u7YKG7UYQ1VlNb46mob1Z+WbvKiB+/EQh71bL5Xu0Pd1EaIKBXTSaPa95zP4o1+yl4uq4QANA7uzBQtLx7th1jBvWNs03dzO2fsy8MtN5TXNFUnf3BbOjsobznx+IAs7rzLvfz72iR9GdHHS6tz6die+Au/tyVCYKMiCDK/3dMKyse4I8m6cZjQCvgTb/s3GutP54Gm+lM/1sWelH/ok+OP+axIyDXB5hKhEAZ00uvFdbVafDBOOhBajdSsOsHCUKz4f6WPQ9qzaKiipQu9VCchTWIOcma+zGWK/bafyuKO3SzB9dwbjcyzIMLqLA3oF28DGgo1ivgT5pdWIyqpEbI4I297xwatqJK7pi1QsxYkHpbgZz0dGcRVYLCDY3QJd/WzwUkd7lTcvhlJSWoXv/s7CxrNF0DKlgEblpEmggE6ahDPzgjpM/yl1fZFQ5gktAjuHBXwyrAUWjvGFh4ulAa5Qe+GpAryzMx2JefWHfbaWLPi7WiA6S76l6vAO9jg+L1Dla1cKqxE8PwalAs0j0c8zW+L1Pi00/jpTkVNQibWnMrDjaimk2n0Mcr3tWJmHPw2eTaNy0hRQQCdNyrIxru98/XfRhzIZLKBFYAeA9/rbY+l4PwR4Np0+4pXCahy9X4q/w0pRVFGNTn7WmDvCFf+El2Hu7zlyx/cKssHlpep1B9txPh8LDmtejCdibSsEeqpfRtVUJGTyseZEBg7c0awmfB1cDguC5WPdti87kX9In9dGiC4ooJMmaWJ325VHuYLR0DKoA8Dr3Wyw/LWW6BCouvVoY6mokOC32yXIKK5CfI4I12L5EFTJ4OnIQeLm9uq9iFSKWfsy8dstntrntTRnoWhHB4NVUmuKwpLKseJoKk6Fy8+IaID79gt2fx64U/6Nvq6LEH2hgE6arFtLQ32n/ZT8XWKRNAQ6BPZhbSywfIIf+rdz0t/FGYhYJMG9FCFc7Tho7at6H3pduy8VYN3pfOSXq16v12QGoLm7El6M1ScycCVepz3u3J5+Ztyf3g1a1G15XKG+ro0QfaKATpq8ndN8hs07mL1IIIETdAjsXX04+GKUNyb2doG5ZdPNjNdFVWU1LkRV4EZcOeJyqpBXJgG/UgpzM8DJmgMfZwt09rfCG70c4e1mutPtYpEEf94pwvq/shGeo1PxHa67DSt767SWqyfvSLunr+sjxBAooJNmY9U4tzfW/FX4oVgKO+gQ2M3ZwNt97DFtoDsGdnh+k8JM0bUIHvZfy8HBu3zoWJ+G62CBwtWve2755Pecf/R0eYQYFAV00uzMfanFrC0XedNk0D5xrpaHLQszX3TGjEEeCPLWbIqbNA2JmXzsv5aH3VdKUCDU+fOMa85GxeLRrjtXnCo4qI/rI8RYKKCTZmt6H/sFv9ypmAighz5er6sPBzNfdMeUfu5wcmh6e9rJM7wyMX69mYu9lwvxWLcp9VpcDguVX7zsvPebf4r26eMFCTE2CuikWUvY0M5qyZG0RX8+1C0jvqHRHazw7mB3jO/jrq+XJDqSiKQ48aAA+6/l42yUTpnqdXE5LFR+9KLT71svlVBhGNKsUUAnJiF1Uwf2pr8zZu24UjalWgYb6Cm4W3KAaf0cMH2gO/q0ddLHSxIN3YgqwS/X83HgVrmu6+J1cV2sWbkLRrntXfAntTUlpoECOjE5Gyd5jlt/Jn+mtlXnFHGyAEZ0ssZLHZ3xYjtHWnM3kMRMPi5Hl+JiJA/nwgUo129HVW4vf7MHX47x/nH8D2lhen1lQhoZBXRisg596N/rm1NZHz7Oqe4EPQb2Wi7WLIzsZIthHZwwpL0jfD2aTmW65iQ1V4grUSW4FMnD2TAhijVrVaoOLgBM7mF9av7olju60z5yYqIooBOT92BFK/ftF3On/3qrfGy1DFYwQHAHAC9bFl7pYoehHRwxtH2LJldTvqnIKajEpagSXIwoxdlwPvIFBvsM4vras9I/HuH2K02rk+cBBXTyXNk5zWfYlnO5M2LypW1goMBey9+BjRFd7DC0vROGtHeCawsLQ56uycovFuFyVCkuRRXjXBgfmeUG/czhApBM6Gp17qOXvH8Zsj4p2ZAnI6QpoYBOnksPVrRy//Fi7ju/3Cofb8hRe11OFkB7H3O08bFCK09rtPG2RqinNUI9bWBmyTb06Q1KLJIgIbcS8dkCxOdWIi5HiJgsIaKyJSjTvLe4NrghzuzEmUNcD9NonDyvKKCT596x2QHdDt0pGHvikWCIPjPkNeFuw0J7XzO09bZBKy9rhHpZoZWnDUJ8mlbiXUImH/G5lUjIFSI2S4C4bCGisiT6KOiiDW57D3b0m31d/prUx+1kyPwo49w6ENJEUUAnpI5/Pg9sd+R2wejD9/ivVFbDAY0Q3BsyZwMtrFhwsmGhhS0bLWw5cLRhw8nGHE62ZnCyMYOjNQeONmZwsDWDgxUbjjZmNf9Zc9DCsWaqv5hXhVKhBGXCapQKJCgTSlAmkKJUIAFPIAaPL0Wp8NmfeYJqlPClKOHLwBPJ9LllTFtcAOjqwwl7o4/L32/0cTvpNy+y8a+KkCaCAjohClyYH9Tq6L2ikcful7+k7y1wRG1cDguCkR2sbo7u5nzpfz9nXWzsCyKkqaKAToga4te3s/r7UdHw0w9Lhl5LFPeWAWagAG8IXAAIdWHHj+vhcGlUV9eLg9YlpDbyNRHSLFBAJ0QLx+cEdPsrrHjY5YiKF9LLZAFPHqYArx2uNQe8lztZ3Xqlc4srM/dnX27sCyKkOaKATogenP08sM3thLIe/8WVd7+RKO6ma4tXE8d1sEDh8A42d4Z1cLoxuK3jrdZfRgsa+6IIae4ooBNiAFFr2zrcTijv8TClrMPDFGFHboakTWNl0DcyLgB08uJEdguyieodbM8d1NbhVpsvYyiAE6JnFNAJMZKkb9tbPE7ld3iUVtHhYUpF+3vJVR2eJNsBzT/QcwGghQUrv2eweXS3QLuILv520V38bCNp9E2IcVBAJ6SRPVrV2jk2W9AqNrsyJCZbEBqdWRkUmy8NelLwBmj8YM+t/YOrJSs30IOTHeRunhHobp0e4GqV6e9mlenvYpHZdlFMRWNeJCHPOwrohDRhN5eG+paUi51KhRIHnkDqUMKXOJXyJQ48ocSBxxfblwikDhWVUhtRlcxCUCWzEollFnwxrERimUVlNawkNdP8T5mzUWHJRpW1OavK2hyVVhasKmtzVqWVBavKzoot8HI0K/BwtCz0cLLI93Iyy/duYZnrbGfO67IstrixfgaEEPVQQCeEEEJMQPMuIE0IIYQQABTQCSGEEJNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBNAAZ0QQggxARTQCSGEEBPwfzLikVGnkJNiAAAAAElFTkSuQmCC';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button class="Btn" onClick={handleLogout} style={{ marginRight: '100px' }}>
          <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

          <div class="text">Logout</div>
        </button>
        <button class="Btn-back" onClick={volverInicio}>
          <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

          <div class="text">Inicio</div>
        </button>
      </div>
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Orden de Compra</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <th>Fecha orden</th>
          </thead>
          <tbody>
            <tr>
              <td><input className='fecha-input' type="date" name='fecha' required value={fechaOrden} onChange={(e) => setFechaOrden(e.target.value)} disabled /></td>
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
          <input type="checkbox" className='dirCheckbox' checked={usarDireccionCliente} onChange={handleCheckboxChange} />
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
                <select required id="region" value={regionSeleccionada} onChange={handleRegionChange} className='comboregioncomuna'>
                  <option value="">Seleccionar una región</option>
                  {Object.keys(regionesYComunas).map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </td>
              <td>
                <select required id="comuna" value={comunaSeleccionada} onChange={handleComunaChange} disabled={!regionSeleccionada} className='comboregioncomuna'>
                  <option value="">Selecciona una comuna</option>
                  {regionSeleccionada &&
                    regionesYComunas[regionSeleccionada].map((comuna) => (
                      <option key={comuna} value={comuna}>{comuna}</option>
                    ))}
                </select>
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