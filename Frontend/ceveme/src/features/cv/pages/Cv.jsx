import React from 'react';
import Sidebar from '../components/Sidebar';
import CvEditor from '../components/CvEditor';
import Navbar from '../../../components/Navbar';

function Cv() {
  return (
    <div className="bg-ivorylight min-h-screen flex font-sans">
      <Navbar />
      <Sidebar />
      <CvEditor />
    </div>
  );
}

export default Cv;
