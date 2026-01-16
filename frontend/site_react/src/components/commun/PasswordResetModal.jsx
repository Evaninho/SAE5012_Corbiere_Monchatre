import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';


export function ResetPasswordModal({ 
  isOpen, 
  onClose, 
  mode = 'forgot', // 'forgot' ou 'change'
  email = '' // Pour mode 'forgot'
}) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: email
  });

  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api';

  // Styles
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-in-out'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      animation: 'slideUp 0.3s ease-out'
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      transition: 'background-color 0.2s'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    icon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#e0f2fe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.5'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: (hasError) => ({
      width: '100%',
      padding: '12px 45px 12px 15px',
      border: hasError ? '2px solid #dc2626' : '1px solid #D9D9D9',
      borderRadius: '10px',
      fontSize: '14px',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    }),
    eyeButton: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    errorMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#dc2626',
      marginTop: '-5px'
    },
    passwordStrength: {
      display: 'flex',
      gap: '5px',
      marginTop: '8px'
    },
    strengthBar: (strength) => ({
      flex: 1,
      height: '4px',
      borderRadius: '2px',
      backgroundColor: strength > 0 ? (
        strength === 1 ? '#dc2626' :
        strength === 2 ? '#f59e0b' :
        strength === 3 ? '#10b981' : '#e5e7eb'
      ) : '#e5e7eb'
    }),
    strengthText: (strength) => ({
      fontSize: '12px',
      marginTop: '5px',
      color: strength === 1 ? '#dc2626' :
            strength === 2 ? '#f59e0b' :
            strength === 3 ? '#10b981' : '#666'
    }),
    hint: {
      fontSize: '12px',
      color: '#666',
      marginTop: '5px'
    },
    submitButton: {
      padding: '15px',
      backgroundColor: isSubmitting ? '#9ca3af' : '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      marginTop: '10px'
    },
    successMessage: {
      backgroundColor: '#d1fae5',
      border: '2px solid #10b981',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '20px'
    },
    successIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 15px'
    },
    successTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#065f46',
      marginBottom: '10px'
    },
    successText: {
      fontSize: '14px',
      color: '#047857'
    }
  };

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Calculer la force du mot de passe
  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  // Validation
  const validate = () => {
    const newErrors = {};

    // Mode changement : vérifier l'ancien mot de passe
    if (mode === 'change') {
      if (!formData.oldPassword) {
        newErrors.oldPassword = 'L\'ancien mot de passe est requis';
      }
    }

    // Mode oublié : vérifier l'email
    if (mode === 'forgot') {
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
    }

    // Nouveau mot de passe
    if (!formData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Minimum 8 caractères';
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Doit contenir une majuscule';
    } else if (!/(?=.*[0-9])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Doit contenir un chiffre';
    }

    // Confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmez le mot de passe';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const endpoint = mode === 'forgot' 
        ? `${API_BASE_URL}/auth/reset-password`
        : `${API_BASE_URL}/users/change-password`;

      const token = localStorage.getItem('authToken');

      const body = mode === 'forgot'
        ? { email: formData.email, newPassword: formData.newPassword }
        : { oldPassword: formData.oldPassword, newPassword: formData.newPassword };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          ...(mode === 'change' && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la modification');
      }

      const data = await response.json();
      console.log('Succès:', data);

      setSuccess(true);

      // Fermer après 2 secondes
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
          email: ''
        });
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ 
        ...errors, 
        general: error.message || 'Une erreur est survenue' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={styles.modal}>
        {/* Bouton fermer */}
        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={24} color="#666" />
        </button>

        {/* En-tête */}
        <div style={styles.header}>
          <div style={styles.icon}>
            <Lock size={28} color="#0085C7" />
          </div>
          <h2 style={styles.title}>
            {mode === 'forgot' ? 'Mot de passe oublié' : 'Changer le mot de passe'}
          </h2>
          <p style={styles.subtitle}>
            {mode === 'forgot' 
              ? 'Entrez votre email et votre nouveau mot de passe'
              : 'Entrez votre ancien mot de passe puis choisissez-en un nouveau'
            }
          </p>
        </div>

        {/* Message de succès */}
        {success && (
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>
              <CheckCircle size={28} color="white" />
            </div>
            <div style={styles.successTitle}>Mot de passe modifié !</div>
            <p style={styles.successText}>
              {mode === 'forgot' 
                ? 'Un email de confirmation vous a été envoyé'
                : 'Votre mot de passe a été changé avec succès'
              }
            </p>
          </div>
        )}

        {/* Erreur générale */}
        {errors.general && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #dc2626',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} color="#dc2626" />
            <span style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>
              {errors.general}
            </span>
          </div>
        )}

        {/* Formulaire */}
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Email (mode oublié uniquement) */}
          {mode === 'forgot' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                style={styles.input(errors.email)}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc2626' : '#D9D9D9'}
              />
              {errors.email && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>
          )}

          {/* Ancien mot de passe (mode changement uniquement) */}
          {mode === 'change' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Ancien mot de passe *</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={styles.input(errors.oldPassword)}
                  onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                  onBlur={(e) => e.target.style.borderColor = errors.oldPassword ? '#dc2626' : '#D9D9D9'}
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </button>
              </div>
              {errors.oldPassword && (
                <div style={styles.errorMessage}>
                  <AlertCircle size={14} />
                  <span>{errors.oldPassword}</span>
                </div>
              )}
            </div>
          )}

          {/* Nouveau mot de passe */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nouveau mot de passe *</label>
            <div style={styles.inputWrapper}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.input(errors.newPassword)}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = errors.newPassword ? '#dc2626' : '#D9D9D9'}
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </button>
            </div>
            {errors.newPassword && (
              <div style={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.newPassword}</span>
              </div>
            )}
            
            {/* Indicateur de force */}
            {formData.newPassword && (
              <>
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBar(passwordStrength >= 1 ? 1 : 0)} />
                  <div style={styles.strengthBar(passwordStrength >= 2 ? 2 : 0)} />
                  <div style={styles.strengthBar(passwordStrength >= 3 ? 3 : 0)} />
                </div>
                <div style={styles.strengthText(passwordStrength)}>
                  {passwordStrength === 0 ? 'Très faible' :
                   passwordStrength === 1 ? 'Faible' :
                   passwordStrength === 2 ? 'Moyen' : 'Fort'}
                </div>
              </>
            )}
            <div style={styles.hint}>
              Minimum 8 caractères, 1 majuscule, 1 chiffre
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmer le mot de passe *</label>
            <div style={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.input(errors.confirmPassword)}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#dc2626' : '#D9D9D9'}
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div style={styles.errorMessage}>
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            style={styles.submitButton}
            disabled={isSubmitting}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#006ba3';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#0085C7';
            }}
          >
            {isSubmitting ? 'Modification en cours...' : 
             mode === 'forgot' ? 'Réinitialiser le mot de passe' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}