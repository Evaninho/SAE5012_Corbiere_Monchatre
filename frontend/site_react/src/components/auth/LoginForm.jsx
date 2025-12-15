import React from "react";
import logoImage from "../image/LOGO_OFFI.png";
import { Link } from "react-router-dom";


export function LoginForm(params) {
    const formStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "45vw",
        margin: "0 auto",
        paddingBottom: "8vh",
        fontFamily: "Arial, sans-serif",
        gap: "10px",
        border:"2px solid #0085C7",
        borderRadius:"25px",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
        width: "34vw",
        height: "30px",
        padding: "10px",  
        borderRadius: "15px",
        border: "1px solid #D9D9D9",
        marginBottom: "15px",  
    };
    const stylediv = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };
    const buttonStyle = {
        padding: "10px 20px",
        width: "35vw",
        height: "60px",
        marginTop: "30px",
        margin: "0 auto",
        backgroundColor: "#0085C7", 
        color: "#fff",
        border: "none",
        borderRadius: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
    };
    const linkStyle = {
        textDecoration: "none",
        color: "#0085C7",
    };
   
    return (
        <div style={formStyle}>
            <img src={logoImage} alt="OlymPeak" style={logo} /> 
            <h1>Bienvenue !</h1>
            <legend style={legendStyle}>Connectez-vous pour accéder à votre compte</legend>
            <form style={formElementStyle}>
                <div>
                    <label htmlFor="useremail">Email :</label>
                    <input type="text" id="useremail" name="useremail" placeholder="votre@email.com" required style={inputStyle} />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe :</label>
                    <input type="password" id="password" name="password" placeholder="votre mot de passe" required style={inputStyle} />
                </div>
                <div style={stylediv}>
                    <div>
                        <input type="checkbox" id="rememberMe" name="rememberMe" />
                        <label htmlFor="rememberMe">Se souvenir de moi</label>
                    </div>
                    
                    <Link to="/forgot-password" style={linkStyle}>mot de passe oublié ?</Link>
                </div>
                
                
                <button type="submit" style={buttonStyle}>Se connecter</button>
            </form>
            <p>Pas encore de compte ? <Link to="/register" style={linkStyle}>S'inscrire gratuitement</Link></p>
        </div>
    );
}