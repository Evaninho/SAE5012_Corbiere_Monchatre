import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../image/LOGO_OFFI.png";

export function LoginForm() {
    const navigate = useNavigate();

    // État pour les données du formulaire
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    // État pour les erreurs
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // État pour le mot de passe oublié
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);

    // URL de votre API - À MODIFIER selon votre backend
    const API_BASE_URL = 'http://localhost:8000/api'; 

    // Charger l'email sauvegardé au montage du composant
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setFormData(prev => ({
                ...prev,
                email: savedEmail,
                rememberMe: true
            }));
        }

        // Vérifier si l'utilisateur est déjà connecté
        const token = localStorage.getItem("authToken");
        if (token) {
            // Optionnel : vérifier si le token est valide
            verifyToken(token);
        }
    }, []);

    // Fonction pour vérifier la validité du token
    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Token valide, rediriger vers la page d'accueil
                navigate('/');
            } else {
                // Token invalide, le supprimer
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        } catch (error) {
            console.error('Erreur de vérification du token:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        }
    };

    // Styles (identiques à avant)

    const pageStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "45vw",
        margin: "0 auto",
        paddingBottom: "8vh",
        fontFamily: "Arial, sans-serif",
        gap: "10px",
        borderRadius: "25px",
        padding: "60px",
    };

    const containerStyle = {
        backgroundColor: "white",
        borderRadius: "25px",
        padding: "40px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        width: "100%",
        maxWidth: "450px"
    };

    const logoStyle = {
        width: "120px",
        display: "block",
        margin: "0 auto 20px"
    };

    const titleStyle = {
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "10px",
        color: "#333"
    };

    const subtitleStyle = {
        fontSize: "14px",
        textAlign: "center",
        color: "#666",
        marginBottom: "30px"
    };

    const inputGroupStyle = {
        marginBottom: "20px"
    };

    const labelStyle = {
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "8px"
    };

    const inputStyle = {
        width: "100%",
        height: "45px",
        padding: "10px 15px",
        fontSize: "14px",
        border: "1px solid #D9D9D9",
        borderRadius: "10px",
        boxSizing: "border-box",
        transition: "border-color 0.2s"
    };

    const inputErrorStyle = {
        ...inputStyle,
        border: "2px solid #dc2626"
    };

    const errorMessageStyle = {
        color: "#dc2626",
        fontSize: "12px",
        marginTop: "5px"
    };

    const buttonStyle = {
        width: "100%",
        height: "50px",
        backgroundColor: isSubmitting ? "#9ca3af" : "#0085C7",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: isSubmitting ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        marginBottom: "20px"
    };

    const footerTextStyle = {
        textAlign: "center",
        marginTop: "25px",
        fontSize: "14px",
        color: "#666"
    };

    const linkStyle = {
        color: "#0085C7",
        textDecoration: "none",
        fontWeight: "600"
    };

    const modalOverlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
    };

    const modalStyle = {
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "30px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)"
    };

    const successMessageStyle = {
        backgroundColor: "#d1fae5",
        border: "2px solid #10b981",
        borderRadius: "10px",
        padding: "15px",
        color: "#065f46",
        textAlign: "center",
        marginBottom: "20px"
    };

    // Gestion des changements
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ========== FONCTION DE CONNEXION AVEC FETCH ==========
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation du formulaire
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({}); // Réinitialiser les erreurs

        try {
            // Appel à l'API de connexion
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            // Vérifier le statut de la réponse
            if (!response.ok) {
                // Gérer les erreurs HTTP
                if (response.status === 401) {
                    throw new Error('Email ou mot de passe incorrect');
                } else if (response.status === 404) {
                    throw new Error('Utilisateur non trouvé');
                } else if (response.status === 500) {
                    throw new Error('Erreur serveur. Veuillez réessayer.');
                } else {
                    throw new Error('Erreur de connexion');
                }
            }

            // Récupérer les données de la réponse
            const data = await response.json();

            console.log('Réponse API:', data);

            // Vérifier que le token existe dans la réponse
            if (!data.token) {
                throw new Error('Token non reçu');
            }

            // ========== STOCKAGE DES DONNÉES ==========

            // 1. Stocker le token JWT
            localStorage.setItem('authToken', data.token);

            // 2. Stocker les informations de l'utilisateur
            if (data.user) {
                localStorage.setItem('userData', JSON.stringify(data.user));
            }

            // 3. Gérer "Se souvenir de moi"
            if (formData.rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // 4. Stocker la date de connexion (optionnel)
            localStorage.setItem('loginTimestamp', Date.now().toString());

            // ========== SUCCÈS ==========
            console.log('Connexion réussie !');
            console.log('Token:', data.token);
            console.log('Utilisateur:', data.user);

            // Afficher un message de succès (optionnel)
            alert(`Bienvenue ${data.user?.name || data.user?.email || 'utilisateur'} !`);

            // Redirection vers la page d'accueil ou dashboard
            navigate('/');

        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur de connexion:', error);

            setErrors({
                general: error.message || 'Une erreur est survenue. Veuillez réessayer.'
            });

        } finally {
            setIsSubmitting(false);
        }
    };

    // ========== FONCTION DE RÉINITIALISATION DU MOT DE PASSE ==========
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!resetEmail.trim()) {
            alert("Veuillez entrer votre adresse email");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
            alert("Email invalide");
            return;
        }

        try {
            // Appel à l'API de réinitialisation
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: resetEmail
                })
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Aucun compte trouvé avec cet email');
                }
                throw new Error('Erreur lors de l\'envoi de l\'email');
            }

            const data = await response.json();
            console.log('Réinitialisation:', data);

            setResetSent(true);

            // Fermer le modal après 3 secondes
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetSent(false);
                setResetEmail("");
            }, 3000);

        } catch (error) {
            console.error("Erreur:", error);
            alert(error.message || "Une erreur est survenue. Veuillez réessayer.");
        }
    };

    // ========== FONCTION DE CONNEXION GOOGLE (optionnel) ==========
    const handleGoogleLogin = () => {
        // Redirection vers l'endpoint Google OAuth de votre backend
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <img src={logoImage} alt="OlymPeak" style={logoStyle} />
                <h1 style={titleStyle}>Bienvenue !</h1>
                <p style={subtitleStyle}>Connectez-vous pour accéder à votre compte</p>

                {errors.general && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        border: '2px solid #dc2626',
                        borderRadius: '10px',
                        padding: '12px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        color: '#dc2626',
                        fontWeight: '600'
                    }}>
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div style={inputGroupStyle}>
                        <label htmlFor="email" style={labelStyle}>
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            style={errors.email ? inputErrorStyle : inputStyle}
                            onFocus={(e) => e.target.style.borderColor = "#0085C7"}
                            onBlur={(e) => e.target.style.borderColor = errors.email ? "#dc2626" : "#D9D9D9"}
                        />
                        {errors.email && <div style={errorMessageStyle}>{errors.email}</div>}
                    </div>

                    {/* Mot de passe */}
                    <div style={inputGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>
                            Mot de passe *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            style={errors.password ? inputErrorStyle : inputStyle}
                            onFocus={(e) => e.target.style.borderColor = "#0085C7"}
                            onBlur={(e) => e.target.style.borderColor = errors.password ? "#dc2626" : "#D9D9D9"}
                        />
                        {errors.password && <div style={errorMessageStyle}>{errors.password}</div>}
                    </div>

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => {
                            if (!isSubmitting) e.currentTarget.style.backgroundColor = "#006ba3";
                        }}
                        onMouseLeave={(e) => {
                            if (!isSubmitting) e.currentTarget.style.backgroundColor = "#0085C7";
                        }}
                    >
                        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </form>

                {/* Footer */}
                <p style={footerTextStyle}>
                    Pas encore de compte ?{" "}
                    <Link to="/register" style={linkStyle}>
                        S'inscrire gratuitement
                    </Link>
                </p>
            </div>
        </div>
    );
}