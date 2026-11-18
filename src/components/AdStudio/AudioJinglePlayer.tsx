import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Radio,
  Mic,
} from 'lucide-react';

interface AudioJinglePlayerProps {
  script: string;
  shopName: string;
  language: string;
}

export const AudioJinglePlayer: React.FC<AudioJinglePlayerProps> = ({
  script,
  shopName,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Setup Web Speech synthesis
  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // cancel any ongoing speech

    const cleanText = script.replace(/[*_~#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Pick voice if available
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India')
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.rate = playbackRate;
    utterance.pitch = 1.05; // slightly cheerful / energetic

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white p-5 rounded-2xl border border-purple-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              Kirana Loudspeaker & WhatsApp Voice Note
              <span className="bg-purple-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                AI Voice
              </span>
            </h4>
            <p className="text-[11px] text-purple-200">
              Energetic promotional audio for {shopName}
            </p>
          </div>
        </div>

        {/* Speed pills */}
        <div className="flex items-center gap-1 bg-purple-900/50 p-1 rounded-lg border border-purple-700/40 text-[10px] font-bold">
          {[0.9, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                setPlaybackRate(rate);
                if (isPlaying) {
                  handleStop();
                }
              }}
              className={`px-2 py-0.5 rounded ${
                playbackRate === rate ? 'bg-purple-500 text-white' : 'text-purple-300 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Player Controls */}
      <div className="bg-purple-900/30 border border-purple-700/30 p-4 rounded-xl flex items-center justify-between gap-4">
        {/* Play Button */}
        <button
          onClick={handlePlayPause}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-bold flex items-center justify-center shadow-lg transform active:scale-95 transition shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-blue-950" />
          ) : (
            <Play className="w-6 h-6 fill-blue-950 ml-0.5" />
          )}
        </button>

        {/* Animated Visualizer Waves */}
        <div className="flex-1 flex items-center justify-center gap-1 h-10 px-2 overflow-hidden">
          {[40, 75, 30, 90, 50, 85, 60, 95, 45, 80, 65, 35, 90, 55, 70, 85, 40, 60].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying
                  ? 'bg-gradient-to-t from-amber-400 to-purple-400'
                  : 'bg-purple-700/50'
              }`}
              style={{
                height: isPlaying ? `${Math.max(15, (h * (i % 3 + 1)) % 100)}%` : '20%',
                animation: isPlaying ? `pulse 0.6s infinite alternate ${i * 0.05}s` : 'none',
              }}
            />
          ))}
        </div>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          disabled={!isPlaying}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white disabled:opacity-40 transition"
          title="Stop Audio"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Script Box */}
      <div className="bg-black/40 border border-purple-800/40 p-3 rounded-xl">
        <div className="flex items-center justify-between text-xs text-purple-300 font-bold mb-1.5">
          <span className="flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            Announcement Script (Hindi / Hinglish):
          </span>
          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded transition font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-200 leading-relaxed italic">
          "{script}"
        </p>
      </div>
    </div>
  );
};
