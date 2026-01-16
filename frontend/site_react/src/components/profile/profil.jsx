import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, Crown, MessageSquare, Star, Trophy, Award } from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentRole, setCurrentRole] = useState('visitor');

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    pseudo: '',
    email: '',
    pays: '',
    sports: ''
  });

  const paysList = ["Autre", "Afrique du Sud", "Algérie", "Allemagne", "Argentine", "Australie", "Autriche", "Belgique", "Brésil", "Canada", "Chine", "Corée du Sud", "Côte d'Ivoire", "Danemark", "Espagne", "États-Unis", "Finlande", "France", "Grèce", "Inde", "Irlande", "Italie", "Japon", "Luxembourg", "Maroc", "Mexique", "Norvège", "Nouvelle-Zélande", "Pays-Bas", "Portugal", "Royaume-Uni", "Russie", "Sénégal", "Suède", "Suisse", "Tunisie"];


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

  // Styles
  const pageStyle = {
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#f5f5f5',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #0085C7 0%, #009F3D 100%)',
    borderRadius: '15px',
    padding: '40px',
    marginBottom: '30px',
    color: 'white',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 auto 20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  };

  const inputGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    fontSize: '14px',
    border: '1px solid #D9D9D9',
    borderRadius: '10px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  const buttonStyle = (variant = 'primary') => ({
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    backgroundColor: variant === 'primary' ? '#0085C7' : variant === 'secondary' ? '#f3f4f6' : '#dc2626',
    color: variant === 'primary' ? 'white' : variant === 'secondary' ? '#333' : 'white'
  });

  const statCardStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  };

  const getRoleDisplayName = () => {
    const roleMap = {
      'ROLE_USER': { name: 'Utilisateur', color: '#6b7280' },
      'ROLE_AUTHOR': { name: 'Auteur', color: '#0085C7' },
      'ROLE_EDITOR': { name: 'Editeur', color: '#F4C300' },
      'ROLE_DATA_PROVIDER': { name: 'Fournisseur de données', color: '#009F3D' },
      'ROLE_ADMIN': { name: 'Administrateur', color: '#dc2626' }
    };

    const role = currentRole || 'ROLE_USER';
    return roleMap[role] || { name: 'Utilisateur', color: '#0085C7' };
  };

  // Charger le profil
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const storedData = localStorage.getItem('userData');

      if (storedData) {
        const data = JSON.parse(storedData);
        setUserData(data);
        setFormData({
          prenom: data.prenom || '',
          nom: data.nom || '',
          pseudo: data.pseudo || '',
          email: data.email || '',
          pays: data.pays || '',
          sportFavoris: data.sports || ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    const userID = localStorage.getItem('userId');

    setIsSaving(true);
    console.log('lancement');
    console.log(userID);



    try {
      const response = await fetch(`${API_BASE_URL}/users/${userID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      console.log("statu : " + response.status);


      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }
      // if (!response.ok) {
      //           const error = await response.json();
      //           console.error("Erreur API:", error);
      //           throw new Error(error['hydra:description'] || 'Erreur 400');
      //       }

      // const data = await response.json();
      // console.log(data);

      // Mettre à jour localStorage
      const updatedUser = { ...userData, ...formData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUserData(updatedUser);

      // Déclencher un événement pour mettre à jour la navbar
      window.dispatchEvent(new Event('storage'));

      setIsEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitial = () => {
    if (!userData) return 'U';
    const name = userData.pseudo || userData.prenom || userData.email;
    return name?.charAt(0).toUpperCase() || 'U';
  };

  const getSubscriptionBadge = () => {
    const sub = userData?.subscription_type || 'free';
    const badges = {
      free: { text: 'Gratuit', color: '#6b7280', icon: null },
      plus: { text: 'Plus', color: '#0085C7', icon: <Crown size={16} /> },
      creator: { text: 'Créateur', color: '#F4C300', icon: <Crown size={16} /> },
      publicity: { text: 'Publicité', color: '#dc2626', icon: <Crown size={16} /> }
    };

    return badges[sub] || badges.free;
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ ...containerStyle, textAlign: 'center', paddingTop: '100px' }}>
          Chargement du profil...
        </div>
      </div>
    );
  }

  const subscriptionBadge = getSubscriptionBadge();
  const roleInfo = getRoleDisplayName();

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* En-tête */}
        <div style={headerStyle}>
          <div style={avatarStyle}>{getInitial()}</div>
          <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '10px' }}>
            {userData?.pseudo || userData?.prenom || 'Utilisateur'}
          </h1>
          <div style={{ textAlign: 'center', marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* <span style={{...badgeStyle, backgroundColor: subscriptionBadge.color, color: 'white'}}>
              {subscriptionBadge.icon}
              {subscriptionBadge.text}
            </span> */}
            <span style={{ ...badgeStyle, backgroundColor: roleInfo.color, color: 'white' }}>
              {roleInfo.name}
            </span>
          </div>
          <p style={{ textAlign: 'center', fontSize: '14px', opacity: 0.9 }}>
            Membre depuis {new Date(userData?.created_at || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Statistiques */}
        {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={statCardStyle}>
            <MessageSquare size={32} color="#0085C7" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>0</p>
            <p style={{ color: '#666', fontSize: '14px' }}>Commentaires</p>
          </div>
          <div style={statCardStyle}>
            <Star size={32} color="#F4C300" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>0</p>
            <p style={{ color: '#666', fontSize: '14px' }}>Points</p>
          </div>
          <div style={statCardStyle}>
            <Trophy size={32} color="#009F3D" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>0</p>
            <p style={{ color: '#666', fontSize: '14px' }}>Badges</p>
          </div>
          <div style={statCardStyle}>
            <Award size={32} color="#dc2626" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>0</p>
            <p style={{ color: '#666', fontSize: '14px' }}>Articles</p>
          </div>
        </div> */}

        {/* Informations du profil */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={titleStyle}>Informations personnelles</h2>
            {!isEditing ? (
              <button
                style={buttonStyle('primary')}
                onClick={() => setIsEditing(true)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006ba3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0085C7'}
              >
                <Edit2 size={16} />
                Modifier
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={buttonStyle('secondary')}
                  onClick={() => {
                    setIsEditing(false);
                    loadProfile();
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                >
                  <X size={16} />
                  Annuler
                </button>
                <button
                  style={buttonStyle('primary')}
                  onClick={handleSave}
                  disabled={isSaving}
                  onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#006ba3')}
                  onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#0085C7')}
                >
                  <Save size={16} />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Prénom</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ ...inputStyle, backgroundColor: isEditing ? 'white' : '#f9fafb' }}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nom</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ ...inputStyle, backgroundColor: isEditing ? 'white' : '#f9fafb' }}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Pseudo</label>
              <input
                type="text"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ ...inputStyle, backgroundColor: isEditing ? 'white' : '#f9fafb' }}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
                style={{ ...inputStyle, backgroundColor: '#f9fafb' }}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Pays</label>
              <select
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                disabled={!isEditing}
                style={{ ...inputStyle, backgroundColor: isEditing ? 'white' : '#f9fafb' }}
              >
                {paysList.map(pays => (
                  <option key={pays} value={pays}>{pays}</option>
                ))}
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Sport favori</label>
              <input
                type="text"
                name="sport_favoris"
                value={formData.sport_favoris ?? ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="ex: Athlétisme"
                style={{ ...inputStyle, backgroundColor: isEditing ? 'white' : '#f9fafb' }}
              />
            </div>
          </div>

          {/* <div style={inputGroupStyle}>
            <label style={labelStyle}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows="4"
              placeholder="Parlez-nous de vous..."
              style={{
                ...inputStyle,
                minHeight: '100px',
                resize: 'vertical',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: isEditing ? 'white' : '#f9fafb'
              }}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}