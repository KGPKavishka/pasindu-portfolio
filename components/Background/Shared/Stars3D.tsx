"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { scrollState } from "./ScrollController";

// ============================================
// DETERMINISTIC RANDOM - For React Compiler
// ============================================
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ============================================
// CONSTANTS - Depth layers for EPIC cinematic feel
// Camera is at z=5, planet at z=-32
// Pushed back for grander sense of scale
// ============================================
const DEPTH_LAYERS = {
  EXTREME_FAR: -200, // Farthest galaxies - massive scale
  VERY_FAR: -160, // Distant galaxies and suns
  FAR: -120, // Solar systems
  MID_FAR: -85, // Nebulae
  MID: -60, // Mid-distance objects
  MID_NEAR: -45, // Just behind planet
  NEAR: -38, // Close to planet
  CLOSE: -35, // Very close to planet
} as const;

// ============================================
// STAR LAYER - Optimized with InstancedMesh feel
// ============================================
type StarLayerProps = {
  count: number;
  spread: number;
  depthStart: number;
  depthRange: number;
  size: number;
  color: string;
  twinkle?: boolean;
  brightness?: number;
};

function StarLayer({
  count,
  spread,
  depthStart,
  depthRange,
  size,
  color,
  twinkle = false,
  brightness = 1,
}: StarLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const baseOpacity = useRef(brightness);

  const { positions, sizes } = useMemo(() => {
    const posArray: number[] = [];
    const sizeArray: number[] = [];

    for (let i = 0; i < count; i++) {
      // Better distribution using golden ratio
      const phi = Math.acos(1 - 2 * ((i + 0.5) / count));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const r = spread * (0.3 + Math.pow(seededRandom(i * 1.1), 0.5) * 0.7);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.6; // Flatten slightly
      const z = depthStart - seededRandom(i * 2.3) * depthRange;

      posArray.push(x, y, z);

      // Varied star sizes for realism
      const sizeVariation = 0.3 + seededRandom(i * 3.7) * 0.7;
      sizeArray.push(size * sizeVariation);
    }

    return {
      positions: new Float32Array(posArray),
      sizes: new Float32Array(sizeArray),
    };
  }, [count, spread, depthStart, depthRange, size]);

  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Realistic star glow with diffraction spikes suggestion
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.1, "rgba(240,248,255,0.9)");
    gradient.addColorStop(0.25, "rgba(200,220,255,0.5)");
    gradient.addColorStop(0.5, "rgba(150,180,220,0.15)");
    gradient.addColorStop(1, "rgba(100,150,200,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const material = pointsRef.current.material as THREE.PointsMaterial;

    if (twinkle) {
      const time = clock.getElapsedTime();
      material.opacity =
        baseOpacity.current * (0.7 + Math.sin(time * 0.3 + count) * 0.3);
    }

    // Fade based on scroll
    const scrollFade =
      1 - THREE.MathUtils.smoothstep(scrollState.current, 0.2, 0.5);
    material.opacity = Math.min(
      material.opacity,
      scrollFade * baseOpacity.current,
    );
  });

  if (!starTexture) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={brightness}
        alphaTest={0.001}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// COSMIC DUST - Atmospheric depth particles
