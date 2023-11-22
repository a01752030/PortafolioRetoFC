// Dashboard.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import HomePage from './HomePage';
import AccesoDenegado from './AccesoDenegado';
import VideoCapture from './VideoCapture';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/dashboard.module.css';

const Dashboard = ({ userComponent }) => {
  // Check the userComponent prop and render the appropriate content
  const renderContent = () => {
    if (userComponent === 'FirstComponent') {
      return (
        <div className={styles.dashboardContainer}>
          <Sidebar />
          <div className={styles.dashboardContent}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/page1" element={<Page1 />} />
              <Route path="/page2" element={<Page2 />} />
              <Route path="/page3" element={<Page3 />} />
              <Route path="/page4" element={<VideoCapture />} />
            </Routes>
          </div>
        </div>
      );
    } else if (userComponent === 'SecondComponent') {
      return (
        <div className={styles.dashboardContainer}>
          <Sidebar />
          <div className={styles.dashboardContent}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/page1" element={<Page1 />} />
              <Route path="/page2" element={<AccesoDenegado />} />
              <Route path="/page3" element={<Page3 />} />
              <Route path="/page4" element={<VideoCapture />} />
            </Routes>
          </div>
        </div>
      );
    } else if (userComponent === 'ThirdComponent') {
      return (
        <div className={styles.dashboardContainer}>
          <Sidebar />
          <div className={styles.dashboardContent}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/page1" element={<Page1 />} />
              <Route path="/page2" element={<Page2 />} />
              <Route path="/page3" element={<Page3 />} />
              <Route path="/page4" element={<AccesoDenegado />} />
            </Routes>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.accesoDenegadoContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} />
            <p className={styles.message}>Acceso Denegado</p>
            <p>Contraseña o correo incorrecto. Favor de recargar la pagina para tratar otra vez</p>
        </div>
    );
    }
  };

  return (
    <Router>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardContent}>{renderContent()}</div>
      </div>
    </Router>
  );
};

export default Dashboard;