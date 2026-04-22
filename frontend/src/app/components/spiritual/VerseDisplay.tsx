import React, { useState, useEffect } from 'react';

interface Verse {
  translations: {
    sanskrit: { text: string; transliteration: string };
    en: { text: string; source: string };
    hi?: { text: string; source: string };
  };
  commentary: { en: string; hi: string };
  metadata: { concepts: string[] };
}

interface VerseDisplayProps {
  verseData: Verse | null;
  chapter: number;
  verseNum: number;
  isFocusMode: boolean;
  showLanguage: 'sa' | 'en' | 'hi';
  setShowLanguage: (l: any) => void;
  showCommentary: boolean;
  setShowCommentary: (s: boolean) => void;
  showTransliteration: boolean;
  setShowTransliteration: (s: boolean) => void;
  notes: string;
  setNotes: (n: string) => void;
  isPlaying: boolean;
  voiceMode: string;
  currentCharIndex: number;
}

export default function VerseDisplay({
  verseData, chapter, verseNum, isFocusMode, showLanguage, setShowLanguage,
  showCommentary, setShowCommentary, showTransliteration, setShowTransliteration,
  notes, setNotes, isPlaying, voiceMode, currentCharIndex
}: VerseDisplayProps) {
  const [ageGroup, setAgeGroup] = useState<'child' | 'teen' | 'adult' | 'scholar'>('adult');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    // Reset AI insight when verse changes
    setAiInsight(null);
  }, [chapter, verseNum]);

  const fetchAiInsight = async (selectedAge: string) => {
    if (!verseData) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gita/ai-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slokaText: verseData.translations.sanskrit.text,
          translation: showLanguage === 'hi' ? verseData.translations.hi?.text : verseData.translations.en.text,
          ageGroup: selectedAge,
          language: showLanguage === 'hi' ? 'Hindi' : 'English'
        }),
      });
      const data = await response.json();
      if (data.insight) {
        setAiInsight(data.insight);
      }
    } catch (error) {
      console.error("AI Fetch Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAge = e.target.value as any;
    setAgeGroup(newAge);
    if (newAge !== 'scholar') {
      fetchAiInsight(newAge);
    } else {
      setAiInsight(null);
    }
  };
  
  const lineData = verseData ? verseData.translations.sanskrit.text.split('\n').map((lineText, lIdx, arr) => {
    let totalOffset = 0;
    for (let i = 0; i < lIdx; i++) totalOffset += arr[i].length + 1;
    
    const words: { word: string; start: number; end: number }[] = [];
    let currentPos = 0;
    lineText.split(/(\s+|।|॥)/).forEach(w => {
      if (w.length > 0) {
        words.push({ word: w, start: totalOffset + currentPos, end: totalOffset + currentPos + w.length });
        currentPos += w.length;
      }
    });
    return words;
  }) : [];

  return (
    <div className="glass-card main-verse-layout animate-in" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '4rem' }}>
      <div style={{ textAlign: 'center' }}>
        {!isFocusMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="spiritual-font" style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 600 }}>{chapter}.{verseNum}</span>
              <div style={{ width: '40px', height: '1px', background: 'var(--primary)', opacity: 0.3 }} />
              <div style={{ textAlign: 'left' }}>
                <span className="spiritual-font" style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '3px', display: 'block' }}>DIVINE VERSE</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', opacity: 0.8, letterSpacing: '1px' }}>Perspective: {ageGroup.toUpperCase()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <select value={ageGroup} onChange={handleAgeChange} className="select-premium" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
                <option value="scholar">Scholar (Original)</option>
                <option value="adult">Adult</option>
                <option value="teen">Teenager</option>
                <option value="child">Child</option>
              </select>
              <select value={showLanguage} onChange={(e) => setShowLanguage(e.target.value as any)} className="select-premium">
                <option value="hi">Hindi</option><option value="en">English</option><option value="sa">Sanskrit</option>
              </select>
            </div>
          </div>
        )}

                  <h2 className="sanskrit-text glow-text" style={{ fontSize: isFocusMode ? '3.5rem' : '2.6rem', marginBottom: '2rem', lineHeight: '1.7', letterSpacing: '0.02em' }}>
                    {lineData.map((words, lIdx) => (
                      <div key={lIdx} style={{ marginBottom: '0.8rem' }}>
                        {words.map((item, wIdx) => {
                          const isCurrent = isPlaying && currentCharIndex >= item.start && currentCharIndex < item.end;
                          return (
                            <span key={wIdx} className={`sanskrit-word ${isCurrent ? 'highlighted' : ''}`} style={{ transition: 'all 0.4s ease' }}>
                              {item.word}
                            </span>
                          )
                        })}
                      </div>
                    ))}
                  </h2>

        {showTransliteration && <p className="spiritual-font translit-text" style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.6, margin: '2rem 0' }}>{verseData?.translations.sanskrit.transliteration}</p>}

        {showLanguage !== 'sa' && (
          <div className="translation-content fade-in" style={{ margin: '4rem 0' }}>
            <p className="spiritual-font" style={{ fontSize: '1.4rem', color: 'var(--primary)', fontStyle: 'italic', fontWeight: 300, lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
              "{showLanguage === 'hi' ? verseData?.translations.hi?.text : verseData?.translations.en.text}"
            </p>
          </div>
        )}

        {!isFocusMode && (
          <>
            <div className="flex-center" style={{ gap: '3.5rem', marginTop: '4rem' }}>
              <button 
                className={`btn-primary-outline ${showCommentary ? 'active' : ''}`} 
                onClick={() => {
                  setShowCommentary(!showCommentary);
                  if (!showCommentary && ageGroup !== 'scholar' && !aiInsight) {
                    fetchAiInsight(ageGroup);
                  }
                }}
              >
                {showCommentary ? 'CLOSE INSIGHT' : 'DEEP INSIGHT'}
              </button>
              <button className={`btn-primary-outline ${showTransliteration ? 'active' : ''}`} onClick={() => setShowTransliteration(!showTransliteration)}>
                {showTransliteration ? 'HIDE TRANSLIT' : 'TRANSLITERATION'}
              </button>
            </div>

            {showCommentary && verseData && (
              <div className="commentary-section fade-in" style={{ marginTop: '4rem', textAlign: 'left' }}>
                <div className="insight-pill" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="spiritual-font" style={{ fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.5 }}>SACRED CONCEPTS: </span>
                    {verseData.metadata.concepts.map(c => <span key={c} className="tag" style={{ border: '1px solid rgba(212,175,55,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.7rem', color: 'var(--primary)', marginLeft: '0.5rem' }}>#{c}</span>)}
                  </div>
                  {isAiLoading && (
                    <span className="spiritual-font animate-pulse" style={{ fontSize: '0.7rem', color: 'var(--primary)', opacity: 0.8 }}>Generating Divine Insight...</span>
                  )}
                </div>
                <div className="commentary-box-modern" style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
                  {isAiLoading && (
                    <div className="shimmer-effect" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)', animation: 'shimmer 2s infinite' }} />
                  )}
                  <p style={{ lineHeight: '1.8', opacity: 0.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                    {aiInsight 
                      ? aiInsight 
                      : (showLanguage === 'hi' ? verseData.commentary.hi : verseData.commentary.en)}
                  </p>
                </div>
              </div>
            )}
            <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(212,175,55,0.03)', borderRadius: '24px', border: '1px solid rgba(212,175,55,0.1)' }}>
              <h4 className="spiritual-font" style={{ fontSize: '0.6rem', letterSpacing: '3px', opacity: 0.5, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Reflections of the Soul</h4>
              <textarea value={notes} onChange={(e) => { setNotes(e.target.value); localStorage.setItem(`note_${chapter}_${verseNum}`, e.target.value); }} placeholder="What does this shloka whisper to you?..." 
                className="notes-area" style={{ background: 'transparent', border: 'none', width: '100%', minHeight: '100px', color: '#fff', outline: 'none', resize: 'none', fontSize: '1rem', fontStyle: 'italic' }} />
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
