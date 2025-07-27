import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="logo">Placement Tracker</div>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          Company Tracker
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
          My Profile
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
