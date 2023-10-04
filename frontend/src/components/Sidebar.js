import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Link to="/page1"><button>Estadísticas</button></Link>
            <Link to="/page2"><button>Alumno nuevo</button></Link>
            <Link to="/page3"><button>Participaciones</button></Link>
        </div>
    );
};

export default Sidebar;
