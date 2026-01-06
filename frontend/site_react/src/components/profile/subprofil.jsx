import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, TrendingUp } from 'lucide-react';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');

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
      setCurrentPlan(data.subscription_type || 'free');
    }
  }, [navigate]);

  const plans = [
    {
      id: 'plus',
      name: 'Plus',
      price: 2.99,
      color: '#0085C7',
      icon: <Zap size={32} />,
      features: [
        'Certification associée',
        'Personnalisation avancée',
        'Notifications en avant-première',
        'Accès direct avant version gratuite',
        'Avantages partenaires'
      ]
    },
    {
      id: 'creator',
      name: 'Créateur',
      price: 5.99,
      color: '#F4C300',
      icon: <Crown size={32} />,
      popular: true,
      features: [
        'Toutes les fonctionnalités Plus',
        'Droit de publier des articles validés',
        'Certification premium',
        'Badge exclusif créateur'
      ]
    },
    {
      id: 'publicity',
      name: 'Publicité',
      price: 9.99,
      color: '#dc2626',
      icon: <TrendingUp size={32} />,
      features: [
        'Toutes les fonctionnalités Créateur',
        'Possibilité de booster 3 articles/mois',
        'Statistiques avancées',
        'Badge exclusif publicité',
        'Support prioritaire'
      ]
    }
  ];

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

  const handleSubscribe = (planId) => {
    if (planId === currentPlan) return;
    
    // Ici vous appelleriez votre API pour gérer l'abonnement
    alert(`Souscription à ${planId} - Fonctionnalité à implémenter avec votre système de paiement`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Choisissez votre abonnement</h1>
          <p style={styles.subtitle}>
            Débloquez des fonctionnalités exclusives et soutenez la plateforme
          </p>
          {currentPlan !== 'free' && (
            <div style={{...styles.currentBadge, marginTop: '20px'}}>
              ✓ Vous êtes actuellement abonné au plan {currentPlan.toUpperCase()}
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
                {plan.icon}
              </div>

              <h3 style={styles.planName}>{plan.name}</h3>
              
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
                style={styles.button(plan.color, currentPlan === plan.id)}
                onClick={() => handleSubscribe(plan.id)}
                disabled={currentPlan === plan.id}
                onMouseEnter={(e) => {
                  if (currentPlan !== plan.id) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPlan !== plan.id) {
                    e.currentTarget.style.opacity = '1';
                  }
                }}
              >
                {currentPlan === plan.id ? 'Abonnement actuel' : `Choisir ${plan.name}`}
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
                  <th style={{ textAlign: 'center', padding: '15px', fontWeight: 'bold', color: '#0085C7' }}>Plus</th>
                  <th style={{ textAlign: 'center', padding: '15px', fontWeight: 'bold', color: '#F4C300' }}>Créateur</th>
                  <th style={{ textAlign: 'center', padding: '15px', fontWeight: 'bold', color: '#dc2626' }}>Publicité</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Accès aux statistiques', free: true, plus: true, creator: true, pub: true },
                  { feature: 'Lecture des articles', free: true, plus: true, creator: true, pub: true },
                  { feature: 'Commentaires', free: true, plus: true, creator: true, pub: true },
                  { feature: 'Certification', free: false, plus: true, creator: true, pub: true },
                  { feature: 'Personnalisation avancée', free: false, plus: true, creator: true, pub: true },
                  { feature: 'Publication d\'articles', free: false, plus: false, creator: true, pub: true },
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