import React, { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('empresa');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  const signin = async (Usuario, password) => {
    // Aquí es donde autenticarías al usuario
    if (Usuario === 'usuarioValido' && password === 'contraseñaValida') {
      const user = { Usuario };
      setUser(user);
      localStorage.setItem('empresa', JSON.stringify(user));
      return user;
    } else {
      alert('Invalid credentials');
      return null;
    }
  };

  const signout = cb => {
    setUser(null);
    localStorage.removeItem('empresa');
    navigate("/");
    cb();
  };

  return {
    user,
    signin,
    signout,
  };
}