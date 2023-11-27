// App.js

import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  useEffect(() => {
    document.title = 'Asistencia y participacion';
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = './resources/logo_icon.png';
    document.head.appendChild(link);
  }, []);

  const [userComponent, setUserComponent] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('https://9cfb-201-162-161-213.ngrok.io/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Assume the backend returns a component name based on the user
      setUserComponent(data.component);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="App">
      {userComponent === null ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard userComponent={userComponent} />
      )}
    </div>
  );
}

export default App;