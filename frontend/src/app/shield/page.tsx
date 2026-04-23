"use client";

import React, { Suspense } from 'react';
import StagePresentation from '../components/kids/StagePresentation';

export default function ShieldPage() {
  return (
    <main>
      <StagePresentation 
        stage="shield"
        metaphor="Shield"
        color="#00BFA5"
        title="High Performance Mindset"
        dataPath="/data/shield/shield.json"
      />
    </main>
  );
}
