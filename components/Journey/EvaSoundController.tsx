"use client";

import { useMotionValueEvent } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "./JourneyController";
import { storyBeats } from "./storyScript";

interface EvaSoundControllerProps {
  enabled: boolean;
}

interface SoundGraph {
  ctx: AudioContext;
  masterGain: GainNode;
  windGain: GainNode;
  windFilter: BiquadFilterNode;
  quartersGain: GainNode;
  entryGain: GainNode;
  breathGain: GainNode;
  noiseBuffer: AudioBuffer;
  cleanup: () => void;
}

function createNoiseBuffer(ctx: AudioContext, durationSec = 3): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.floor(sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  // Pink-ish filtered noise for natural wind, breathing, and squelch.
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    b0 = 0.997 * b0 + white * 0.029;
    b1 = 0.985 * b1 + white * 0.032;
    b2 = 0.95 * b2 + white * 0.048;
    data[i] = THREE.MathUtils.clamp((b0 + b1 + b2 + white * 0.08) * 0.9, -1, 1);
  }

  return buffer;
}

function buildSoundGraph(): SoundGraph | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;

  const ctx = new AudioCtx();
  const noiseBuffer = createNoiseBuffer(ctx, 4);

  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.0001;
  masterGain.connect(ctx.destination);

  // 1. Suit PLSS ventilation fan hum (continuous 116 Hz + 232 Hz + airflow)
  const fanOsc1 = ctx.createOscillator();
  fanOsc1.type = "sine";
  fanOsc1.frequency.value = 116;
  const fanOsc2 = ctx.createOscillator();
  fanOsc2.type = "triangle";
  fanOsc2.frequency.value = 232;
  const fanGain = ctx.createGain();
  fanGain.gain.value = 0.014;
  fanOsc1.connect(fanGain);
  fanOsc2.connect(fanGain);
  fanGain.connect(masterGain);
  fanOsc1.start();
  fanOsc2.start();

  // 2. Astronaut breathing loop (band-passed noise modulated in update loop)
  const breathSource = ctx.createBufferSource();
  breathSource.buffer = noiseBuffer;
  breathSource.loop = true;
  const breathFilter = ctx.createBiquadFilter();
  breathFilter.type = "bandpass";
  breathFilter.frequency.value = 720;
  breathFilter.Q.value = 2.4;
  const breathGain = ctx.createGain();
  breathGain.gain.value = 0.001;
  breathSource.connect(breathFilter);
  breathFilter.connect(breathGain);
  breathGain.connect(masterGain);
  breathSource.start();

  // 3. Thin-air Martian surface wind (progress >= 0.25)
  const windSource = ctx.createBufferSource();
  windSource.buffer = noiseBuffer;
  windSource.loop = true;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 340;
  windFilter.Q.value = 3.2;
  const windGain = ctx.createGain();
  windGain.gain.value = 0;
  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  windSource.start();

  // 4. Off-Shift Quarters warm interior hum (progress 0.74 - 0.83)
  const quartersOsc1 = ctx.createOscillator();
  quartersOsc1.type = "sine";
  quartersOsc1.frequency.value = 60;
  const quartersOsc2 = ctx.createOscillator();
  quartersOsc2.type = "sine";
  quartersOsc2.frequency.value = 120;
  const quartersGain = ctx.createGain();
  quartersGain.gain.value = 0;
  quartersOsc1.connect(quartersGain);
  quartersOsc2.connect(quartersGain);
  quartersGain.connect(masterGain);
  quartersOsc1.start();
  quartersOsc2.start();

  // 5. Atmospheric entry low plasma rumble (progress 0.14 - 0.25)
  const entryOsc = ctx.createOscillator();
  entryOsc.type = "sawtooth";
  entryOsc.frequency.value = 52;
  const entryFilter = ctx.createBiquadFilter();
  entryFilter.type = "lowpass";
  entryFilter.frequency.value = 110;
  const entryGain = ctx.createGain();
  entryGain.gain.value = 0;
  entryOsc.connect(entryFilter);
  entryFilter.connect(entryGain);
  entryGain.connect(masterGain);
  entryOsc.start();

  const cleanup = () => {
    try {
      fanOsc1.stop();
      fanOsc2.stop();
      breathSource.stop();
      windSource.stop();
      quartersOsc1.stop();
      quartersOsc2.stop();
      entryOsc.stop();
      void ctx.close();
    } catch {
      // Ignore already-stopped nodes
    }
  };

  return {
    ctx,
    masterGain,
    windGain,
    windFilter,
    quartersGain,
    entryGain,
    breathGain,
    noiseBuffer,
    cleanup,
  };
}

function triggerRadioSquelch(
  graph: SoundGraph,
  speaker: "PK" | "CONTROL"
): void {
  const { ctx, masterGain, noiseBuffer } = graph;
  if (ctx.state !== "running") return;

  const now = ctx.currentTime;

  // Short VHF static burst
  const burst = ctx.createBufferSource();
  burst.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1850;
  filter.Q.value = 1.8;
  const burstGain = ctx.createGain();
  burstGain.gain.setValueAtTime(0.032, now);
  burstGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.055);
  burst.connect(filter);
  filter.connect(burstGain);
  burstGain.connect(masterGain);
  burst.start(now);
  burst.stop(now + 0.06);

  // Authentic Apollo Quindar-style intro tone (2525 Hz Control / 2475 Hz EVA)
  const tone = ctx.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(speaker === "CONTROL" ? 2525 : 2475, now);
  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(0.022, now);
  toneGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.065);
  tone.connect(toneGain);
  toneGain.connect(masterGain);
  tone.start(now);
  tone.stop(now + 0.07);
}

