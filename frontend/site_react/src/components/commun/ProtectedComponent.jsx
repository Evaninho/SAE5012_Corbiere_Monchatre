// src/components/common/ProtectedComponent.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { isRoleAtLeast, PERMISSIONS } from '../../utils/roles';

export function ProtectedComponent({ 
  children, 
  permission = null,
  minRole = null,
  fallback = null,
  showUpgradePrompt = true
}) {
  const { can, userRole, isLoggedIn } = usePermissions();
  const navigate = useNavigate();

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#fee2e2',
      border: '2px solid #dc2626',
      borderRadius: '12px',
      textAlign: 'center'
    },
    icon: {
      fontSize: '48px',
      marginBottom: '15px'
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#dc2626',
      marginBottom: '10px'
    },
    message: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '20px'
    },
    upgradeButton: {
      padding: '12px 24px',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    loginButton: {
      padding: '12px 24px',
      backgroundColor: '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s',
      marginRight: '10px'
    }
  };

  // Vérifier si l'utilisateur est connecté
  if (!isLoggedIn && (permission || minRole)) {
    if (!showUpgradePrompt) return null;
    
    return fallback || (
      <div style={styles.container}>
        <div style={styles.icon}>🔒</div>
        <div style={styles.title}>Connexion requise</div>
        <div style={styles.message}>
          Vous devez être connecté pour accéder à cette fonctionnalité
        </div>
        <button
          style={styles.loginButton}
          onClick={() => navigate('/login')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006ba3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0085C7'}
        >
          Se connecter
        </button>
      </div>
    );
  }

  // Vérifier par permission
  if (permission && !can(permission)) {
    if (!showUpgradePrompt) return null;
    
    const roleInfo = PERMISSIONS[userRole];
    
    return fallback || (
      <div style={styles.container}>
        <div style={styles.icon}>⚠️</div>
        <div style={styles.title}>Abonnement requis</div>
        <div style={styles.message}>
          Cette fonctionnalité n'est pas disponible avec votre abonnement actuel ({roleInfo?.displayName || 'Abonné'})
        </div>
        <button
          style={styles.upgradeButton}
          onClick={() => navigate('/abonnement')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
        >
          Améliorer mon abonnement
        </button>
      </div>
    );
  }

  // Vérifier par rôle minimum
  if (minRole && !isRoleAtLeast(userRole, minRole)) {
    if (!showUpgradePrompt) return null;
    
    const requiredRoleInfo = PERMISSIONS[minRole];
    
    return fallback || (
      <div style={styles.container}>
        <div style={styles.icon}>⚠️</div>
        <div style={styles.title}>Abonnement {requiredRoleInfo?.displayName} requis</div>
        <div style={styles.message}>
          Cette fonctionnalité nécessite un abonnement {requiredRoleInfo?.displayName} ou supérieur
        </div>
        <button
          style={styles.upgradeButton}
          onClick={() => navigate('/abonnement')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
        >
          Découvrir les abonnements
        </button>
      </div>
    );
  }

  // Si toutes les vérifications passent, afficher le contenu
  return children;
}