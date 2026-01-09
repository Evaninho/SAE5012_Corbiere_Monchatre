import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "../image/LOGO_OFFI.png";

export function RegisterForm() {
    const navigate = useNavigate();
    const API_BASE_URL = "http://localhost:8000/api";

    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
        pays: "France",
        sports: [],
        // roles: [],
        acceptCGU: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    const paysList = [ "Autre", "Afrique du Sud", "Algérie", "Allemagne", "Argentine", "Australie", "Autriche", "Belgique", "Brésil", "Canada", "Chine", "Corée du Sud", "Côte d'Ivoire", "Danemark", "Espagne", "États-Unis", "Finlande", "France", "Grèce", "Inde", "Irlande", "Italie", "Japon", "Luxembourg", "Maroc", "Mexique", "Norvège", "Nouvelle-Zélande", "Pays-Bas", "Portugal", "Royaume-Uni", "Russie", "Sénégal", "Suède", "Suisse", "Tunisie" ];

    const sportsList = [
        "Athlétisme", "Natation", "Gymnastique",
        "Basketball", "Football", "Tennis"
    ];

    const formStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "45vw",
        minWidth: "320px",
        margin: "0 auto",
        paddingBottom: "8vh",
        fontFamily: "Arial, sans-serif",
        gap: "10px",
        borderRadius: "25px",
        padding: "20px",
        marginTop: "40px",
        marginBottom: "40px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#f9f9f9",
    };

    const legendStyle = {
        marginBottom: "20px",
        color: "#555",
    };

    const logo = {
        width: "120px",
        marginTop: "5vh",
    };

    const formElementStyle = {
        width: "80%",
        marginBottom: "15px",
    };

    const inputStyle = {
        width: "100%",
        height: "30px",
        padding: "10px",
        borderRadius: "15px",
        border: "1px solid #D9D9D9",
        marginBottom: "15px",
        fontSize: "14px"
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
        marginTop: "-10px",
        marginBottom: "10px"
    };

    const buttonStyleSend = {
        padding: "10px 20px",
        width: "100%",
        maxWidth: "35vw",
        height: "60px",
        marginTop: "30px",
        backgroundColor: "#009F3D",
        color: "#fff",
        border: "none",
        borderRadius: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
    };

    const buttonStyleContinue = {
        padding: "10px 20px",
        width: "100%",
        maxWidth: "17vw",
        height: "60px",
        marginTop: "30px",
        marginLeft: "10px",
        backgroundColor: "#0085C7",
        color: "#fff",
        border: "none",
        borderRadius: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
    };

    const buttonStyleBack = {
        padding: "10px 20px",
        width: "100%",
        maxWidth: "17vw",
        height: "60px",
        marginTop: "30px",
        border: "2px solid #0085C7",
        backgroundColor: "transparent",
        color: "#0085C7",
        borderRadius: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "#0085C7",
    };

    const stepContainerStyle = {
        display: "flex",
        gap: "15px",
        alignItems: "center",
        marginBottom: "20px"
    };

    const stepStyle = (step) => ({
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "18px",
        backgroundColor: currentStep === step ? "#0085C7" : currentStep > step ? "#009F3D" : "#D9D9D9",
        color: currentStep >= step ? "#fff" : "#666",
        transition: "all 0.3s"
    });

    const checkboxStyle = {
        width: "18px",
        height: "18px",
        marginRight: "8px",
        cursor: "pointer"
    };

    const checkboxLabelStyle = {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        fontSize: "14px"
    };

    const selectStyle = {
        width: "100%",
        height: "50px",
        padding: "10px",
        borderRadius: "15px",
        border: "1px solid #D9D9D9",
        marginBottom: "15px",
        fontSize: "14px"
    };

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

    const handleSportChange = (sport) => {
        const isSelected = formData.sports.includes(sport);
        const newSports = isSelected ? [] : [sport];

        setFormData({ ...formData, sports: newSports });
        if (errors.sports) {
            setErrors({ ...errors, sports: "" });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.prenom.trim()) {
            newErrors.prenom = "Le prénom est requis";
        }

        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom est requis";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est requis";
        } else if (formData.username.length < 3) {
            newErrors.username = "Au moins 3 caractères";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
            newErrors.password = "Au moins 8 caractères";
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = "Doit contenir une majuscule";
        } else if (!/(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = "Doit contenir un chiffre";
        }

        if (!formData.passwordConfirm) {
            newErrors.passwordConfirm = "Confirmez le mot de passe";
        } else if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (formData.sports.length === 0) {
            newErrors.sports = "Sélectionnez au moins un sport";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.acceptCGU) {
            setErrors({ acceptCGU: "Vous devez accepter les CGU" });
            return;
        }

        setIsSubmitting(true);

        try {
            // ========== ENVOI À SYMFONY ==========
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ld+json',
                    'Accept': 'application/ld+json'
                },
                body: JSON.stringify({
                    // Données envoyées à Symfony
                    prenom: formData.prenom,      // Symfony attend firstName
                    nom: formData.nom,          // Symfony attend lastName
                    email: formData.email,
                    pseudo: formData.username,
                    password: formData.passwordConfirm,     // Sera hashé côté Symfony
                    pays: formData.pays,
                    sportFavoris: formData.sports[0] || "",
                    // roles: ["ROLE_USER"]
                })
            });
            console.log('status : ', response.status)

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400) {
                    // Erreur de validation
                    throw new Error(errorData.message || 'Données invalides');
                } else if (response.status === 409) {
                    // Email ou username déjà utilisé
                    throw new Error('Cet email ou nom d\'utilisateur existe déjà');
                }
                throw new Error('Erreur lors de l\'inscription');
            }
            // if (!response.ok) {
            //     const error = await response.json();
            //     console.error("Erreur API:", error);
            //     throw new Error(error['hydra:description'] || 'Erreur 400');
            // }

            // const data = await response.json();

            // console.log('Inscription réussie:', data);

            // 2️⃣ Login automatique
            const loginResponse = await fetch(`${API_BASE_URL}/login_check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!loginResponse.ok) {
                throw new Error('Connexion automatique impossible');
            }

            const loginData = await loginResponse.json();
            localStorage.setItem('authToken', loginData.token);

            // 3️⃣ Récupération user connecté
            const meResponse = await fetch(`${API_BASE_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${loginData.token}`
                }
            });

            const userData = await meResponse.json();
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userId', userData.id);

            // Connexion automatique après inscription
            // if (data.token) {
            //     localStorage.setItem('authToken', data.token);
            //     localStorage.setItem('userData', JSON.stringify(data.user));
            // }

            alert('Inscription réussie ! Bienvenue ' + formData.prenom + ' !');
            navigate('/');

        } catch (error) {
            console.error('Erreur inscription:', error);
            alert(error.message || 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={formStyle}>
            <img src={logoImage} alt="OlymPeak" style={logo} />
            <h1>Créer un compte</h1>
            <legend style={legendStyle}>Rejoignez la communauté Olympeak</legend>

            <div style={stepContainerStyle}>
                <div style={stepStyle(1)}>{currentStep > 1 ? "✓" : "1"}</div>
                <div style={{ width: "40px", height: "2px", backgroundColor: currentStep > 1 ? "#009F3D" : "#D9D9D9" }}></div>
                <div style={stepStyle(2)}>{currentStep > 2 ? "✓" : "2"}</div>
                <div style={{ width: "40px", height: "2px", backgroundColor: currentStep > 2 ? "#009F3D" : "#D9D9D9" }}></div>
                <div style={stepStyle(3)}>3</div>
            </div>

            <form style={formElementStyle} onSubmit={handleSubmit}>
                {currentStep === 1 && (
                    <>
                        <h2>Informations de base</h2>

                        <div>
                            <label htmlFor="prenom">Prénom* :</label>
                            <input
                                type="text"
                                id="prenom"
                                name="prenom"
                                placeholder="Votre prénom"
                                value={formData.prenom}
                                onChange={handleChange}
                                style={errors.prenom ? inputErrorStyle : inputStyle}
                            />
                            {errors.prenom && <div style={errorMessageStyle}>{errors.prenom}</div>}
                        </div>

                        <div>
                            <label htmlFor="nom">Nom* :</label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                placeholder="Votre nom"
                                value={formData.nom}
                                onChange={handleChange}
                                style={errors.nom ? inputErrorStyle : inputStyle}
                            />
                            {errors.nom && <div style={errorMessageStyle}>{errors.nom}</div>}
                        </div>

                        <div>
                            <label htmlFor="email">Email* :</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={errors.email ? inputErrorStyle : inputStyle}
                            />
                            {errors.email && <div style={errorMessageStyle}>{errors.email}</div>}
                        </div>

                        <div>
                            <label htmlFor="username">Nom d'utilisateur* :</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="@votre_pseudo"
                                value={formData.username}
                                onChange={handleChange}
                                style={errors.username ? inputErrorStyle : inputStyle}
                            />
                            {errors.username && <div style={errorMessageStyle}>{errors.username}</div>}
                        </div>

                        <div>
                            <label htmlFor="password">Mot de passe* :</label>
                            <div style={passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Minimum 8 caractères"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={errors.password ? inputErrorStyle : inputPassword}
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
                            <div style={{ fontSize: "11px", color: "#666", marginTop: "3px", marginBottom: "10px" }}>
                                Minimum 8 caractères, 1 majuscule, 1 chiffre
                            </div>
                        </div>

                        <div>
                            <label htmlFor="passwordConfirm">Confirmez le mot de passe* :</label>
                            <div style={passwordContainer}>
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    placeholder="Confirmez votre mot de passe"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    style={errors.passwordConfirm ? inputErrorStyle : inputPassword}
                                />
                                <button
                                    type="button"
                                    style={eyeButton}
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    title={showPasswordConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {showPasswordConfirm ? (
                                        <Eye size={20} color="#666" />
                                    ) : (
                                        <EyeOff size={20} color="#666" />
                                    )}
                                </button>
                            </div>

                            {errors.passwordConfirm && <div style={errorMessageStyle}>{errors.passwordConfirm}</div>}
                        </div>

                        <button type="button" onClick={handleNext} style={buttonStyleContinue}>
                            Continuer
                        </button>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <h2>Vos préférences</h2>

                        <div>
                            <label htmlFor="pays">Pays :</label>
                            <select
                                id="pays"
                                name="pays"
                                value={formData.pays}
                                onChange={handleChange}
                                style={selectStyle}
                            >
                                {paysList.map(pays => (
                                    <option key={pays} value={pays}>{pays}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Votre Sport favori * :</label>
                            <div style={{ marginTop: "10px" }}>
                                {sportsList.map(sport => (
                                    <label key={sport} style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            checked={formData.sports.includes(sport)}
                                            onChange={() => handleSportChange(sport)}
                                            style={checkboxStyle}
                                        />
                                        {sport}
                                    </label>
                                ))}
                            </div>
                            {errors.sports && <div style={errorMessageStyle}>{errors.sports}</div>}
                        </div>

                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button type="button" onClick={handleBack} style={buttonStyleBack}>
                                Retour
                            </button>
                            <button type="button" onClick={handleNext} style={buttonStyleContinue}>
                                Continuer
                            </button>
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <h2>Finalisation</h2>

                        <div style={{
                            backgroundColor: "#e0f2fe",
                            padding: "15px",
                            borderRadius: "10px",
                            border: "1px solid #0085C7",
                            marginBottom: "20px"
                        }}>
                            <h3 style={{ marginTop: 0, color: "#0085C7" }}>
                                👑 Essayez Plus gratuitement pendant 30 jours !
                            </h3>
                            <ul style={{ fontSize: "14px", paddingLeft: "20px" }}>
                                <li>✓ Certification associée</li>
                                <li>✓ Personnalisation avancée</li>
                                <li>✓ Notifications en avant-première</li>
                            </ul>
                            <p style={{ fontSize: "12px", color: "#666", marginBottom: 0 }}>
                                Sans engagement, annulez quand vous voulez
                            </p>
                        </div>

                        <label style={checkboxLabelStyle}>
                            <input
                                type="checkbox"
                                name="acceptCGU"
                                checked={formData.acceptCGU}
                                onChange={handleChange}
                                style={checkboxStyle}
                            />
                            <span>
                                J'accepte les <Link to="/cgu" style={linkStyle}>conditions d'utilisation</Link> et
                                la <Link to="/confidentialite" style={linkStyle}>politique de confidentialité</Link> *
                            </span>
                        </label>
                        {errors.acceptCGU && <div style={errorMessageStyle}>{errors.acceptCGU}</div>}

                        {/* <label style={checkboxLabelStyle}>
                            <input
                                type="checkbox"
                                name="newsletter"
                                checked={formData.newsletter}
                                onChange={handleChange}
                                style={checkboxStyle}
                            />
                            Je souhaite recevoir les actualités et offres exclusives par email
                        </label>*/}

                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button type="button" onClick={handleBack} style={buttonStyleBack}>
                                Retour
                            </button>
                            <button type="submit" disabled={isSubmitting} style={buttonStyleSend}>
                                {isSubmitting ? 'Création...' : 'Créer mon compte'}
                            </button>
                        </div>
                    </>
                )}
            </form>

            <p>
                Vous avez déjà un compte ? <Link to="/login" style={linkStyle}>Se connecter</Link>
            </p>
        </div>
    );
}