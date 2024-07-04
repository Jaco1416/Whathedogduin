import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './Detalle.css';

const Detalle = () => {

    const { id } = useParams();
    const [factura, setFactura] = useState(null);

    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/factura/${id}`);
                const facturaData = response.data;

                // Parsea la propiedad productos si es una cadena JSON
                if (typeof facturaData.productos === 'string') {
                    facturaData.productos = JSON.parse(facturaData.productos);
                }

                setFactura(facturaData);
                console.log('Detalles de la factura:', facturaData);
            } catch (error) {
                console.error('Error al obtener los detalles de la factura:', error.message, error.response?.data);
            }
        };

        if (id) {
            fetchFactura();
        }
    }, [id]);


    if (!factura) {
        return <div>Cargando...</div>;
    }

    const productos = Array.isArray(factura.productos) ? factura.productos : [];

    return (
        <div>
            <div className='detalle-container'>
                <Link to='/Inicio'>
                    <button class="Btn-volver">
                        <div class="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>

                        <div class="text">Inicio</div>
                    </button>
                </Link>
                <h1>Detalles de la Factura N° {factura.numero_orden}</h1>
                <table>
                    <tbody>
                        <tr>
                            <th>Número de Factura:</th>
                            <td>{factura.numero_orden}</td>
                        </tr>
                        <tr>
                            <th>Fecha de Factura:</th>
                            <td>{new Date(factura.fecha_orden).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <th>Estado de la factura:</th>
                            <td>{factura.estado_factura}</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Datos del proveedor</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Rut:</th>
                            <td>{factura.rut_proveedor}</td>
                        </tr>
                        <tr>
                            <th>Razón social:</th>
                            <td>{factura.razon_social_proveedor}</td>
                        </tr>
                        <tr>
                            <th>Dirección:</th>
                            <td>{factura.direccion_proveedor}</td>
                        </tr>
                        <tr>
                            <th>Teléfono:</th>
                            <td>+56{factura.telefono_proveedor}</td>
                        </tr>
                        <tr>
                            <th>Correo:</th>
                            <td>{factura.correo_proveedor}</td>
                        </tr>
                        <tr>
                            <th>Sitio web:</th>
                            <td>{factura.sitio_web_proveedor}</td>
                        </tr>
                        <tr>
                            <th>Tipo de servicio:</th>
                            <td>{factura.tipo_servicio}</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Datos del cliente</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Rut:</th>
                            <td>{factura.rut_cliente}</td>
                        </tr>
                        <tr>
                            <th>Nombre/Razón social:</th>
                            <td>{factura.nombre_cliente}</td>
                        </tr>
                        <tr>
                            <th>Dirección:</th>
                            <td>{factura.direccion_cliente}</td>
                        </tr>
                        <tr>
                            <th>Teléfono:</th>
                            <td>{factura.telefono_cliente}</td>
                        </tr>
                        <tr>
                            <th>Correo:</th>
                            <td>{factura.correo_cliente}</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Productos de la factura</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto, index) => (
                            <tr key={index}>
                                <td>{producto.nombre}</td>
                                <td>{Number(producto.precio).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                                <td>{producto.cantidad}</td>
                                <td>{Number(producto.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h2>Detalles del despacho</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Región:</th>
                            <td>{factura.regionDespacho}</td>
                        </tr>
                        <tr>
                            <th>Comuna:</th>
                            <td>{factura.comunaDespacho}</td>
                        </tr>
                        <tr>
                            <th>Dirección:</th>
                            <td>{factura.direccionDespacho}</td>
                        </tr>
                        <tr>
                            <th>Fecha estimada de entrega:</th>
                            <td>{new Date(factura.fechaDespacho).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <th>Estado del despacho:</th>
                            <td>{factura.estado_entrega}</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Montos</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Subtotal:</th>
                            <td>{Number(factura.subtotal).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                        </tr>
                        <tr>
                            <th>IVA:</th>
                            <td>{Number(factura.iva).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                        </tr>
                        <tr>
                            <th>Total General:</th>
                            <td>{Number(factura.total).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                        </tr>
                    </tbody>
                </table>
                <Link to={`/Rect/${id}`}>
                    <button className='btn-rectificar'>
                        Hacer rectificaciones
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Detalle
