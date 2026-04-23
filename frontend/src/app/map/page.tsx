"use client";

import React, { Suspense } from 'react';
import StagePresentation from '../components/kids/StagePresentation';

export default function MapPage() {
  return (
    <main>
      <StagePresentation 
        stage="map"
        metaphor="The Map"
        color="#00C853"
        title="The Map: Career & Growth"
        dataPath="/data/map/map.json"
      />
    </main>
  );
}
