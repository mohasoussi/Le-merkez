"use client";

// Dernier filet de sécurité : jamais de détail technique affiché à l'utilisateur.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, textAlign: "center", padding: 16 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Une erreur est survenue.</h1>
          <p style={{ color: "#6b6b76" }}>Veuillez réessayer dans un instant.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: "10px 18px", borderRadius: 10, border: 0, background: "#0a0a0f", color: "#fff", cursor: "pointer" }}>
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
