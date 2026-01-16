import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, TrendingUp } from 'lucide-react';
import { PERMISSIONS } from '../../utils/roles';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [currentRole, setCurrentRole] = useState('ROLE_USER');
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api';

  // Icones pour les plans
  const iconMap = {
    'ROLE_AUTHOR': <Zap size={32} />,
    'ROLE_EDITOR': <Crown size={32} />,
    'ROLE_DATA_PROVIDER': <TrendingUp size={32} />
  };

  // Récupérer les plans depuis PERMISSIONS
  const plans = [
    { id: 'ROLE_AUTHOR', ...PERMISSIONS.ROLE_AUTHOR },
    { id: 'ROLE_EDITOR', ...PERMISSIONS.ROLE_EDITOR },
    { id: 'ROLE_DATA_PROVIDER', ...PERMISSIONS.ROLE_DATA_PROVIDER }
  ];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setUserData(data);
      if (data.roles && Array.isArray(data.roles)) {
        setCurrentRole(data.roles[0] || 'ROLE_USER');
      }
    }
  }, [navigate]);

  const styles = {
    page: {
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px',
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
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '15px'
    },
    subtitle: {
      fontSize: '18px',
      color: '#666'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
      gap: '30px',
      marginBottom: '50px'
    },
    card: (isPopular, planColor) => ({
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '35px',
      position: 'relative',
      boxShadow: isPopular ? '0 8px 24px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)',
      border: isPopular ? `3px solid ${planColor}` : '1px solid #e5e7eb',
      transform: isPopular ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s'
    }),
    popular: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#F4C300',
      color: '#000',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 'bold'
    },
    iconContainer: (color) => ({
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: `${color}20`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      color: color
    }),
    planName: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '15px'
    },
    price: {
      fontSize: '40px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '10px'
    },
    priceDetail: {
      textAlign: 'center',
      color: '#666',
      marginBottom: '30px',
      fontSize: '14px'
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '30px'
    },
    featureItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      marginBottom: '12px',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    button: (planColor, isCurrent) => ({
      width: '100%',
      padding: '15px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: isCurrent ? 'not-allowed' : 'pointer',
      backgroundColor: isCurrent ? '#9ca3af' : planColor,
      color: 'white',
      transition: 'all 0.2s'
    }),
    currentBadge: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      padding: '10px 20px',
      borderRadius: '10px',
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: '20px'
    },
    comparison: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      marginTop: '50px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  };

  const handleSubscribe = async (planId) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (planId === currentRole) return;

    if (!window.confirm(`Voulez-vous vraiment souscrire au plan ${planId.replace('ROLE_', '')} ?`)) {
      return;
    }

    setIsProcessing(true);

    try {
      const roleMap = {
        'ROLE_AUTHOR': 'auteur',
        'ROLE_EDITOR': 'editeur',
        'ROLE_DATA_PROVIDER': 'fournisseur'
      };

      const response = await fetch(`${API_BASE_URL}/role/${roleMap[planId]}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du rôle');
      }

      const data = await response.json();
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.roles = data.roles;
      localStorage.setItem('userData', JSON.stringify(userData));
      setCurrentRole(planId);
      setUserData(userData);

      alert(`✅ Abonnement activé avec succès !`);
      setTimeout(() => navigate('/profile'), 1000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la mise à jour');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Choisissez votre abonnement</h1>
          <p style={styles.subtitle}>
            Débloquez des fonctionnalités exclusives et soutenez la plateforme
          </p>
          {currentRole !== 'ROLE_USER' && (
            <div style={{...styles.currentBadge, marginTop: '20px'}}>
              ✓ Vous êtes actuellement abonné au plan {plans.find(p => p.id === currentRole)?.displayName || 'Premium'}
            </div>
          )}
        </div>

        <div style={styles.grid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={styles.card(plan.popular, plan.color)}
              onMouseEnter={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }
              }}
            >
              {plan.popular && <div style={styles.popular}>POPULAIRE</div>}
              
              <div style={styles.iconContainer(plan.color)}>
                {iconMap[plan.id]}
              </div>

              <h3 style={styles.planName}>{plan.displayName}</h3>
              
              <div style={styles.price}>
                {plan.price}€
              </div>
              <p style={styles.priceDetail}>par mois</p>

              <ul style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={styles.featureItem}>
                    <Check size={20} color={plan.color} style={{ flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                style={styles.button(plan.color, currentRole === plan.id || isProcessing)}
                onClick={() => handleSubscribe(plan.id)}
                disabled={currentRole === plan.id || isProcessing}
                onMouseEnter={(e) => {
                  if (currentRole !== plan.id && !isProcessing) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentRole !== plan.id && !isProcessing) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
              >
                {currentRole === plan.id ? 'Abonnement actuel' : isProcessing ? 'Traitement...' : `Choisir ${plan.displayName}`}
              </button>
            </div>
          ))}
        </div>

        {/* Tableau comparatif */}
        <div style={styles.comparison}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' }}>
            Comparaison détaillée
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '15px', fontWeight: 'bold' }}>Fonctionnalité</th>
                  <th style={{ textAlign: 'center', padding: '15px', fontWeight: 'bold' }}>Gratuit</th>
                  <th style={{ textAlign: 'center', padding: '15px', fontWeight: 'bold', color: '#0085C7' }}>Auteur</th>
                  <th style={{ textAlign: 'center', padding: '15px', fontWeight: 'bold', color: '#F4C300' }}>Editeur</th>
                  <th style={{ textAlign: 'center', padding: '15px', fontWeight: 'bold', color: '#009F3D' }}>Fournisseur de données</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Accès aux statistiques', free: true, plus: true, creator: true, pub: true },
                  { feature: 'Lecture des articles', free: true, plus: true, creator: true, pub: true },
                  { feature: 'Commentaires', free: true, plus: true, creator: true, pub: true },
                  { feature: 'Certification', free: false, plus: true, creator: true, pub: true },
                  { feature: 'Personnalisation avancée', free: false, plus: true, creator: true, pub: true },
                  { feature: 'Publication d\'articles', free: false, plus: true, creator: true, pub: false },
                  { feature: 'Boost d\'articles', free: false, plus: false, creator: false, pub: '3/mois' }
                ].map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '15px', fontWeight: '500' }}>{row.feature}</td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      {row.free === true ? <Check size={20} color="#10b981" style={{ margin: '0 auto' }} /> : '—'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      {row.plus === true ? <Check size={20} color="#10b981" style={{ margin: '0 auto' }} /> : '—'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      {row.creator === true ? <Check size={20} color="#10b981" style={{ margin: '0 auto' }} /> : '—'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      {typeof row.pub === 'string' ? row.pub : row.pub === true ? <Check size={20} color="#10b981" style={{ margin: '0 auto' }} /> : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}