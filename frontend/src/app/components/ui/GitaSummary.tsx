'use client';

import { useEffect, useState } from 'react';

interface SummaryData {
  title: string;
  subtitle: string;
  description: string;
  cards: { id: string; title: string; content: string; isSpecial?: boolean }[];
  chapters: { no: number; name: string; summary: string }[];
}

interface GitaSummaryProps {
  onEnter?: () => void;
  onSelectChapter?: (ch: number) => void;
}

export default function GitaSummary({ 
  onEnter, onSelectChapter 
}: GitaSummaryProps) {
  const [data, setData] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetch('/data/summary.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => {
         import('../../data/summary.json').then(mod => setData(mod.default as any));
      });
  }, []);

  if (!data) return <div className="flex-center" style={{ height: '50vh', color: 'var(--primary)' }}>Distilling the Essence...</div>;

  return (
    <div className="summary-container animate-in">
      <div className="summary-content">
        <div className="divine-intro">
          <span className="spiritual-font s-label">{data.subtitle}</span>
          <h1 className="spiritual-font s-main">{data.title}</h1>
          <p className="s-desc">{data.description}</p>
        </div>

        <div className="summary-grid">
          {data.cards.map(card => (
            <div key={card.id} className={`summary-card ${card.isSpecial ? 'gold' : ''}`}>
              <h3 className="spiritual-font">{card.title}</h3>
              <p>{card.content}</p>
            </div>
          ))}
        </div>

        <div className="chapter-directory">
          <h2 className="spiritual-font dir-title">THE EIGHTEEN CHAPTERS</h2>
          <div className="ch-grid">
            {data.chapters.map(ch => (
              <div 
                key={ch.no} 
                className="ch-cell tap-effect"
                onClick={() => onSelectChapter?.(ch.no)}
              >
                <div className="ch-num">{String(ch.no).padStart(2, '0')}</div>
                <div className="ch-info">
                  <h4>{ch.name}</h4>
                  <p>{ch.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {onEnter && (
          <div className="launch-action">
            <button className="enter-gita-btn tap-effect" onClick={onEnter}>
              Enter the Full Dialogue
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .summary-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem;
          color: #fff;
        }
        .summary-content {
          max-width: 1200px;
          text-align: center;
        }
        .divine-intro { margin-bottom: 5rem; }
        .s-label { font-size: 0.7rem; letter-spacing: 5px; opacity: 0.4; text-transform: uppercase; }
        .s-main { font-size: 5rem; margin: 2rem 0; color: var(--primary); }
        .s-desc { font-size: 1.15rem; line-height: 1.8; opacity: 0.7; max-width: 800px; margin: 0 auto; color: var(--text-dim); }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 8rem;
        }
        .summary-card {
           padding: 3rem 2rem;
           background: rgba(255, 255, 255, 0.02);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 24px;
           text-align: left;
           transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .summary-card:hover { transform: translateY(-10px); background: rgba(255, 255, 255, 0.05); border-color: rgba(255,255,255,0.1); }
        .summary-card h3 { font-size: 0.65rem; letter-spacing: 3px; margin-bottom: 1.5rem; opacity: 0.5; text-transform: uppercase; }
        .summary-card p { font-size: 0.95rem; line-height: 1.6; opacity: 0.8; }
        .summary-card.gold { border-color: rgba(212, 175, 55, 0.2); background: rgba(212, 175, 55, 0.02); }

        .chapter-directory { margin-bottom: 8rem; }
        .dir-title { font-size: 0.7rem; letter-spacing: 8px; opacity: 0.3; margin-bottom: 4rem; text-transform: uppercase; }
        
        .ch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          text-align: left;
        }
        .ch-cell {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          cursor: pointer;
          transition: 0.4s;
        }
        .ch-cell:hover {
          background: rgba(212, 175, 55, 0.03);
          border-color: rgba(212, 175, 55, 0.2);
          transform: scale(1.02);
        }
        .ch-num {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          opacity: 0.3;
        }
        .ch-info { flex: 1; }
        .ch-info h4 { font-size: 0.9rem; margin-bottom: 0.5rem; color: #fff; }
        .ch-info p { font-size: 0.75rem; line-height: 1.5; opacity: 0.5; margin: 0; }

        .launch-action { display: flex; justify-content: center; margin-top: 4rem; }
        .enter-gita-btn {
          padding: 1.2rem 4rem;
          background: var(--primary);
          color: #000;
          border: none;
          border-radius: 100px;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.4s;
          box-shadow: 0 10px 30px var(--primary-glow);
        }
        .enter-gita-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px var(--primary-glow);
        }

        @media (max-width: 1024px) {
          .ch-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .summary-grid, .ch-grid { grid-template-columns: 1fr; }
          .s-main { font-size: 3rem; }
          .summary-content { padding: 0 1rem; }
        }
      `}</style>
    </div>
  );
}
