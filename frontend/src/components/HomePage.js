import React from 'react';
import { FaGithub, FaFilePdf, FaYoutube } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div>
      <h1>Bienvenido al dashboard para seguir la participación y asistencia de estudiantes</h1>
      <p>En esta aplicación web se podrá no solo registrar estudiantes para que se les pueda contar asistencia en la clase, sino también
        llevar un control de sus participaciones, todo de manera práctica y con una interfaz amigable. Perfecta para que los alumnos puedan 
        mantener control de su vida escolar y para que los profesores entiendan mejor a sus estudiantes. 
        Abajo, al dar click en los iconos puede ver el repositorio de este código, descargar el reporte final y ver un video demostración.
        Este trabajo fue realizado por:</p>

      <ul>
        <li>Juan Pablo Castañeda Serrano A01752030</li>
        <li>Aldo Daniel Villaseñor Fierro A01637907</li>
        <li>José Alfredo García Rodriguez A00830952</li>
        <li>Francisco Castorena Salazar A00827756</li>
      </ul>

      <p>Para la materia "Inteligencia artificial avanzada para la ciencia de datos" en el grupo 301. Entregado el 28/11/2023.
        Bajo el programa del Instituto Tecnológico y de Estudios Superiores de Monterrey.</p>

      {/* GitHub Link */}
        <a href="https://github.com/a01752030/PortafolioRetoFC" target="_blank" rel="noopener noreferrer">
          <FaGithub size={40} />
        </a>


      {/* PDF Download Link */}

        <a href="https://drive.google.com/file/d/1JlEhoS9AvkDQr_6c-ksorPZ_CFDErZ6K/view?usp=sharing" target="_blank" rel="noopener noreferrer">
          <FaFilePdf size={40} />
        </a>


      {/* Video Tutorial Link */}

        <a href="https://youtu.be/QAmuV5ITtFY" target="_blank" rel="noopener noreferrer">
          <FaYoutube size={40} />
        </a>
    </div>
  );
};

export default HomePage;