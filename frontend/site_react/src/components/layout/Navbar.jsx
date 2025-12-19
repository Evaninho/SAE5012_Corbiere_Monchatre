import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { UserMenu } from "./UserMenu";
// import { LangueSelect } from "./LangueSelect";
import logoImage from "../image/LOGO_OFFI.png";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navbar = {
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
  };

  const navbarLeft = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 1001,
  };

  const logo = {
    height: "60px",
    width: "auto",
  };

  const siteName = {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#0085C7",
  };

  const navbarCenter = {
    display: isMobile ? "none" : "flex",
    gap: "40px",
    listStyle: "none",
    margin: 0,
    padding: 0,
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

  const navbarRight = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const burgerButton = {
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    transition: "background-color 0.2s",
  };

  const mobileMenu = {
    position: "fixed",
    top: "80px",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    padding: "20px",
    display: isMenuOpen && isMobile ? "flex" : "none",
    flexDirection: "column",
    gap: "15px",
    zIndex: 999,
    maxHeight: "calc(100vh - 80px)",
    overflowY: "auto",
  };

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

  const overlay = {
    position: "fixed",
    top: "80px",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: isMenuOpen && isMobile ? "block" : "none",
    zIndex: 998,
  };

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
      <nav style={navbar}>
        <div style={navbarLeft}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src={logoImage} alt="OlymPeak" style={logo} />
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={siteName}>OlymPeak</span>
          </Link>
        </div>

        <div style={navbarCenter}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={navLink(isActive(link.to))}
              onMouseEnter={(e) => {
                if (!isActive(link.to)) {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.to)) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={navbarRight}>
          <div style={{ display: isMobile && isMenuOpen ? "none" : "block" }}>
            <UserMenu />
          </div>

          <button
            style={burgerButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {isMenuOpen ? <X size={28} color="#000" /> : <Menu size={28} color="#000" />}
          </button>
        </div>
      </nav>

      <div
        style={overlay}
        onClick={() => setIsMenuOpen(false)}
      />

      <div style={mobileMenu}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={mobileNavLink(isActive(link.to))}
            onMouseEnter={(e) => {
              if (!isActive(link.to)) {
                e.currentTarget.style.backgroundColor = "#f3f4f6";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(link.to)) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {link.label}
          </Link>
        ))}

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "10px 0" }} />

        <div>
          <UserMenu isMobile={true} />
        </div>

        {/* <LangueSelect /> */}
      </div>
    </>
  );
}