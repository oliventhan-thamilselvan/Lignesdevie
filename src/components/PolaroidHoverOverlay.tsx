interface Props {
    polaroid: {
      image: string;
      title: string;
      text: string;
      text2?: string;
    } | null;
  }
  
  export function PolaroidHoverOverlay({ polaroid }: Props) {
    if (!polaroid) return null;
  
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{
          pointerEvents: 'none',
          zIndex: 99999,
          isolation: 'isolate',
        }}
      >
        {/* FOND NOIR 75% */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        />
  
        {/* CONTENEUR CENTRAL AVEC MARGES LARGES */}
        <div
          className="relative flex items-center w-full max-w-[1400px]"
          style={{
            paddingLeft: '6rem',
            paddingRight: '6rem',
            gap: '3rem',
          }}
        >
          {/* IMAGE (PLUS GRANDE) */}
          <div
            className="flex-shrink-0"
            style={{
              width: '450px',
            }}
          >
            <img
              src={polaroid.image}
              alt={polaroid.title}
              className="w-full max-h-[72vh] object-contain shadow-2xl rounded-xl"
            />
          </div>
  
          {/* TEXTE (PLUS PETIT, PLUS AÉRÉ) */}
          <div className="flex-1 space-y-4">
            <h2
              className="uppercase text-white"
              style={{
                fontFamily: '"Anton", sans-serif',
                fontSize: '2.1rem', // ⬅️ plus petit
                letterSpacing: '0.18em',
                opacity: 0.85,
              }}
            >
              {polaroid.title}
            </h2>
  
            <p
              className="text-white leading-relaxed"
              style={{
                fontSize: '1rem', // ⬅️ plus petit
                opacity: 0.85,
                maxWidth: '520px',
              }}
            >
              {polaroid.text2 || polaroid.text}
            </p>
          </div>
        </div>
      </div>
    );
  }
  