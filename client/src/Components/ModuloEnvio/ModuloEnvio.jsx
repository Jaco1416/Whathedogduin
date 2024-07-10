import React, { useEffect, useState } from 'react'
import './ModuloEnvio.css'
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import camion from '../../Components/Assets/camion.png'
import box from '../../Components/Assets/box.png'
import check from '../../Components/Assets/check.png'
import rechazo from '../../Components/Assets/Rechazo.png'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ModuloEnvio = () => {

    const { id } = useParams();
    const obtenerFechaActualFormateada = () => {
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = (`0${fechaActual.getMonth() + 1}`).slice(-2); // Asegura el formato de dos dígitos
        const dia = (`0${fechaActual.getDate()}`).slice(-2); // Asegura el formato de dos dígitos
        return `${año}-${mes}-${dia}`;
    };

    const [fechaOrden, setFechaOrden] = useState(obtenerFechaActualFormateada());
    const [factura, setFactura] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [direccionReceptor, setDireccionReceptor] = useState('');
    const [rutReceptor, setRutReceptor] = useState('');

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenModal2 = () => setIsModalOpen2(true);
    const handleCloseModal2 = () => setIsModalOpen2(false);
    const handleRejectionReasonChange = (e) => setRejectionReason(e.target.value);
    const handleDireccionReceptor = (e) => setDireccionReceptor(e.target.value);
    const handleRutReceptor = (e) => setRutReceptor(e.target.value);
    const handleSaveRejectionReason = () => {
        console.log(rejectionReason); // Aquí puedes hacer algo con el motivo del rechazo, como enviarlo a un servidor
        handleCloseModal();
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, rechazar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleRechazo();
                Swal.fire(
                    'Rechazado!',
                    'El envio ha sido rechazado.',
                    'success'
                )
            }
        });
    };
    const handleSaveDataEnvio = () => {
        console.log(rejectionReason); // Aquí puedes hacer algo con el motivo del rechazo, como enviarlo a un servidor
        handleCloseModal();
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, aceptar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                handleSaveData();
                Swal.fire(
                    'Aceptado!',
                    'El envio ha sido aceptado.',
                    'success'
                )
            }
        });
    };


    const navigate = useNavigate();

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


    const enviarRechazo = async (rechazoData) => {
        try {
            const response = await axios.post('http://localhost:3001/rechazos', rechazoData);
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



    const handleRechazo = async event => {


        const rechazoData = {
            numero_orden: factura.numero_orden,
            fecha_rechazo: fechaOrden,
            motivo: rejectionReason
        };
        const estado = { estado_entrega: 'rechazado' };
        const razon = { motivo_rechazo: rejectionReason };
        await axios.put(`http://localhost:3001/factura/${id}`, estado);
        await axios.put(`http://localhost:3001/factura/${id}`, razon);
        console.log(estado);

        const numero_orden = await enviarRechazo(rechazoData);
    };

    const handleSaveData = async event => {
        const envioData = {
            direccion_entrega: direccionReceptor,
            rut_receptor: rutReceptor
        };
        const estado = { estado_entrega: 'aceptado' };
        await axios.put(`http://localhost:3001/factura/${id}`, envioData);
        await axios.put(`http://localhost:3001/factura/${id}`, estado);
    };

    return (
        <div>
            <div className="title">
                <h1>Detalles de la Factura</h1>
            </div>

            <div className='estado'>
                {factura.estado_entrega === 'por entregar' && <img className='img-estado' src={box} alt="Por entregar" />}
                {factura.estado_entrega === 'aceptado' && <img className='img-estado' src={check} alt="aceptado" />}
                {factura.estado_entrega === 'rechazado' && <img className='img-estado' src={rechazo} alt="rechazado" />}
            </div>
            <div className='estado'>
                {factura.estado_entrega === 'por entregar' && <h1>Por entregar</h1>}
                {factura.estado_entrega === 'aceptado' && <h1>Aceptado</h1>}
                {factura.estado_entrega === 'rechazado' && <h1>Rechazado</h1>}
            </div>
            <div className="detalles-envio">
                <table className='tabla-datos'>
                    <tbody>
                        <tr >
                            <th className='items-tabla'>Número de Factura:</th>
                            <td className='items-tabla-bd'>{factura.numero_orden}</td>
                        </tr>
                        <tr>
                            <th className='items-tabla'>Fecha de Factura:</th>
                            <td className='items-tabla-bd'>{new Date(factura.fecha_orden).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <th className='items-tabla'>Estado de la entrega:</th>
                            <td className='items-tabla-bd'>{factura.estado_entrega}</td>
                        </tr>
                    </tbody>
                </table>
                {
                    factura.estado_entrega !== 'aceptado' && (
                        <div className="botones">
                            <button className='btn-aceptar' onClick={handleOpenModal2}>Aceptar</button>
                            <button className='btn-rechazar' onClick={handleOpenModal}>Rechazar</button>
                        </div>
                    )
                }
                {isModalOpen && (
                    <div className="modal">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <div className="modal-content">
                            <div className='modal-title'>
                                <p>Ingrese el motivo del rechazo:</p>
                            </div>
                            <div className="modal-input">
                                <textarea value={rejectionReason} onChange={handleRejectionReasonChange} style={{ resize: 'none', width: '300px', height: '100px' }}></textarea>
                            </div>
                            <div className="modal-footer">
                                <button onClick={handleSaveRejectionReason} className='btn-aceptar' style={{ margin: '10px' }}>Guardar</button>
                            </div>
                        </div>
                    </div>
                )}
                {isModalOpen2 && (
                    <div className="modal">
                        <span className="close" onClick={handleCloseModal2}>&times;</span>
                        <div className="modal-content">
                            <div className='modal-title'>
                                <p>Ingrese datos de envio:</p>
                            </div>
                            <div className="modal-input-2">
                                <p>Direccion</p>
                                <input type="text" value={direccionReceptor} name='direccion_entrega' onChange={handleDireccionReceptor} placeholder='Ingresar direccion' required />
                                <p>Rut</p>
                                <input type="text" value={rutReceptor} name='rut_receptor' onChange={handleRutReceptor} placeholder='ejemp: 21564842-7' required />
                            </div>
                            <div className="modal-footer">
                                <button onClick={handleSaveDataEnvio} className='btn-aceptar' style={{ margin: '10px' }}>Guardar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModuloEnvio
