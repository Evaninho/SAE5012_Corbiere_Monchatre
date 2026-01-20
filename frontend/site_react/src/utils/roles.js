// src/utils/roles.js

export const ROLES = {
  VISITOR: 'visitor',           // Non connecté
  USER: 'ROLE_USER',            // Utilisateur (gratuit)
  AUTHOR: 'ROLE_AUTHOR',        // Auteur (payant)
  EDITOR: 'ROLE_EDITOR',        // Éditeur (payant)
  DATA_PROVIDER: 'ROLE_DATA_PROVIDER', // Fournisseur (payant)
  ADMIN: 'ROLE_ADMIN'           // Administrateur
};

// Hiérarchie des rôles (du plus bas au plus haut)
const ROLE_HIERARCHY = [
  'visitor',
  'ROLE_USER',
  'ROLE_AUTHOR',
  'ROLE_EDITOR',
  'ROLE_DATA_PROVIDER',
  'ROLE_ADMIN'
];

// Permissions détaillées par rôle
export const PERMISSIONS = {
  visitor: {
    // Navigation seulement
    canViewSite: true,
    canViewArticles: true,
    canViewStats: true,
    
    // Restrictions totales
    canComment: false,
    canRate: false,
    canAddFavorites: false,
    canCreateArticles: false,
    canSupprimerArticles: false,
    canEditOwnArticles: false,
    canEditAllArticles: false,
    canImportData: false,
    canManageUsers: false,
    
    displayName: 'Visiteur',
    color: '#9CA3AF',
    icon: '👁️',
    isPaid: false
  },
  
  ROLE_USER: {
    // Hérite de visitor + ajouts
    canViewSite: true,
    canViewArticles: true,
    canViewStats: true,
    
    // Nouvelles permissions
    canComment: true,
    canRate: true,
    canAddFavorites: true,
    
    // Toujours restrictions
    canCreateArticles: false,
    canSupprimerArticles: false,
    canEditOwnArticles: false,
    canEditAllArticles: false,
    canImportData: false,
    canManageUsers: false,
    
    displayName: 'Utilisateur',
    color: '#3B82F6',
    icon: '👤',
    isPaid: false,
    price: 'Gratuit'
  },
  
  ROLE_AUTHOR: {
    // Hérite de ROLE_USER + ajouts
    canViewSite: true,
    canViewArticles: true,
    canViewStats: true,
    canComment: true,
    canRate: true,
    canAddFavorites: true,
    
    // Nouvelles permissions
    canCreateArticles: true,
    canSupprimerArticles: false,
    canEditOwnArticles: true,
    
    // Toujours restrictions
    canEditAllArticles: false,
    canImportData: false,
    canManageUsers: false,
    
    displayName: 'Auteur',
    color: '#0085C7',
    isPaid: true,
    price: 4.99,
    popular: false,
    features: [
      'Certification associée',
      'Personnalisation avancée',
      'Notifications en avant-première',
      'Accès direct avant version gratuite',
      'Avantages partenaires'
    ]
  },
  
  ROLE_EDITOR: {
    // Hérite de ROLE_AUTHOR + ajouts
    canViewSite: true,
    canViewArticles: true,
    canViewStats: true,
    canComment: true,
    canRate: true,
    canAddFavorites: true,
    canCreateArticles: true,
    canSupprimerArticles: true,
    canEditOwnArticles: true,
    
    // Nouvelles permissions
    canEditAllArticles: true,
    
    // Toujours restrictions
    canImportData: false,
    canManageUsers: false,
    
    displayName: 'Éditeur',
    color: '#F4C300',
    isPaid: true,
    price: 5.99,
    popular: true,
    features: [
      'Toutes les fonctionnalités Auteur',
      'Droit de publier des articles validés',
      'Certification premium',
      'Badge exclusif créateur'
    ]
  },
  
  ROLE_DATA_PROVIDER: {
    // Hérite de ROLE_EDITOR + ajouts
    canViewSite: true,
    canViewArticles: true,
    canViewStats: true,
    canComment: true,
    canRate: true,
    canAddFavorites: true,
    canCreateArticles: false,
    canSupprimerArticles: false,
    canEditOwnArticles: false,
    canEditAllArticles: false,
    
    // Nouvelles permissions
    canImportData: true,
    canManageDatasets: true,
    
    // Toujours restrictions
    canManageUsers: false,
    
    displayName: 'Fournisseur de Données',
    color: '#009F3D',
    isPaid: true,
    price: 9.99,
    popular: false,
    features: [
      'Possibilité de booster 3 articles/mois',
      'Statistiques avancées',
      'Badge exclusif premium',
      'Support prioritaire'
    ]
  },
  
  ROLE_ADMIN: {
    // Tous les droits
    canViewSite: true,
    canViewArticles: true,
    canViewStats: true,
    canComment: true,
    canRate: true,
    canAddFavorites: true,
    canCreateArticles: true,
    canSupprimerArticles: true,
    canEditOwnArticles: true,
    canEditAllArticles: true,
    canImportData: true,
    canManageDatasets: true,
    canManageUsers: true,
    canAccessAdminPanel: true,
    canDeleteArticles: true,
    canModerateComments: true,
    hasAllPermissions: true,
    
    displayName: 'Administrateur',
    color: '#F59E0B',
    icon: '👑',
    isPaid: false,
    price: 'Admin'
  }
};

