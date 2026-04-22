'use client';

interface FocusOverlayProps {
  isFocusMode: boolean;
  setIsFocusMode: (f: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function FocusOverlay({ isFocusMode, setIsFocusMode, onNext, onPrev }: FocusOverlayProps) {
  if (!isFocusMode) return null;

  return (
    <div className="focus-container">
      <div 
        className="focus-side-nav left tap-effect" 
        onClick={onPrev}
        style={{ color: 'var(--primary)', opacity: 0.4, fontSize: '3rem', cursor: 'pointer', transition: '0.4s' }}
      >
        «
      </div>
      <div 
        className="focus-side-nav right tap-effect" 
        onClick={onNext}
        style={{ color: 'var(--primary)', opacity: 0.4, fontSize: '3rem', cursor: 'pointer', transition: '0.4s' }}
      >
        »
      </div>
      <div className="focus-nav" style={{ position: 'fixed', top: '2rem', right: '3rem', zIndex: 10000 }}>
        <button 
          className="btn-primary-outline tap-effect"
          style={{ 
            background: 'var(--primary)', 
            color: '#000', 
            fontWeight: 700,
            padding: '0.8rem 2.5rem', 
            fontSize: '0.8rem',
            boxShadow: '0 0 20px var(--primary-glow)' 
          }}
          onClick={() => { setIsFocusMode(false); document.body.classList.remove('focus-mode'); }}
        >
          EXIT FOCUS
        </button>
      </div>
    </div>
  );
}
