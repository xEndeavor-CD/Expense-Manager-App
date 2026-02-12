import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaThLarge, 
  FaPlusCircle, 
  FaList, 
  FaChartBar, 
  FaCog 
} from 'react-icons/fa';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: <FaThLarge />, label: 'Dashboard' },
    { path: '/add-expense', icon: <FaPlusCircle />, label: 'Add Expense' },
    { path: '/expense-list', icon: <FaList />, label: 'Expense List' },
    { path: '/reports', icon: <FaChartBar />, label: 'Reports' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>Expense Manager</h1>
        <p>Track your daily expenses</p>
      </div>

      <nav className="nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="help-section">
        <p>Need help getting started?</p>
        <a href="#guide">View Guide →</a>
      </div>
    </aside>
  );
};

export default Sidebar;