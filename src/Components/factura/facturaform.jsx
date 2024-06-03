import './factura.css'
// facturaform.jsx
import React, { useState } from 'react';

const FacturaForm = () => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [data, setData] = useState([]);
    const [cant, setCant] = useState(0);

    const agregar = () => {
        const precioNum = parseFloat(precio);
        const cantidadNum = parseFloat(cantidad);
        const total = precioNum * cantidadNum;

        const newItem = {
            id: cant,
            nombre,
            precio: precioNum,
            cantidad: cantidadNum,
            total
        };

        setData([...data, newItem]);
        setNombre('');
        setPrecio('');
        setCantidad('');
        setCant(cant + 1);
        console.log(data);
    };

    const eliminar = (id) => {
        setData(data.filter(item => item.id !== id));
    };

    return (
        <div>
            <input
                id="nombre"
                type="text"
                value={nombre}
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
