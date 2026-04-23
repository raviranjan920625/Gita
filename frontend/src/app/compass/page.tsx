"use client";

import React, { Suspense } from 'react';
import StagePresentation from '../components/kids/StagePresentation';

export default function CompassPage() {
  return (
    <main>
      <StagePresentation 
        stage="compass"
        metaphor="Compass"
        color="#2962FF"
        title="The Compass: Source Code"
        dataPath="/data/compass/compass.json"
      />
    </main>
  );
}
