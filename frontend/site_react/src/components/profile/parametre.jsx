import React, { useState } from 'react';
import { ResetPasswordModal } from '../commun/PasswordResetModal';
import { Lock, Bell, Shield } from 'lucide-react';

export function SettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  //  états des toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [importantNews, setImportantNews] = useState(false);
  const [commentsNotif, setCommentsNotif] = useState(true);

  const [publicProfile, setPublicProfile] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [privateMessages, setPrivateMessages] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);


  const API_BASE_URL = 'http://localhost:8000/api';
  const userID = localStorage.getItem('userID')
  const getToken = () => localStorage.getItem('authToken');


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
      gap: '10px'
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
    toggle: (active) => ({
      width: '50px',
      height: '26px',
      backgroundColor: active ? '#10b981' : '#e5e7eb',
      borderRadius: '13px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background-color 0.25s ease'
    }),
    toggleBall: (active) => ({
      width: '22px',
      height: '22px',
      backgroundColor: 'white',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: '2px',
      transform: active ? 'translateX(24px)' : 'translateX(0)',
      transition: 'transform 0.25s ease'
    }),
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
    }
  };
  const handleSupprimerCompte = async () => {
    const confirmDelete = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );

    if (!confirmDelete) return;

    console.log('début de la supression');
    

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${getToken()}`
        }
      });
      console.log('requete passe');
      

      if (!response.ok) {
        const error = await response.json();
        console.error("Erreur API:", error);
        throw new Error(error['hydra:description'] || 'Erreur 400');
      }

      // if (!response.ok) {
      //   throw new Error('Erreur lors de la suppression du compte');
      // }

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      alert('Compte supprimé avec succès');

      window.location.href = '/';

    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue lors de la suppression du compte.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.title}>Paramètres</h1>

        {/* 🔔 Notifications */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}><Bell /> Notifications</h2>

          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Notifications par email</span>
            <div style={styles.toggle(emailNotif)} onClick={() => setEmailNotif(!emailNotif)}>
              <div style={styles.toggleBall(emailNotif)} />
            </div>
          </div>

          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Actualités importantes</span>
            <div style={styles.toggle(importantNews)} onClick={() => setImportantNews(!importantNews)}>
              <div style={styles.toggleBall(importantNews)} />
            </div>
          </div>

          <div style={{ ...styles.settingItem, borderBottom: 'none' }}>
            <span style={styles.settingLabel}>Nouveaux commentaires</span>
            <div style={styles.toggle(commentsNotif)} onClick={() => setCommentsNotif(!commentsNotif)}>
              <div style={styles.toggleBall(commentsNotif)} />
            </div>
          </div>
        </div>

        {/* 🔐 Sécurité */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}><Shield /> Sécurité</h2>

          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Profil public</span>
            <div style={styles.toggle(publicProfile)} onClick={() => setPublicProfile(!publicProfile)}>
              <div style={styles.toggleBall(publicProfile)} />
            </div>
          </div>

          <div style={styles.settingItem}>
            <span style={styles.settingLabel}>Afficher mes statistiques</span>
            <div style={styles.toggle(showStats)} onClick={() => setShowStats(!showStats)}>
              <div style={styles.toggleBall(showStats)} />
            </div>
          </div>

          <div style={{ ...styles.settingItem, borderBottom: 'none' }}>
            <span style={styles.settingLabel}>Autoriser les messages privés</span>
            <div style={styles.toggle(privateMessages)} onClick={() => setPrivateMessages(!privateMessages)}>
              <div style={styles.toggleBall(privateMessages)} />
            </div>
          </div>
        </div>

        {/* 🔒 Compte */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}><Lock /> Compte</h2>

          <div style={{ ...styles.settingItem, borderBottom: 'none' }}>
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

          <div style={{ ...styles.settingItem, borderBottom: 'none' }} disabled={isSubmitting}>
            <span style={styles.settingLabel}>Supprimer mon compte</span>
            <button
              style={styles.dangerButton}
              onClick={() => { handleSupprimerCompte() }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#dc2626';
              }}
              
            >
              {isSubmitting ? 'Suppression...' : 'Supprimer mon compte'}
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
