"use client";

import React, { Suspense } from 'react';
import StagePresentation from '../components/kids/StagePresentation';

export default function HeroPage() {
  return (
    <main>
      <StagePresentation 
        stage="hero"
        metaphor="Hero"
        color="#FF6D00"
        title="The Hero's Journey"
        dataPath="/data/kids/kids.json"
      />
    </main>
  );
}
