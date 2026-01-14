// src/hooks/usePermissions.js

import { useState, useEffect } from 'react';
import { 
  hasPermission, 
  getRolePermissions, 
  isRoleAtLeast,
  getUserRole,
  isAuthenticated 
} from '../utils/roles';

export const usePermissions = () => {
  const [userRole, setUserRole] = useState('visitor');
  const [permissions, setPermissions] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur
    const role = getUserRole();
    
    setUserRole(role);
    setPermissions(getRolePermissions(role));
    setIsLoggedIn(isAuthenticated(role));

    // Écouter les changements de localStorage (si l'utilisateur se connecte/déconnecte)
    const handleStorageChange = () => {
      const newRole = getUserRole();
      setUserRole(newRole);
      setPermissions(getRolePermissions(newRole));
      setIsLoggedIn(isAuthenticated(newRole));
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fonction pour vérifier une permission spécifique
  const can = (permission) => {
    return hasPermission(permission, userRole);
  };

  // Fonction pour vérifier si le rôle est au moins égal à un rôle requis
  const isAtLeast = (requiredRole) => {
    return isRoleAtLeast(userRole, requiredRole);
  };

  // Fonction pour forcer le refresh des permissions
  const refreshPermissions = () => {
    const role = getUserRole();
    setUserRole(role);
    setPermissions(getRolePermissions(role));
    setIsLoggedIn(isAuthenticated(role));
  };

  return {
    userRole,
    permissions,
    isLoggedIn,
    can,
    isAtLeast,
    refreshPermissions
  };
};