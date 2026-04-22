'use client';

import { useState, useEffect, useMemo } from 'react';

interface Verse {
  id: string;
  location: { chapter: number; verse: number };
  translations: {
    sanskrit: { text: string; transliteration: string };
    en: { text: string; source: string };
    hi?: { text: string; source: string };
  };
  commentary: { en: string; hi: string };
  metadata: {
    concepts: string[];
    tags: string[];
    importance_score: number;
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'verses' | 'audio' | 'settings'>('dashboard');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/gita')
      .then(res => res.json())
      .then(data => {
        setVerses(data);
        setLoading(false);
      });
  }, []);

  const filteredVerses = useMemo(() => {
    return verses.filter(v => {
      const matchesSearch = search === '' || 
        `${v.location.chapter}.${v.location.verse}`.includes(search) ||
        v.translations.sanskrit.text.includes(search);
      const matchesChapter = search !== '' || v.location.chapter === selectedChapter;
      return matchesSearch && matchesChapter;
    });
  }, [verses, search, selectedChapter]);

  const stats = useMemo(() => ({
    totalChapters: 18,
    totalVerses: verses.length,
    audioCoverage: Math.round((verses.filter(v => v.id).length / 701) * 100), // Placeholder logic
    activeLearners: 1240
  }), [verses]);

  const handleSave = async (verse: Verse) => {
    setSaving(true);
    try {
      const res = await fetch('/api/gita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verse),
      });
      if (res.ok) {
        setVerses(verses.map(v => v.id === verse.id ? verse : v));
        setSelectedVerse(null);
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex-center" style={{ height: '100vh', background: '#05070a', color: 'var(--primary)' }}>
      <div className="devotional-pulse">Preparing the Sacred Dashboard...</div>
    </div>
  );

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#05070a' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>G</div>
          <h2 className="spiritual-font" style={{ fontSize: '1.2rem', margin: 0 }}>Gita Admin</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'verses', label: 'Verse Manager', icon: '📜' },
            { id: 'audio', label: 'Media Library', icon: '🔉' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', maxHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 className="spiritual-font" style={{ fontSize: '2rem', textTransform: 'capitalize' }}>{activeTab}</h1>
            <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Welcome back, Prabhu. Everything is in divine order.</p>
          </div>
          <div className="glass-card" style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '0.8rem', opacity: 0.7 }}>AUM ADMIN</div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
              {[
                { label: 'Chapters', val: stats.totalChapters, icon: '☸️', trend: '+0 this week' },
                { label: 'Verses', val: stats.totalVerses, icon: '📜', trend: '+12 last month' },
                { label: 'Audio Sync', val: `${stats.audioCoverage}%`, icon: '🔉', trend: 'Needs focus' },
                { label: 'Learners', val: stats.activeLearners, icon: '🙌', trend: '+14% growth' }
              ].map((s, i) => (
                <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', opacity: 0.6 }}>{s.trend}</span>
                  </div>
                  <h4 style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</h4>
                  <div style={{ fontSize: '2.4rem', fontWeight: 600 }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: '3rem' }}>
              <h3 className="spiritual-font" style={{ marginBottom: '2rem' }}>Recent Wisdom Updates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {verses.slice(0, 5).map(v => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div className="spiritual-font" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Verse {v.location.chapter}.{v.location.verse}</div>
                      <div style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: '0.2rem' }}>{v.translations.en.text.substring(0, 60)}...</div>
                    </div>
                    <button className="btn-text" style={{ fontSize: '0.7rem' }}>EDIT</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'verses' && (
          <div className="animate-in">
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Global Search (1.1, karma, etc...)" 
                className="admin-input" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="btn-primary-outline" style={{ background: 'var(--primary)', color: '#000' }}>+ NEW VERSE</button>
            </div>

            {/* Chapter Pagination Bar */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '1rem', whiteSpace: 'nowrap' }} className="custom-scroll">
              {Array.from({ length: 18 }, (_, k) => k + 1).map(ch => (
                <button 
                  key={ch} 
                  onClick={() => { setSelectedChapter(ch); setSearch(''); }}
                  style={{ 
                    padding: '0.6rem 1.2rem', 
                    borderRadius: '8px', 
                    background: selectedChapter === ch && search === '' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    color: selectedChapter === ch && search === '' ? '#000' : '#888',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  CH {ch}
                </button>
              ))}
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    <th style={{ padding: '1.5rem 2rem' }}>Ref</th>
                    <th>Shloka</th>
                    <th>Importance</th>
                    <th style={{ textAlign: 'right', padding: '1.5rem 2rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVerses.slice(0, 50).map(v => (
                    <tr key={v.id} className="admin-table-row">
                      <td style={{ padding: '1.5rem 2rem', color: 'var(--primary)', fontWeight: 600 }}>{v.location.chapter}.{v.location.verse}</td>
                      <td style={{ opacity: 0.7, fontSize: '0.9rem' }}>{v.translations.sanskrit.text.substring(0, 50)}...</td>
                      <td>
                        <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                          <div style={{ width: `${v.metadata.importance_score * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', padding: '1.5rem 2rem' }}>
                        <button className="btn-text" onClick={() => setSelectedVerse(v)}>OPEN EDITOR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Full Window Editor Modal */}
        {selectedVerse && (
          <div className="admin-modal-backdrop" onClick={() => setSelectedVerse(null)}>
            <div className="admin-modal animate-divine-rise" onClick={e => e.stopPropagation()}>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <h2 className="spiritual-font" style={{ fontSize: '2.5rem' }}>Verse {selectedVerse.location.chapter}.{selectedVerse.location.verse}</h2>
                  <p style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '2px' }}>PUBLISHING CONSOLE</p>
                </div>
                <button 
                  className="play-btn-circle" 
                  onClick={() => setSelectedVerse(null)}
                  style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}
                >
                  ✕
                </button>
              </header>

              <div className="admin-editor-grid">
                {/* Primary Content Row */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="admin-label">SANSKRIT SHLOKA</label>
                  <textarea 
                    className="admin-textarea" 
                    style={{ height: '140px', fontSize: '1.4rem', textAlign: 'center' }}
                    value={selectedVerse.translations.sanskrit.text}
                    onChange={e => setSelectedVerse({...selectedVerse, translations: {...selectedVerse.translations, sanskrit: {...selectedVerse.translations.sanskrit, text: e.target.value}}})}
                  />
                </div>

                {/* Translation Row */}
                <div>
                  <label className="admin-label">ENGLISH TRANSLATION</label>
                  <textarea 
                    className="admin-textarea"
                    value={selectedVerse.translations.en.text}
                    onChange={e => setSelectedVerse({...selectedVerse, translations: {...selectedVerse.translations, en: {...selectedVerse.translations.en, text: e.target.value}}})}
                  />
                </div>
                <div>
                  <label className="admin-label">HINDI TRANSLATION</label>
                  <textarea 
                    className="admin-textarea"
                    value={selectedVerse.translations.hi?.text || ''}
                    onChange={e => setSelectedVerse({...selectedVerse, translations: {...selectedVerse.translations, hi: {text: e.target.value, source: selectedVerse.translations.hi?.source || ''}}})}
                  />
                </div>

                {/* Commentary Row */}
                <div>
                  <label className="admin-label">ENGLISH COMMENTARY</label>
                  <textarea 
                    className="admin-textarea"
                    style={{ height: '240px' }}
                    value={selectedVerse.commentary.en}
                    onChange={e => setSelectedVerse({...selectedVerse, commentary: {...selectedVerse.commentary, en: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="admin-label">HINDI COMMENTARY</label>
                  <textarea 
                    className="admin-textarea"
                    style={{ height: '240px' }}
                    value={selectedVerse.commentary.hi || ''}
                    onChange={e => setSelectedVerse({...selectedVerse, commentary: {...selectedVerse.commentary, hi: e.target.value}})}
                  />
                </div>

                {/* Metadata Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', gridColumn: 'span 2', marginTop: '1rem' }}>
                  <div>
                    <label className="admin-label">CONCEPTS (COMMA SEPARATED)</label>
                    <input 
                      className="admin-input" style={{ width: '100%' }}
                      value={selectedVerse.metadata.concepts.join(', ')}
                      onChange={e => setSelectedVerse({...selectedVerse, metadata: {...selectedVerse.metadata, concepts: e.target.value.split(',').map(s => s.trim())}})}
                    />
                  </div>
                  <div>
                    <label className="admin-label">TAGS (COMMA SEPARATED)</label>
                    <input 
                      className="admin-input" style={{ width: '100%' }}
                      value={selectedVerse.metadata.tags.join(', ')}
                      onChange={e => setSelectedVerse({...selectedVerse, metadata: {...selectedVerse.metadata, tags: e.target.value.split(',').map(s => s.trim())}})}
                    />
                  </div>
                  <div>
                    <label className="admin-label">IMPORTANCE SCORE ({selectedVerse.metadata.importance_score})</label>
                    <input 
                      type="range" min="0" max="1" step="0.1" 
                      style={{ width: '100%', marginTop: '1rem' }}
                      value={selectedVerse.metadata.importance_score}
                      onChange={e => setSelectedVerse({...selectedVerse, metadata: {...selectedVerse.metadata, importance_score: parseFloat(e.target.value)}})}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2', marginTop: '3rem' }}>
                  <button 
                    className={`btn-primary tap-effect ${saving ? 'loading' : ''}`} 
                    style={{ width: '100%', padding: '1.5rem', background: 'var(--primary)', color: '#000', fontSize: '1rem', fontWeight: 700 }} 
                    onClick={() => handleSave(selectedVerse)}
                  >
                    {saving ? 'SYNCING WITH AKASHIC RECORDS...' : 'PUBLISH DIVINE WISDOM'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-layout { height: 100vh; overflow: hidden; }
        .admin-nav-item {
          background: transparent; border: none; color: rgba(255,255,255,0.4);
          padding: 1rem 1.5rem; border-radius: 12px; display: flex; align-items: center; gap: 1rem;
          cursor: pointer; transition: all 0.3s ease; font-weight: 500; text-align: left;
        }
        .admin-nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .admin-nav-item.active { background: rgba(212, 175, 55, 0.1); color: var(--primary); }
        .admin-table-row { transition: all 0.3s ease; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .admin-table-row:hover { background: rgba(255,255,255,0.02); }
        
        .admin-input {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          padding: 1rem 1.5rem; border-radius: 12px; color: #fff; outline: none; transition: 0.3s;
        }
        .admin-input:focus { border-color: var(--primary); background: rgba(212, 175, 55, 0.05); }

        .admin-modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(5, 7, 10, 0.95); backdrop-filter: blur(20px); z-index: 10000;
          display: flex; align-items: center; justify-content: center; padding: 4rem;
        }
        .admin-modal {
          width: 100%; max-width: 1400px; height: 100%;
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 30px; padding: 4rem; overflow-y: auto; position: relative;
        }

        .admin-editor-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;
        }

        .admin-label {
          display: block; font-size: 0.65rem; letter-spacing: 2px;
          color: var(--primary); margin-bottom: 0.8rem; opacity: 0.6;
        }
        .admin-textarea {
          width: 100%; height: 160px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
          padding: 1.5rem; color: #fff; outline: none; resize: none; transition: 0.3s;
          font-family: inherit; line-height: 1.6;
        }
        .admin-textarea:focus { border-color: var(--primary); background: rgba(255,255,255,0.05); }

        @keyframes divineRise {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-divine-rise {
          animation: divineRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
