"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

import { scrollState } from "../Shared/ScrollController";

// =========================================
// HOME SUN - Our Solar System's Star
// =========================================
function HomeSun() {
  const sunRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.01;

      // Fade out as we approach planet
      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.25, 0.45);
      sunRef.current.visible = fade > 0.01;
    }
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.12;
      coronaRef.current.scale.setScalar(pulse);
    }
    if (flareRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.08;
      flareRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={sunRef} position={[45, 25, -80]}>
      {/* Brilliant sun core */}
      <mesh>
        <sphereGeometry args={[12, 64, 64]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Hot surface */}
      <mesh scale={1.02}>
        <sphereGeometry args={[12, 64, 64]} />
        <meshBasicMaterial color="#fef3c7" />
      </mesh>

      {/* Inner corona */}
      <mesh scale={1.15}>
        <sphereGeometry args={[12, 48, 48]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Mid corona */}
      <mesh ref={coronaRef} scale={1.4}>
        <sphereGeometry args={[12, 48, 48]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer corona */}
      <mesh scale={1.8}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial
          color="#fcd34d"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Distant halo */}
      <mesh ref={flareRef} scale={3}>
        <sphereGeometry args={[12, 24, 24]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lens flare rays */}
      <mesh rotation={[0, 0, Math.PI / 4]} scale={[120, 1.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]} scale={[120, 1.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[0, 0, 0]} scale={[150, 0.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} scale={[150, 0.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#fef3c7" intensity={3} distance={500} decay={2} />
    </group>
  );
}

// =========================================
// ORBITING MOON
// =========================================
function Moon() {
  const moonRef = useRef<THREE.Group>(null);
  const moonBodyRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (moonRef.current) {
      // Orbit around planet
      const t = clock.getElapsedTime() * 0.15;
      moonRef.current.position.x = Math.cos(t) * 15;
      moonRef.current.position.z = Math.sin(t) * 12;
      moonRef.current.position.y = Math.sin(t * 0.5) * 2;
    }
    if (moonBodyRef.current) {
      moonBodyRef.current.rotation.y += 0.002;
    }
  });

  const moonTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Gray moon surface with craters
    ctx.fillStyle = "#4a5568";
    ctx.fillRect(0, 0, 512, 256);

    // Add craters
    for (let i = 0; i < 40; i++) {
      const x = Math.sin(i * 3.7 + 0.5) * 256 + 256;
      const y = Math.cos(i * 2.3 + 0.3) * 128 + 128;
      const r = 5 + Math.abs(Math.sin(i * 1.9)) * 20;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, "#2d3748");
      gradient.addColorStop(0.7, "#4a5568");
      gradient.addColorStop(1, "#4a5568");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  return (
    <group ref={moonRef} position={[15, 0, 0]}>
      {/* Moon body */}
      <mesh ref={moonBodyRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          map={moonTexture ?? undefined}
          color="#6b7280"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Subtle glow */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// =========================================
// SISTER PLANETS - Other planets in our solar system
// =========================================
function SisterPlanets() {
  const planet1Ref = useRef<THREE.Group>(null);
  const planet2Ref = useRef<THREE.Group>(null);
  const planet3Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Fade out as we approach main planet
    const fade = 1 - THREE.MathUtils.smoothstep(scrollState.current, 0.2, 0.4);

    if (planet1Ref.current) {
      // Inner rocky planet (closer to sun)
      const angle1 = t * 0.08;
      planet1Ref.current.position.x = 45 + Math.cos(angle1) * 35;
      planet1Ref.current.position.z = -80 + Math.sin(angle1) * 30;
      planet1Ref.current.position.y = 25 + Math.sin(angle1 * 0.5) * 5;
      planet1Ref.current.visible = fade > 0.01;
    }

    if (planet2Ref.current) {
      // Gas giant (outer orbit)
      const angle2 = t * 0.03 + 2;
      planet2Ref.current.position.x = 45 + Math.cos(angle2) * 70;
      planet2Ref.current.position.z = -80 + Math.sin(angle2) * 60;
      planet2Ref.current.position.y = 25 + Math.sin(angle2 * 0.3) * 8;
      planet2Ref.current.visible = fade > 0.01;
    }

    if (planet3Ref.current) {
      // Ice planet (far orbit)
      const angle3 = t * 0.02 + 4;
      planet3Ref.current.position.x = 45 + Math.cos(angle3) * 100;
      planet3Ref.current.position.z = -80 + Math.sin(angle3) * 85;
      planet3Ref.current.position.y = 25 + Math.sin(angle3 * 0.2) * 12;
      planet3Ref.current.visible = fade > 0.01;
    }
  });

  return (
    <>
      {/* Inner rocky planet - Mars-like */}
      <group ref={planet1Ref}>
        <mesh>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshBasicMaterial color="#b45309" />
        </mesh>
        <mesh scale={1.08}>
          <sphereGeometry args={[1.8, 24, 24]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Gas giant - Jupiter-like with ring */}
      <group ref={planet2Ref}>
        <mesh>
          <sphereGeometry args={[4, 48, 48]} />
          <meshBasicMaterial color="#78716c" />
        </mesh>
        {/* Atmospheric bands */}
        <mesh scale={1.01}>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial color="#a8a29e" transparent opacity={0.3} />
        </mesh>
        {/* Subtle ring */}
        <mesh rotation={[Math.PI * 0.4, 0, 0.2]}>
          <ringGeometry args={[5.5, 7, 64]} />
          <meshBasicMaterial
            color="#d6d3d1"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh scale={1.15}>
          <sphereGeometry args={[4, 24, 24]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Ice planet - Neptune-like */}
      <group ref={planet3Ref}>
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color="#1e3a5f" />
        </mesh>
        <mesh scale={1.1}>
          <sphereGeometry args={[2.5, 24, 24]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}

// =========================================
// ORBITAL PATH RINGS
// =========================================
function OrbitalPaths() {
  const pathsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (pathsRef.current) {
      const fade =
        1 - THREE.MathUtils.smoothstep(scrollState.current, 0.2, 0.4);
      pathsRef.current.visible = fade > 0.01;
      pathsRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.08 * fade;
        }
      });
    }
  });

  return (
    <group ref={pathsRef} position={[45, 25, -80]} rotation={[0.1, 0, 0.05]}>
      {/* Inner planet orbit */}
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[34, 36, 128]} />
        <meshBasicMaterial
          color="#fcd34d"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Our planet's orbit (where we're going) */}
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[54, 56, 128]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Gas giant orbit */}
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[68, 72, 128]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ice planet orbit */}
      <mesh rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[98, 102, 128]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function Planet() {
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cityLightsRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // =========================================
  // PLANET SURFACE TEXTURE - Realistic terrain
  // =========================================
  const surfaceTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const nx = x / canvas.width;
        const ny = y / canvas.height;

        // Multi-layered noise for realistic terrain
        const continent =
          Math.sin(nx * 6 + 0.5) * Math.cos(ny * 4 - 0.3) * 0.5 + 0.5;
        const terrain1 = Math.sin(nx * 24 + ny * 18) * 0.25;
        const terrain2 = Math.cos(nx * 48 - ny * 32) * 0.15;
        const terrain3 = Math.sin(nx * 96 + ny * 64) * 0.08;
        const detail = Math.sin(nx * 200) * Math.cos(ny * 180) * 0.04;

        const elevation = continent + terrain1 + terrain2 + terrain3 + detail;
        const isOcean = elevation < 0.45;

        if (isOcean) {
          // Deep ocean - dark blue
          const depth = (0.45 - elevation) * 2;
          data[index] = Math.floor(5 + depth * 10);
          data[index + 1] = Math.floor(15 + depth * 25);
          data[index + 2] = Math.floor(35 + depth * 45);
        } else {
          // Land - dark terrain with subtle variation
          const height = (elevation - 0.45) * 3;
          data[index] = Math.floor(8 + height * 20);
          data[index + 1] = Math.floor(20 + height * 35);
          data[index + 2] = Math.floor(25 + height * 30);
        }
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // =========================================
  // CITY LIGHTS TEXTURE - Night side glow
  // =========================================
  const cityLightsTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create city light clusters
    const cities = [
      { x: 0.2, y: 0.35, size: 60, intensity: 0.9 },
      { x: 0.35, y: 0.45, size: 80, intensity: 1.0 },
      { x: 0.5, y: 0.4, size: 100, intensity: 1.0 },
      { x: 0.65, y: 0.5, size: 70, intensity: 0.85 },
      { x: 0.8, y: 0.38, size: 55, intensity: 0.8 },
      { x: 0.15, y: 0.55, size: 45, intensity: 0.7 },
      { x: 0.45, y: 0.6, size: 65, intensity: 0.9 },
      { x: 0.7, y: 0.35, size: 50, intensity: 0.75 },
      { x: 0.25, y: 0.48, size: 40, intensity: 0.65 },
      { x: 0.55, y: 0.52, size: 55, intensity: 0.8 },
    ];

    cities.forEach((city) => {
      const cx = city.x * canvas.width;
      const cy = city.y * canvas.height;

      // Main city glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, city.size);
      gradient.addColorStop(0, `rgba(34,211,238,${city.intensity * 0.8})`);
      gradient.addColorStop(0.3, `rgba(14,165,233,${city.intensity * 0.4})`);
      gradient.addColorStop(0.7, `rgba(6,182,212,${city.intensity * 0.1})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        cx - city.size,
        cy - city.size,
        city.size * 2,
        city.size * 2,
      );

      // Individual lights
      for (let i = 0; i < city.size / 2; i++) {
        const lx = cx + (Math.sin(i * 7.5) - 0.5) * city.size * 1.5;
        const ly = cy + (Math.cos(i * 11.3) - 0.5) * city.size * 1.2;
        const ls = 0.5 + Math.abs(Math.sin(i * 3.2)) * 1.5;
        ctx.beginPath();
        ctx.arc(lx, ly, ls, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(103,232,249,${0.4 + Math.abs(Math.sin(i * 2.1)) * 0.3})`;
        ctx.fill();
      }
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // =========================================
  // CLOUD TEXTURE
  // =========================================
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const nx = x / canvas.width;
        const ny = y / canvas.height;

        // Cloud patterns
        const cloud1 = Math.sin(nx * 15 + ny * 8) * Math.cos(nx * 12 - ny * 6);
        const cloud2 = Math.sin(nx * 30 + ny * 20) * 0.5;
        const cloud3 = Math.cos(nx * 60 - ny * 40) * 0.25;
        const cloudNoise = (cloud1 + cloud2 + cloud3 + 1.75) / 3.5;

        // Only show clouds above threshold
        const cloudDensity = cloudNoise > 0.55 ? (cloudNoise - 0.55) * 4 : 0;

        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = Math.floor(cloudDensity * 120);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // =========================================
  // PLANET ANIMATION
  // =========================================
  useFrame((_, delta) => {
    // Rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.025;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.035;
    }
    if (cityLightsRef.current) {
      cityLightsRef.current.rotation.y += delta * 0.025;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.008;
    }

    // Scroll-based approach
    if (groupRef.current) {
      const scroll = scrollState.target;
      const approach = THREE.MathUtils.smoothstep(scroll, 0.08, 0.3);

      const targetZ = THREE.MathUtils.lerp(-32, -9, approach);
      const targetScale = THREE.MathUtils.lerp(1, 1.25, approach);

      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        0.04,
      );

      const targetScaleVector = new THREE.Vector3(
        targetScale,
        targetScale,
        targetScale,
      );
      groupRef.current.scale.lerp(targetScaleVector, 0.04);
    }
  });

  return (
    <>
      <group ref={groupRef} position={[0, 0, -32]}>
        {/* PLANET BODY */}
        <mesh ref={planetRef}>
          <sphereGeometry args={[7, 128, 128]} />
          <meshStandardMaterial
            map={surfaceTexture ?? undefined}
            color="#0a1520"
            roughness={0.85}
            metalness={0.05}
            bumpMap={surfaceTexture ?? undefined}
            bumpScale={0.12}
          />
        </mesh>

        {/* CITY LIGHTS - Night side glow */}
        <mesh ref={cityLightsRef} scale={1.002}>
          <sphereGeometry args={[7, 128, 128]} />
          <meshBasicMaterial
            map={cityLightsTexture ?? undefined}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* CLOUD LAYER */}
        <mesh ref={cloudsRef} scale={1.015}>
          <sphereGeometry args={[7, 64, 64]} />
          <meshBasicMaterial
            map={cloudTexture ?? undefined}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>

        {/* INNER ATMOSPHERE */}
        <mesh ref={atmosphereRef} scale={1.05}>
          <sphereGeometry args={[7, 64, 64]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* MIDDLE ATMOSPHERE */}
        <mesh scale={1.08}>
          <sphereGeometry args={[7, 64, 64]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* OUTER ATMOSPHERE */}
        <mesh scale={1.12}>
          <sphereGeometry args={[7, 64, 64]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* ATMOSPHERE GLOW RING */}
        <mesh scale={1.18} rotation={[Math.PI * 0.5, 0, 0]}>
          <ringGeometry args={[6.8, 8.5, 64]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* ORBITING MOON */}
        <Moon />
      </group>

      {/* SOLAR SYSTEM ELEMENTS - Outside planet group */}
      <HomeSun />
      <SisterPlanets />
      <OrbitalPaths />
    </>
  );
}
