import { useEffect, useRef, useState } from 'react';
import { useStatsStore } from '../store/useStatsStore';

interface ShotAlarmProps {
  onContinue: () => void;
}

/** Optionale eigene Audiodatei (z.B. ein legal erworbener Song) - einfach unter
 * public/shot-alarm.mp3 ablegen, dann wird sie automatisch statt der
 * generierten Sirene abgespielt. */
const CUSTOM_AUDIO_SRC = `${import.meta.env.BASE_URL}shot-alarm.mp3`;

/**
 * Vollflaechiger "Shotalarm": alle Teams muessen einen Shot trinken.
 * Spielt entweder eine vom Nutzer hinterlegte Audiodatei ab, oder faellt
 * automatisch auf eine per Web Audio API generierte Sirene zurueck
 * (keine externe/urheberrechtlich geschuetzte Audiodatei im Code).
 */
export function ShotAlarm({ onContinue }: ShotAlarmProps) {
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopSireneRef = useRef<() => void>(() => {});
  const [nutztEigeneDatei, setNutztEigeneDatei] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const audio = new Audio(CUSTOM_AUDIO_SRC);
    audio.loop = true;
    audioElRef.current = audio;

    audio
      .play()
      .then(() => {
        if (!cancelled) setNutztEigeneDatei(true);
      })
      .catch(() => {
        if (!cancelled) stopSireneRef.current = starteGenerierteSirene();
      });

    return () => {
      cancelled = true;
      audio.pause();
      stopSireneRef.current();
      audioCtxRef.current?.close();
    };
  }, []);

  function starteGenerierteSirene(): () => void {
    const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return () => {};

    const ctx = new AudioContextCtor();
    audioCtxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    gain.connect(ctx.destination);

    const oscillator = ctx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.connect(gain);
    oscillator.start();

    let hoch = true;
    const intervalId = window.setInterval(() => {
      oscillator.frequency.setValueAtTime(hoch ? 880 : 587, ctx.currentTime);
      hoch = !hoch;
    }, 280);

    return () => {
      window.clearInterval(intervalId);
      oscillator.stop();
    };
  }

  function handleContinue() {
    audioElRef.current?.pause();
    stopSireneRef.current();
    audioCtxRef.current?.close();
    useStatsStore.getState().recordShotAlarm();
    onContinue();
  }

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="animate-pulse text-7xl">🚨</div>
      <p className="text-3xl font-black text-neon-pink">SHOTALARM!</p>
      <p className="text-lg text-white/80">Alle Teams trinken jetzt einen Shot! 🥃</p>
      {!nutztEigeneDatei && (
        <p className="text-xs text-white/30">
          (generierter Alarm-Sound - eigene Audiodatei unter public/shot-alarm.mp3 ablegen für einen individuellen Sound)
        </p>
      )}
      <button onClick={handleContinue} className="btn-primary w-full text-xl">
        🍻 Getrunken – weiter
      </button>
    </div>
  );
}
