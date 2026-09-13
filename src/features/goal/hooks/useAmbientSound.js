import { useState, useRef, useEffect, useCallback } from "react";

// Ambient sound engine — synthesized in-browser, no external audio files.
export function useAmbientSound() {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const [active, setActive] = useState("none");

  const stop = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try {
        n.stop?.();
        n.disconnect?.();
      } catch {
        /* already stopped */
      }
    });
    nodesRef.current = [];
  }, []);

  const play = useCallback(
    (type) => {
      stop();
      setActive(type);
      if (type === "none") return;

      if (!ctxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      if (type === "rain" || type === "brown") {
        const bufferSize = ctx.sampleRate * 4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = type === "rain" ? 1400 : 500;

        const gain = ctx.createGain();
        gain.gain.value = type === "rain" ? 0.12 : 0.16;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();

        nodesRef.current = [source, filter, gain];
      } else if (type === "hum") {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 110;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.015;

        const gain = ctx.createGain();
        gain.gain.value = 0.05;

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        lfo.start();
        nodesRef.current = [osc, lfo, lfoGain, gain];
      }
    },
    [stop]
  );
  useEffect(() => stop, [stop]);
  return { active, play, stop };
}