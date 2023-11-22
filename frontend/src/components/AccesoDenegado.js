// AccesoDenegado.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/AcessoDenegado.module.css';

const AccesoDenegado = () => {
    return (
        <div className={styles.accesoDenegadoContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={styles.icon} />
            <p className={styles.message}>Acceso Denegado</p>
            <p>Favor de entrar como el usuario pertinente de esta pagina</p>
        </div>
    );
};

export default AccesoDenegado;