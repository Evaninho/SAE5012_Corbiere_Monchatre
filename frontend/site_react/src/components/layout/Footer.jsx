import React from "react";
import { Link } from "react-router-dom";

export function Footer(params) {
    const footerStyle = {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#1F2937",
        padding: "20px",
        marginTop: "auto",
        fontFamily: "Arial, sans-serif",
        height: "10vh",
        color: "#FFFFFF",
    };
    return (
        <footer style={footerStyle}>
            <p>© 2025  OlymPeak - Tous droits réservés</p>
        </footer>
    );
}