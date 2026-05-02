import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/patients', name: 'Patients' },
    { path: '/appointments', name: 'Appointments' },
    { path: '/billing', name: 'Billing' },
    { path: '/pharmacy', name: 'Pharmacy' },
    { path: '/lab', name: 'Lab Reports' }
  ];
  
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🏥 CareFlow</h2>
      <div style={styles.navLinks}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navLink,
              ...(location.pathname === item.path ? styles.active : {})
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#2c3e50',
    color: 'white',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  logo: {
    margin: 0
  },
  navLinks: {
    display: 'flex',
    gap: '20px'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'background 0.3s'
  },
  active: {
    backgroundColor: '#667eea'
  }
};

export default Navbar;