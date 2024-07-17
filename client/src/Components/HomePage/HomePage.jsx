import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import userIcon from '../../Components/Assets/4644948.png';


const HomePage = () => {

  const empresaData = JSON.parse(localStorage.getItem('empresa'));
  const auth = useAuth();
  const [facturas, setFacturas] = useState([]);
  const [filtroFactura, setFiltroFactura] = useState('todas'); // Estado de filtro por estado de factura
  const [filtroEntrega, setFiltroEntrega] = useState('todas'); // Estado de filtro por estado de entrega



  useEffect(() => {
    const obtenerFacturas = async () => {
      const response = await fetch(`http://localhost:3001/facturas?rut_proveedor=${empresaData.RUT}`);
      const facturas = await response.json();
      setFacturas(facturas);
    };

    obtenerFacturas();
  }, [empresaData.RUT]);

  const handleLogout = () => {
    auth.signout(() => {
      // Redirige al usuario después de cerrar sesión
      window.location.href = '/'; // Por ejemplo, redirige a la página de inicio
    });
  };


  const fecha = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fechaCapitalized = fecha.split(' ').map(capitalizeFirstLetter).join(' ');

  const filtrarFacturas = (estado, tipo) => {
    if (tipo === 'factura') {
      setFiltroFactura(estado);
    } else if (tipo === 'entrega') {
      setFiltroEntrega(estado);
    }
  };

  const contarFacturasPorEstado = (estado) => {
    return facturas.filter(factura => factura.estado_factura === estado).length;
  };

  const contarFacturasPorEstadoEntrega = (estado) => {
    return facturas.filter(factura => factura.estado_entrega === estado).length;
  };

  const facturasFiltradas = facturas.filter(factura => {
    const filtroFacturaPass = filtroFactura === 'todas' || factura.estado_factura === filtroFactura;
    const filtroEntregaPass = filtroEntrega === 'todas' || factura.estado_entrega === filtroEntrega;
    return filtroFacturaPass && filtroEntregaPass;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='logout'>
        <button class="Btn" onClick={handleLogout} style={{ marginTop: '20px' }}>
          <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

          <div class="text">Logout</div>
        </button>
      </div>
      <div className='container'>
        <div className='derecho'>
          <div className="userCard">
            <div class="card">
              <div class="card-border-top">
              </div>
              <div class="img">
                <img className='img' src={userIcon} alt="foto" />
              </div>
              <span> Bienvenido/a</span>
              <p class="job"> {empresaData.NOMBRE}</p>
              <Link to='/Home' style={{ color: 'white' }}><button>
                Crear factura
              </button> </Link>
            </div>
          </div>
          <h2>Tus facturas</h2>
          <div className="btn-filtros">
            <p style={{ marginTop: '12px', marginRight: '20px' }}>Filtrar por estado de factura:</p>
            <button className='boton-ver' onClick={() => filtrarFacturas('todas', 'factura')}>Todas ({facturas.length})</button>
            <button className='boton-ver' onClick={() => filtrarFacturas('creada', 'factura')}>Creadas ({contarFacturasPorEstado('creada')})</button>
            <button className='boton-ver' onClick={() => filtrarFacturas('rectificada', 'factura')}>Rectificadas ({contarFacturasPorEstado('rectificada')})</button>
            <button className='boton-ver' onClick={() => filtrarFacturas('anulada', 'factura')}>Anuladas ({contarFacturasPorEstado('anulada')})</button>
          </div>
          <div className="btn-filtros">
            <p style={{ marginTop: '12px', marginRight: '20px' }}>Filtrar por estado de entrega:</p>
            <button className='boton-ver' onClick={() => filtrarFacturas('todas', 'entrega')}>Todas ({facturas.length})</button>
            <button className='boton-ver' onClick={() => filtrarFacturas('por entregar', 'entrega')}>Por Entregar ({contarFacturasPorEstadoEntrega('por entregar')})</button>
            <button className='boton-ver' onClick={() => filtrarFacturas('rechazado', 'entrega')}>Rechazadas ({contarFacturasPorEstadoEntrega('rechazado')})</button>
            <button className='boton-ver' onClick={() => filtrarFacturas('aceptado', 'entrega')}>Aceptadas ({contarFacturasPorEstadoEntrega('aceptado')})</button>
          </div>
          {facturasFiltradas.length === 0 ? (
            <p style={{ fontSize: '20px', textAlign: 'center' }}>No hay facturas para mostrar con el estado que escogiste</p>
          ) : (
            <div className="tabla">
              <table className='table-fact'>
                <thead>
                  <tr>
                    <th className='top-table-1'>Número de orden</th>
                    <th className='top-table'>Fecha factura</th>
                    <th className='top-table'>Estado factura</th>
                    <th className='top-table'>Estado envio</th>
                    <th className='top-table-2'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturasFiltradas.map(factura => {
                    const fechaOrden = new Date(factura.fecha_orden);
                    const fechaOrdenChilena = fechaOrden.toLocaleDateString('es-CL');
                    const colorEstadoEntrega = factura.estado_entrega === 'aceptado' ? '#0B9111' : factura.estado_entrega === 'rechazado' ? '#E81E1E' : factura.estado_entrega === 'por entregar' ? '#00C195' : 'black';
                    const colorEstadoFactura = factura.estado_factura === 'creada' ? '#0B9111' : factura.estado_factura === 'anulada' ? '#E81E1E' : factura.estado_factura === 'rectificada' ? '#3A32BB' : 'black';

                    return (
                      <tr key={factura.numero_orden} className='dato-table'>
                        <td className='dato-table'>
                          <p>{factura.numero_orden}</p>
                        </td>
                        <td className='dato-table'>
                          {fechaOrdenChilena}
                        </td>
                        <td className='dato-table'>
                          <p style={{ background: colorEstadoFactura, borderRadius: '100px' }}>{factura.estado_factura}</p>
                        </td>
                        <td className='dato-table'>
                          <p style={{ background: colorEstadoEntrega, borderRadius: '100px' }}>{factura.estado_entrega}</p>
                        </td>
                        <td className='btn-acciones'>
                          <Link to={`/detalle/${factura.numero_orden}`} style={{ color: 'white' }}>
                            <button style={{ marginLeft: '20px', marginRight: '20px' }} className='boton-ver'>Ver detalle</button>
                          </Link>
                          <Link to={`/Envio/${factura.numero_orden}`} style={{ color: 'white' }}>
                            <button style={{ marginLeft: '20px', marginRight: '20px' }} className='boton-ver'>Ver envio</button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          )}

        </div>
      </div>
    </div>


  )
}

export default HomePage
