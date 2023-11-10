import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import HomePage from './HomePage';
import AccesoDenegado from './AccesoDenegado';
import VideoCapture from './VideoCapture';

const Dashboard = ({ userComponent }) => {
  // Check the userComponent prop and render the appropriate content
  const renderContent = () => {
    if (userComponent === 'FirstComponent') {
      return (
        <div className="dashboard">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<VideoCapture />} />
        </Routes>
        </div>
      );
    

    } else if (userComponent === 'SecondComponent') {
      return (
        <div className="dashboard">
        <Sidebar />
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<AccesoDenegado />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<VideoCapture />} />
        </Routes>
        </div>

      );
    } else if (userComponent === 'ThirdComponent') {
      // Default case when userComponent doesn't match the first two
      return (
        <div className="dashboard">
        <Sidebar />
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<AccesoDenegado />} />
        </Routes>
        </div>
      );
    }
    else{

        return <div>Contraseña o usuario no valido</div>;

    }
  };

  return (
    <Router>
      <div className="dashboard">
        <div className="content">{renderContent()}</div>
      </div>
    </Router>
  );
};

export default Dashboard;