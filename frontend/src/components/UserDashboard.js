import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Page1 from './Page1';
import Page2 from './Page2';
import HomePage from './HomePage';


const UserDashboard = () => {
    return (
        <Router>
            <div className="dashboard">
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/page1" element={<Page1 />} />
                        <Route path="/page2" element={<Page2 />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default UserDashboard;