import React, { useState } from "react";

/* ================= COULEURS GLOBALES ================= */

const colors = {
  blue: "#0085C7",
  green: "#009F3D",
  grayBg: "#f5f5f5",
  grayBorder: "#e5e7eb",
  grayText: "#6b7280",
  danger: "#dc2626",
};

/* ================= PAGE ================= */

const SettingsPage = () => {
  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Paramètres</h1>
          <p style={subtitleStyle}>
            Gérez vos préférences, votre confidentialité et votre compte
          </p>
        </div>

        {/* Sections */}
        <div style={sectionsWrapper}>
          <SettingsCard title="Préférences de notification">
            <SettingToggle label="Notifications par email" />
            <SettingToggle label="Actualités importantes" />
            <SettingToggle label="Nouveaux commentaires" />
            <SettingToggle label="Résultats des jeux" />
          </SettingsCard>

          <SettingsCard title="Confidentialité">
            <SettingToggle label="Profil public" />
            <SettingToggle label="Afficher mes statistiques" />
            <SettingToggle label="Autoriser les messages privés" />
          </SettingsCard>

          <SettingsCard title="Compte">
            <button style={primaryButton}>
              Changer le mot de passe
            </button>

            <button style={dangerButton}>
              Supprimer mon compte
            </button>
          </SettingsCard>
        </div>
      </div>
    </main>
  );
};

/* ================= COMPOSANTS ================= */

const SettingsCard = ({ title, children }) => (
  <section style={cardStyle}>
    <h3 style={cardTitle}>{title}</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {children}
    </div>
  </section>
);

const SettingToggle = ({ label }) => {
  const [enabled, setEnabled] = useState(true);

  return (
    <div style={toggleRow}>
      <span>{label}</span>

      <button
        onClick={() => setEnabled(!enabled)}
        style={{
          ...toggleButton,
          backgroundColor: enabled ? colors.green : "#d1d5db",
        }}
      >
        <div
          style={{
            ...toggleKnob,
            transform: enabled ? "translateX(24px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
};

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "calc(100vh - 80px)",
  backgroundColor: colors.grayBg,
  padding: "40px 20px",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
};

const headerStyle = {
  background: "linear-gradient(135deg, #0085C7 0%, #009F3D 100%)",
  borderRadius: "15px",
  padding: "40px",
  marginBottom: "30px",
  color: "white",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const subtitleStyle = {
  fontSize: "14px",
  opacity: 0.9,
};

const sectionsWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "15px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const cardTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "16px",
};

const toggleRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const toggleButton = {
  width: "52px",
  height: "26px",
  borderRadius: "999px",
  border: "none",
  cursor: "pointer",
  padding: "3px",
  transition: "background-color 0.2s",
};

const toggleKnob = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "white",
  transition: "transform 0.2s",
};

const primaryButton = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: `2px solid ${colors.blue}`,
  backgroundColor: "transparent",
  color: colors.blue,
  fontWeight: "600",
  cursor: "pointer",
};

const dangerButton = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: `2px solid ${colors.danger}`,
  backgroundColor: "transparent",
  color: colors.danger,
  fontWeight: "600",
  cursor: "pointer",
};

export default SettingsPage;
