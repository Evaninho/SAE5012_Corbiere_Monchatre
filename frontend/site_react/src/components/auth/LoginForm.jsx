import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImage from "../image/LOGO_OFFI.png";

export function LoginForm() {
    const navigate = useNavigate();

<<<<<<< HEAD
    const API_BASE_URL = "http://localhost:8000/api";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
=======
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);

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
>>>>>>> e03dd71e8427e86dc2c9ed067189fc00dec22f75

        try {
            const response = await fetch(`${API_BASE_URL}/login_check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
<<<<<<< HEAD
                    email: email,
                    password: password,
=======
                    email: formData.email,
                    password: formData.password,
>>>>>>> e03dd71e8427e86dc2c9ed067189fc00dec22f75
                }),
            });

            if (!response.ok) {
<<<<<<< HEAD
                if (response.status === 401) {
                    throw new Error("Email ou mot de passe incorrect");
                }
                throw new Error("Erreur serveur");
=======
                throw new Error("Email ou mot de passe incorrect");
>>>>>>> e03dd71e8427e86dc2c9ed067189fc00dec22f75
            }

            const data = await response.json();
            console.log("Réponse complète:", data);

<<<<<<< HEAD
            if (!data.token) {
                throw new Error("Token JWT non reçu");
            }

            // ✅ Stockage du token
            localStorage.setItem("authToken", data.token);

            // ✅ Redirection
            navigate("/");

        } catch (err) {
            setError(err.message);
=======
            // Stocker le token
            localStorage.setItem("authToken", data.token);

            // Décoder le JWT pour récupérer les infos utilisateur
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            // console.log("Payload JWT:", payload);
            const userId = payload.id || payload.user_id || payload.sub;
            // Récupérer les infos complètes de l'utilisateur depuis l'API
            const userResponse = await fetch(`${API_BASE_URL}/users/3`, {
                headers: {
                    "Authorization": `Bearer ${data.token}`
                }
            });

            let userData;
            if (userResponse.ok) {
                const userDataResponse = await userResponse.json();
                userData = userDataResponse.data || userDataResponse;
                console.log('ok');
                
            } else {
                // Si l'API profile n'existe pas encore, créer un objet depuis le JWT
                console.log('acestdomage');
                
                userData = {
                    id: payload.id || payload.user_id,
                    email: payload.username || formData.email,
                    pseudo: payload.pseudo || payload.username?.split('@')[0] || "Utilisateur",
                    prenom: payload.prenom || "",
                    nom: payload.nom || "",
                    roles: payload.roles || []
                };
            }

            // Stocker les données utilisateur
            localStorage.setItem("userData", JSON.stringify(userData));
            // console.log("Données utilisateur stockées:", userData);

            // Gestion "Se souvenir de moi"
            if (formData.rememberMe) {
                localStorage.setItem("rememberedEmail", formData.email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            alert(`Bienvenue ${userData.pseudo || userData.prenom || 'utilisateur'} !`);
            navigate("/");

        } catch (error) {
            console.error("Erreur login:", error);
            setErrors({ general: error.message });
>>>>>>> e03dd71e8427e86dc2c9ed067189fc00dec22f75
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
=======
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

>>>>>>> e03dd71e8427e86dc2c9ed067189fc00dec22f75
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <img src={logoImage} alt="OlymPeak" style={styles.logo} />
                <h1 style={styles.title}>Connexion</h1>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                        autoComplete="email"
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                        autoComplete="current-password"
                    />

<<<<<<< HEAD
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Connexion..." : "Se connecter"}
=======
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

                        <span
                            style={forgotLinkStyle}
                            onClick={() => setShowForgotPassword(true)}
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
>>>>>>> e03dd71e8427e86dc2c9ed067189fc00dec22f75
                    </button>
                </form>

                <p style={styles.footer}>
                    Pas de compte ?{" "}
                    <Link to="/register" style={styles.link}>
                        Inscription
                    </Link>
                </p>
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

/* ================= STYLES ================= */

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
    },
    container: {
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        width: "350px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    logo: {
        width: "100px",
        marginBottom: "20px",
    },
    title: {
        marginBottom: "20px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    button: {
        width: "100%",
        padding: "10px",
        background: "#0085C7",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "15px",
    },
    footer: {
        marginTop: "15px",
        fontSize: "14px",
    },
    link: {
        color: "#0085C7",
        fontWeight: "bold",
        textDecoration: "none",
    },
};
