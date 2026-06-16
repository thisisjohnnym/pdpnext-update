"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePdpRuntime } from "./pdp-runtime-context";

/** One product sound at a time — tap toggles play/pause */
export function useSignatureSound() {
  const { shouldRun, lifecycle } = usePdpRuntime();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const resumeOnActiveRef = useRef(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudio = useCallback((src: string) => {
    const cache = audioCacheRef.current;
    let audio = cache.get(src);

    if (!audio) {
      audio = new Audio(src);
      audio.preload = "none";
      cache.set(src, audio);
    }

    return audio;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    audioRef.current = null;
    resumeOnActiveRef.current = false;
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
        audioRef.current.currentTime = 0;
      }

      setActiveId(id);

      const audio = getAudio(src);
      audioRef.current = audio;

      audio.onended = () => {
        setActiveId(null);
        setIsPlaying(false);
        resumeOnActiveRef.current = false;
        audioRef.current = null;
      };

      audio.onpause = () => {
        if (audioRef.current === audio && audio.currentTime > 0 && !audio.ended) {
          setIsPlaying(false);
        }
      };

      audio.onplay = () => {
        setIsPlaying(true);
        resumeOnActiveRef.current = true;
      };

      if (!shouldRun) {
        return;
      }

      void audio.play().catch(() => {
        stop();
      });
    },
    [activeId, getAudio, isPlaying, shouldRun, stop],
  );

  useEffect(() => {
    if (shouldRun) {
      return;
    }

    const audio = audioRef.current;
    if (audio && !audio.paused) {
      resumeOnActiveRef.current = true;
      audio.pause();
      setIsPlaying(false);
    }
  }, [shouldRun]);

  useEffect(() => {
    if (!shouldRun || !lifecycle.isVisible || !resumeOnActiveRef.current) {
      return;
    }

    const audio = audioRef.current;
    if (!audio || !audio.paused) {
      return;
    }

    void audio.play().catch(() => {
      stop();
    });
  }, [lifecycle.isVisible, shouldRun, stop]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioCacheRef.current.forEach((audio) => {
        audio.pause();
      });
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
