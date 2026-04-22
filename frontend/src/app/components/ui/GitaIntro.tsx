'use client';

interface GitaIntroProps {
  onSelectSummary: () => void;
  onSelectNarrative: () => void;
  metaphor?: string;
  description?: string;
}

export default function GitaIntro({ 
  onSelectSummary, 
  onSelectNarrative, 
  metaphor, 
  description 
}: GitaIntroProps) {
  return (
    <div className="intro-screen animate-in">
      <div className="glass-card intro-content" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '4rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className="spiritual-font" style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 600 }}>ॐ</span>
            <div style={{ width: '40px', height: '1px', background: 'var(--primary)', opacity: 0.3 }} />
            <span className="spiritual-font" style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '3px', textTransform: 'uppercase' }}>THE RESPLENDENT WISDOM</span>
          </div>
        </div>

        {metaphor && (
          <div style={{ marginBottom: '1rem' }}>
            <span className="metaphor-tag">FOCUS: THE {metaphor.toUpperCase()}</span>
          </div>
        )}

        <h1 className="spiritual-font main-title" style={{ color: 'var(--primary)', letterSpacing: '0.02em', filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.2))' }}>भगवद्गीता</h1>
        
        {description ? (
          <p className="stage-description">{description}</p>
        ) : (
          <p className="spiritual-font" style={{ fontSize: '1.4rem', opacity: 0.6, letterSpacing: '4px', fontStyle: 'italic', marginTop: '1.5rem', marginBottom: '4rem', fontWeight: 300 }}>
            The Song of the Divine One
          </p>
        )}
        
        <div className="gateway-options">
          <button className="gateway-btn tap-effect" onClick={onSelectSummary}>
            <span className="btn-label spiritual-font">THE ESSENCE</span>
            <span className="btn-title">Overall Summary</span>
            <p>A distillation of the 18 chapters and the eternal message of Yoga.</p>
          </button>

          <button className="gateway-btn narrative tap-effect" onClick={onSelectNarrative}>
            <span className="btn-label spiritual-font">THE DIALOGUE</span>
            <span className="btn-title">Sacred Narrative</span>
            <p>Enter the battlefield of Kurukshetra and witness the dialogue of the ages.</p>
          </button>
        </div>
      </div>

      <style jsx>{`
        .intro-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
          padding: 2rem;
        }
        .intro-content {
          text-align: center;
        }
        .main-title {
          font-size: 7rem;
          margin: 0;
          line-height: 1;
        }

        .metaphor-tag {
          color: var(--primary);
          border: 1px solid var(--primary);
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.8rem;
          letter-spacing: 3px;
          font-weight: 700;
          background: rgba(212, 175, 55, 0.05);
        }

        .stage-description {
          font-size: 1.4rem;
          color: #fff;
          opacity: 0.8;
          max-width: 600px;
          margin: 2rem auto 4rem;
          line-height: 1.6;
        }
        
        .gateway-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        
        .gateway-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 3rem 2rem;
          border-radius: 24px;
          text-align: left;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          color: #fff;
          display: flex;
          flex-direction: column;
        }
        .gateway-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        
        .gateway-btn.narrative {
          border-color: rgba(212, 175, 55, 0.2);
          background: rgba(212, 175, 55, 0.02);
        }
        .gateway-btn.narrative:hover {
          background: rgba(212, 175, 55, 0.05);
          border-color: var(--primary);
          box-shadow: 0 20px 80px rgba(212, 175, 55, 0.1);
        }
        
        .btn-label {
          font-size: 0.6rem;
          letter-spacing: 3px;
          opacity: 0.4;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .btn-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }
        .gateway-btn p {
          font-size: 0.95rem;
          line-height: 1.6;
          opacity: 0.6;
          margin: 0;
        }

        @media (max-width: 768px) {
          .gateway-options { grid-template-columns: 1fr; gap: 2rem; }
          .main-title { font-size: 4rem; }
          .gateway-btn { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
