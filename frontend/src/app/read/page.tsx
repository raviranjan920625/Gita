'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import GitaHeader from '../components/layout/GitaHeader';
import GitaPlayer from '../components/layout/GitaPlayer';
import VerseDisplay from '../components/spiritual/VerseDisplay';
import ChapterDisplay from '../components/spiritual/ChapterDisplay';
import { audioService } from '../services/GitaAudioService';

interface Verse {
  id: string;
  location: { chapter: number; verse: number };
  translations: {
    sanskrit: { text: string; transliteration: string };
    en: { text: string; source: string };
    hi?: { text: string; source: string };
  };
  commentary: { en: string; hi: string };
  metadata: { concepts: string[] };
  audio?: { url: string; timestamps: { start: number; end: number; word: string }[] };
}

const CHAPTER_LIMITS: Record<number, number> = {
  1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47, 7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20, 13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

const CHAPTER_TITLES: Record<number, string> = {
  1: "Arjuna-Vishada Yoga", 2: "Sankhya Yoga", 3: "Karma Yoga", 4: "Jnana-Karma-Sannyasa Yoga",
  5: "Karma-Sannyasa Yoga", 6: "Dhyana Yoga", 7: "Jnana-Vijnana Yoga", 8: "Akshara-Brahma Yoga",
  9: "Raja-Vidya-Raja-Guhya Yoga", 10: "Vibhuti Yoga", 11: "Vishvarupa-Darshana Yoga",
  12: "Bhakti Yoga", 13: "Kshetra-Kshetrajna Vibhaga Yoga", 14: "Gunatraya-Vibhaga Yoga",
  15: "Purushottama Yoga", 16: "Daivasura-Sampad-Vibhaga Yoga", 17: "Shraddhatraya-Vibhaga Yoga",
  18: "Moksha-Sannyasa Yoga"
};

export default function ReaderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Route-Integrated State
  const chapter = Number(searchParams.get('ch')) || 1;
  const verseNum = Number(searchParams.get('v')) || 1;
  
  const [allVerses, setAllVerses] = useState<Verse[]>([]);
  const [viewMode, setViewMode] = useState<'verse' | 'chapter'>('verse');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [verseData, setVerseData] = useState<Verse | null>(null);
  const [showLanguage, setShowLanguage] = useState<'en' | 'hi'>('en');
  const [showCommentary, setShowCommentary] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [notes, setNotes] = useState('');
  const [voiceMode, setVoiceMode] = useState<'vedic' | 'meditation' | 'guide' | 'original'>('vedic');
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [loading, setLoading] = useState(true);

  // Sync Data
  useEffect(() => {
    fetch('/api/gita')
      .then(res => res.json())
      .then(data => {
        setAllVerses(data);
        setLoading(false);
      });
  }, []);

  // Update URL on state change
  const updateRoute = (ch: number, v: number) => {
    router.push(`/read?ch=${ch}&v=${v}`);
  };

  const handleNext = () => {
    if (viewMode === 'chapter') {
      if (chapter < 18) updateRoute(chapter + 1, 1);
    } else {
      if (verseNum < CHAPTER_LIMITS[chapter]) updateRoute(chapter, verseNum + 1);
      else if (chapter < 18) updateRoute(chapter + 1, 1);
    }
  };

  const handlePrev = () => {
    if (viewMode === 'chapter') {
      if (chapter > 1) updateRoute(chapter - 1, 1);
    } else {
      if (verseNum > 1) updateRoute(chapter, verseNum - 1);
      else if (chapter > 1) updateRoute(chapter - 1, CHAPTER_LIMITS[chapter - 1]);
    }
  };

  // Sync Verse Interaction
  useEffect(() => {
    const verse = allVerses.find(v =>
      Number(v.location.chapter) === chapter && Number(v.location.verse) === verseNum
    );
    setVerseData(verse || null);

    if (verse) {
      setNotes(localStorage.getItem(`note_${chapter}_${verseNum}`) || '');
      const saved = typeof window !== 'undefined' ? localStorage.getItem('gita_progress') : null;
      const progress = saved ? JSON.parse(saved) : {};
      progress[`${chapter}_${verseNum}`] = true;
      localStorage.setItem('gita_progress', JSON.stringify(progress));
    }
  }, [chapter, verseNum, allVerses]);

  const progressCount = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('gita_progress');
    if (!saved) return 0;
    const progressObj = JSON.parse(saved);
    return (Object.keys(progressObj).length / 701) * 100;
  }, [chapter, verseNum]);

  const speakSacred = async (text?: string) => {
    // If we are in Chapter View or if Voice Mode is set to 'original', play the full recitation
    if (viewMode === 'chapter' || voiceMode === 'original') {
      setIsPlaying(true);
      try {
        await audioService.playChapter(chapter, () => setIsPlaying(false));
      } catch (err) {
        // If chapter audio fails, fallback to verse mode if we are in verse view
        if (viewMode === 'verse') {
          setVoiceMode('vedic');
          speakSacred();
        } else {
          setIsPlaying(false);
        }
      }
      return;
    }

    window.speechSynthesis.cancel();
    const synth = window.speechSynthesis;
    let rate = voiceMode === 'meditation' ? 0.6 : 0.85;
    let pitch = 0.95;
    let textToSpeak = text || verseData?.translations.sanskrit.text || "";

    if (voiceMode === 'meditation' && !text) { rate = 0.45; pitch = 0.9; }
    else if (voiceMode === 'guide' && !text) {
      rate = 0.8; pitch = 1.0;
      textToSpeak = showLanguage === 'hi' ? verseData?.commentary.hi || "" : verseData?.commentary.en || "";
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'sa-IN';
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onboundary = (event) => {
      if (event.name === 'word') setCurrentCharIndex(event.charIndex);
    };

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => { setIsPlaying(false); setCurrentCharIndex(-1); };

    synth.speak(utterance);
  };

  const chapterVerses = useMemo(() =>
    allVerses.filter(v => Number(v.location.chapter) === chapter),
    [chapter, allVerses]
  );

  const atmosphere = getDivineAtmosphere(chapter);

  if (loading) return <div className="flex-center" style={{ height: '100vh', color: 'var(--primary)' }}>Aum... Entering the Dialogue</div>;

  return (
    <div className={`read-layout ${isFocusMode ? 'focus-mode' : ''}`}>
      <div
        className="app-background full-bg"
        style={{
          backgroundImage: `url(${atmosphere.img})`,
          filter: atmosphere.filter,
          transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      <GitaHeader
        progress={progressCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
      />

      <main className="container animate-in" style={{ 
        paddingTop: isFocusMode ? '2rem' : '100px',
        paddingBottom: '160px'
      }}>
        {viewMode === 'verse' ? (
          <VerseDisplay
            verseData={verseData} chapter={chapter} verseNum={verseNum} isFocusMode={isFocusMode}
            showLanguage={showLanguage} setShowLanguage={setShowLanguage}
            showCommentary={showCommentary} setShowCommentary={setShowCommentary}
            showTransliteration={showTransliteration} setShowTransliteration={setShowTransliteration}
            notes={notes} setNotes={setNotes} isPlaying={isPlaying} voiceMode={voiceMode} currentCharIndex={currentCharIndex}
          />
        ) : (
          <ChapterDisplay
            chapter={chapter}
            chapterVerses={chapterVerses}
            onPlayChapter={() => speakSacred()}
            onSelectVerse={(v) => {
              updateRoute(chapter, v);
              setViewMode('verse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            titles={CHAPTER_TITLES}
            isFocusMode={isFocusMode}
            isPlaying={isPlaying}
          />
        )}
      </main>

      <GitaPlayer
        chapter={chapter} 
        setChapter={(ch) => updateRoute(ch, 1)} 
        verseNum={verseNum} 
        setVerseNum={(v) => updateRoute(chapter, v)} 
        viewMode={viewMode}
        isPlaying={isPlaying} voiceMode={voiceMode} setVoiceMode={(m) => setVoiceMode(m as any)}
        onPlay={speakSacred} onPause={() => window.speechSynthesis.cancel()}
        onNext={handleNext} onPrev={handlePrev} chapterLimits={CHAPTER_LIMITS}
        isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode}
      />
    </div>
  );
}

function getDivineAtmosphere(ch: number) {
  switch (ch) {
    case 1: return { img: '/chapter-1-bg.png', filter: 'brightness(0.5) saturate(0.8) sepia(0.2)' };
    case 2: return { img: '/chapter-2-bg.png', filter: 'brightness(0.6) saturate(1.4)' };
    case 11: return { img: '/chapter-11-bg.png', filter: 'brightness(0.7) saturate(2)' };
    default: return { img: '/gita-bg.png', filter: 'brightness(0.4) saturate(0.6)' };
  }
}
