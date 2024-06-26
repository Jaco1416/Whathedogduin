import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Facturaform from '../src/Pages/Facturaform'
import Home from '../src/Pages/Home'
import Login from '../src/Pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/Home' element={<Home/>} />
        <Route path='/Facturaform' element={<Facturaform/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
