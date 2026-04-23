"use client";

import React, { Suspense } from 'react';
import StagePresentation from '../components/kids/StagePresentation';

export default function AnchorPage() {
  return (
    <main>
      <StagePresentation 
        stage="anchor"
        metaphor="Anchor"
        color="#6200EA"
        title="The Anchor: Middle Way"
        dataPath="/data/anchor/anchor.json"
      />
    </main>
  );
}
