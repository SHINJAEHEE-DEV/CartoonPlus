let speechQueue = Promise.resolve();

export function speakKorean(text: string, voiceName?: string, rate = 0.95): Promise<void> {
  const speak = () => new Promise<void>((resolve, reject) => {
    if (!('speechSynthesis' in window))
      return reject(new Error('이 브라우저는 방송을 지원하지 않습니다.'));
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = rate;
    if (voiceName) {
      const voice = window.speechSynthesis
        .getVoices()
        .find((candidate) => candidate.name === voiceName && candidate.lang.toLowerCase() === 'ko-kr');
      if (voice) utterance.voice = voice;
    }
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error('방송 재생에 실패했습니다.'));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
  const queued = speechQueue.then(speak, speak);
  speechQueue = queued.then(() => undefined, () => undefined);
  return queued;
}

export function stopKoreanSpeech(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
