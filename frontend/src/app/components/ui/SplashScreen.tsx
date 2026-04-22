'use client';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800); // 2.8 seconds divine entrance
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="divine-aura" />
        <h1 className="spiritual-font sanskrit-text devotional-pulse" style={{ fontSize: '4rem', marginBottom: '1rem' }}>भगवद्गीता</h1>
        <div className="divine-loader">
          <div className="loader-progress" />
        </div>
        <p className="spiritual-font" style={{ color: 'var(--primary)', letterSpacing: '8px', opacity: 0.6, fontSize: '0.8rem', marginTop: '2rem' }}>THE SONG OF THE LORD</p>
      </div>
      <style jsx>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #05070a;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          overflow: hidden;
        }
        .splash-content {
          text-align: center;
          position: relative;
          z-index: 2;
          animation: splashEnter 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .divine-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          filter: blur(50px);
          z-index: -1;
        }
        .divine-loader {
          width: 200px;
          height: 2px;
          background: rgba(255, 255, 255, 0.05);
          margin: 0 auto;
          position: relative;
          border-radius: 100px;
          overflow: hidden;
        }
        .loader-progress {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary-glow);
          animation: loaderFlow 2.5s ease-in-out forwards;
        }
        @keyframes splashEnter {
          from { opacity: 0; transform: scale(0.9); filter: blur(20px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes loaderFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
