import { useState } from 'react';

// URL de votre backend (changez si nécessaire)
const BACKEND_URL = 'http://localhost:3001';

export function DreamAI() {
  const [dream, setDream] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!dream.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dream: dream.trim() }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Erreur:', error);
      setResponse("L'IA est momentanément indisponible. Ton rêve n'en reste pas moins précieux.");
    } finally {
      setLoading(false);
    }
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
      <h2
        style={{
          marginBottom: '2rem',
          fontFamily: '"Permanent Marker", cursive',
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
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />

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
        {loading ? '✨ L\'IA réfléchit…' : 'CONFIER À L\'IA'}
      </button>

      {response && (
        <div className="animate-fadeIn">
          <p
            style={{
              marginTop: '1.5rem',
              color: 'var(--text-medium)',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}
          >
            ✨ {response} ✨
          </p>
          <p style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.75rem', 
            opacity: 0.5,
            fontStyle: 'italic'
          }}>
            Réponse générée par intelligence artificielle
          </p>
        </div>
      )}
    </div>
  );
}