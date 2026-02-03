import { useState } from 'react';

const DREAM_RESPONSES = [
  "Les rêves demandent du temps et du courage. Continue d’avancer, même lentement.",
  "Ton rêve est déjà en marche. Chaque pas compte.",
  "Ce que tu désires façonne la personne que tu deviens.",
  "Les lignes ne sont jamais droites, mais elles mènent toujours quelque part.",
  "Même dans l’ombre, la lumière apprend à naître.",
  "Avancer, c’est déjà réussir.",
  "Ce que tu imagines aujourd’hui devient possible demain.",
  "Ton rêve te ressemble plus que tu ne le penses.",
];

export function DreamAI() {
  const [dream, setDream] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!dream.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      const random =
        DREAM_RESPONSES[Math.floor(Math.random() * DREAM_RESPONSES.length)];
      setResponse(random);
      setLoading(false);
    }, 1200);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, var(--bg-dark), var(--bg-dark))',
        border: '1px solid rgba(244, 197, 66, 0.4)',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        maxWidth: '640px',
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(244, 197, 66, 0.08)',
      }}
    >
      {/* Question */}
      <h2
  style={{
    marginBottom: '2rem',
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 200,
    letterSpacing: '0.12em',
    lineHeight: 1.3,
    color: 'var(--text-bright)',
    textShadow: '0 0 20px rgba(244, 197, 66, 0.25)',
  }}
>
  Et toi ?
  <br />
  Quel est ton rêve ?
</h2>



      {/* Input */}
      <input
        type="text"
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Écris ton rêve ici…"
        style={{
          width: '100%',
          background: 'transparent',
          border: '1px solid var(--text-dim)',
          color: 'var(--text-bright)',
          padding: '0.9rem 1rem',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '1rem',
          outline: 'none',
          marginBottom: '1.5rem',
        }}
      />

      {/* Bouton */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '0.6rem 2rem',
          borderRadius: '999px',
          border: '1px solid var(--accent-light)',
          background: loading ? 'transparent' : 'var(--accent-light)',
          color: loading ? 'var(--text-dim)' : '#000',
          fontSize: '0.75rem',
          letterSpacing: '0.25em',
          cursor: loading ? 'default' : 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '1.5rem',
        }}
      >
        {loading ? '…' : 'CONFIER'}
      </button>

      {/* Réponse */}
      {response && (
        <p
          className="animate-fadeIn"
          style={{
            marginTop: '1.5rem',
            color: 'var(--text-medium)',
            fontStyle: 'italic',
          }}
        >
          “{response}”
        </p>
      )}
    </div>
  );
}
