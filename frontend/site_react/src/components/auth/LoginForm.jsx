import React, { useState, useEffect, use } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../image/LOGO_OFFI.png";

import { ResetPasswordModal } from '../commun/PasswordResetModal';


export function LoginForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });




    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);


    const API_BASE_URL = "http://localhost:8000/api";

    // Styles
    const pageStyle = {
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
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

    const passwordContainer = {
        position: 'relative',
        width: '100%'
    };

    const inputPassword = {
        width: "100%",
        height: "45px",
        padding: '10px 45px 10px 15px',
        fontSize: "14px",
        border: "1px solid #D9D9D9",
        borderRadius: "10px",
        boxSizing: "border-box",
        transition: "border-color 0.2s"
    };

    const eyeButton = {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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

    const checkboxContainerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "25px",
        fontSize: "14px"
    };

    const checkboxLabelStyle = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer"
    };

    const checkboxStyle = {
        width: "18px",
        height: "18px",
        cursor: "pointer"
    };

    const forgotLinkStyle = {
        color: "#0085C7",
        textDecoration: "none",
        fontSize: "14px",
        cursor: "pointer",
        transition: "color 0.2s"
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

    // Charger l'email sauvegardé
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setFormData((prev) => ({
                ...prev,
                email: savedEmail,
                rememberMe: true,
            }));
        }

        // Vérifier si déjà connecté
        const token = localStorage.getItem("authToken");
        if (token) {
            alert("Vous êtes déjà connecté !");
            navigate("/");
        }
    }, [navigate]);

    // Gestion des changements
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
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
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // LOGIN
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetch(`${API_BASE_URL}/login_check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            // console.log('status : ', response.status);
            // console.log(response);



            if (!response.ok) {
                throw new Error("Email ou mot de passe incorrect");
            }

            const data = await response.json();
            // console.log("Réponse complète:", data);

            // Stocker le token
            localStorage.setItem("authToken", data.token);

            // Appel API /me

            const meResponse = await fetch(`${API_BASE_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            });
            // console.log("Status /api/me :", meResponse.status);
            // console.log("teste :", meResponse);


            if (!meResponse.ok) {
                throw new Error("Impossible de récupérer l'utilisateur");
            }

            const userData = await meResponse.json();
            // console.log(userData);
            

            // Stocker les infos utilisateur
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("userId", userData.id);
            // Gestion "Se souvenir de moi"
            if (formData.rememberMe) {
                localStorage.setItem("rememberedEmail", formData.email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            // alert(`Bienvenue ${userData.pseudo || userData.prenom || 'utilisateur'} !`);
            navigate("/");

        } catch (error) {
            console.error("Erreur login:", error);
            setErrors({ general: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Réinitialisation mot de passe
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
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: resetEmail })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi');
            }

            setResetSent(true);

            setTimeout(() => {
                setShowForgotPassword(false);
                setResetSent(false);
                setResetEmail("");
            }, 3000);

        } catch (error) {
            console.error("Erreur:", error);
            alert(error.message || "Une erreur est survenue");
        }
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
                        <div style={passwordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                style={errors.password ? inputErrorStyle : inputPassword}
                                onFocus={(e) => e.target.style.borderColor = "#0085C7"}
                                onBlur={(e) => e.target.style.borderColor = errors.password ? "#dc2626" : "#D9D9D9"}
                            />
                            <button
                                type="button"
                                style={eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {showPassword ? (
                                    <Eye size={20} color="#666" />
                                ) : (
                                    <EyeOff size={20} color="#666" />
                                )}
                            </button>
                        </div>

                        {errors.password && <div style={errorMessageStyle}>{errors.password}</div>}
                    </div>

                    {/* Se souvenir + Mot de passe oublié */}
                    <div style={checkboxContainerStyle}>
                        <label style={checkboxLabelStyle}>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                style={checkboxStyle}
                            />
                            <span>Se souvenir de moi</span>
                        </label>

                        {/* <span
                            style={forgotLinkStyle}
                            onClick={() => setShowForgotPassword(true)}
                            onMouseEnter={(e) => e.target.style.color = "#006ba3"}
                            onMouseLeave={(e) => e.target.style.color = "#0085C7"}
                        >
                            Mot de passe oublié ?
                        </span> */}
                        <span
                            style={forgotLinkStyle}
                            onClick={() => {
                                setResetEmail(formData.email); // Pré-remplir avec l'email saisi
                                setShowResetModal(true);
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#006ba3"}
                            onMouseLeave={(e) => e.target.style.color = "#0085C7"}
                        >
                            Mot de passe oublié ?
                        </span>

                    </div>


                    {/* Bouton connexion */}
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
                <ResetPasswordModal
                    isOpen={showResetModal}
                    onClose={() => setShowResetModal(false)}
                    mode="forgot"
                    email={resetEmail}
                />
            </div>

            {/* Modal Mot de passe oublié */}
            {showForgotPassword && (
                <div
                    style={modalOverlayStyle}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowForgotPassword(false);
                            setResetSent(false);
                            setResetEmail("");
                        }
                    }}
                >
                    <div style={modalStyle}>
                        <h2 style={{ marginTop: 0, color: "#0085C7" }}>Mot de passe oublié</h2>

                        {resetSent ? (
                            <div style={successMessageStyle}>
                                ✓ Un email de réinitialisation a été envoyé !
                            </div>
                        ) : (
                            <>
                                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                                </p>

                                <form onSubmit={handlePasswordReset}>
                                    <div style={inputGroupStyle}>
                                        <label htmlFor="resetEmail" style={labelStyle}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="resetEmail"
                                            placeholder="votre@email.com"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForgotPassword(false);
                                                setResetEmail("");
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: "12px",
                                                border: "2px solid #0085C7",
                                                backgroundColor: "white",
                                                color: "#0085C7",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            style={{
                                                flex: 1,
                                                padding: "12px",
                                                border: "none",
                                                backgroundColor: "#0085C7",
                                                color: "white",
                                                borderRadius: "10px",
                                                cursor: "pointer",
                                                fontWeight: "600"
                                            }}
                                        >
                                            Envoyer
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}