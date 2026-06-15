"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** One product sound at a time — tap toggles play/pause */
export function useSignatureSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    audioRef.current = null;
    setActiveId(null);
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(
    (id: string, src: string) => {
      if (activeId === id && isPlaying) {
        stop();
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      setActiveId(id);

      const audio = new Audio(src);
      audioRef.current = audio;

      audio.onended = () => {
        setActiveId(null);
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onpause = () => {
        if (audioRef.current === audio && audio.currentTime > 0 && !audio.ended) {
          setIsPlaying(false);
        }
      };

      audio.onplay = () => {
        setIsPlaying(true);
      };

      void audio.play().catch(() => {
        stop();
      });
    },
    [activeId, isPlaying, stop],
  );

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return {
    activeId,
    isPlaying,
    toggle,
    stop,
    isActive: (id: string) => activeId === id && isPlaying,
  };
}
