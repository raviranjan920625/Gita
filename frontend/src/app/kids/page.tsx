"use client";

import React, { Suspense } from 'react';
import KidsPresentation from '../components/kids/KidsPresentation';

export default function KidsPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading Journey...</div>}>
        <KidsPresentation />
      </Suspense>
    </main>
  );
}
