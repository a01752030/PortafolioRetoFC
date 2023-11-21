// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/sidebar.module.css';

const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <Link to="/">
        <button className={styles.sidebarButton}>
          <FontAwesomeIcon icon={faHome} /> {/* Use the home icon here */}
        </button>
      </Link>
      <Link to="/page1">
        <button className={styles.sidebarButton}>Estadísticas</button>
      </Link>
      <Link to="/page2">
        <button className={styles.sidebarButton}>Alumno nuevo</button>
      </Link>
      <Link to="/page3">
        <button className={styles.sidebarButton}>Graficas</button>
      </Link>
      <Link to="/page4">
        <button className={styles.sidebarButton}>Subir Video</button>
      </Link>
    </div>
  );
};

export default Sidebar;