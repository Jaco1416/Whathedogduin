import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../src/Pages/Home'
import Login from '../src/Pages/Login'
import HomeOG from './Pages/HomeOG';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/Inicio' element={<HomeOG/>} />
        <Route path='/Home' element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
