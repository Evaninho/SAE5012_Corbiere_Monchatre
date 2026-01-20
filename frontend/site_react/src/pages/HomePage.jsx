import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, BarChart3, Newspaper, Play } from "lucide-react";
import Fondimg from "../components/image/fondAccueil.webp";
import CarrefourLogo from "../../public/images/Carrefour.svg";
import EDFLogo from "../../public/images/Edf.png";
import AllianzLogo from "../../public/images/Allianz.png";
import DecathlonLogo from "../../public/images/Decathlon.png";

export function HomePage() {
    const navigate = useNavigate();

    const pageStyle = {
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh"
    };

    const AccueilStyle = {
        textAlign: "center",
        position : "relative"
    };

    const fondAccueilStyle = {
        width: "100%",
        height: "auto",
        marginBottom: "40px",
        marginTop: "0px"
    };

    const NamePage= {
        position: "absolute",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "48px",
        fontWeight: "bold",
        color: "#0085C7",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "15px 150px",
        borderRadius: "15px",
        opacity: 0.9
    };

    const containerStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 20px"
    };

    const sectionStyle = {
        marginBottom: "60px"
    };

    const sectionTitle = {
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "40px",
        color: "#333"
    };

    const cardStyle = {
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px"
    };

    const presentationStyle = {
        ...cardStyle,
        textAlign: "center"
    };

    const presentationTitle = {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#0085C7",
        marginBottom: "20px"
    };

    const presentationText = {
        fontSize: "18px",
        lineHeight: "1.6",
        color: "#555"
    };

    const quickAccessStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
        marginTop: "30px"
    };

    const quickAccessCardStyle = {
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s",
        textAlign: "center"
    };

    const iconContainerStyle = (color) => ({
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px"
    });

    const cardTitleStyle = {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "12px",
        color: "#333"
    };

    const cardDescriptionStyle = {
        fontSize: "16px",
        color: "#666",
        lineHeight: "1.5"
    };

    const gamesSectionStyle = {
        borderRadius: "15px",
        padding: "40px 80px"
    };

    const gamesTitleStyle = {
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "10px"
    };

    const gamesSubtitleStyle = {
        fontSize: "16px",
        textAlign: "center",
        color: "#666",
        marginBottom: "30px"
    };

    const gamesGridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
    };

    const gameCardStyle = {
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    };

    const gameIconStyle = (color) => ({
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 15px",
        fontSize: "24px"
    });

    const gameCardTitleStyle = {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "10px"
    };

    const gameCardDescStyle = {
        fontSize: "14px",
        color: "#666"
    };

    const ctaButtonStyle = {
        display: "block",
        width: "300px",
        margin: "0 auto",
        padding: "15px 30px",
        backgroundColor: "#0085C7",
        color: "white",
        border: "none",
        borderRadius: "15px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        textDecoration: "none",
        textAlign: "center",
        transition: "all 0.3s"
    };

    const partnersGridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "30px",
        marginTop: "30px"
    };


   const partnerCardStyle = {
    backgroundColor: "white",
    borderRadius: "15px",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    };

    const partnerLogoStyle = {
        maxWidth: "120px",
        maxHeight: "60px",
        objectFit: "contain"
    };

    const gamesData = [
        { 
            title: "Quiz Rapide", 
            description: "Questions sur l'histoire olympique",
            color: "#0085C7",
            icon: "❓"
        },
        { 
            title: "Devine le Sport", 
            description: "Reconnaissez les disciplines",
            color: "#009F3D",
            icon: "🏅"
        },
        { 
            title: "Chrono Records", 
            description: "Battez les records de vitesse",
            color: "#DF0024",
            icon: "⏱️"
        }
    ];

    return (
        <div style={pageStyle}>
            <div style={AccueilStyle}>
                <img src={Fondimg} alt="Fond d'accueil" style={fondAccueilStyle} />
            </div>
            

            <div style={containerStyle}>
                <section style={sectionStyle}>
                    <div style={presentationStyle}>
                        <h2 style={presentationTitle}>À propos du projet</h2>
                        <p style={presentationText}>
                            Bienvenue sur notre plateforme dédiée aux Jeux Olympiques ! 
                            Découvrez les statistiques complètes des médailles par pays, 
                            suivez les actualités des athlètes et explorez l'histoire olympique 
                            à travers des données interactives et des articles passionnants.
                        </p>
                    </div>
                </section>

                <section style={sectionStyle}>
                    <h2 style={sectionTitle}>Explorez</h2>
                    <div style={quickAccessStyle}>
                        <div 
                            style={quickAccessCardStyle}
                            onClick={() => navigate('/statistiques')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            <div style={iconContainerStyle("#0085C7")}>
                                <BarChart3 size={32} color="white" />
                            </div>
                            <h3 style={cardTitleStyle}>Statistiques</h3>
                            <p style={cardDescriptionStyle}>
                                Consultez les médailles par pays et les performances historiques
                            </p>
                        </div>

                        <div 
                            style={quickAccessCardStyle}
                            onClick={() => navigate('/actualites')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            <div style={iconContainerStyle("#009F3D")}>
                                <Newspaper size={32} color="white" />
                            </div>
                            <h3 style={cardTitleStyle}>Actualités</h3>
                            <p style={cardDescriptionStyle}>
                                Suivez les dernières nouvelles et histoires des athlètes
                            </p>
                        </div>
                    </div>
                </section>

                <section style={sectionStyle}>
                    <div style={gamesSectionStyle}>
                        <h2 style={gamesTitleStyle}>Testez vos connaissances !</h2>
                        <p style={gamesSubtitleStyle}>
                            Trois modes de jeu pour devenir un expert olympique
                        </p>

                        <div style={gamesGridStyle}>
                            {gamesData.map((game, index) => (
                                <div key={index} style={gameCardStyle}>
                                    <div style={gameIconStyle(game.color)}>
                                        {game.icon}
                                    </div>
                                    <h3 style={gameCardTitleStyle}>{game.title}</h3>
                                    <p style={gameCardDescStyle}>{game.description}</p>
                                </div>
                            ))}
                        </div>

                        <Link 
                            to="/jeux" 
                            style={ctaButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#006ba3";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#0085C7";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            Jouer maintenant !
                        </Link>
                    </div>
                </section>

                <section style={sectionStyle}>
                    <h2 style={sectionTitle}>Nos Partenaires</h2>
                    <div style={partnersGridStyle}>
                        <div style={partnerCardStyle}>
                            <img src={CarrefourLogo} alt="Carrefour" style={partnerLogoStyle} />
                        </div>

                        <div style={partnerCardStyle}>
                            <img src={EDFLogo} alt="EDF" style={partnerLogoStyle} />
                        </div>

                        <div style={partnerCardStyle}>
                            <img src={AllianzLogo} alt="Allianz" style={partnerLogoStyle} />
                        </div>

                        <div style={partnerCardStyle}>
                            <img src={DecathlonLogo} alt="Decathlon" style={partnerLogoStyle} />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}