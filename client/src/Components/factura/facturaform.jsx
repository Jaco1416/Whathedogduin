import './factura.css'
// facturaform.jsx
import React, { useState } from 'react';

const FacturaForm = () => {
    const [nombre_p, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [data, setData] = useState([]);
    const [cant, setCant] = useState(1);
    const [cant2, setCant2] = useState(1);

    const [nombre1, setNombre1] = useState('');
    const [cuit1, setCuit1] = useState('');
    const [direccion1, setDireccion1] = useState('');
    const [telefono1, setTelefono1] = useState('');
    const [correo1, setCorreo1] = useState('');

    const [nombre2, setNombre2] = useState('');
    const [cuit2, setCuit2] = useState('');
    const [direccion2, setDireccion2] = useState('');
    const [telefono2, setTelefono2] = useState('');
    const [correo2, setCorreo2] = useState('');
    const [datos, setDatos] = useState([]);
    

    const agregar = () => {
        const precioNum = parseFloat(precio);
        const cantidadNum = parseFloat(cantidad);
        const total = precioNum * cantidadNum;

        const newItem = {
            id: cant2,
            nombre_p,
            precio: precioNum,
            cantidad: cantidadNum,
            total
        };

        setData([...data, newItem]);
        setNombre('');
        setPrecio('');
        setCantidad('');
        setCant2(cant2 + 1);
        console.log(data);
    };

    const eliminar = (id) => {
        setData(data.filter(item => item.id !== id));
    };


    const agregarPersonas = () => {
        const newItem1 = {
            id: cant,
            nombre: nombre1,
            cuit: cuit1,
            direccion: direccion1,
            telefono: telefono1,
            correo: correo1
        };

        const newItem2 = {
            id: cant + 1,
            nombre: nombre2,
            cuit: cuit2,
            direccion: direccion2,
            telefono: telefono2,
            correo: correo2
        };

        setDatos([...datos, newItem1, newItem2]);
        setNombre1('');
        setCuit1('');
        setDireccion1('');
        setTelefono1('');
        setCorreo1('');
        setNombre2('');
        setCuit2('');
        setDireccion2('');
        setTelefono2('');
        setCorreo2('');
        setCant(cant + 2);
        console.log(datos);
    };

    const eliminarPersonas = (id) => {
        setDatos(datos.filter(item => item.id !== id));
    };



return (
    <div>
        <div>
            <input
                id="nombre1"
                type="text"
                placeholder="Nombre o Razón social"
                value={nombre1}
                onChange={(e) => setNombre1(e.target.value)}
            />
            <input
                id="cuit1"
                type="text"
                placeholder="CUIT"
                value={cuit1}
                onChange={(e) => setCuit1(e.target.value)}
            />
            <input
                id="direccion1"
                type="text"
                placeholder="Dirección"
                value={direccion1}
                onChange={(e) => setDireccion1(e.target.value)}
            />
            <input
                id="telefono1"
                type="text"
                placeholder="Teléfono"
                value={telefono1}
                onChange={(e) => setTelefono1(e.target.value)}
            />
            <input
                id="correo1"
                type="email"
                placeholder="Correo electrónico"
                value={correo1}
                onChange={(e) => setCorreo1(e.target.value)}
            />
            <input
                id="nombre2"
                type="text"
                placeholder="Nombre o Razón social"
                value={nombre2}
                onChange={(e) => setNombre2(e.target.value)}
            />
            <input
                id="cuit2"
                type="text"
                placeholder="CUIT"
                value={cuit2}
                onChange={(e) => setCuit2(e.target.value)}
            />
            <input
                id="direccion2"
                type="text"
                placeholder="Dirección"
                value={direccion2}
                onChange={(e) => setDireccion2(e.target.value)}
            />
            <input
                id="telefono2"
                type="text"
                placeholder="Teléfono"
                value={telefono2}
                onChange={(e) => setTelefono2(e.target.value)}
            />
            <input
                id="correo2"
                type="email"
                placeholder="Correo electrónico"
                value={correo2}
                onChange={(e) => setCorreo2(e.target.value)}
            />
            <button onClick={agregarPersonas}>Agregar</button>
        </div>

        <input
            id="nombre"
            type="text"
            value={nombre_p}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
        />
        <input
            id="precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio"
        />
        <input
            id="cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Cantidad"
        />
        <button id="agregar" onClick={agregar}>Agregar</button>
        <button id="guardar" onClick={() => console.log('Data saved:', data)}>Guardar</button>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="lista">
                {data.map(item => (
                    <tr key={item.id}>
                        <td>{item.nombre}</td>
                        <td>{item.precio}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.total}</td>
                        <td>
                            <button onClick={() => eliminar(item.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
};

export default FacturaForm;
