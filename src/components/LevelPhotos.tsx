import { ImageWithFallback } from './figma/ImageWithFallback';

interface LevelPhotosProps {
  levelId: string;
  levelName: string;
  levelTitle: string;
  levelSubtitle: string;
}

interface LevelPhotoData {
  topImage: string;
  bottomImage: string;
  topText: string;
  bottomText: string;
}

const LEVEL_PHOTOS: Record<string, LevelPhotoData> = {
  chaos: {
    topImage: 'https://images.unsplash.com/photo-1695279087980-6f3d3102bf15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHdhciUyMGNoYW9zJTIwMTk5MHN8ZW58MXx8fHwxNzcwMDgxNTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bottomImage: 'https://images.unsplash.com/photo-1695279087980-6f3d3102bf15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYSUyMHdhciUyMGNoYW9zJTIwMTk5MHN8ZW58MXx8fHwxNzcwMDgxNTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    topText: 'Les premières années dans le tumulte',
    bottomText: 'Sri Lanka, années 1990',
  },
  constraint: {
    topImage: 'https://images.unsplash.com/photo-1654632011771-62b5eea154b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2hpbGRob29kJTIwY29uc3RyYWludCUyMHNoYWRvd3N8ZW58MXx8fHwxNzcwMDgxNTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bottomImage: 'https://images.unsplash.com/photo-1654632011771-62b5eea154b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2hpbGRob29kJTIwY29uc3RyYWludCUyMHNoYWRvd3N8ZW58MXx8fHwxNzcwMDgxNTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    topText: 'Grandir dans les contraintes',
    bottomText: '3 ans - Entre ombres et espoir',
  },
  displacement: {
    topImage: 'https://images.unsplash.com/photo-1760627587014-ffbf8092d464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHRyYXZlbCUyMGpvdXJuZXklMjBtaWdyYXRpb258ZW58MXx8fHwxNzcwMDgxNTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bottomImage: 'https://images.unsplash.com/photo-1760627587014-ffbf8092d464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHRyYXZlbCUyMGpvdXJuZXklMjBtaWdyYXRpb258ZW58MXx8fHwxNzcwMDgxNTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    topText: 'Le grand voyage vers l\'inconnu',
    bottomText: 'Inde → France, 2014',
  },
  reconstruction: {
    topImage: 'https://images.unsplash.com/photo-1548720704-cf427ebb7cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3BlJTIwcmVjb3ZlcnklMjBuZXclMjBiZWdpbm5pbmd8ZW58MXx8fHwxNzcwMDgxNTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bottomImage: 'https://images.unsplash.com/photo-1548720704-cf427ebb7cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3BlJTIwcmVjb3ZlcnklMjBuZXclMjBiZWdpbm5pbmd8ZW58MXx8fHwxNzcwMDgxNTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    topText: 'Reconstruire pierre par pierre',
    bottomText: 'France - Nouvelle vie',
  },
  light: {
    topImage: 'https://images.unsplash.com/photo-1764703666646-acc2f7d48857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzb2NjZXIlMjBzdGFkaXVtJTIwbGlnaHRzfGVufDF8fHx8MTc3MDA4MTUyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    bottomImage: 'https://images.unsplash.com/photo-1764703666646-acc2f7d48857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzb2NjZXIlMjBzdGFkaXVtJTIwbGlnaHRzfGVufDF8fHx8MTc3MDA4MTUyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    topText: 'Sous les projecteurs',
    bottomText: 'Football professionnel',
  },
};

export function LevelPhotos({ levelId, levelName, levelTitle, levelSubtitle }: LevelPhotosProps) {
  const photoData = LEVEL_PHOTOS[levelId];
  
  if (!photoData) return null;
  
  return (
    <>
      {/* Polaroid en haut */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div 
          className="relative bg-white p-4 shadow-2xl"
          style={{
            width: '280px',
            transform: 'rotate(-3deg)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Photo du polaroid */}
          <div className="relative w-full aspect-square bg-gray-200 mb-4 overflow-hidden">
            <ImageWithFallback
              src={photoData.topImage}
              alt={`${levelName} - top`}
              className="w-full h-full object-cover"
            />
            {/* Effet vieilli sur la photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-40" />
          </div>
          
          {/* Texte du polaroid */}
          <div className="text-center font-['Permanent_Marker',cursive] text-gray-800">
            <p className="text-sm leading-tight">{photoData.topText}</p>
          </div>
          
          {/* Petit badge de niveau */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {levelName}
          </div>
        </div>
      </div>
      
      {/* Polaroid en bas */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div 
          className="relative bg-white p-4 shadow-2xl"
          style={{
            width: '280px',
            transform: 'rotate(2deg)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Photo du polaroid */}
          <div className="relative w-full aspect-square bg-gray-200 mb-4 overflow-hidden">
            <ImageWithFallback
              src={photoData.bottomImage}
              alt={`${levelName} - bottom`}
              className="w-full h-full object-cover"
            />
            {/* Effet vieilli sur la photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-40" />
          </div>
          
          {/* Texte du polaroid */}
          <div className="text-center font-['Permanent_Marker',cursive] text-gray-800">
            <p className="text-sm leading-tight">{photoData.bottomText}</p>
          </div>
          
          {/* Date stylée */}
          <div className="absolute -bottom-2 -left-2 bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-1 transform -rotate-6 shadow-lg">
            {levelSubtitle}
          </div>
        </div>
      </div>
    </>
  );
}
