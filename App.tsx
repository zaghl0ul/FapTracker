
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { SessionLog, TimeComparison } from './types';
import { TIME_COMPARISONS } from './constants';
import LogForm from './components/LogForm';
import ComparisonResult from './components/ComparisonResult';
import SessionHistory from './components/SessionHistory';
import AccomplishmentModal from './components/AccomplishmentModal';
import ThemeSelector from './components/ThemeSelector';
import { ShareIcon, SparklesIcon, PlusCircleIcon } from './components/Icons';

const SESSIONS_STORAGE_KEY = 'faptracker_sessions';
const PINS_STORAGE_KEY = 'faptracker_pinned_accomplishments';
const THEME_STORAGE_KEY = 'faptracker_theme';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [pinnedAccomplishments, setPinnedAccomplishments] = useState<string[]>([]);
  const [theme, setTheme] = useState('dark-amber');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (storedSessions) setSessions(JSON.parse(storedSessions));

      const storedPins = localStorage.getItem(PINS_STORAGE_KEY);
      if (storedPins) setPinnedAccomplishments(JSON.parse(storedPins));

      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) setTheme(storedTheme);

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Failed to save sessions to localStorage", error);
    }
  }, [sessions]);

  useEffect(() => {
    try {
      localStorage.setItem(PINS_STORAGE_KEY, JSON.stringify(pinnedAccomplishments));
    } catch (error) {
      console.error("Failed to save pins to localStorage", error);
    }
  }, [pinnedAccomplishments]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  const totalMinutes = useMemo(() => {
    return sessions.reduce((total, session) => total + session.durationMinutes, 0);
  }, [sessions]);

  const addSession = useCallback((duration: number) => {
    const newSession: SessionLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      durationMinutes: duration,
    };
    setSessions(prevSessions => [...prevSessions, newSession]);
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== id));
  }, []);
  
  const togglePin = useCallback((name: string) => {
    setPinnedAccomplishments(prevPins => {
        if (prevPins.includes(name)) {
            return prevPins.filter(pin => pin !== name);
        } else {
            return [...prevPins, name];
        }
    });
  }, []);

  const formatTime = (minutes: number) => {
    const d = Math.floor(minutes / (24 * 60));
    const h = Math.floor((minutes % (24 * 60)) / 60);
    const m = Math.floor(minutes % 60);
    
    let result = '';
    if (d > 0) result += `${d}d `;
    if (h > 0) result += `${h}h `;
    if (m > 0 || result === '') result += `${m}m`;

    return result.trim();
  };

  const pinnedComparisons = useMemo(() => {
    const pinnedSet = new Set(pinnedAccomplishments);
    return TIME_COMPARISONS.filter(comp => pinnedSet.has(comp.name));
  }, [pinnedAccomplishments]);

  const handleShare = () => {
    if (pinnedComparisons.length === 0) {
        setShareStatus('Pin a goal to share your progress!');
        setTimeout(() => setShareStatus(''), 3000);
        return;
    }

    let bestComparison = pinnedComparisons[0];
    let bestProgress = (totalMinutes / bestComparison.durationMinutes);

    for (let i = 1; i < pinnedComparisons.length; i++) {
        const currentProgress = (totalMinutes / pinnedComparisons[i].durationMinutes);
        if (currentProgress > bestProgress) {
            bestComparison = pinnedComparisons[i];
            bestProgress = currentProgress;
        }
    }

    const shareText = `I'm tracking my 'self-love' time with FapTracker™ and I'm ${(bestProgress * 100).toFixed(0)}% of the way to ${bestComparison.name.toLowerCase()}. Wish me luck!`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        setShareStatus('Copied to clipboard!');
        setTimeout(() => setShareStatus(''), 3000);
    }).catch(err => {
        setShareStatus('Failed to copy.');
        setTimeout(() => setShareStatus(''), 3000);
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <>
      <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[--color-gradient-from] to-[--color-gradient-to]">
              FapTracker™
            </h1>
            <p className="mt-2 text-lg text-[--color-text-muted] italic">
              Turning 'Me Time' into Monumental Achievements
            </p>
          </header>

          <main className="space-y-8">
            <LogForm onAddSession={addSession} />

            <div className="bg-[--color-bg-secondary]/50 rounded-xl p-6 shadow-lg border border-[--color-border]">
              <h2 className="text-2xl font-bold text-center text-[--color-text-base]">Your Grand Total</h2>
              <div className="mt-4 text-center text-5xl font-mono font-bold text-[--color-primary-accent] tracking-wider">
                {formatTime(totalMinutes)}
              </div>
              <p className="text-center text-[--color-text-subtle] mt-2">Total time invested in your craft.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-[--color-text-base]">Your Pinned Goals</h2>
                  <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[--color-primary] hover:bg-[--color-primary-hover] text-[--color-primary-content] font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        <PlusCircleIcon className="w-5 h-5"/>
                        Manage Goals
                    </button>
                    <div className="relative">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-[--color-bg-tertiary] hover:bg-[--color-border] text-[--color-primary-accent] font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                            <ShareIcon className="w-5 h-5"/>
                            Share
                        </button>
                        {shareStatus && <span className="absolute bottom-full right-0 mb-2 w-max bg-slate-600 text-white text-xs rounded py-1 px-2">{shareStatus}</span>}
                    </div>
                    <ThemeSelector currentTheme={theme} setTheme={setTheme} />
                  </div>
              </div>
              
              {pinnedComparisons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pinnedComparisons.map(comp => (
                    <ComparisonResult key={comp.name} comparison={comp} totalMinutes={totalMinutes} onTogglePin={togglePin} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-6 bg-[--color-bg-secondary]/50 rounded-xl border border-dashed border-[--color-border-dashed]">
                  <SparklesIcon className="mx-auto w-12 h-12 text-[--color-text-subtle]" />
                  <h3 className="mt-2 text-lg font-medium text-[--color-text-muted]">Your Quest Awaits</h3>
                  <p className="mt-1 text-sm text-[--color-text-subtle]">You have no pinned goals. Click "Manage Goals" to choose your destiny!</p>
                </div>
              )}
            </div>

            <SessionHistory sessions={sessions} onDeleteSession={deleteSession} />
          </main>
          
          <footer className="text-center mt-12 py-6 border-t border-[--color-bg-secondary]">
              <p className="text-sm text-[--color-text-subtle]">
                  FapTracker™: Handle your business with historical perspective.
              </p>
              <p className="text-xs text-[--color-text-subtle]/80 mt-1">
                  All data is stored locally on your device. We respect your privacy as much as you respect your... time.
              </p>
          </footer>
        </div>
      </div>
      {isModalOpen && (
        <AccomplishmentModal 
          allComparisons={TIME_COMPARISONS}
          pinnedAccomplishments={pinnedAccomplishments}
          onTogglePin={togglePin}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default App;