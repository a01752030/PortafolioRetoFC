// App.js

import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
//import './App.css';

function App() {
  const [userComponent, setUserComponent] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('https://1f9e-201-162-233-114.ngrok.io/login', {
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