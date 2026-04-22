'use client';

interface GitaPlayerProps {
  chapter: number;
  setChapter: (c: number) => void;
  verseNum: number;
  setVerseNum: (v: number) => void;
  isPlaying: boolean;
  voiceMode: string;
  setVoiceMode: (m: string) => void;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  chapterLimits: Record<number, number>;
  viewMode: string;
  isFocusMode?: boolean;
  setIsFocusMode?: (f: boolean) => void;
}

export default function GitaPlayer({ 
  chapter, setChapter, verseNum, setVerseNum, isPlaying, 
  voiceMode, setVoiceMode, onPlay, onPause, onNext, onPrev, 
  chapterLimits, viewMode, isFocusMode, setIsFocusMode 
}: GitaPlayerProps) {

  return (
    <div className={`minimal-player ${isFocusMode ? 'focus' : ''}`}>
      <div className="player-inner">
        {/* Left: Typographic Selector */}
        <div className="ref-selector">
          <select 
            value={chapter} 
            onChange={(e) => { setChapter(Number(e.target.value)); setVerseNum(1); }}
            className="clean-select ch"
          >
            {Array.from({ length: 18 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
          
          {viewMode === 'verse' && (
            <>
              <span className="sep">:</span>
              <select 
                value={verseNum} 
                onChange={(e) => setVerseNum(Number(e.target.value))}
                className="clean-select vs"
              >
                {Array.from({ length: chapterLimits[chapter] || 20 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                ))}
              </select>
            </>
          )}
        </div>

        {/* Center: Ghost Controls */}
        <div className="controls">
          <button className="icon-btn tap-effect" onClick={onPrev}>«</button>
          <button 
            className={`play-pulse tap-effect ${isPlaying ? 'active' : ''}`} 
            onClick={isPlaying ? onPause : onPlay}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="icon-btn tap-effect" onClick={onNext}>»</button>
        </div>

        {/* Right: Mode Selector & Exit */}
        <div className="mode-area">
          {isFocusMode && setIsFocusMode ? (
            <button className="exit-btn tap-effect" onClick={() => setIsFocusMode(false)} title="Exit Focus Mode">✕</button>
          ) : (
            <select value={voiceMode} onChange={(e) => setVoiceMode(e.target.value)} className="clean-select mode">
              <option value="original">ORIGINAL</option>
              <option value="vedic">VEDIC</option>
              <option value="meditation">ZEN</option>
              <option value="guide">GURU</option>
            </select>
          )}
        </div>
      </div>

      <style jsx>{`
        .minimal-player {
          position: fixed;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .player-inner {
          display: flex;
          align-items: center;
          gap: 3rem;
          padding: 0.8rem 2.5rem;
          background: rgba(10, 12, 16, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .minimal-player.focus {
          bottom: 1.5rem;
          opacity: 0.6;
          transform: translateX(-50%) scale(0.9);
        }
        .minimal-player.focus:hover { opacity: 1; }

        .ref-selector { display: flex; align-items: center; gap: 0.5rem; }
        .sep { color: rgba(255, 255, 255, 0.2); font-weight: 300; }
        
        .clean-select {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-family: inherit;
          font-weight: 500;
          font-size: 1.1rem;
          cursor: pointer;
          outline: none;
          appearance: none;
          transition: 0.3s;
        }
        .clean-select.ch:hover { color: #fff; }
        .clean-select.vs { color: var(--primary); font-weight: 700; }
        .clean-select.mode { font-size: 0.6rem; letter-spacing: 2px; }

        .controls { display: flex; align-items: center; gap: 2rem; }
        .icon-btn {
          background: transparent; border: none; color: #fff;
          font-size: 1.6rem; cursor: pointer; opacity: 0.3; transition: 0.3s;
        }
        .icon-btn:hover { opacity: 1; color: var(--primary); }
        
        .play-pulse {
          background: transparent; border: none; color: var(--primary);
          font-size: 1.2rem; cursor: pointer; transition: 0.4s;
          display: flex; align-items: center; justify-content: center;
        }
        .play-pulse.active {
          filter: drop-shadow(0 0 10px var(--primary-glow));
          animation: slowPulse 3s infinite;
        }
        
        @keyframes slowPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .mode-area { min-width: 80px; text-align: right; display: flex; justify-content: flex-end; }
        
        .exit-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.2rem;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        .exit-btn:hover {
          color: var(--primary);
          background: rgba(212, 175, 55, 0.05);
          transform: rotate(90deg);
        }

        .clean-select option {
          background: #0a0c10;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
