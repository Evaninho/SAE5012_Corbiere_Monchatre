import React, { useState } from 'react';
import { ResetPasswordModal } from '../commun/PasswordResetModal';
import { Lock, Bell, Shield, Trash2 } from 'lucide-react';

export function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '40px'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '25px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#333'
    },
    settingItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 0',
      borderBottom: '1px solid #f3f4f6'
    },
    settingLabel: {
      fontSize: '15px',
      color: '#555',
      fontWeight: '500'
    },
    button: {
      padding: '10px 20px',
      border: '2px solid #0085C7',
      backgroundColor: 'transparent',
      color: '#0085C7',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    dangerButton: {
      padding: '10px 20px',
      border: '2px solid #dc2626',
      backgroundColor: 'transparent',
      color: '#dc2626',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    toggle: {
      width: '50px',
      height: '26px',
      backgroundColor: '#10b981',
      borderRadius: '13px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    toggleBall: {
      width: '22px',
      height: '22px',
      backgroundColor: 'white',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      right: '2px',
      transition: 'transform 0.2s'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.title}>Paramètres</h1>

        {/* Section Notifications */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Bell size={24} />
            Notifications
          </h2>
          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Notifications par email</span>
            <div style={styles.toggle}>
              <div style={styles.toggleBall}></div>
            </div>
          </div>
          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Actualités importantes</span>
            <div style={styles.toggle}>
              <div style={styles.toggleBall}></div>
            </div>
          </div>
          <div style={{...styles.settingItem, borderBottom: 'none'}}>
            <span style={styles.settingLabel}>Nouveaux commentaires</span>
            <div style={styles.toggle}>
              <div style={styles.toggleBall}></div>
            </div>
          </div>
        </div>

        {/* Section Sécurité */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Shield size={24} />
            Sécurité
          </h2>
          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Profil public</span>
            <div style={styles.toggle}>
              <div style={styles.toggleBall}></div>
            </div>
          </div>
          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Afficher mes statistiques</span>
            <div style={styles.toggle}>
              <div style={styles.toggleBall}></div>
            </div>
          </div>
          <div style={{...styles.settingItem, borderBottom: 'none'}}>
            <span style={styles.settingLabel}>Autoriser les messages privés</span>
            <div style={styles.toggle}>
              <div style={styles.toggleBall}></div>
            </div>
          </div>
        </div>

        {/* Section Compte */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Lock size={24} />
            Compte
          </h2>
          
          {/* Bouton Changer le mot de passe */}
          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Mot de passe</span>
            <button
              style={styles.button}
              onClick={() => setShowPasswordModal(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0085C7';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0085C7';
              }}
            >
              Changer le mot de passe
            </button>
          </div>

          <div style={{...styles.settingItem, borderBottom: 'none'}}>
            <span style={styles.settingLabel}>Supprimer mon compte</span>
            <button
              style={styles.dangerButton}
              onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
                  // Logique de suppression
                  console.log('Suppression du compte');
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#dc2626';
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Modal de changement de mot de passe */}
      <ResetPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        mode="change"
      />
    </div>
  );
}