function triggerMuffledFootstep(graph: SoundGraph): void {
  const { ctx, masterGain, noiseBuffer } = graph;
  if (ctx.state !== "running") return;

  const now = ctx.currentTime;

  // Low suit-boot thud transmitted through the helmet frame
  const thud = ctx.createOscillator();
  thud.type = "sine";
  thud.frequency.setValueAtTime(72, now);
  thud.frequency.exponentialRampToValueAtTime(34, now + 0.11);
  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0.045, now);
  thudGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.12);
  thud.connect(thudGain);
  thudGain.connect(masterGain);
  thud.start(now);
  thud.stop(now + 0.13);

  // Subtle regolith crunch
  const crunch = ctx.createBufferSource();
  crunch.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 260;
  const crunchGain = ctx.createGain();
  crunchGain.gain.setValueAtTime(0.018, now);
  crunchGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.09);
  crunch.connect(filter);
  filter.connect(crunchGain);
  crunchGain.connect(masterGain);
  crunch.start(now);
  crunch.stop(now + 0.1);
}

/**
 * Optional procedural Web Audio soundscape (docs/DESIGN_PLAN.md §7):
 * - Starts muted by default (`enabled = false`).
 * - Synthesizes suit fan hum, calm astronaut breathing, radio squelch on each
 *   radio line, muffled footsteps while walking on the surface, thin-air
 *   Martian wind, and warm interior hum inside the Off-Shift Quarters.
 */
export default function EvaSoundController({
  enabled,
}: EvaSoundControllerProps) {
  const { progress, velocity } = useJourney();
  const graphRef = useRef<SoundGraph | null>(null);
  const lastBeatIdRef = useRef<string | null>(null);
  const lastFootstepAtRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      if (graphRef.current) {
        const { ctx, masterGain } = graphRef.current;
        if (ctx.state === "running") {
          masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15);
          window.setTimeout(() => {
            void ctx.suspend();
          }, 220);
        }
      }
      return;
    }

    if (!graphRef.current) {
      graphRef.current = buildSoundGraph();
    }
    const graph = graphRef.current;
    if (!graph) return;

    void graph.ctx.resume().then(() => {
      graph.masterGain.gain.setTargetAtTime(
        0.85,
        graph.ctx.currentTime,
        0.25
      );
      triggerRadioSquelch(graph, "CONTROL");
    });

    const interval = window.setInterval(() => {
      if (!graphRef.current || graphRef.current.ctx.state !== "running") return;
      const g = graphRef.current;
      const now = g.ctx.currentTime;
      const p = progress.get();

      // Breathing envelope (~4.8s cycle: inhale 1.5s, hold 0.5s, exhale 1.9s)
      const cycle = now % 4.8;
      let breathEnv = 0.002;
      if (cycle < 1.5) {
        breathEnv = Math.sin((cycle / 1.5) * Math.PI) * 0.022;
      } else if (cycle >= 2.0 && cycle < 3.9) {
        breathEnv = Math.sin(((cycle - 2.0) / 1.9) * Math.PI) * 0.026;
      }
      g.breathGain.gain.setTargetAtTime(Math.max(0.001, breathEnv), now, 0.08);

      // Entry rumble (Act 3: 0.14 - 0.25)
      const entryIntensity =
        THREE.MathUtils.smoothstep(p, 0.135, 0.18) *
        (1 - THREE.MathUtils.smoothstep(p, 0.22, 0.255));
      g.entryGain.gain.setTargetAtTime(entryIntensity * 0.045, now, 0.12);

      // Quarters interior hum (Act 11: 0.74 - 0.83)
      const inQuarters =
        THREE.MathUtils.smoothstep(p, 0.735, 0.755) *
        (1 - THREE.MathUtils.smoothstep(p, 0.815, 0.835));
      g.quartersGain.gain.setTargetAtTime(inQuarters * 0.024, now, 0.15);

      // Thin-air surface wind (progress >= 0.25, ducked inside Quarters)
      const onSurface = THREE.MathUtils.smoothstep(p, 0.245, 0.28);
      const windLevel = onSurface * (1 - inQuarters * 0.75) * 0.028;
      g.windGain.gain.setTargetAtTime(windLevel, now, 0.15);
      g.windFilter.frequency.setTargetAtTime(
        320 + Math.sin(now * 0.85) * 110,
        now,
        0.15
      );
    }, 120);

    const handleVisibility = () => {
      if (!graphRef.current) return;
      if (document.hidden) {
        void graphRef.current.ctx.suspend();
      } else if (enabled) {
        void graphRef.current.ctx.resume();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, progress]);

  useEffect(() => {
    return () => {
      graphRef.current?.cleanup();
      graphRef.current = null;
    };
  }, []);

  // Trigger radio squelch on each scroll story beat and muffled footsteps on surface movement
  useMotionValueEvent(progress, "change", (value) => {
    if (!enabled || !graphRef.current) return;

    const activeBeat = storyBeats.find(
      (beat) =>
        beat.trigger.type === "scroll" &&
        value >= beat.trigger.from &&
        value < beat.trigger.to
    );
    const beatId = activeBeat?.id ?? null;

    if (beatId && beatId !== lastBeatIdRef.current) {
      lastBeatIdRef.current = beatId;
      triggerRadioSquelch(graphRef.current, activeBeat!.speaker);
    } else if (!beatId) {
      lastBeatIdRef.current = null;
    }

    // Muffled footsteps while walking on the outpost surface (0.27 <= p <= 0.975)
    if (value >= 0.27 && value <= 0.975) {
      const speed = Math.abs(velocity.get());
      const nowMs = performance.now();
      if (speed > 0.012 && nowMs - lastFootstepAtRef.current > 410) {
        lastFootstepAtRef.current = nowMs;
        triggerMuffledFootstep(graphRef.current);
      }
    }
  });

  return null;
}

