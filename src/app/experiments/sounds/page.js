"use client";

/* Sound sandbox — computer-analog hover sounds.
   ----------------------------------------------
   Web Audio synthesis only (no asset files). Each preset declares a
   `type` (tone / bell / dyad / noise / saw) that the player branches
   on to choose its synth path. Output is shaped by a shared envelope
   and a high-shelf cut so the textures stay warm. */

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

/* Computer-analog presets. Small, tactile sounds with the warmth of
   old hardware: ticks, blips, soft bells, modem-warm dyads, lowpass
   saw tails. */
const PRESETS = [
  {
    id: "tick",
    name: "Soft tick",
    spec: "30ms / sine 1.2 kHz",
    type: "tone",
    frequency: 1200,
    duration: 0.03,
    gainMul: 0.5,
    description: "A clean short tick. Quiet keyboard press.",
  },
  {
    id: "blip",
    name: "Warm blip",
    spec: "90ms / sine 700 Hz",
    type: "tone",
    frequency: 700,
    duration: 0.09,
    gainMul: 0.55,
    description: "Round low-mid tone. Soft computer notification.",
  },
  {
    id: "bell",
    name: "Bell pluck",
    spec: "220ms / sine 880 Hz + 2nd harmonic",
    type: "bell",
    frequency: 880,
    duration: 0.22,
    gainMul: 0.42,
    description: "Plucked sine bell with a quick decay. Spacious.",
  },
  {
    id: "modem",
    name: "Modem chirp",
    spec: "130ms / detuned sines 600 Hz",
    type: "dyad",
    frequency: 600,
    detune: 9,
    duration: 0.13,
    gainMul: 0.5,
    description: "Two slightly detuned sines. Hint of old hardware.",
  },
  {
    id: "relay",
    name: "Relay click",
    spec: "55ms / bandpass noise 1.6 kHz",
    type: "noise",
    filterFreq: 1600,
    q: 1.3,
    duration: 0.055,
    gainMul: 0.4,
    description: "Quick filtered noise burst. Like a relay tripping.",
  },
  {
    id: "saw",
    name: "Saw tail",
    spec: "300ms / saw 220 Hz / lowpass 1.4 kHz",
    type: "saw",
    frequency: 220,
    filterFreq: 1400,
    duration: 0.3,
    gainMul: 0.38,
    description: "Brief lowpassed sawtooth. Subtle analog warmth.",
  },
];

