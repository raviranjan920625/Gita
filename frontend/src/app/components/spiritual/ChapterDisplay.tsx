'use client';

interface Verse {
  id: string;
  location: { chapter: number; verse: number };
  translations: {
    sanskrit: { text: string; transliteration: string };
    en: { text: string; source: string };
    hi?: { text: string; source: string };
  };
}

interface ChapterDisplayProps {
  chapter: number;
  chapterVerses: Verse[];
  onPlayChapter: () => void;
  onSelectVerse: (v: number) => void;
  titles: { [key: number]: string };
  isFocusMode?: boolean;
  isPlaying?: boolean;
}

export default function ChapterDisplay({ 
  chapter, chapterVerses, onSelectVerse, titles, isFocusMode 
}: ChapterDisplayProps) {
  if (isFocusMode) {
    return (
      <div className="chapter-focus-view animate-in" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', paddingBottom: '20vh' }}>
        <div style={{ marginBottom: '10rem', position: 'relative' }}>
          <h2 className="spiritual-font sanskrit-text devotional-pulse" style={{ fontSize: '5rem', marginBottom: '1rem' }}>अध्याय {chapter}</h2>
          <p className="spiritual-font" style={{ color: 'var(--primary)', letterSpacing: '15px', textTransform: 'uppercase', fontSize: '1.4rem', opacity: 0.8 }}>{titles[chapter]}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          {chapterVerses.map((v) => (
            <div key={v.id} className="sacred-scroll-verse fade-in-up" style={{ animationDelay: `${v.location.verse * 0.1}s` }}>
              <div className="spiritual-font" style={{ fontSize: '0.9rem', color: 'var(--primary)', opacity: 0.5, marginBottom: '3rem', letterSpacing: '6px', fontWeight: 600 }}>SHLOKA {v.location.verse}</div>
              <h3 className="sanskrit-text" style={{ fontSize: '2.8rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '2rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}>
                {v.translations.sanskrit.text}
              </h3>
              <div style={{ width: '60px', height: '2px', background: 'var(--primary)', opacity: 0.3, margin: '4rem auto 0', borderRadius: '100px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chapter-view animate-in" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', paddingBottom: '100px' }}>
      {/* Majestic Sacred Banner */}
      <div style={{ textAlign: 'center', marginBottom: '8rem', position: 'relative', paddingTop: '4rem' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', opacity: 0.3 }} />
        <h2 className="spiritual-font sanskrit-text" style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>अध्याय {chapter}</h2>
        <p className="spiritual-font" style={{ color: 'var(--primary)', letterSpacing: '12px', textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 300, opacity: 0.8 }}>{titles[chapter]}</p>
        
        <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '3rem auto' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {chapterVerses.map((v) => (
          <div 
            key={v.id} 
            className="verse-cell tap-effect" 
            onClick={() => onSelectVerse(v.location.verse)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.06)', 
              borderRadius: '16px', 
              padding: '1.5rem 3rem',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '3rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <div className="spiritual-font" style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 600, minWidth: '80px', opacity: 0.6 }}>{v.location.verse}</div>
            <div style={{ flex: 1 }}>
              <h3 className="sanskrit-text" style={{ fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '0.2rem' }}>
                {v.translations.sanskrit.text}
              </h3>
            </div>
            <div className="spiritual-font" style={{ fontSize: '0.6rem', opacity: 0.3, letterSpacing: '2px' }}>EXPLORE →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
