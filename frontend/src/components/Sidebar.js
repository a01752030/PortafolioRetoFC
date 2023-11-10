import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Link to="/page1"><button>Estadísticas</button></Link>
            <Link to="/page2"><button>Alumno nuevo</button></Link>
            <Link to="/page3"><button>Graficas</button></Link>
            <Link to="/page4"><button>Subir Video</button></Link>
        </div>
    );
};

export default Sidebar;
