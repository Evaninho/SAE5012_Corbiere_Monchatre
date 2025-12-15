import React from 'react';

export function ContactPage() {

    const tire = {
        textAlign: "center",
        marginTop: "25px",
        marginBottom: "25px",
        fontFamily: "Arial, sans-serif",
        color: "#007BFF",
    };  
    const formElementStyle = {
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        paddingTop: "20px",
        paddingBottom: "40px",
        gap: "15px",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius:"25px",
        width: "40vw",
        margin: "0 auto",
        marginBottom: "20px",
        fontFamily: "Arial, sans-serif",
    };
    const inputStyle = {
        width: "38vw",
        height: "30px",
        padding: "10px",  
        borderRadius: "15px",
        border: "1px solid #D9D9D9",
        marginBottom: "15px",  
    };
    const inputStyleTextarea = {
        width: "38vw",
        height: "150px",
        padding: "10px",
        borderRadius: "15px",
        border: "1px solid #D9D9D9",
        marginBottom: "15px",  
    };
    const buttonStyle = {
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        width: "20vw",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    };

  return (
    <main>
      <h1 style={tire}>Contact</h1>
      <form style={formElementStyle}>
        <p>Une question, une suggestion ? N'hésitez pas à nous contacter !</p>

        <div>
          <label htmlFor="usernom">Nom complet :</label><br />
          <input type="text" id="usernom" name="usernom" placeholder="jean dupont" required style={inputStyle} />
        </div>vs
        <div>
          <label htmlFor="useremail">Email :</label><br />
          <input type="email" id="useremail" name="useremail" placeholder="jean.dupont@email.com" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="usersujet">Sujet :</label><br />
          <input type="text" id="usersujet" name="usersujet" placeholder="Sujet de votre message" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="usermessage">Message :</label><br />
          <textarea id="usermessage" name="usermessage" placeholder="Votre message ici..." required style={inputStyleTextarea} rows="5"></textarea>
        </div>

        <button type="submit" style={buttonStyle}>Envoyer</button>
      </form>
    </main>
  );
}
