
import React, { useState, useCallback } from 'react';
import { MoodType, PromptResult } from './types';
import MoodCard from './components/MoodCard';
import { generateMusicContent } from './services/geminiService';

const App: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'none' | 'prompt' | 'lyrics'>('none');

  const moods = [
    { type: MoodType.ENTHUSIASTIC, label: 'Coşkulu', icon: '🔥' },
    { type: MoodType.CALM, label: 'Sakin', icon: '🧘' },
    { type: MoodType.SAD, label: 'Üzgün', icon: '😢' },
    { type: MoodType.ENERGETIC, label: 'Enerjik', icon: '⚡' },
    { type: MoodType.MYSTERIOUS, label: 'Gizemli', icon: '🔮' },
  ];

  const handleGenerate = async () => {
    if (!selectedMood) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopyStatus('none');

    try {
      const data = await generateMusicContent(selectedMood);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback((text: string, type: 'prompt' | 'lyrics') => {
    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => setCopyStatus('none'), 2000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Mood2Music
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          Ruh halini seç, senin için profesyonel prompt ve şarkı sözü hazırlayalım.
        </p>
      </div>

      {/* Mood Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-10">
        {moods.map((m) => (
          <MoodCard
            key={m.type}
            mood={m.type}
            label={m.label}
            icon={m.icon}
            selected={selectedMood === m.type}
            onClick={() => setSelectedMood(m.type)}
          />
        ))}
      </div>

      {/* Action Button */}
      <button
        onClick={handleGenerate}
        disabled={!selectedMood || isLoading}
        className={`w-full md:w-auto px-12 py-4 rounded-full font-bold text-xl transition-all ${
          !selectedMood || isLoading
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/50 scale-100 hover:scale-105'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Üretiliyor...
          </span>
        ) : (
          'Prompt ve Sözleri Üret'
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 w-full max-w-2xl text-center">
          {error}
        </div>
      )}

      {/* Result Area */}
      {result && (
        <div className="mt-12 w-full max-w-3xl space-y-8 animate-fade-in">
          {/* Music Prompt Section */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-300 flex items-center gap-2">
                <span className="text-2xl">🎹</span> Müzik Promptu
              </h2>
              <button
                onClick={() => handleCopy(result.prompt, 'prompt')}
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  copyStatus === 'prompt' ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                {copyStatus === 'prompt' ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
            <p className="text-lg leading-relaxed text-slate-100 italic">
              "{result.prompt}"
            </p>
          </div>

          {/* Lyrics Section */}
          <div className="glass p-8 rounded-3xl relative overflow-hidden border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                <span className="text-2xl">✍️</span> Şarkı Sözleri
              </h2>
              <button
                onClick={() => handleCopy(result.lyrics, 'lyrics')}
                className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                  copyStatus === 'lyrics' ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                {copyStatus === 'lyrics' ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
            <div className="text-lg leading-relaxed text-slate-100 whitespace-pre-wrap font-mono bg-black/20 p-6 rounded-xl border border-white/5">
              {result.lyrics}
            </div>
          </div>
          
          <p className="text-center text-sm text-slate-500">
            Promptu kopyalayıp Suno/Udio'ya, sözleri ise 'Lyrics' kısmına yapıştırabilirsiniz.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-400 border-t border-white/5 pt-12">
        <div>
          <div className="text-blue-400 text-xl mb-2 font-bold">Teknik Prompt</div>
          <p className="text-xs">AI modellerinin anlayacağı detaylı enstrümantasyon.</p>
        </div>
        <div>
          <div className="text-purple-400 text-xl mb-2 font-bold">Yaratıcı Sözler</div>
          <p className="text-xs">Ruh haline uygun, bestelenmeye hazır lirikler.</p>
        </div>
        <div>
          <div className="text-pink-400 text-xl mb-2 font-bold">Tam Uyum</div>
          <p className="text-xs">Müzik tarzı ve sözlerin birbirini tamamladığı sonuçlar.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
