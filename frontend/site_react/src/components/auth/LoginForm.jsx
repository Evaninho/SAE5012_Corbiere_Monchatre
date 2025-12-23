import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoImage from "../image/LOGO_OFFI.png";

export function LoginForm() {
    const navigate = useNavigate();

    const API_BASE_URL = "http://localhost:8000/api";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/login_check`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Email ou mot de passe incorrect");
                }
                throw new Error("Erreur serveur");
            }

            const data = await response.json();

            if (!data.token) {
                throw new Error("Token JWT non reçu");
            }

            // ✅ Stockage du token
            localStorage.setItem("authToken", data.token);

            // ✅ Redirection
            navigate("/");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p style={styles.footer}>
                    Pas de compte ?{" "}
                    <Link to="/register" style={styles.link}>
                        Inscription
                    </Link>
                </p>
            </div>
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
