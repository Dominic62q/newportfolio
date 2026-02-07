import React, { useState, useEffect } from 'react';

const menuItems = ['Home', 'About', 'Projects', 'Experience', 'Certificates', 'Contact'];

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => item.toLowerCase());
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const offsetTop = section.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, item) => {
    e.preventDefault();
    const sectionId = item.toLowerCase();
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Offset for fixed header
      const elementPosition = section.offsetTop;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="profile-avatar-wrap">
          <img src="/my-photo.jpg" alt="Profile" className="profile-avatar" />
        </div>
        <h2 className="profile-name">Dominic Amuah</h2>
        <p className="profile-status">Available for work</p>
      </div>

      <nav className="menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleClick(e, item)}
                className={`menu-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
