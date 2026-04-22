"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import GitaIntro from '../components/ui/GitaIntro';

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="landing-threshold">
      <div 
        className="app-background full-bg" 
        style={{ 
          backgroundImage: 'url(/gita-bg.png)', 
          filter: 'brightness(0.3) saturate(0.5)' 
        }} 
      />
      <main className="intro-container">
        <GitaIntro 
          metaphor="The Map"
          description="Managing your energy and becoming the 'Knower of the Field' during career and growth (Ages 25-35)."
          onSelectSummary={() => router.push('/summary')}
          onSelectNarrative={() => router.push('/read')}
        />
      </main>
      <style jsx>{`
        .landing-threshold { min-height: 100vh; position: relative; overflow: hidden; }
        .intro-container { position: relative; z-index: 10; }
      `}</style>
    </div>
  );
}
