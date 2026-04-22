'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Sword,
  ShieldCheck,
  Navigation,
  Trophy,
  Anchor,
  BookOpen,
  ArrowDown
} from 'lucide-react';
import styles from './page.module.css';

const LIFE_STAGES = [
  {
    id: '3-6',
    age: '3 – 6',
    theme: 'The Magic Spark',
    objective: 'Discovering your inner light and kindness as a superpower.',
    focus: 'Mirror',
    icon: <Sparkles />,
    color: '#FFB300',
    path: '/mirror'
  },
  {
    id: '7-12',
    age: '7 – 12',
    theme: 'The Hero’s Journey',
    objective: 'Understanding the "Mind-Monkey" and leading by example.',
    focus: 'Hero',
    icon: <Sword />,
    color: '#FF6D00',
    path: '/hero'
  },
  {
    id: '13-18',
    age: '13 – 18',
    theme: 'High Performance Mindset',
    objective: 'Navigating identity and focus through effort, not results.',
    focus: 'Shield',
    icon: <ShieldCheck />,
    color: '#00BFA5',
    path: '/shield'
  },
  {
    id: '19-24',
    age: '19 – 24',
    theme: 'Foundational Philosophy',
    objective: 'Building a personal "Source Code" for adult life.',
    focus: 'Compass',
    icon: <Navigation />,
    color: '#2979FF',
    path: '/compass'
  },
  {
    id: '25-35',
    age: '25 – 35',
    theme: 'Strategic Mastery',
    objective: 'Managing your energy (Gunas) and mastering the field.',
    focus: 'The Map',
    icon: <Trophy />,
    color: '#651FFF',
    path: '/map'
  },
  {
    id: '35-45',
    age: '35 – 45',
    theme: 'Life Integration',
    objective: 'Mastering the "Middle Way" in career, family, and legacy.',
    focus: 'Anchor',
    icon: <Anchor />,
    color: '#F9A825',
    path: '/anchor'
  },
  {
    id: '45plus',
    age: '45+',
    theme: 'The Sage Scholar',
    objective: 'Eternal wisdom, mentorship, and selfless service.',
    focus: 'The Lighthouse',
    icon: <BookOpen />,
    color: '#FFECB3',
    path: '/lighthouse'
  }
];

export default function LandingPortal() {
  const router = useRouter();
  const [expandingStage, setExpandingStage] = useState<any | null>(null);

  const handleStageClick = (stage: any) => {
    setExpandingStage(stage);
    // Wait for the expansion animation to complete before navigating
    setTimeout(() => {
      router.push(stage.path);
    }, 800);
  };

  return (
    <div className={styles.portalContainer}>
      {/* Portal Expansion Overlay */}
      <AnimatePresence>
        {expandingStage && (
          <motion.div 
            initial={{ clipPath: 'circle(10% at 50% 50%)', opacity: 0 }}
            animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={styles.portalOverlay}
            style={{ backgroundColor: expandingStage.color }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={styles.potalContentPreview}
            >
              <h1 className={styles.portalTitle}>{expandingStage.theme}</h1>
              <p className={styles.portalSubtitle}>Entering The {expandingStage.focus}...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divine Background Layer */}
      <div className={styles.divineBackgroundWrapper}>
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2 }}
          className={styles.divineImagePath}
          style={{ backgroundImage: 'url(/radiant-path.png)' }}
        />
        <div className={styles.etherealOverlay}></div>
      </div>

      <div className={styles.ambientBackground}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={styles.heroContent}
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: '2px' }}
            animate={{ opacity: 1, letterSpacing: '6px' }}
            className={styles.preTitle}
          >
            A Divine Journey Through Time
          </motion.span>
          <h1 className={styles.mainTitle}>
            The Evolution of the <br />
            <span>Sovereign Soul</span>
          </h1>
          <p className={styles.mainDescription}>
            From the <strong>Radiant Spark</strong> of childhood to the <strong>Eternal Lighthouse</strong> of the Sage.
            Discover how the Gita’s wisdom matures with you at every breath.
          </p>
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={styles.scrollIndicator}
          >
            <span>Descend into Wisdom</span>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className={styles.timelineSection}>
        <div className={styles.timelineLine}></div>

        {LIFE_STAGES.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`${styles.stageCardWrapper} ${index % 2 === 0 ? styles.left : styles.right}`}
            onClick={() => handleStageClick(stage)}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -10 }}
              className={styles.stageCard}
              style={{ '--accent-color': stage.color } as any}
            >
              <div className={styles.cardHeader}>
                <div className={styles.stageAge}>{stage.age}</div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className={styles.stageIcon}
                >
                  {stage.icon}
                </motion.div>
              </div>
              <h3 className={styles.stageTheme}>{stage.theme}</h3>
              <p className={styles.stageObjective}>{stage.objective}</p>
              <div className={styles.stageFocus}>
                <span className={styles.focusLabel}>FOCUS:</span> The {stage.focus}
              </div>
              <div className={styles.enterButton}>Enter Portal</div>
              <div className={styles.glowEffect} style={{ background: stage.color }}></div>
            </motion.div>
          </motion.div>
        ))}
      </section>

      {/* Footer Quote */}
      <section className={styles.quoteSection}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={styles.quoteBox}
        >
          <p>"Reflect on this fully, and then do as you wish."</p>
          <span>— Lord Krishna, Gita 18.63</span>
          <p className={styles.footerNote}>The Sovereign Soul respects your free will at every stage of life.</p>
        </motion.div>
      </section>
    </div>
  );
}