export default function SoundsSandbox() {
  const ctxRef = useRef(null);
  const noiseBufferRef = useRef(null);
  const lastPlayedRef = useRef({});            // throttle per-card
  const [audioReady, setAudioReady] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const [muted, setMuted] = useState(false);

  /* Cleanup on unmount. */
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
      }
    };
  }, []);

  async function enableAudio() {
    if (audioReady) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    try {
      await ctx.resume();
    } catch {
      /* Some browsers throw if already running; ignore. */
    }

    /* Pre-generate a 2-second white-noise buffer for the noise preset. */
    const len = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    ctxRef.current = ctx;
    noiseBufferRef.current = buffer;
    setAudioReady(true);
  }

  function playPreset(preset) {
    if (muted || !audioReady) return;
    const ctx = ctxRef.current;
    const buffer = noiseBufferRef.current;
    if (!ctx || !buffer) return;

    /* Throttle per-preset so a fast cursor scrub doesn't stack. */
    const now = performance.now();
    const last = lastPlayedRef.current[preset.id] || 0;
    if (now - last < 120) return;
    lastPlayedRef.current[preset.id] = now;

    const t0 = ctx.currentTime;
    const dur = preset.duration;
    const peak = volume * (preset.gainMul ?? 1);

    /* Shared output bus: envelope -> high-shelf cut -> destination.
       The high-shelf rolls off brittle top end so noisy/saw textures
       stay warm. */
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(peak, t0 + 0.012);
    env.gain.setValueAtTime(peak, t0 + Math.max(dur * 0.4, 0.01));
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.08);

    const shelf = ctx.createBiquadFilter();
    shelf.type = "highshelf";
    shelf.frequency.value = 5000;
    shelf.gain.value = -10;

    env.connect(shelf);
    shelf.connect(ctx.destination);

    const oscs = [];

    switch (preset.type) {
      case "tone": {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = preset.frequency;
        osc.connect(env);
        oscs.push(osc);
        break;
      }
      case "bell": {
        /* Sine fundamental + 2nd harmonic at a lower amplitude.
           Override the envelope: bells decay quickly from peak. */
        const fund = ctx.createOscillator();
        fund.type = "sine";
        fund.frequency.value = preset.frequency;
        const harm = ctx.createOscillator();
        harm.type = "sine";
        harm.frequency.value = preset.frequency * 2;
        const harmGain = ctx.createGain();
        harmGain.gain.value = 0.35;
        fund.connect(env);
        harm.connect(harmGain);
        harmGain.connect(env);
        env.gain.cancelScheduledValues(t0);
        env.gain.setValueAtTime(0, t0);
        env.gain.linearRampToValueAtTime(peak, t0 + 0.005);
        env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        oscs.push(fund, harm);
        break;
      }
      case "dyad": {
        /* Two sines detuned a few cents apart for slow beating. */
        const a = ctx.createOscillator();
        a.type = "sine";
        a.frequency.value = preset.frequency;
        const b = ctx.createOscillator();
        b.type = "sine";
        b.frequency.value = preset.frequency;
        b.detune.value = preset.detune ?? 8;
        a.connect(env);
        b.connect(env);
        oscs.push(a, b);
        break;
      }
      case "noise": {
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        const maxOffset = Math.max(0, buffer.duration - dur - 0.05);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.value = preset.q ?? 1;
        filter.frequency.value = preset.filterFreq ?? 1500;
        src.connect(filter);
        filter.connect(env);
        src.start(t0, Math.random() * maxOffset);
        src.stop(t0 + dur + 0.05);
        break;
      }
      case "saw": {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = preset.frequency;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = preset.filterFreq ?? 1500;
        lp.Q.value = 0.7;
        osc.connect(lp);
        lp.connect(env);
        oscs.push(osc);
        break;
      }
      default:
        return;
    }

    for (const osc of oscs) {
      osc.start(t0);
      osc.stop(t0 + dur + 0.15);
    }
  }

  return (
    <main className="page">
      <div className={styles.root}>
        <span className={styles.eyebrow}>Experiments / Sounds</span>
        <h1 className={styles.headline}>Computer-analog sandbox</h1>
        <p className={styles.lede}>
          I was experimenting with some sounds to add a layer of texture to
          my work. Built with the Web Audio API.
        </p>

        {!audioReady && (
          <div className={styles.enableBanner}>
            <span>Audio is muted until you click anywhere. Browsers require a user gesture first.</span>
            <button
              type="button"
              className="btn btn-primary"
              onClick={enableAudio}
            >
              Enable audio
            </button>
          </div>
        )}

        <div className={styles.controls}>
          <label className={styles.controlGroup}>
            Volume
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
            <span>{Math.round(volume * 100)}%</span>
          </label>
          <label className={styles.controlGroup}>
            <input
              type="checkbox"
              checked={muted}
              onChange={(e) => setMuted(e.target.checked)}
            />
            Mute
          </label>
        </div>

        <div className={styles.grid}>
          {PRESETS.map((p) => (
            <div
              key={p.id}
              className={styles.card}
              onMouseEnter={() => playPreset(p)}
              onFocus={() => playPreset(p)}
              tabIndex={0}
              role="button"
              aria-label={`${p.name}. ${p.description}`}
            >
              <span className={styles.cardLabel}>Preset</span>
              <h2 className={styles.cardName}>{p.name}</h2>
              <span className={styles.cardSpec}>{p.spec}</span>
              <span className={styles.cardSpec} style={{ color: "var(--ink-soft)" }}>
                {p.description}
              </span>
              <button
                type="button"
                className={styles.replay}
                onClick={(e) => { e.stopPropagation(); playPreset(p); }}
              >
                Play again
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
