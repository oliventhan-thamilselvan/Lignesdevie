import { useState } from 'react';

const DREAM_RESPONSES = [
  "Les rêves demandent du temps et du courage. Continue d’avancer, même lentement.",
  "Ton rêve est déjà en marche. Chaque pas compte, même les plus discrets.",
  "Ce que tu désires façonne la personne que tu deviens. Fais-lui confiance.",
  "Les lignes ne sont jamais droites, mais elles mènent toujours quelque part.",
  "Ton rêve te ressemble plus que tu ne le penses. Laisse-le respirer.",
  "Avancer, c’est déjà réussir. Le reste viendra.",
  "Même dans l’ombre, la lumière apprend à naître.",
  "Ce que tu imagines aujourd’hui devient possible demain.",
];

export function DreamAI() {
  const [dream, setDream] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!dream.trim() || loading) return;

    setLoading(true);
    setResponse(null);

    // Simulation de "réflexion"
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * DREAM_RESPONSES.length);
      setResponse(DREAM_RESPONSES[randomIndex]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="pt-12 space-y-8 text-center">
      {/* Question */}
      <h2 className="text-3xl md:text-4xl font-light tracking-wide text-white">
        Et toi ? Quel est ton rêve ?
      </h2>

      {/* Input */}
      <input
        type="text"
        value={dream}
        onChange={(e) => setDream(e.target.value)}
        placeholder="Écris ton rêve ici…"
        className="
          w-full max-w-md mx-auto
          bg-transparent border border-white/30
          text-white text-center
          px-5 py-3 rounded-md
          focus:outline-none focus:border-white
          transition
        "
      />

      {/* Bouton */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`
          inline-block px-8 py-2
          border rounded-md text-sm tracking-widest
          transition
          ${
            loading
              ? 'border-white/30 text-white/40 cursor-not-allowed'
              : 'border-white text-white hover:bg-white hover:text-black'
          }
        `}
      >
        {loading ? '…' : 'CONFIER'}
      </button>

      {/* Réponse */}
      {response && (
        <p className="text-lg md:text-xl opacity-80 max-w-xl mx-auto animate-fadeIn">
          {response}
        </p>
      )}
    </div>
  );
}
