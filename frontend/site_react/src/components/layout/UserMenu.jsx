import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Crown, Settings, LogOut } from "lucide-react";

const UserMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // 🔄 Synchronisation login / logout
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("userData");
      setUserData(stored ? JSON.parse(stored) : null);
    };

    loadUser();
    window.addEventListener("user-login", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("user-login", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  /* ================= STYLES ================= */

  const styles = {
    container: {
      position: "relative",
      fontFamily: "Arial, sans-serif",
    },

    button: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },

    avatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "14px",
    },

    userName: {
      fontWeight: "600",
      fontSize: "14px",
    },

    dropdown: {
      position: "absolute",
      right: 0,
      top: "100%",
      marginTop: "8px",
      width: "200px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      padding: "8px 0",
      zIndex: 1000,
    },

    userInfo: {
      padding: "12px 16px",
      borderBottom: "1px solid #e5e7eb",
    },

    userInfoName: {
      fontWeight: "600",
      fontSize: "14px",
      marginBottom: "4px",
    },

    userInfoEmail: {
      fontSize: "12px",
      color: "#6b7280",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    menuItem: {
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      color: "#111827",
      textDecoration: "none",
      transition: "background-color 0.2s",
    },

    separator: {
      margin: "8px 0",
      border: "none",
      borderTop: "1px solid #e5e7eb",
    },

    logout: {
      width: "100%",
      padding: "10px 16px",
      border: "none",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      color: "#dc2626",
      cursor: "pointer",
    },
  };

  /* ================= HELPERS ================= */

  const getInitial = () => {
    if (!userData) return "U";
    const name =
      userData.pseudo ||
      userData.prenom ||
      userData.nom ||
      userData.email;
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (!userData) return "Utilisateur";
    if (userData.pseudo) return userData.pseudo;
    if (userData.prenom && userData.nom)
      return `${userData.prenom} ${userData.nom}`;
    return userData.email.split("@")[0];
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    if (onLogout) onLogout();

    window.dispatchEvent(new Event("user-login"));
    setIsOpen(false);
  };

  /* ================= RENDER ================= */

  if (!userData) {
    return (
      <Link to="/login" style={styles.menuItem}>
        Connexion
      </Link>
    );
  }

  return (
    <div style={styles.container}>
      <button
        style={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f3f4f6")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <div style={styles.avatar}>{getInitial()}</div>
        <span style={styles.userName}>{getDisplayName()}</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.userInfo}>
            <div style={styles.userInfoName}>{getDisplayName()}</div>
            <div style={styles.userInfoEmail}>{userData.email}</div>
          </div>

          <Link to="/profile" style={styles.menuItem} onClick={() => setIsOpen(false)}>
            <User size={16} /> Mon profil
          </Link>

          <Link to="/abonnement" style={styles.menuItem} onClick={() => setIsOpen(false)}>
            <Crown size={16} /> Abonnement
          </Link>

          <Link to="/parametres" style={styles.menuItem} onClick={() => setIsOpen(false)}>
            <Settings size={16} /> Paramètres
          </Link>

          <hr style={styles.separator} />

          <button style={styles.logout} onClick={handleLogout}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
