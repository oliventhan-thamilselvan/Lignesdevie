interface Props {
    polaroid: {
      image: string;
      title: string;
      text: string;
    } | null;
  }
  
  export function PolaroidHoverOverlay({ polaroid }: Props) {
    if (!polaroid) return null;
  
    return (
      <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
        {/* FOND NOIR 75% */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
  
        {/* CONTENU CENTRÉ */}
        <div className="relative z-10 flex items-center gap-20 max-w-6xl w-full px-16">
          {/* IMAGE */}
          <div className="w-1/2 flex justify-center animate-fadeIn">
            <img
              src={polaroid.image}
              alt={polaroid.title}
              className="max-h-[70vh] object-contain shadow-2xl"
            />
          </div>
  
          {/* TEXTE */}
          <div className="w-1/2 space-y-6 animate-fadeIn text-left">
            <h2
              className="text-4xl uppercase"
              style={{
                fontFamily: '"Anton", sans-serif',
                letterSpacing: '0.15em',
                opacity: 0.9,
              }}
            >
              {polaroid.title}
            </h2>
  
            <p className="text-lg opacity-80 leading-relaxed max-w-md">
              {polaroid.text}
            </p>
          </div>
        </div>
      </div>
    );
  }
  