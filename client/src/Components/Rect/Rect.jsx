import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Rect.css';
import Swal from 'sweetalert2';


const EditarFactura = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [factura, setFactura] = useState(null);
    const [initialFactura, setInitialFactura] = useState(null);


    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/factura/${id}`);
                const facturaData = response.data;
                facturaData.productos = JSON.parse(facturaData.productos);
                facturaData.productos.forEach(producto => {
                    producto.total = producto.precio * producto.cantidad;
                });
                setFactura(facturaData);
                setInitialFactura(facturaData);

            } catch (error) {
                console.error('Error al obtener la factura:', error.message, error.response?.data);
            }
        };
        fetchFactura();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFactura({ ...factura, [name]: value });
    };

    const handleProductChange = (index, event) => {
        const { name, value } = event.target;
        const productos = [...factura.productos];
        productos[index] = { ...productos[index], [name]: value };
        productos[index].total = productos[index].precio * productos[index].cantidad;
        setFactura({ ...factura, productos });
    };

    const handleProductAdd = () => {
        const nuevoProducto = { nombre: '', precio: 0, cantidad: 1, total: 0 };
        setFactura({ ...factura, productos: [...factura.productos, nuevoProducto] });
    };

    const handleProductDelete = (index) => {
        if (factura.productos.length > 1) {
            const productos = factura.productos.filter((_, i) => i !== index);
            setFactura({ ...factura, productos });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Debe haber al menos un producto!",
            });
        }
    };

    const formatDateForMySQL = (dateString) => {
        const date = new Date(dateString);
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    const calcularSubtotal = () => {
        if (!factura || !factura.productos) return 0;
        return Math.round(factura.productos.reduce((total, producto) => total + producto.total, 0));
    };

    const calcularIva = (subtotal) => {
        const iva = Math.round(subtotal * 0.19);
        return iva;
    };

    const calcularTotal = (subtotal, iva) => {
        const total = Math.round(subtotal + iva);
        return total;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const resultado = await Swal.fire({
            title: '¿Guardar cambios?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'si',
            cancelButtonText: 'no'
        });

        if (resultado.isConfirmed) {
            try {
                const productosAgrupados = factura.productos.reduce((acc, producto) => {
                    if (acc[producto.nombre]) {
                        acc[producto.nombre].cantidad += parseFloat(producto.cantidad);
                        acc[producto.nombre].total += producto.precio * producto.cantidad;
                    } else {
                        acc[producto.nombre] = {
                            ...producto,
                            cantidad: parseFloat(producto.cantidad),
                            total: producto.precio * producto.cantidad
                        };
                    }
                    return acc;
                }, {});

                const productosFormateados = Object.values(productosAgrupados).map(producto => ({
                    ...producto,
                    precio: producto.precio.toString(),
                    cantidad: producto.cantidad.toString(),
                    total: producto.total.toString()
                }));

                const productosJson = JSON.stringify(productosFormateados);
                const subtotal = calcularSubtotal();
                const iva = calcularIva(subtotal);
                const total = calcularTotal(subtotal, iva);
                const updatedFactura = {
                    ...factura,
                    productos: productosJson,
                    fecha_orden: formatDateForMySQL(factura.fecha_orden),
                    fechaDespacho: formatDateForMySQL(factura.fechaDespacho),
                    subtotal: subtotal,
                    iva: iva,
                    total: total
                };

                await axios.put(`http://localhost:3001/factura/${id}`, updatedFactura);
                const updatedFacturaWithEstado = { ...updatedFactura, estado_factura: 'rectificada' };
                await axios.put(`http://localhost:3001/factura/${id}`, updatedFacturaWithEstado);
                navigate('/home');
            } catch (error) {
                console.error('Error al actualizar la factura:', error.message, error.response?.data);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        let month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    if (!factura) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <div className="formulario-rectificado">
                <div className="top-title">
                    <h1 className='b'>Rectificar Factura N° {factura.numero_orden}</h1>
                    <p className='b'>En esta página puedes modificar los datos que requieras de la factura!</p>
                </div>
                <form onSubmit={handleSubmit} className='a'>
                    <table>
                        <thead>
                            <th>Número de Factura:</th>
                            <th>Fecha de Factura:</th>
                        </thead>
                        <tbody>
                            <td><input type="text" name="numero_orden" value={factura.numero_orden} onChange={handleInputChange} disabled /></td>
                            <td><input type="date" name="fecha_orden" value={formatDate(factura.fecha_orden)} onChange={handleInputChange} /></td>
                        </tbody>
                    </table>
                    <div className='top-title'>
                        <h2>Datos proveedor</h2>
                    </div>
                    <table>
                        <thead>
                            <th>Rut:</th>
                            <th>Razón social:</th>
                            <th>Dirección:</th>
                            <th>Teléfono:</th>
                            <th>Correo:</th>
                            <th>Sitio Web:</th>
                            <th>Tipo Servicio:</th>
                        </thead>
                        <tbody>
                            <td><input type="text" name="rut_proveedor" value={factura.rut_proveedor} onChange={handleInputChange} required minLength='9' maxLength='10' /></td>
                            <td><input type="text" name="razon_social_proveedor" value={factura.razon_social_proveedor} onChange={handleInputChange} required minLength="5" maxLength="45" /></td>
                            <td><input type="text" name="direccion_proveedor" value={factura.direccion_proveedor} onChange={handleInputChange} required minLength="5" maxLength="45" /></td>
                            <td><input type="number" name="telefono_proveedor" value={factura.telefono_proveedor} onChange={handleInputChange} required /></td>
                            <td><input type="text" name="correo_proveedor" value={factura.correo_proveedor} onChange={handleInputChange} required /></td>
                            <td><input type="text" name="sitio_web_proveedor" value={factura.sitio_web_proveedor} onChange={handleInputChange} /></td>
                            <td><input type="text" name="tipo_servicio" value={factura.tipo_servicio} onChange={handleInputChange} /></td>
                        </tbody>
                    </table>
                    <div className='top-title'>
                        <h2>Datos cliente</h2>
                    </div>
                    <table>
                        <thead>
                            <th>Rut:</th>
                            <th>Nombre/Razón social:</th>
                            <th>Dirección:</th>
                            <th>Teléfono:</th>
                            <th>Correo:</th>
                        </thead>
                        <tbody>
                            <td><input type="text" name="rut_cliente" value={factura.rut_cliente} onChange={handleInputChange} required minLength='9' maxLength='10' /></td>
                            <td><input type="text" name="nombre_cliente" value={factura.nombre_cliente} onChange={handleInputChange} required minLength="3" maxLength="45" /></td>
                            <td><input type="text" name="direccion_cliente" value={factura.direccion_cliente} onChange={handleInputChange} required minLength="3" maxLength="80" /></td>
                            <td><input type="text" name="telefono_cliente" value={factura.telefono_cliente} onChange={handleInputChange} required /></td>
                            <td><input type="text" name="correo_cliente" value={factura.correo_cliente} onChange={handleInputChange} required /></td>
                        </tbody>
                    </table>
                    <div className='top-title'>
                        <h2>Productos</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factura.productos.map((producto, index) => (
                                <tr key={index}>
                                    <td><input type="text" name="nombre" value={producto.nombre} onChange={(event) => handleProductChange(index, event)} /></td>
                                    <td><input type="number" name="precio" value={producto.precio} onChange={(event) => handleProductChange(index, event)} /></td>
                                    <td><input type="number" name="cantidad" value={producto.cantidad} onChange={(event) => handleProductChange(index, event)} /></td>
                                    <td><input type="number" name="total" value={Math.round(producto.total)} disabled /></td>
                                    <td><button className='botones-form' type="button" onClick={() => handleProductDelete(index)}>Eliminar Producto</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='boton-agregar' type="button" onClick={handleProductAdd}>Agregar Producto</button>

                    <div className='top-title'>
                        <h2>Datos de despacho</h2>
                    </div>
                    <table>
                        <thead>
                            <th>Región:</th>
                            <th>Comuna:</th>
                            <th>Dirección:</th>
                            <th>Fecha de entrega:</th>
                        </thead>
                        <tbody>
                            <td><input type="text" name="regionDespacho" value={factura.regionDespacho} onChange={handleInputChange} /></td>
                            <td><input type="text" name="comunaDespacho" value={factura.comunaDespacho} onChange={handleInputChange} /></td>
                            <td><input type="text" name="direccionDespacho" value={factura.direccionDespacho} onChange={handleInputChange} /></td>
                            <td><input type="date" name="fechaDespacho" value={formatDate(factura.fechaDespacho)} onChange={handleInputChange} /></td>
                        </tbody>
                    </table>
                    <div className='top-title'>
                        <h2>Valores finales</h2>
                    </div>
                    <table>
                        <thead>
                            <th>Subtotal:</th>
                            <th>Iva:</th>
                            <th>Total:</th>
                        </thead>
                        <tbody>
                            <td><input type="number" name='subtotal' value={Math.round(calcularSubtotal())} onChange={handleInputChange} disabled /></td>
                            <td><input type="number" name='iva' value={Math.round(calcularIva(calcularSubtotal()))} onChange={handleInputChange} disabled /></td>
                            <td><input type="number" name='total' value={Math.round(calcularTotal(calcularSubtotal(), calcularIva(calcularSubtotal())))} onChange={handleInputChange} disabled /></td>
                        </tbody>
                    </table>
                    <div className='btnes-modificar' >
                        <button className='botones-form-generar' type="submit">Confirmar Cambios</button>
                        <button className='botones-form-cancelar' type="button" onClick={handleCancel}>Cancelar</button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default EditarFactura;
