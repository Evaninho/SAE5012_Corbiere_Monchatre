import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import logoImage from "../image/LOGO_OFFI.png";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
      height: "80px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    navbarLeft: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      zIndex: 1001,
    },
    logo: {
      height: "60px",
      width: "auto",
    },
    siteName: {
      fontWeight: "bold",
      fontSize: "1.2rem",
      color: "#0085C7",
    },
    navbarCenter: {
      display: "flex",
      gap: "40px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    navbarRight: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    burgerButton: {
      display: "none", // Caché par défaut
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      transition: "background-color 0.2s",
    },
    mobileMenu: {
      position: "fixed",
      top: "80px",
      left: 0,
      right: 0,
      backgroundColor: "#fff",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      padding: "20px",
      display: isMenuOpen ? "flex" : "none",
      flexDirection: "column",
      gap: "15px",
      zIndex: 999,
      maxHeight: "calc(100vh - 80px)",
      overflowY: "auto",
    },
    overlay: {
      position: "fixed",
      top: "80px",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: isMenuOpen ? "block" : "none",
      zIndex: 998,
    },
  };

  const navLink = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "#0085C7" : "#000",
    fontWeight: isActive ? 600 : 500,
    fontSize: "16px",
    padding: "8px 12px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#f0f9ff" : "transparent",
    transition: "all 0.2s",
  });

  const mobileNavLink = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "#0085C7" : "#000",
    fontWeight: isActive ? 600 : 500,
    fontSize: "18px",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: isActive ? "#f0f9ff" : "transparent",
    transition: "all 0.2s",
    display: "block",
  });

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/statistiques", label: "Statistiques" },
    { to: "/actualites", label: "Actualités" },
    { to: "/contact", label: "Contact" },
    { to: "/jeux", label: "Jeux" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .navbar-center {
            display: none !important;
          }
          .burger-button {
            display: flex !important;
          }
          .desktop-auth {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
          .mobile-overlay {
            display: none !important;
          }
        }
      `}</style>

      <nav style={styles.navbar}>
        <div style={styles.navbarLeft}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src={logoImage} alt="OlymPeak" style={styles.logo} />
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={styles.siteName}>OlymPeak</span>
          </Link>
        </div>

        <div className="navbar-center" style={styles.navbarCenter}>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} style={navLink(isActive(link.to))}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={styles.navbarRight}>
          <div className="desktop-auth">
            {isLoggedIn ? (
              <UserMenu onLogout={() => setIsLoggedIn(false)} />
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  border: 'solid 2px #009F3D',
                  color: 'black',
                  borderRadius: '45px',
                  fontWeight: '600'
                }}
              >
                se connecter
              </Link>
            )}
          </div>

          <button 
            className="burger-button"
            style={styles.burgerButton} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <div className="mobile-overlay" style={styles.overlay} onClick={() => setIsMenuOpen(false)} />

      <div className="mobile-menu" style={styles.mobileMenu}>
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} style={mobileNavLink(isActive(link.to))}>
            {link.label}
          </Link>
        ))}

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0" }} />

        <div>
          {isLoggedIn ? (
            <UserMenu isMobile={true} onLogout={() => setIsLoggedIn(false)} />
          ) : (
            <Link
              to="/login"
              style={{
                display: 'block',
                padding: '12px 16px',
                backgroundColor: '#0085C7',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                textAlign: 'center'
              }}
            >
              👤 Se connecter
            </Link>
          )}
        </div>
      </div>
    </>
  );
}