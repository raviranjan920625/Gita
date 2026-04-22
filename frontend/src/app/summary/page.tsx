'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GitaSummary from '../components/ui/GitaSummary';
import ParticleFlow from '../components/ParticleFlow';
import GitaHeader from '../components/layout/GitaHeader';
import { audioService } from '../services/GitaAudioService';

export default function SummaryPage() {
  const router = useRouter();
  const [currentPlayingChapter, setCurrentPlayingChapter] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayChapter = async (ch: number) => {
    if (currentPlayingChapter === ch && isPlaying) {
      audioService.stop();
      setIsPlaying(false);
      return;
    }
    
    setCurrentPlayingChapter(ch);
    setIsPlaying(true);
    try {
      await audioService.playChapter(ch, () => {
        setIsPlaying(false);
        setCurrentPlayingChapter(null);
      });
    } catch (err) {
      setIsPlaying(false);
      setCurrentPlayingChapter(null);
    }
  };

  return (
    <div className="app-wrapper reader-mode">
      <ParticleFlow />
      <div className="app-background full-bg" style={{ backgroundImage: 'url(/gita-bg.png)', filter: 'brightness(0.3) saturate(0.5)' }} />
      
      <GitaHeader 
        progress={0} 
        viewMode="chapter" 
        setViewMode={() => {}} 
        isFocusMode={false} 
        setIsFocusMode={() => {}} 
      />

      <main className="container" style={{ paddingTop: '100px' }}>
        <GitaSummary 
          onEnter={() => router.push('/')} 
          onSelectChapter={(ch) => router.push(`/?ch=${ch}`)} 
          onPlayChapter={handlePlayChapter}
          currentPlayingChapter={currentPlayingChapter}
          isPlaying={isPlaying}
        />
      </main>
    </div>
  );
}
