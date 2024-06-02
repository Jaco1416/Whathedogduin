import React, { useState, useEffect } from 'react'
import Axios from "axios";
import './Login.css'
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [usuariosList, setUsuarios] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const getUsuarios = (event) => {
    if (event) event.preventDefault();
    Axios.get("http://localhost:3001/usuarios").then((response) => {
      setUsuarios(response.data);
    });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError('');  // Ocultar el error cuando el usuario empieza a escribir
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');  // Ocultar el error cuando el usuario empieza a escribir
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const usuario = usuariosList.find(usuario => usuario.CORREO === email && usuario.CONTRASENA === password);

    if (usuario) {
      localStorage.setItem('user', JSON.stringify(usuario));
      localStorage.setItem('loggedIn', true);
      navigate('/');

    } else {
      setError('Correo y/o contraseña incorrectos');
    }
  };

  useEffect(() => {
    getUsuarios();
    // Esto hace que la página cargue desde arriba cada vez que se monta el componente
    window.scrollTo(0, 0);
  }, []);

  return (
    <div class="login-box">
      <p>Inicio de sesión</p>
      <form onSubmit={handleLogin}>
        <div class="user-box">
          <input required="" name="" type="text" value={email} onChange={handleEmailChange}/>
            <label>Correo</label>
        </div>
        <div class="user-box">
          <input required="" name="" type="password" value={password} onChange={handlePasswordChange}/>
            <label>Contraseña</label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <a type='submit' href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Entrar
        </a>
      </form>
      <p>No tienes una cuenta? <a href="https://www.youtube.com/watch?v=S6O1PYlE5BI" target='_blank' class="a2">click aqui!</a></p>
    </div>
  )
}

export default Login
