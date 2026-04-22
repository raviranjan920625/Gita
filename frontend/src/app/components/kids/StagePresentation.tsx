'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Sun, ArrowLeft, ArrowRight, Play, Volume2 } from 'lucide-react';
import styles from './StagePresentation.module.css';

interface Lesson {
  id: number;
  chapter: number;
  title: string;
  theme: string;
  content: string;
  verse: string;
  sloka: string;
  translation: string;
  power: string;
  illustration: string;
  audio: string;
  lifeHack?: string;
  story?: string;
}

interface StagePresentationProps {
  stage: string;
  metaphor: string;
  color: string;
  dataPath: string;
  title: string;
}

type ViewState = 'GRID' | 'STORY';

export default function StagePresentation({ stage, metaphor, color, dataPath, title }: StagePresentationProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'GRID' | 'STORY'>('GRID');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch(dataPath)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const normalized = Array.isArray(data) ? data : data.highlights || [];
        setLessons(normalized);
      })
      .catch(err => console.error(`Failed to load ${stage} data from ${dataPath}:`, err));
  }, [dataPath, stage]);

  const selectLesson = (index: number) => {
    setCurrentIndex(index);
    setView('STORY');
  };

  if (lessons.length === 0) return <div>Loading {title}...</div>;

  const current = lessons[currentIndex];

  return (
    <div className={styles.container} style={{ '--stage-color': color } as any}>
      <div className={styles.ambientGlow} />
      
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => setView('GRID')}>
          <Sparkles className={styles.sparkleIcon} />
          <span>{title}</span>
        </div>
        {view === 'STORY' && (
          <div className={styles.progress}>
            {lessons.map((_, i) => (
              <div 
                key={`dot-${i}`} 
                className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        )}
      </header>

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {view === 'GRID' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.chapterGrid}
            >
              <h2 className={styles.gridHeadline}>Focus: The {metaphor}</h2>
              <div className={styles.gridItems}>
                {lessons.map((lesson, index) => (
                  <motion.div 
                    key={`lesson-${lesson.id || index}`}
                    whileHover={{ scale: 1.05 }}
                    className={styles.gridItem}
                    onClick={() => selectLesson(index)}
                  >
                    <div className={styles.gridIcon}><Sun /></div>
                    <h3>Chapter {lesson.chapter}</h3>
                    <p>{lesson.title}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="story"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.lessonCard}
            >
              <div className={styles.textArea}>
                <span className={styles.chapterTag}>CHAPTER {current.chapter}</span>
                <h1 className={styles.title}>{current.title}</h1>
                
                <div className={styles.storyBox}>
                  <p>{current.content || current.story || current.lifeHack}</p>
                </div>

                <div className={styles.verseBox}>
                  <div className={styles.verseHeader}>
                    <Heart size={16} />
                    <span>The Verse ({current.verse}):</span>
                  </div>
                  <p className={styles.sloka}>{current.sloka || current.sanskrit}</p>
                  <p className={styles.translation}>{current.translation || current.meaning}</p>
                </div>

                <div className={styles.powerBox}>
                  <span className={styles.powerLabel}>LIFELONG POWER:</span>
                  <p>{current.power}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view === 'STORY' && (
        <footer className={styles.footer}>
          <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className={styles.navBtn} disabled={currentIndex === 0}><ArrowLeft /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={styles.playBtn}>{isPlaying ? <Volume2 /> : <Play />} <span>Listen</span></button>
          <button onClick={() => setCurrentIndex(Math.min(lessons.length - 1, currentIndex + 1))} className={styles.navBtn} disabled={currentIndex === lessons.length - 1}><ArrowRight /></button>
        </footer>
      )}
    </div>
  );
}
