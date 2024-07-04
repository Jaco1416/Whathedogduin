import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../src/Pages/Home'
import Login from '../src/Pages/Login'
import Detalle_factura from '../src/Pages/Detalle_factura'
import HomeOG from './Pages/HomeOG';
import Rectificado from './Pages/Rectificado';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/Inicio' element={<HomeOG/>} />
        <Route path='/Home' element={<Home/>} />
        <Route path='/detalle/:id' element={<Detalle_factura/>} />
        <Route path='/rect/:id' element={<Rectificado/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
