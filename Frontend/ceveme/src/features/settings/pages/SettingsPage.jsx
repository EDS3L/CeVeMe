import React from 'react';
import UserDetails from '../components/UserDetails';
import Navbar from '../../../components/Navbar';

function SettingsPage() {
  return (
    <div className="relative">
      <Navbar showShadow={false} />
      <UserDetails />
    </div>
  );
}

export default SettingsPage;