// Vérifier une permission spécifique
export const hasPermission = (permission, userRole) => {
  // Permet les deux formats: hasPermission('permission') ou hasPermission('permission', 'ROLE_X')
  if (!userRole) {
    userRole = getUserRole();
  }
  const rolePermissions = PERMISSIONS[userRole] || PERMISSIONS.visitor;
  return rolePermissions[permission] || false;
};

// Obtenir les infos utilisateur actuelles
export const getCurrentUser = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData;
  } catch (e) {
    return null;
  }
};

// Obtenir toutes les permissions du rôle actuel
export const getCurrentRolePermissions = () => {
  const userRole = getUserRole();
  return PERMISSIONS[userRole] || PERMISSIONS.visitor;
};

// Obtenir toutes les permissions d'un rôle
export const getRolePermissions = (userRole) => {
  const role = userRole || 'visitor';
  return PERMISSIONS[role] || PERMISSIONS.visitor;
};

// Vérifier une permission spécifique avec un rôle spécifique (ancien format - toujours supporté)
export const hasPermissionForRole = (userRole, permission) => {
  // Si pas de rôle, considérer comme visiteur
  const role = userRole || 'visitor';
  const rolePermissions = PERMISSIONS[role] || PERMISSIONS.visitor;
  return rolePermissions[permission] || false;
};

// Vérifier si un rôle est supérieur ou égal à un autre
export const isRoleAtLeast = (userRole, requiredRole) => {
  const currentRole = userRole || 'visitor';
  const userIndex = ROLE_HIERARCHY.indexOf(currentRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  // Si un des rôles n'existe pas dans la hiérarchie
  if (userIndex === -1 || requiredIndex === -1) return false;
  
  return userIndex >= requiredIndex;
};

// Obtenir le prochain rôle dans la hiérarchie (pour l'upgrade)
export const getNextRole = (currentRole) => {
  const role = currentRole || 'visitor';
  const currentIndex = ROLE_HIERARCHY.indexOf(role);
  
  // Si on est déjà au max ou rôle invalide
  if (currentIndex === -1 || currentIndex >= ROLE_HIERARCHY.length - 1) {
    return null;
  }
  
  return ROLE_HIERARCHY[currentIndex + 1];
};

// Obtenir les rôles disponibles pour upgrade (payants uniquement)
export const getAvailableUpgrades = (currentRole) => {
  const role = currentRole || 'visitor';
  const currentIndex = ROLE_HIERARCHY.indexOf(role);
  
  return ROLE_HIERARCHY
    .slice(currentIndex + 1)
    .filter(r => PERMISSIONS[r]?.isPaid && r !== 'ROLE_ADMIN')
    .map(r => ({
      role: r,
      ...PERMISSIONS[r]
    }));
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = (userRole) => {
  return userRole && userRole !== 'visitor';
};

// Obtenir le rôle depuis les données utilisateur
export const getUserRole = () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Le rôle vient du backend dans userData.roles (tableau)
    if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
      // Retourner le premier rôle du tableau
      return userData.roles[0];
    }
    
    // Fallback: chercher userData.role (ancien format)
    if (userData.role) {
      if (typeof userData.role === 'string') {
        return userData.role;
      }
      const roles = JSON.parse(userData.role);
      return Array.isArray(roles) ? roles[0] : roles;
    }
  } catch (e) {
    console.error('Erreur lors de la lecture du rôle:', e);
  }
  
  // Si pas connecté, retourner visitor
  return 'visitor';
};