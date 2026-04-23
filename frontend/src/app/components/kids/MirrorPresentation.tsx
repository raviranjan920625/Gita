'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Sun, ArrowLeft, ArrowRight, Play, Volume2, Trophy,
  Smile, Moon, Users, HandHeart, Hourglass, Bird, Heart
} from 'lucide-react';  
import styles from './MirrorPresentation.module.css';

interface Topic {
  title: string;
  content: string;
  verse: string;
  sloka: string;
  translation: string;
  power: string;
}

interface Lesson {
  id: number | string;
  chapter: number;
  title: string;
  theme: string;
  topics: Topic[];
  illustration: string;
  audio: string;
  // Flattened properties for display
  activeTopic?: Topic;
}

type ViewState = 'LANDING' | 'GRID' | 'STORY';

export default function MirrorPresentation() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<ViewState>('LANDING');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/data/hero/mirror.json')
      .then(res => res.json())
      .then(data => {
        // Flatten topics into individual story slides
        const flattened: Lesson[] = [];
        data.forEach((chapter: any) => {
          chapter.topics.forEach((topic: any, tIndex: number) => {
            flattened.push({
              ...chapter,
              id: `${chapter.id}-${tIndex}`,
              activeTopic: topic
            });
          });
        });
        setLessons(flattened);
      })
      .catch(err => console.error('Failed to load mirror data:', err));
  }, []);

  const nextLesson = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevLesson = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const selectLesson = (index: number) => {
    setCurrentIndex(index);
    setView('STORY');
  };

  const selectChapter = (chapterId: number) => {
    const firstTopicIndex = lessons.findIndex(l => l.chapter === chapterId);
    if (firstTopicIndex !== -1) {
      setCurrentIndex(firstTopicIndex);
      setView('STORY');
      setIsMenuOpen(false);
    }
  };

  // Adventure Map Metadata
  const MAP_NODES = [
    {
      id: 1,
      chapter: 1,
      name: "The Magic Mirror",
      icon: <Sparkles />, // Represents the "Inner Light"
      theme: "Inner Light"
    },
    {
      id: 2,
      chapter: 2,
      name: "The Happy Mirror",
      icon: <Smile />, // Represents "Do and Smile"
      theme: "Action"
    },
    {
      id: 3,
      chapter: 3,
      name: "The Calm Mirror",
      icon: <Moon />, // Represents "Peace" and a quiet mind
      theme: "Mental Health & Peace"
    },
    {
      id: 4,
      chapter: 4,
      name: "The Kind Mirror",
      icon: <Users />, // Represents "Leadership" and showing others the way
      theme: "Leadership"
    },
    {
      id: 5,
      chapter: 5,
      name: "The Love Mirror",
      icon: <HandHeart />, // Represents "Kind Heart" and tiny gifts
      theme: "Kindness"
    },
    {
      id: 6,
      chapter: 6,
      name: "The Time Mirror",
      icon: <Hourglass />, // Represents "Everything Changes"
      theme: "Understanding"
    },
    {
      id: 7,
      chapter: 7,
      name: "The Choice Mirror",
      icon: <Bird />, // Represents "Freedom" and letting go like a balloon/bird
      theme: "Freedom"
    },
    {
      id: 8,
      chapter: 8,
      name: "The Victory Mirror",
      icon: <Trophy />, // Represents "Shine Bright" and success
      theme: "Success"
    }
  ];
  if (lessons.length === 0) return <div>Loading Magic...</div>;

  const current = lessons[currentIndex];

  return (
    <div className={`${styles.container} ${isMenuOpen ? styles.menuShift : ''}`}>
      <div className={styles.ambientGlow} />

      {/* Side Menu */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isMenuOpen ? 0 : -300 }}
        className={styles.sideMenu}
      >
        <div className={styles.menuHeader}>
          <h3>Mirror Adventure</h3>
          <button onClick={() => setIsMenuOpen(false)} className={styles.closeBtn}>×</button>
        </div>
        <nav className={styles.menuNav}>
          <div className={styles.menuItem} onClick={() => { setView('LANDING'); setIsMenuOpen(false); }}>🏠 Home</div>
          <div className={styles.menuItem} onClick={() => { setView('GRID'); setIsMenuOpen(false); }}>🗺️ Explore Map</div>
          <div className={styles.menuDivider}>PROWERS & STICKERS</div>
          <div className={styles.menuItem}>⭐ My Power Stickers</div>
          <div className={styles.menuItem}>🏆 Achievement Case</div>
        </nav>
      </motion.aside>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.leftHeader}>
          <button className={styles.menuToggle} onClick={() => setIsMenuOpen(true)}>
            <div /><div /><div />
          </button>
          <div className={styles.logo} onClick={() => setView('LANDING')}>
            <Sparkles className={styles.sparkleIcon} />
            <span>The Sovereign Soul</span>
          </div>
        </div>
        {(view === 'STORY' || view === 'GRID') && (
          <div className={styles.backToLanding} onClick={() => setView('LANDING')}>
            Explore Map
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {view === 'LANDING' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className={styles.heroLanding}
            >
              <div className={styles.heroBadge}>AGE 3 – 6</div>
              <h1 className={styles.heroTitle}>The Magic Spark</h1>
              <p className={styles.heroObjective}>
                Discovering your inner light and kindness as a superpower.
              </p>
              <div className={styles.heroFocus}>
                <span className={styles.focusLabel}>FOCUS:</span> The Mirror
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('GRID')}
                className={styles.presentsBtn}
              >
                Open The Mirror
              </motion.button>
            </motion.div>
          ) : view === 'GRID' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.adventureMap}
            >
              <h2 className={styles.mapHeadline}>Mirror Adventure Map</h2>

              <div className={styles.mapCanvas}>
                <div className={styles.nodesList}>
                  {MAP_NODES.map((node, index) => {
                    const isLeft = index % 2 === 0;
                    return (
                      <motion.div
                        key={node.chapter}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                        className={`${styles.mapNode} ${isLeft ? styles.nodeLeft : styles.nodeRight}`}
                        onClick={() => selectChapter(node.chapter)}
                      >
                        {/* Icon with divine glow */}
                        <div className={styles.nodeWrapper}>
                          <span className={styles.divineSymbol}>ॐ</span>
                          <span className={styles.divineSymbol}>✦</span>
                          <span className={styles.divineSymbol}>❋</span>
                          <span className={styles.divineSymbol}>✦</span>
                          <div className={styles.nodeCircle}>{node.icon}</div>
                        </div>
                        {/* Text label extending outward */}
                        <div className={styles.nodeCard}>
                          <span className={styles.nodeChapter}>CHAPTER {node.chapter}</span>
                          <h3 className={styles.nodeName}>{node.name}</h3>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className={styles.lessonCard}
            >
              <div className={styles.illustrationArea}>
                <AnimatePresence mode="wait">
                  {current.illustration ? (
                    <motion.img
                      key={current.illustration}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      src={current.illustration}
                      alt={current.title}
                      className={styles.lessonImage}
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className={styles.imagePlaceholder}
                    >
                      <Sun size={180} color="#FFD54F" />
                      <p>Illustration: {current.title}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.textArea}>
                <span className={styles.chapterTag}>CHAPTER {current.chapter}</span>
                <h1 className={styles.title}>{current.activeTopic?.title || current.title}</h1>

                <div className={styles.storyBox}>
                  <p>{current.activeTopic?.content}</p>
                </div>

                <div className={styles.verseBox}>
                  <div className={styles.verseHeader}>
                    <Heart size={16} />
                    <span>The Verse ({current.activeTopic?.verse}):</span>
                  </div>
                  <p className={styles.sloka}>{current.activeTopic?.sloka}</p>
                  <p className={styles.translation}>{current.activeTopic?.translation}</p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={styles.powerBox}
                >
                  <span className={styles.powerLabel}>MY SUPERPOWER:</span>
                  <p>"{current.activeTopic?.power}"</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Controls */}
      {view === 'STORY' && (
        <footer className={styles.footer}>
          <button
            onClick={prevLesson}
            disabled={currentIndex === 0}
            className={styles.navBtn}
          >
            <ArrowLeft />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={styles.playBtn}
          >
            {isPlaying ? <Volume2 /> : <Play />}
            <span>Listen</span>
          </button>

          <button
            onClick={nextLesson}
            disabled={currentIndex === lessons.length - 1}
            className={styles.navBtn}
          >
            <ArrowRight />
          </button>
        </footer>
      )}
    </div>
  );
}