// ============================================
function CosmicDust() {
  const dustRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const vertices: number[] = [];
    const count = 4000;

    for (let i = 0; i < count; i++) {
      const r = 20 + seededRandom(i * 1.1) * 120;
      const theta = seededRandom(i * 2.3) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 3.7) - 1);

      vertices.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.5,
        -50 - seededRandom(i * 4.9) * 150,
      );
    }
    return new Float32Array(vertices);
  }, []);

  const dustTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(180,200,255,0.5)");
    gradient.addColorStop(0.3, "rgba(140,170,230,0.2)");
    gradient.addColorStop(0.6, "rgba(100,140,200,0.05)");
    gradient.addColorStop(1, "rgba(80,120,180,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = clock.getElapsedTime() * 0.003;
      dustRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.0015) * 0.03;

      const material = dustRef.current.material as THREE.PointsMaterial;
      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.15, 0.45);
      material.opacity = 0.2 * fade;
    }
  });

  if (!dustTexture) return null;

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={dustTexture}
        size={0.8}
        sizeAttenuation
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// STAR CLUSTER - Dense star formations
// ============================================
function StarCluster({
  position,
  count = 200,
  radius = 15,
  color = "#e0f2fe",
}: {
  position: [number, number, number];
  count?: number;
  radius?: number;
  color?: string;
}) {
  const clusterRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const vertices: number[] = [];
    for (let i = 0; i < count; i++) {
      // Gaussian-like distribution for cluster density
      const r = radius * Math.pow(seededRandom(i * 1.1), 0.5);
      const theta = seededRandom(i * 2.3) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 3.7) - 1);

      vertices.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      );
    }
    return new Float32Array(vertices);
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (clusterRef.current) {
      clusterRef.current.rotation.y = clock.getElapsedTime() * 0.01;
      const material = clusterRef.current.material as THREE.PointsMaterial;
      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.1, 0.4);
      material.opacity = 0.6 * fade;
    }
  });

  return (
    <points ref={clusterRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.3}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================
// DISTANT PLANET - Environmental planets
// ============================================
function DistantPlanet({
  position,
  radius,
  color,
  atmosphereColor,
  hasRing = false,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  atmosphereColor: string;
  hasRing?: boolean;
}) {
  const planetRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={planetRef} position={position}>
      {/* Planet body */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Rim light */}
      <mesh scale={1.02}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Optional ring */}
      {hasRing && (
        <mesh rotation={[Math.PI * 0.45, 0.1, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
          <meshBasicMaterial
            color={atmosphereColor}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ============================================
// MOON - Small celestial body
// ============================================
function Moon({
  position,
  radius = 0.5,
  color = "#94a3b8",
}: {
  position: [number, number, number];
  radius?: number;
  color?: string;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ============================================
// SUN - Glowing star with corona
// ============================================
function Sun({
  position,
  scale = 1,
  color = "#fef3c7",
  intensity = 1,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  intensity?: number;
}) {
  const sunRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.15;
      coronaRef.current.scale.setScalar(pulse);
    }
    if (flareRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
      flareRef.current.scale.setScalar(pulse);
    }
  });

  const baseSize = 10 * scale;

  return (
    <group ref={sunRef} position={position}>
      {/* Brilliant sun core */}
      <mesh>
        <sphereGeometry args={[baseSize, 48, 48]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Hot inner layer */}
      <mesh scale={1.02}>
        <sphereGeometry args={[baseSize, 48, 48]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Inner glow - intense */}
      <mesh scale={1.12}>
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.7 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona layer 1 */}
      <mesh ref={coronaRef} scale={1.4}>
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.35 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Corona layer 2 */}
      <mesh scale={1.8}>
        <sphereGeometry args={[baseSize, 32, 32]} />
        <meshBasicMaterial
          color="#fcd34d"
          transparent
          opacity={0.18 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={2.5}>
        <sphereGeometry args={[baseSize, 24, 24]} />
        <meshBasicMaterial
          color="#fde68a"
          transparent
          opacity={0.1 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Distant halo */}
      <mesh ref={flareRef} scale={4}>
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshBasicMaterial
          color="#fef3c7"
          transparent
          opacity={0.04 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lens flare rays */}
      <mesh
        rotation={[0, 0, Math.PI / 4]}
        scale={[baseSize * 8, baseSize * 0.15, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.15 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        rotation={[0, 0, -Math.PI / 4]}
        scale={[baseSize * 8, baseSize * 0.15, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.15 * intensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight
        color={color}
        intensity={intensity * 2}
        distance={400}
        decay={2}
      />
    </group>
  );
}

// ============================================
// BLACK HOLE - Dramatic event horizon with accretion disk
// ============================================
function BlackHole({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const diskRef = useRef<THREE.Mesh>(null);
  const lensRef = useRef<THREE.Mesh>(null);
  const innerDiskRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (diskRef.current) {
      diskRef.current.rotation.z = t * 0.2;
    }
    if (innerDiskRef.current) {
      innerDiskRef.current.rotation.z = -t * 0.35;
    }
    if (lensRef.current) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.08;
      lensRef.current.scale.setScalar(pulse);
    }
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(t * 0.06) * 0.1;
      groupRef.current.rotation.z = Math.sin(t * 0.04) * 0.05;
    }
  });

  const accretionTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Multi-layer dramatic accretion disk
    const gradient = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.12, "rgba(255,220,150,1)");
    gradient.addColorStop(0.18, "rgba(251,146,60,0.95)");
    gradient.addColorStop(0.28, "rgba(249,115,22,0.85)");
    gradient.addColorStop(0.4, "rgba(234,88,12,0.6)");
    gradient.addColorStop(0.55, "rgba(194,65,12,0.35)");
    gradient.addColorStop(0.7, "rgba(154,52,18,0.18)");
    gradient.addColorStop(0.85, "rgba(124,45,18,0.08)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // Add spiral structure
    for (let spiral = 0; spiral < 3; spiral++) {
      for (let i = 0; i < 80; i++) {
        const baseAngle = (spiral * Math.PI * 2) / 3;
        const angle = baseAngle + i * 0.12;
        const r = 140 + i * 3.5;
        const x = 512 + Math.cos(angle) * r;
        const y = 512 + Math.sin(angle) * r;
        const spotSize = 15 + seededRandom(spiral * 80 + i) * 25;
        const spotGrad = ctx.createRadialGradient(x, y, 0, x, y, spotSize);
        spotGrad.addColorStop(0, "rgba(255,200,100,0.4)");
        spotGrad.addColorStop(0.5, "rgba(255,150,50,0.15)");
        spotGrad.addColorStop(1, "rgba(255,100,0,0)");
        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.arc(x, y, spotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Add hot spots
    for (let i = 0; i < 50; i++) {
      const angle = seededRandom(i * 1.7) * Math.PI * 2;
      const r = 130 + seededRandom(i * 2.9) * 200;
      const x = 512 + Math.cos(angle) * r;
      const y = 512 + Math.sin(angle) * r;
      const spotGrad = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        10 + seededRandom(i * 4.1) * 18,
      );
      spotGrad.addColorStop(0, "rgba(255,255,200,0.7)");
      spotGrad.addColorStop(0.3, "rgba(255,200,100,0.4)");
      spotGrad.addColorStop(1, "rgba(255,150,50,0)");
      ctx.fillStyle = spotGrad;
      ctx.fillRect(x - 30, y - 30, 60, 60);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  if (!accretionTexture) return null;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Absolute dark event horizon */}
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Primary gravitational lensing ring */}
      <mesh ref={lensRef} scale={1.12}>
        <torusGeometry args={[4.8, 0.4, 32, 128]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary lensing - purple */}
      <mesh scale={1.06}>
        <torusGeometry args={[4.4, 0.25, 24, 96]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner hot accretion */}
      <mesh ref={innerDiskRef} rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[5.5, 10, 128]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Main accretion disk */}
      <mesh ref={diskRef} rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[6, 20, 128]} />
        <meshBasicMaterial
          map={accretionTexture}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Gravitational distortion field */}
      <mesh scale={2.5}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer influence zone */}
      <mesh scale={4}>
        <sphereGeometry args={[4, 24, 24]} />
        <meshBasicMaterial
          color="#4c1d95"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ============================================
// SOLAR SYSTEM - Complete with orbits
// ============================================
function SolarSystem({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const systemRef = useRef<THREE.Group>(null);
  const planetsRef = useRef<THREE.Mesh[]>([]);

  const planets = useMemo(
    () => [
      { orbitRadius: 4, size: 0.35, speed: 0.6, color: "#94a3b8", offset: 0 },
      {
        orbitRadius: 6.5,
        size: 0.55,
        color: "#67e8f9",
        speed: 0.4,
        offset: 2.1,
      },
      {
        orbitRadius: 9.5,
        size: 0.45,
        color: "#f97316",
        speed: 0.25,
        offset: 4.2,
      },
      {
        orbitRadius: 13,
        size: 0.7,
        color: "#a78bfa",
        speed: 0.15,
        offset: 1.5,
      },
    ],
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    planets.forEach((planet, i) => {
      const mesh = planetsRef.current[i];
      if (mesh) {
        const angle = t * planet.speed + planet.offset;
        mesh.position.x = Math.cos(angle) * planet.orbitRadius;
        mesh.position.z = Math.sin(angle) * planet.orbitRadius;
      }
    });
  });

  return (
    <group
      ref={systemRef}
      position={position}
      scale={scale}
      rotation={[0.25, 0, 0.15]}
    >
      {/* Central star */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <mesh scale={1.4}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbit paths */}
      {planets.map((planet, i) => (
        <mesh key={`orbit-${i}`} rotation={[Math.PI * 0.5, 0, 0]}>
          <ringGeometry
            args={[planet.orbitRadius - 0.05, planet.orbitRadius + 0.05, 64]}
          />
          <meshBasicMaterial
            color="#475569"
            transparent
            opacity={0.12 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Planets */}
      {planets.map((planet, i) => (
        <mesh
          key={`planet-${i}`}
          ref={(el) => {
            if (el) planetsRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[planet.size, 20, 20]} />
          <meshBasicMaterial color={planet.color} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// VOLUMETRIC NEBULA - Multi-layer gas cloud
// ============================================
function VolumetricNebula({
  position,
  colors,
  scale = 50,
  opacity = 0.04,
}: {
  position: [number, number, number];
  colors: string[];
  scale?: number;
  opacity?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const nebulaTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Create organic cloud pattern
    for (let i = 0; i < 15; i++) {
      const x = 256 + (Math.sin(i * 2.3) - 0.5) * 200;
      const y = 256 + (Math.cos(i * 1.7) - 0.5) * 200;
      const r = 40 + Math.abs(Math.sin(i * 0.8)) * 100;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, "rgba(255,255,255,0.25)");
      gradient.addColorStop(0.3, "rgba(255,255,255,0.12)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0.04)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.003;
      groupRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.002) * 0.1;

      // Fade with scroll
      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.1, 0.4);
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          mat.opacity = opacity * fade;
        }
      });
    }
  });

  if (!nebulaTexture) return null;

  return (
    <group ref={groupRef} position={position}>
      {colors.map((color, i) => (
        <mesh
          key={i}
          scale={scale * (1 - i * 0.15)}
          rotation={[
            seededRandom(i * 5.3) * Math.PI,
            seededRandom(i * 7.1) * Math.PI,
            0,
          ]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={nebulaTexture}
            color={color}
            transparent
            opacity={opacity}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// SPIRAL GALAXY - Detailed with arms
// ============================================
function SpiralGalaxy({
  position,
  rotation = 0,
  scale = 40,
  tilt = 0.3,
}: {
  position: [number, number, number];
  rotation?: number;
  scale?: number;
  tilt?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = rotation + clock.getElapsedTime() * 0.005;

      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.15, 0.45);
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.85 * fade;
    }
    if (glowRef.current) {
      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.15, 0.45);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 * fade;
    }
  });

  const galaxyTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Brilliant core with multiple layers
    const coreGrad = ctx.createRadialGradient(512, 512, 0, 512, 512, 400);
    coreGrad.addColorStop(0, "rgba(255,255,255,1)");
    coreGrad.addColorStop(0.03, "rgba(255,250,240,0.95)");
    coreGrad.addColorStop(0.08, "rgba(255,230,200,0.7)");
    coreGrad.addColorStop(0.15, "rgba(220,180,255,0.45)");
    coreGrad.addColorStop(0.25, "rgba(150,100,220,0.25)");
    coreGrad.addColorStop(0.4, "rgba(100,70,180,0.12)");
    coreGrad.addColorStop(0.6, "rgba(60,40,120,0.05)");
    coreGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Spiral arms with varied stars - more dense and vivid
    const numArms = 4;
    for (let arm = 0; arm < numArms; arm++) {
      for (let i = 0; i < 400; i++) {
        const seed = arm * 400 + i;
        const baseAngle = (arm * Math.PI * 2) / numArms;
        const angle = baseAngle + i * 0.058;
        const radius = 40 + i * 0.9;
        const spread = 12 + i * 0.1;
        const offsetR = (seededRandom(seed * 1.3) - 0.5) * spread;
        const offsetT = (seededRandom(seed * 2.7) - 0.5) * 0.18;

        const x = 512 + Math.cos(angle + offsetT) * (radius + offsetR);
        const y = 512 + Math.sin(angle + offsetT) * (radius + offsetR);

        const starBrightness = 0.2 + seededRandom(seed * 3.1) * 0.6;
        const starSize = 0.8 + seededRandom(seed * 4.9) * 2.5;

        ctx.beginPath();
        ctx.arc(x, y, starSize, 0, Math.PI * 2);
        // Varied star colors for realism
        const colorVariant = seededRandom(seed * 5.5);
        if (colorVariant > 0.85) {
          ctx.fillStyle = `rgba(255,200,150,${starBrightness})`; // Orange stars
        } else if (colorVariant > 0.7) {
          ctx.fillStyle = `rgba(150,180,255,${starBrightness})`; // Blue stars
        } else {
          ctx.fillStyle = `rgba(220,225,255,${starBrightness})`; // White stars
        }
        ctx.fill();
      }
    }

    // Add some bright nebula regions along arms
    for (let i = 0; i < 12; i++) {
      const seed = i * 100;
      const arm = i % 4;
      const baseAngle = (arm * Math.PI * 2) / 4;
      const angle = baseAngle + i * 0.5;
      const radius = 120 + seededRandom(seed * 1.1) * 200;
      const x = 512 + Math.cos(angle) * radius;
      const y = 512 + Math.sin(angle) * radius;
      const nebulaSize = 30 + seededRandom(seed * 2.2) * 50;

      const nebGrad = ctx.createRadialGradient(x, y, 0, x, y, nebulaSize);
      const hue =
        seededRandom(seed * 3.3) > 0.5 ? "200,100,255" : "100,180,255";
      nebGrad.addColorStop(0, `rgba(${hue},0.15)`);
      nebGrad.addColorStop(0.5, `rgba(${hue},0.05)`);
      nebGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, 1024, 1024);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  if (!galaxyTexture) return null;

  return (
    <group position={position} rotation={[tilt, 0, 0]}>
      {/* Main galaxy */}
      <mesh ref={meshRef} scale={scale} rotation={[0, 0, rotation]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={galaxyTexture}
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Outer glow */}
      <mesh ref={glowRef} scale={scale * 1.3} rotation={[0, 0, rotation]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ============================================
// SHOOTING STARS - Cinematic meteor streaks
// ============================================
function ShootingStars() {
  const starRefs = useRef<THREE.Mesh[]>([]);
  const trailRefs = useRef<THREE.Mesh[]>([]);

  const meteors = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        x: (Math.sin(i * 3.7) - 0.5) * 100,
        y: 25 + Math.abs(Math.cos(i * 2.3)) * 50,
        z: -60 - Math.abs(Math.sin(i * 1.9)) * 80,
        speed: 0.3 + Math.abs(Math.sin(i * 5.1)) * 0.35,
        delay: i * 3.5,
        angle: -0.55 - seededRandom(i * 6.7) * 0.4,
        length: 3 + seededRandom(i * 8.3) * 4,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    meteors.forEach((meteor, i) => {
      const star = starRefs.current[i];
      const trail = trailRefs.current[i];
      if (!star) return;

      const cycle = ((time + meteor.delay) * meteor.speed) % 15;

      if (cycle < 2.5) {
        star.visible = true;
        if (trail) trail.visible = true;
        const progress = cycle / 2.5;
        const travelX = progress * 60;
        const travelY = progress * 36;

        star.position.set(meteor.x - travelX, meteor.y - travelY, meteor.z);
        star.scale.set(1 - progress * 0.3, 1, 1);

        if (trail) {
          trail.position.set(
            meteor.x - travelX * 0.7,
            meteor.y - travelY * 0.7,
            meteor.z - 0.1,
          );
          trail.scale.set(progress * 0.8 + 0.2, 1, 1);
        }

        const mat = star.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress * 0.6) * 0.95;

        if (trail) {
          const trailMat = trail.material as THREE.MeshBasicMaterial;
          trailMat.opacity = (1 - progress) * 0.4;
        }
      } else {
        star.visible = false;
        if (trail) trail.visible = false;
      }
    });
  });

  return (
    <group>
      {meteors.map((meteor, i) => (
        <group key={i}>
          {/* Main bright head */}
          <mesh
            ref={(el) => {
              if (el) starRefs.current[i] = el;
            }}
            visible={false}
            rotation={[0, 0, meteor.angle]}
          >
            <planeGeometry args={[meteor.length, 0.06]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* Trailing glow */}
          <mesh
            ref={(el) => {
              if (el) trailRefs.current[i] = el;
            }}
            visible={false}
            rotation={[0, 0, meteor.angle]}
          >
            <planeGeometry args={[meteor.length * 2, 0.15]} />
            <meshBasicMaterial
              color="#67e8f9"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// SIGNAL BEACON - Destination hint
// ============================================
function SignalBeacon({ position }: { position: [number, number, number] }) {
  const beaconRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!beaconRef.current) return;

    const scroll = scrollState.current;
    const visibility = THREE.MathUtils.smoothstep(scroll, 0.05, 0.15);

    beaconRef.current.visible = visibility > 0.01;

    if (pulseRef.current) {
      const t = clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 3) * 0.3;
      pulseRef.current.scale.setScalar(pulse);

      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 * visibility * (0.5 + Math.sin(t * 2) * 0.5);
    }
  });

  return (
    <group ref={beaconRef} position={position} visible={false}>
      {/* Core signal */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[1, 1.5, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={3}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================
// MAIN STARS3D COMPONENT
// ============================================
export default function Stars3D() {
  const spaceRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Global fade for space elements as we approach planet
    if (spaceRef.current) {
      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.25, 0.5);
      spaceRef.current.visible = fade > 0.01;
    }
  });

  return (
    <>
      {/* ========================================= */}
      {/* LAYER 1: EXTREME DISTANT STARS - Dense starfield */}
      {/* ========================================= */}
      <StarLayer
        count={12000}
        spread={150}
        depthStart={DEPTH_LAYERS.EXTREME_FAR}
        depthRange={60}
        size={0.03}
        color="#c7d2fe"
        brightness={0.4}
      />

      {/* ========================================= */}
      {/* LAYER 2: VERY DISTANT STARS - Galaxy backdrop */}
      {/* ========================================= */}
      <StarLayer
        count={8000}
        spread={120}
        depthStart={DEPTH_LAYERS.VERY_FAR}
        depthRange={50}
        size={0.05}
        color="#e0f2fe"
        brightness={0.55}
      />

      {/* ========================================= */}
      {/* LAYER 3: FAR STARS - Main field */}
      {/* ========================================= */}
      <StarLayer
        count={5000}
        spread={100}
        depthStart={DEPTH_LAYERS.FAR}
        depthRange={40}
        size={0.07}
        color="#f0f9ff"
        brightness={0.65}
      />

      {/* ========================================= */}
      {/* LAYER 4: MID-DISTANCE STARS - Bright field */}
      {/* ========================================= */}
      <StarLayer
        count={2500}
        spread={80}
        depthStart={DEPTH_LAYERS.MID_FAR}
        depthRange={30}
        size={0.1}
        color="#ffffff"
        brightness={0.8}
        twinkle
      />

      {/* ========================================= */}
      {/* LAYER 5: CLOSER BRIGHT STARS */}
      {/* ========================================= */}
      <StarLayer
        count={800}
        spread={65}
        depthStart={DEPTH_LAYERS.MID}
        depthRange={20}
        size={0.12}
        color="#ffffff"
        brightness={0.9}
        twinkle
      />

      {/* ========================================= */}
      {/* LAYER 6: NEAR ACCENT STARS - Cyan tint */}
      {/* ========================================= */}
      <StarLayer
        count={300}
        spread={55}
        depthStart={DEPTH_LAYERS.MID_NEAR}
        depthRange={15}
        size={0.16}
        color="#67e8f9"
        brightness={0.85}
        twinkle
      />

      {/* ========================================= */}
      {/* LAYER 7: WARM FOCAL STARS - Golden accent */}
      {/* ========================================= */}
      <StarLayer
        count={100}
        spread={45}
        depthStart={DEPTH_LAYERS.NEAR}
        depthRange={8}
        size={0.2}
        color="#fef08a"
        brightness={0.95}
        twinkle
      />

      {/* ========================================= */}
      {/* COSMIC DUST */}
      {/* ========================================= */}
      <CosmicDust />

      {/* ========================================= */}
      {/* SPACE OBJECTS GROUP */}
      {/* ========================================= */}
      <group ref={spaceRef}>
        {/* STAR CLUSTERS - Dense star formations */}
        <StarCluster
          position={[-55, 30, DEPTH_LAYERS.FAR]}
          count={350}
          radius={15}
          color="#a5b4fc"
        />
        <StarCluster
          position={[65, -25, DEPTH_LAYERS.VERY_FAR]}
          count={280}
          radius={12}
          color="#fcd34d"
        />
        <StarCluster
          position={[-40, -45, DEPTH_LAYERS.FAR - 20]}
          count={220}
          radius={10}
          color="#c4b5fd"
        />
        <StarCluster
          position={[30, 50, DEPTH_LAYERS.EXTREME_FAR]}
          count={400}
          radius={18}
          color="#f0abfc"
        />

        {/* DISTANT SUNS - Dramatic glowing stars */}
        <Sun
          position={[70, 45, DEPTH_LAYERS.VERY_FAR]}
          scale={0.35}
          intensity={1.5}
        />
        <Sun
          position={[-80, -35, DEPTH_LAYERS.EXTREME_FAR + 30]}
          scale={0.25}
          color="#fef9c3"
          intensity={1.2}
        />
        <Sun
          position={[45, 65, DEPTH_LAYERS.FAR + 10]}
          scale={0.18}
          color="#fde68a"
          intensity={0.9}
        />
        <Sun
          position={[-55, 50, DEPTH_LAYERS.VERY_FAR - 20]}
          scale={0.2}
          color="#fed7aa"
          intensity={1.0}
        />

        {/* BLACK HOLES - Dramatic cosmic voids */}
        <BlackHole position={[-70, -25, DEPTH_LAYERS.FAR + 10]} scale={0.8} />
        <BlackHole position={[80, 35, DEPTH_LAYERS.VERY_FAR]} scale={0.5} />

        {/* SOLAR SYSTEMS - Mini planetary systems */}
        <SolarSystem position={[-45, 25, DEPTH_LAYERS.MID_FAR]} scale={0.5} />
        <SolarSystem position={[50, -20, DEPTH_LAYERS.FAR]} scale={0.4} />
        <SolarSystem
          position={[-30, -40, DEPTH_LAYERS.VERY_FAR + 20]}
          scale={0.35}
        />
        <SolarSystem position={[25, 45, DEPTH_LAYERS.FAR - 15]} scale={0.3} />

        {/* DISTANT ENVIRONMENTAL PLANETS */}
        <DistantPlanet
          position={[-75, 18, DEPTH_LAYERS.VERY_FAR]}
          radius={2.5}
          color="#1e3a5f"
          atmosphereColor="#3b82f6"
        />
        <DistantPlanet
          position={[70, -30, DEPTH_LAYERS.FAR]}
          radius={1.8}
          color="#374151"
          atmosphereColor="#6366f1"
          hasRing
        />
        <DistantPlanet
          position={[-55, 55, DEPTH_LAYERS.EXTREME_FAR + 20]}
          radius={3}
          color="#1f2937"
          atmosphereColor="#22d3ee"
        />
        <DistantPlanet
          position={[45, 40, DEPTH_LAYERS.VERY_FAR - 20]}
          radius={1.5}
          color="#422006"
          atmosphereColor="#f97316"
        />
        <DistantPlanet
          position={[-30, -55, DEPTH_LAYERS.FAR + 15]}
          radius={2}
          color="#1e1b4b"
          atmosphereColor="#a78bfa"
          hasRing
        />

        {/* MOONS - Smaller celestial bodies */}
        <Moon
          position={[-72, 22, DEPTH_LAYERS.VERY_FAR + 5]}
          radius={0.4}
          color="#6b7280"
        />
        <Moon
          position={[73, -27, DEPTH_LAYERS.FAR + 5]}
          radius={0.3}
          color="#9ca3af"
        />
        <Moon
          position={[48, 43, DEPTH_LAYERS.VERY_FAR - 18]}
          radius={0.25}
          color="#78716c"
        />

        {/* SPIRAL GALAXIES - MASSIVE and CINEMATIC */}
        <SpiralGalaxy
          position={[-90, 40, DEPTH_LAYERS.EXTREME_FAR]}
          scale={45}
          tilt={0.4}
        />
        <SpiralGalaxy
          position={[100, -30, DEPTH_LAYERS.EXTREME_FAR - 20]}
          rotation={1.5}
          scale={55}
          tilt={0.25}
        />
        <SpiralGalaxy
          position={[30, 80, DEPTH_LAYERS.EXTREME_FAR + 10]}
          rotation={2.8}
          scale={38}
          tilt={0.5}
        />
        <SpiralGalaxy
          position={[-50, -70, DEPTH_LAYERS.EXTREME_FAR - 10]}
          rotation={0.8}
          scale={32}
          tilt={0.35}
        />
        <SpiralGalaxy
          position={[70, 60, DEPTH_LAYERS.EXTREME_FAR + 5]}
          rotation={4.2}
          scale={28}
          tilt={0.45}
        />
        <SpiralGalaxy
          position={[-80, -20, DEPTH_LAYERS.EXTREME_FAR - 15]}
          rotation={2.1}
          scale={40}
          tilt={0.3}
        />

        {/* VOLUMETRIC NEBULAE - LARGE and COLORFUL */}
        <VolumetricNebula
          position={[-60, 25, DEPTH_LAYERS.MID_FAR]}
          colors={["#0ea5e9", "#06b6d4", "#22d3ee"]}
          scale={50}
          opacity={0.08}
        />
        <VolumetricNebula
          position={[70, -15, DEPTH_LAYERS.FAR]}
          colors={["#8b5cf6", "#a855f7", "#c084fc"]}
          scale={60}
          opacity={0.07}
        />
        <VolumetricNebula
          position={[-35, 55, DEPTH_LAYERS.VERY_FAR]}
          colors={["#ec4899", "#f472b6", "#fda4af"]}
          scale={45}
          opacity={0.065}
        />
        <VolumetricNebula
          position={[25, -45, DEPTH_LAYERS.FAR - 20]}
          colors={["#14b8a6", "#2dd4bf", "#5eead4"]}
          scale={40}
          opacity={0.07}
        />
        <VolumetricNebula
          position={[-85, -30, DEPTH_LAYERS.EXTREME_FAR + 30]}
          colors={["#f59e0b", "#fbbf24", "#fcd34d"]}
          scale={55}
          opacity={0.055}
        />
        <VolumetricNebula
          position={[50, 50, DEPTH_LAYERS.VERY_FAR - 10]}
          colors={["#f43f5e", "#fb7185", "#fda4af"]}
          scale={35}
          opacity={0.06}
        />
        <VolumetricNebula
          position={[0, -65, DEPTH_LAYERS.FAR + 5]}
          colors={["#6366f1", "#818cf8", "#a5b4fc"]}
          scale={48}
          opacity={0.065}
        />

        {/* SIGNAL BEACON - Hints at destination */}
        <SignalBeacon position={[0, 0, DEPTH_LAYERS.MID]} />
      </group>

      {/* ========================================= */}
      {/* SHOOTING STARS - Always visible layer */}
      {/* ========================================= */}
      <ShootingStars />
    </>
  );
}
