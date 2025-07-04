import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function HomeLayout() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [navOpen, setNavOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setNavOpen(width > 1024);
    };
    
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(document.body);
    window.addEventListener('resize', handleResize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      position: "relative"
    }}>
      <Navbar 
        navOpen={navOpen} 
        setNavOpen={setNavOpen} 
        windowWidth={windowWidth} 
      />
      
      <div style={{
        flex: 1,
        paddingLeft: navOpen && windowWidth > 1024 ? '220px' : '0',
        transition: 'padding-left 0.3s ease',
        width: '100%',
        overflowX: 'hidden'
      }}>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </div>
      
      {/* Overlay for mobile */}
      {navOpen && windowWidth <= 1024 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999,
          transition: 'opacity 0.3s ease'
        }} />
      )}
    </div>
  );
}