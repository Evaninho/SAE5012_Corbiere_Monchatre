import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
    const styles = {
        footer: {
            backgroundColor: "#1F2937",
            color: "#FFFFFF",
            fontFamily: "Arial, sans-serif",
            marginTop: "auto",
            paddingTop: "60px",
            paddingBottom: "30px"
        },
        container: {
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px"
        },
        mainContent: {
            display: "grid",
            gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(4, 1fr)",
            gap: "40px",
            marginBottom: "40px"
        },
        column: {
            display: "flex",
            flexDirection: "column",
            gap: "15px"
        },
        columnTitle: {
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#0085C7"
        },
        link: {
            color: "#D1D5DB",
            textDecoration: "none",
            fontSize: "14px",
            transition: "color 0.2s",
            display: "block"
        },
        description: {
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#D1D5DB"
        },
        contactItem: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            color: "#D1D5DB"
        },
        olympicRings: {
            display: "flex",
            gap: "12px",
            marginTop: "15px",
            marginBottom: "20px"
        },
        ring: {
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "3px solid"
        },
        socialLinks: {
            display: "flex",
            gap: "15px",
            marginTop: "10px",
        },
        iconColor: { color: "#D1D5DB" },
        socialIcon: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s"
        },
        divider: {
            height: "1px",
            backgroundColor: "#374151",
            margin: "30px 0"
        },
        bottom: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            fontSize: "14px",
            color: "#9CA3AF"
        },
        bottomLinks: {
            display: "flex",
            gap: "20px",
            flexWrap: "wrap"
        },
        bottomLink: {
            color: "#9CA3AF",
            textDecoration: "none",
            fontSize: "13px",
            transition: "color 0.2s"
        }
    };

    const olympicColors = [
        { color: "#0085C7", name: "Bleu" },
        { color: "#F4C300", name: "Jaune" },
        { color: "#000000", name: "Noir" },
        { color: "#009F3D", name: "Vert" },
        { color: "#DF0024", name: "Rouge" }
    ];

    const navigationLinks = [
        { to: "/", label: "Accueil" },
        { to: "/statistiques", label: "Statistiques" },
        { to: "/actualites", label: "Actualités" },
        { to: "/jeux", label: "Jeux" },
        { to: "/contact", label: "Contact" }
    ];

    const legalLinks = [
        { to: "/mentions-legales", label: "Mentions légales" },
        { to: "/confidentialite", label: "Politique de confidentialité" },
        { to: "/cgv", label: "CGV" },
        { to: "/cookies", label: "Gestion des cookies" }
    ];

    const accountLinks = [
        { to: "/login", label: "Se connecter" },
        { to: "/register", label: "Créer un compte" },
        { to: "/profil", label: "Mon profil" },
        { to: "/abonnement", label: "Abonnements" }
    ];

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.mainContent}>
                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>OlymPeak</h3>
                        <p style={styles.description}>
                            Votre plateforme de référence pour suivre les Jeux Olympiques. 
                            Statistiques, actualités et analyses en temps réel.
                        </p>
                        
                        <div style={styles.olympicRings}>
                            {olympicColors.map((ring, index) => (
                                <div
                                    key={index}
                                    style={{...styles.ring, borderColor: ring.color}}
                                    title={ring.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>Navigation</h3>
                        {navigationLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                style={styles.link}
                                onMouseEnter={(e) => e.target.style.color = "#0085C7"}
                                onMouseLeave={(e) => e.target.style.color = "#D1D5DB"}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>Mon Compte</h3>
                        {accountLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                style={styles.link}
                                onMouseEnter={(e) => e.target.style.color = "#0085C7"}
                                onMouseLeave={(e) => e.target.style.color = "#D1D5DB"}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div style={styles.column}>
                        <h3 style={styles.columnTitle}>Contact</h3>
                        
                        <div style={styles.contactItem}>
                            <Mail size={18} />
                            <span>contact@olympeak.com</span>
                        </div>
                        
                        <div style={styles.contactItem}>
                            <Phone size={18} />
                            <span>+33 1 23 45 67 89</span>
                        </div>
                        
                        <div style={styles.contactItem}>
                            <MapPin size={18} />
                            <span>Paris, France</span>
                        </div>

                        <div style={styles.socialLinks}>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.socialIcon}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0085C7";
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#374151";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <Facebook size={20} style={styles.iconColor} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.socialIcon}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0085C7";
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#374151";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <Twitter size={20} style={styles.iconColor} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.socialIcon}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0085C7";
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#374151";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <Instagram size={20} style={styles.iconColor} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.socialIcon}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0085C7";
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#374151";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <Linkedin size={20} style={styles.iconColor} />
                            </a>
                        </div>
                    </div>
                </div>

                <div style={styles.divider}></div>

                <div style={styles.bottom}>
                    <p>© {new Date().getFullYear()} OlymPeak - Tous droits réservés</p>
                    
                    <div style={styles.bottomLinks}>
                        {legalLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                style={styles.bottomLink}
                                onMouseEnter={(e) => e.target.style.color = "#FFFFFF"}
                                onMouseLeave={(e) => e.target.style.color = "#9CA3AF"}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}