import React from 'react';

export function GameIntroPage() {
  const mainStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    color: "#0085C7",
    marginBottom: "10px",
    textAlign: "center",
  };

  const subtitleStyle = {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#555",
    marginBottom: "40px",
  };

  const sectionStyle = {
    marginBottom: "60px",
  };

  const sectionTitleStyle = {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#222",
  };

  const quizGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "24px",
  };

  const quizCardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    background: "linear-gradient(145deg, #ffffff, #f1f5f9)",
    borderRadius: "16px",
    padding: "20px",
    color: "#0085C7",
    height: "180px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };

  const quizImageStyle = {
    width: "64px",
    height: "64px",
    objectFit: "contain",
    marginBottom: "14px",
  };

  const quizTextStyle = {
    fontWeight: 600,
    fontSize: "1rem",
    textAlign: "center",
  };

  const gameBoxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    padding: "30px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #0085C7, #005f99)",
    color: "white",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    flexWrap: "wrap",
  };

  const gameTextStyle = {
    maxWidth: "600px",
  };

  const gameButtonStyle = {
    padding: "16px 36px",
    fontSize: "1.2rem",
    fontWeight: 700,
    borderRadius: "50px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #FFD700, #FFB700)",
    color: "#222",
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <main style={mainStyle}>
      <h1 style={titleStyle}>🏅 Jeux Olympiques</h1>
      <p style={subtitleStyle}>
        Découvre les règles, teste tes connaissances et bats des records mondiaux
      </p>

      {/* QUIZ */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>🧠 Quiz sur les Jeux Olympiques</h2>
        <div style={quizGridStyle}>
          {[
            {
              title: "JO Paris 2024",
              img: "https://cdn-icons-png.flaticon.com/128/1926/1926496.png",
              link: "https://www.jetpunk.com/user-quizzes/1812795/jeux-olympiques-paris-2024",
            },
            {
              title: "Sports olympiques",
              img: "https://cdn-icons-png.flaticon.com/128/4163/4163684.png",
              link: "https://www.jetpunk.com/user-quizzes/1269592/sports-aux-jeux-olympiques-de-paris-2024",
            },
            {
              title: "Tableau des médailles",
              img: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
              link: "https://www.jetpunk.com/user-quizzes/2131904/jeux-olympiques-2024-tableau-des-medailles",
            },
            {
              title: "Villes hôtes",
              img: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              link: "https://www.jetpunk.com/user-quizzes/68189/villes-hotesses-des-jo-dete",
            },
            {
              title: "Pays organisateurs",
              img: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
              link: "https://www.jetpunk.com/user-quizzes/176412/pays-hotes-des-jeux-olympiques",
            },
            {
              title: "Plus de quiz JO",
              img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
              link: "https://www.jetpunk.com/fr/tags/jeux-olympiques",
            },
          ].map((quiz) => (
            <a
              key={quiz.title}
              href={quiz.link}
              target="_blank"
              rel="noopener noreferrer"
              style={quizCardStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <img src={quiz.img} alt={quiz.title} style={quizImageStyle} />
              <span style={quizTextStyle}>{quiz.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* JEUX */}
      <section>
        <div style={gameBoxStyle}>
          <div style={gameTextStyle}>
            <h2>🎮 Jeux records mondiaux</h2>
            <p>
              Participe à des épreuves olympiques interactives et tente de battre
              les meilleurs scores.
            </p>
          </div>

          <button
            style={gameButtonStyle}
            onClick={() => (window.location.href = "/jeujo/menu.html")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            🚀 Lancer les jeux
          </button>
        </div>
      </section>
    </main>
  );
}

