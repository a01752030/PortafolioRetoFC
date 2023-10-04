import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import HomePage from './HomePage';

const Dashboard = () => {
    return (
        <Router>
            <div className="dashboard">
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/page1" element={<Page1 />} />
                        <Route path="/page2" element={<Page2 />} />
                        <Route path="/page3" element={<Page3 />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default Dashboard;