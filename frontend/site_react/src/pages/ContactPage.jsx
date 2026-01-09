import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export function ContactPage() {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  // État pour les erreurs
  const [errors, setErrors] = useState({});

  // État pour le statut d'envoi
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Styles
  const pageStyle = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "calc(100vh - 80px)",
    padding: "40px 20px"
  };

  const titre = {
    textAlign: "center",
    marginTop: "0",
    marginBottom: "30px",
    fontFamily: "Arial, sans-serif",
    color: "#0085C7",
    fontSize: "36px",
    fontWeight: "bold"
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: window.innerWidth < 967 ? "1fr" : "1fr 1fr",
    gap: "30px",
    marginTop: "40px"
  };

  const formElementStyle = {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    width: window.innerWidth < 967 ? "90%" : "100%"
  };

  const introText = {
    fontSize: "16px",
    color: "#666",
    textAlign: "center",
    marginBottom: "10px"
  };

  const inputGroup = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333"
  };

  const inputStyle = {
    width: "100%",
    height: "45px",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #D9D9D9",
    fontSize: "14px",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: "2px solid #dc2626"
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "150px",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #D9D9D9",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  };

  const textareaErrorStyle = {
    ...textareaStyle,
    border: "2px solid #dc2626"
  };

  const errorMessageStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "-5px"
  };

  const buttonStyle = {
    padding: "15px 30px",
    backgroundColor: isSubmitting ? "#9ca3af" : "#0085C7",
    width: "100%",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.2s",
    marginTop: "10px"
  };

  const successMessageStyle = {
    backgroundColor: "#d1fae5",
    border: "2px solid #10b981",
    borderRadius: "10px",
    padding: "15px",
    color: "#065f46",
    textAlign: "center",
    fontWeight: "600"
  };

  const infoCardStyle = {
    backgroundColor: "white",
    borderRadius: "15px",
    marginLeft: window.innerWidth < 967 ? "0" : "40px",
    padding: "30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "fit-content"
  };

  const infoItemStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "25px"
  };

  const iconContainerStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#0085C7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  };

  const infoTextStyle = {
    flex: 1
  };

  const infoLabelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "5px"
  };

  const infoValueStyle = {
    fontSize: "14px",
    color: "#666"
  };

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    // Validation du sujet
    if (!formData.sujet.trim()) {
      newErrors.sujet = "Le sujet est requis";
    } else if (formData.sujet.trim().length < 3) {
      newErrors.sujet = "Le sujet doit contenir au moins 3 caractères";
    }

    // Validation du message
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulation d'envoi (remplacez par votre vraie API)
    try {
      // Exemple d'appel API
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulation d'un délai
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Formulaire soumis:', formData);
      
      setSubmitSuccess(true);
      setFormData({ nom: '', email: '', sujet: '', message: '' });

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titre}>Contactez-nous</h1>

        <div style={gridStyle}>
          {/* Formulaire de contact */}
          <form style={formElementStyle} onSubmit={handleSubmit}>
            <p style={introText}>
              Une question, une suggestion ? N'hésitez pas à nous contacter !
            </p>

            {submitSuccess && (
              <div style={successMessageStyle}>
                ✓ Votre message a été envoyé avec succès !
              </div>
            )}

            {/* Nom complet */}
            <div style={inputGroup}>
              <label htmlFor="nom" style={labelStyle}>
                Nom complet *
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                placeholder="Jean Dupont"
                value={formData.nom}
                onChange={handleChange}
                style={errors.nom ? inputErrorStyle : inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = errors.nom ? '#dc2626' : '#D9D9D9'}
              />
              {errors.nom && <span style={errorMessageStyle}>{errors.nom}</span>}
            </div>

            {/* Email */}
            <div style={inputGroup}>
              <label htmlFor="email" style={labelStyle}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="jean.dupont@email.com"
                value={formData.email}
                onChange={handleChange}
                style={errors.email ? inputErrorStyle : inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc2626' : '#D9D9D9'}
              />
              {errors.email && <span style={errorMessageStyle}>{errors.email}</span>}
            </div>

            {/* Sujet */}
            <div style={inputGroup}>
              <label htmlFor="sujet" style={labelStyle}>
                Sujet *
              </label>
              <input
                type="text"
                id="sujet"
                name="sujet"
                placeholder="Sujet de votre message"
                value={formData.sujet}
                onChange={handleChange}
                style={errors.sujet ? inputErrorStyle : inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = errors.sujet ? '#dc2626' : '#D9D9D9'}
              />
              {errors.sujet && <span style={errorMessageStyle}>{errors.sujet}</span>}
            </div>

            {/* Message */}
            <div style={inputGroup}>
              <label htmlFor="message" style={labelStyle}>
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Votre message ici..."
                value={formData.message}
                onChange={handleChange}
                style={errors.message ? textareaErrorStyle : textareaStyle}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = errors.message ? '#dc2626' : '#D9D9D9'}
              />
              {errors.message && <span style={errorMessageStyle}>{errors.message}</span>}
            </div>

            <button
              type="submit"
              style={buttonStyle}
              disabled={isSubmitting}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#006ba3';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#0085C7';
                }
              }}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>

          {/* Informations de contact */}
          <div style={infoCardStyle}>
            <h2 style={{ marginTop: 0, color: "#0085C7", fontSize: "24px" }}>
              Nos coordonnées
            </h2>

            <div style={infoItemStyle}>
              <div style={iconContainerStyle}>
                <Mail size={20} color="white" />
              </div>
              <div style={infoTextStyle}>
                <div style={infoLabelStyle}>Email</div>
                <div style={infoValueStyle}>contact@olympeak.com</div>
              </div>
            </div>

            <div style={infoItemStyle}>
              <div style={iconContainerStyle}>
                <Phone size={20} color="white" />
              </div>
              <div style={infoTextStyle}>
                <div style={infoLabelStyle}>Téléphone</div>
                <div style={infoValueStyle}>+33 1 23 45 67 89</div>
              </div>
            </div>

            <div style={infoItemStyle}>
              <div style={iconContainerStyle}>
                <MapPin size={20} color="white" />
              </div>
              <div style={infoTextStyle}>
                <div style={infoLabelStyle}>Adresse</div>
                <div style={infoValueStyle}>
                  123 Avenue des Champs-Élysées<br />
                  75008 Paris, France
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div style={{ marginLeft: "30px", marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "15px" }}>
                Horaires d'ouverture
              </h3>
              <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.8" }}>
                <div>Lundi - Vendredi : 9h00 - 18h00</div>
                <div>Samedi : 10h00 - 16h00</div>
                <div>Dimanche : Fermé</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}