import Link from 'next/link';

interface GitaHeaderProps {
  progress: number;
  viewMode: string;
  setViewMode: (v: any) => void;
  isFocusMode: boolean;
  setIsFocusMode: (f: boolean) => void;
}

export default function GitaHeader({ 
  progress, viewMode, setViewMode, isFocusMode, setIsFocusMode
}: GitaHeaderProps) {
  if (isFocusMode) return null;

  return (
    <header className="ghost-header">
      {/* Hair-Thin Progress Tracer */}
      <div className="progress-tracer">
        <div className="active-trace" style={{ width: `${progress}%` }} />
      </div>

      <nav className="sacred-navigator">
        <Link href="/" className="nav-link">INTRO</Link>
        <Link href="/summary" className="nav-link">SUMMARY</Link>
        <Link href="/read" className="nav-link">READ</Link>
      </nav>

      <div className="header-inner">
        <div className="brand">
          <h1 className="spiritual-font divine-title">भगवद्गीता</h1>
        </div>

        <nav className="minimal-nav">
          <div className="mode-toggle">
            <button className={viewMode === 'verse' ? 'active' : ''} onClick={() => setViewMode('verse')}>VERSE</button>
            <span className="dot">·</span>
            <button className={viewMode === 'chapter' ? 'active' : ''} onClick={() => setViewMode('chapter')}>CHAPTER</button>
          </div>
          <button className="focus-trigger tap-effect" onClick={() => setIsFocusMode(!isFocusMode)}>
             FOCUS
          </button>
        </nav>
      </div>

      <style jsx>{`
        .ghost-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 60px;
          z-index: 2000;
          background: rgba(5, 7, 10, 0.2);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          display: flex;
          flex-direction: column;
          transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .progress-tracer {
          height: 1.5px;
          width: 100%;
          background: transparent;
          position: relative;
        }
        .active-trace {
          height: 100%;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
          transition: width 1s ease;
        }
        .header-inner {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4rem;
        }
        .divine-title {
          font-size: 1.2rem;
          letter-spacing: 6px;
          opacity: 0.8;
          margin: 0;
        }
        .minimal-nav {
          display: flex;
          align-items: center;
          gap: 3rem;
        }
        .mode-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .mode-toggle button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.3);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
          transition: 0.3s;
        }
        .mode-toggle button.active {
          color: var(--primary);
          text-shadow: 0 0 10px var(--primary-glow);
        }
        .dot { color: rgba(255,255,255,0.1); font-size: 0.8rem; }
        
        .focus-trigger {
          background: transparent;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--primary);
          padding: 0.4rem 1.2rem;
          border-radius: 100px;
          font-size: 0.6rem;
          letter-spacing: 1px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.4s;
        }
        .focus-trigger:hover {
          background: var(--primary);
          color: #000;
          box-shadow: 0 0 20px var(--primary-glow);
        }
        
        .sacred-navigator {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 3px;
          transition: 0.3s;
        }
        .nav-link:hover {
          color: var(--primary);
          text-shadow: 0 0 10px var(--primary-glow);
        }

        @media (max-width: 768px) {
          .header-inner { padding: 0 1.5rem; }
          .divine-title { font-size: 1rem; letter-spacing: 3px; }
          .minimal-nav { gap: 1rem; }
          .sacred-navigator { display: none; }
        }
      `}</style>
    </header>
  );
}
