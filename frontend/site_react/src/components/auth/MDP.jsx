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
{/* Se souvenir de moi + Mot de passe oublié */ }
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
{/* Modal Mot de passe oublié */ }
{
    showForgotPassword && (
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
    )
}