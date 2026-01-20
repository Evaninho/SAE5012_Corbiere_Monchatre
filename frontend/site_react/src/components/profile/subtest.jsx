// src/pages/SubscriptionPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, TrendingUp, Check, X } from 'lucide-react';
import { getUserRole, PERMISSIONS, getCurrentUser } from '../../utils/roles';
import { Popup } from '../Popup';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState('visitor');
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    // Récupérer le rôle actuel et les données de l'utilisateur
    const userDataFromStorage = JSON.parse(localStorage.getItem('userData') || '{}');
    setUserData(userDataFromStorage);
    
    // Récupérer le rôle depuis le tableau roles
    if (userDataFromStorage.roles && Array.isArray(userDataFromStorage.roles)) {
      setCurrentRole(userDataFromStorage.roles[0] || 'visitor');
    } else {
      setCurrentRole('visitor');
    }
  }, []);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '60px 20px',
      fontFamily: 'Arial, sans-serif'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    title: {
      fontSize: '42px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '15px'
    },
    subtitle: {
      fontSize: '18px',
      color: '#666'
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
      gap: '30px',
      marginBottom: '50px'
    },
    planCard: (isPopular, isCurrent) => ({
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px 30px',
      boxShadow: isPopular ? '0 8px 24px rgba(0,133,199,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
      border: isPopular ? '3px solid #0085C7' : isCurrent ? '3px solid #009F3D' : '2px solid #e5e7eb',
      position: 'relative',
      transform: isPopular ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s'
    }),
    popularBadge: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0085C7',
      color: 'white',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    currentBadge: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#009F3D',
      color: 'white',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    planIcon: (color) => ({
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px'
    }),
    planName: {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '15px',
      color: '#333'
    },
    planPrice: {
      fontSize: '40px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#0085C7',
      marginBottom: '5px'
    },
    planPeriod: {
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '30px'
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '30px'
    },
    featureItem: (included) => ({
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      marginBottom: '12px',
      fontSize: '14px',
      color: included ? '#333' : '#999',
      textDecoration: included ? 'none' : 'line-through'
    }),
    subscribeButton: (isCurrent, isProcessing) => ({
      width: '100%',
      padding: '15px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: isCurrent || isProcessing ? 'not-allowed' : 'pointer',
      backgroundColor: isCurrent ? '#009F3D' : isProcessing ? '#9ca3af' : '#0085C7',
      color: 'white',
      transition: 'all 0.2s'
    }),
    comparisonTable: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    comparisonTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      color: '#333'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '15px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '14px',
      borderBottom: '2px solid #e5e7eb',
      color: '#333'
    },
    td: {
      padding: '15px',
      textAlign: 'center',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '14px'
    },
    // Styles pour la carte de profil
    profileCard: (roleColor) => ({
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '40px',
      borderLeft: `5px solid ${roleColor}`,
      display: 'flex',
      alignItems: 'center',
      gap: '30px',
      flexWrap: 'wrap'
    }),
    profileBadge: (color) => ({
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      flexShrink: 0
    }),
    profileInfo: {
      flex: 1,
      minWidth: '200px'
    },
    profileName: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px'
    },
    profileRole: (color) => ({
      display: 'inline-block',
      backgroundColor: color,
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '12px'
    }),
    profileDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      fontSize: '14px',
      color: '#666'
    },
    profileDetail: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    profileDetailLabel: {
      fontSize: '12px',
      color: '#999',
      fontWeight: '600'
    }
  };
 
  // Définition des plans
  const plans = [
    {
      id: 'plus',
      name: 'Plus',
      icon: Zap,
      color: '#0085C7',
      price: '2,99',
      popular: false,
      features: [
        { text: 'Certification associée', included: true },
        { text: 'Personnalisation avancée', included: true },
        { text: 'Notifications en avant-première', included: true },
        { text: 'Accès direct avant version gratuite', included: true },
        { text: 'Avantages partenaires', included: true },
        { text: 'Publier des articles', included: false },
        { text: 'Booster des articles', included: false }
      ]
    },
    {
      id: 'creator',
      name: 'Créateur',
      icon: Crown,
      color: '#9333EA',
      price: '5,99',
      popular: true,
      features: [
        { text: 'Toutes les fonctionnalités Plus', included: true },
        { text: 'Droit de publier des articles validés', included: true },
        { text: 'Certification premium', included: true },
        { text: 'Gestion de vos propres articles', included: true },
        { text: 'Badge créateur exclusif', included: true },
        { text: 'Booster des articles', included: false }
      ]
    },
    {
      id: 'publicity',
      name: 'Publicité',
      icon: TrendingUp,
      color: '#DC2626',
      price: '9,99',
      popular: false,
      features: [
        { text: 'Toutes les fonctionnalités Créateur', included: true },
        { text: 'Booster 3 articles/mois', included: true },
        { text: 'Statistiques avancées', included: true },
        { text: 'Badge exclusif premium', included: true },
        { text: 'Support prioritaire', included: true },
        { text: 'Visibilité maximale', included: true }
      ]
    }
  ];

  // Tableau de comparaison
  const comparisonFeatures = [
    { name: 'Lecture articles', free: true, plus: true, creator: true, publicity: true },
    { name: 'Commentaires', free: '5/jour', plus: 'Illimité', creator: 'Illimité', publicity: 'Illimité' },
    { name: 'Notation', free: true, plus: true, creator: true, publicity: true },
    { name: 'Favoris', free: true, plus: true, creator: true, publicity: true },
    { name: 'Certification', free: false, plus: true, creator: true, publicity: true },
    { name: 'Personnalisation', free: false, plus: true, creator: true, publicity: true },
    { name: 'Accès anticipé', free: false, plus: true, creator: true, publicity: true },
    { name: 'Publier articles', free: false, plus: false, creator: true, publicity: true },
    { name: 'Certification premium', free: false, plus: false, creator: true, publicity: true },
    { name: 'Booster articles', free: false, plus: false, creator: false, publicity: '3/mois' },
    { name: 'Stats avancées', free: false, plus: false, creator: false, publicity: true },
    { name: 'Publicités', free: true, plus: false, creator: false, publicity: false }
  ];

  // Gérer la souscription
  const handleSubscribe = async (planId) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setPopup({
        isOpen: true,
        type: 'info',
        title: 'Authentification requise',
        message: 'Vous devez être connecté pour souscrire'
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (planId === currentRole) {
      return; // Déjà abonné à ce plan
    }

    if (!window.confirm(`Voulez-vous vraiment souscrire au plan ${planId.toUpperCase()} ?`)) {
      return;
    }

    setIsProcessing(true);

    try {
      // Appel API pour changer le rôle
      const response = await fetch(`${API_BASE_URL}/user/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la souscription');
      }

      const data = await response.json();

      // Mettre à jour les données utilisateur localement
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.role = planId;
      userData.subscription_expires_at = data.subscription_expires_at;
      userData.subscription_status = 'active';
      localStorage.setItem('userData', JSON.stringify(userData));

      // Mettre à jour l'état local
      setCurrentRole(planId);

      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Abonnement activé !',
        message: `Vous êtes maintenant abonné au plan ${planId.toUpperCase()} ! Vos nouveaux avantages sont actifs immédiatement.`
      });

      // Rediriger vers le profil après 1 seconde
      setTimeout(() => {
        navigate('/profil');
      }, 1500);

    } catch (error) {
      console.error('Erreur souscription:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: `Erreur: ${error.message}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Render d'une cellule du tableau
  const renderCell = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={20} color="#009F3D" />
      ) : (
        <X size={20} color="#dc2626" />
      );
    }
    return value;
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>Choisissez votre abonnement</h1>
          <p style={styles.subtitle}>
            Débloquez des fonctionnalités exclusives et soutenez la plateforme
          </p>
        </div>

        {/* Carte de profil utilisateur avec le style du rôle */}
        {userData && (
          <>
            {(() => {
              const rolePermissions = PERMISSIONS[currentRole];
              const roleColor = rolePermissions?.color || '#9CA3AF';
              const roleIcon = rolePermissions?.icon || '👤';
              const roleDisplayName = rolePermissions?.displayName || 'Visiteur';
              
              return (
                <div style={styles.profileCard(roleColor)}>
                  <div style={styles.profileBadge(roleColor)}>
                    {roleIcon}
                  </div>
                  <div style={styles.profileInfo}>
                    <h2 style={styles.profileName}>
                      {userData.prenom} {userData.nom}
                    </h2>
                    <div style={styles.profileRole(roleColor)}>
                      {roleDisplayName}
                    </div>
                    <div style={styles.profileDetails}>
                      <div style={styles.profileDetail}>
                        <span style={styles.profileDetailLabel}>Email</span>
                        <span>{userData.email}</span>
                      </div>
                      <div style={styles.profileDetail}>
                        <span style={styles.profileDetailLabel}>Pseudo</span>
                        <span>{userData.pseudo || 'N/A'}</span>
                      </div>
                      <div style={styles.profileDetail}>
                        <span style={styles.profileDetailLabel}>Pays</span>
                        <span>{userData.pays || 'N/A'}</span>
                      </div>
                      <div style={styles.profileDetail}>
                        <span style={styles.profileDetailLabel}>Rôle</span>
                        <span>{currentRole}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* Grille des plans */}
        <div style={styles.plansGrid}>
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            const isCurrent = currentRole === plan.id;
            
            return (
              <div
                key={plan.id}
                style={styles.planCard(plan.popular, isCurrent)}
              >
                {plan.popular && (
                  <div style={styles.popularBadge}>
                    ⭐ POPULAIRE
                  </div>
                )}
                {isCurrent && (
                  <div style={styles.currentBadge}>
                    ✓ ACTUEL
                  </div>
                )}

                <div style={styles.planIcon(plan.color)}>
                  <PlanIcon size={32} color="white" />
                </div>

                <h3 style={styles.planName}>{plan.name}</h3>

                <div style={styles.planPrice}>{plan.price} €</div>
                <div style={styles.planPeriod}>par mois</div>

                <ul style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <li key={index} style={styles.featureItem(feature.included)}>
                      {feature.included ? (
                        <Check size={18} color="#009F3D" style={{ flexShrink: 0 }} />
                      ) : (
                        <X size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  style={styles.subscribeButton(isCurrent, isProcessing)}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || isProcessing}
                  onMouseEnter={(e) => {
                    if (!isCurrent && !isProcessing) {
                      e.currentTarget.style.backgroundColor = '#006ba3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent && !isProcessing) {
                      e.currentTarget.style.backgroundColor = '#0085C7';
                    }
                  }}
                >
                  {isCurrent ? '✓ Abonnement actuel' : isProcessing ? 'Traitement...' : 'Choisir ce plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Tableau de comparaison */}
        <div style={styles.comparisonTable}>
          <h2 style={styles.comparisonTitle}>Comparaison détaillée</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{...styles.th, textAlign: 'left'}}>Fonctionnalité</th>
                <th style={styles.th}>Gratuit</th>
                <th style={styles.th}>Plus</th>
                <th style={styles.th}>Créateur</th>
                <th style={styles.th}>Publicité</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => (
                <tr key={index}>
                  <td style={{...styles.td, textAlign: 'left', fontWeight: '600'}}>
                    {feature.name}
                  </td>
                  <td style={styles.td}>{renderCell(feature.free)}</td>
                  <td style={styles.td}>{renderCell(feature.plus)}</td>
                  <td style={styles.td}>{renderCell(feature.creator)}</td>
                  <td style={styles.td}>{renderCell(feature.publicity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP */}
      <Popup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
    </div>
  );
}