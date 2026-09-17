import { useEffect, useState } from 'react';
import { getKoreanFemaleVoices } from '../../lib/broadcastRunner';

export const VOICE_STORAGE_KEY = 'cartoonplus_broadcast_voice';

export function useBroadcastVoice() {
  const [voiceNames, setVoiceNames] = useState<string[]>([]);
  const [voiceName, setVoiceNameState] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(VOICE_STORAGE_KEY) || '';
    }
    return '';
  });

  const setVoiceName = (newVoice: string) => {
    setVoiceNameState(newVoice);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(VOICE_STORAGE_KEY, newVoice);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const refreshVoices = () => {
      const names = getKoreanFemaleVoices(window.speechSynthesis.getVoices()).map((voice) => voice.name);
      setVoiceNames(names);

      const saved = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(VOICE_STORAGE_KEY) : null;
      if (saved && names.includes(saved)) {
        setVoiceNameState(saved);
      } else if (!voiceName && names.length > 0) {
        setVoiceNameState(names[0]);
      }
    };

    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
  }, [voiceName]);

  return {
    voiceName,
    voiceNames,
    setVoiceName,
  };
}
