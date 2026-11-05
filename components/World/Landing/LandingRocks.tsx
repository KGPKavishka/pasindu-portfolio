"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { seededRandom } from "@/components/World/Orbit/orbitLayout";
import { GROUND_Y, landingUniforms, sunElevation } from "./landingConfig";

type ShaderLike = Parameters<THREE.Material["onBeforeCompile"]>[0];

/** Where the landing plain is centred relative to the lander (the camera's xz). */
const ANCHOR = new THREE.Vector3(0.95, 0, -24.6);
const FORWARD_ANGLE = Math.PI / 2; // anchor looks toward -z

// Lumpy boulder: displaced icosahedron, smoothed normals.
function createRockGeometry(seed: number) {
  const base = new THREE.IcosahedronGeometry(1, 3);

  base.deleteAttribute("normal");
  base.deleteAttribute("uv");

  const geometry = mergeVertices(base);
  const position = geometry.getAttribute("position");
  const vertex = new THREE.Vector3();

  base.dispose();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index).normalize();

    const lump =
      1 +
      0.26 * Math.sin(vertex.x * 3.1 + seed) * Math.sin(vertex.y * 2.6 + seed * 1.7) * Math.sin(vertex.z * 3.4 + seed * 0.6) +
      0.09 * Math.sin(vertex.x * 8.3 + seed * 2.1) * Math.sin(vertex.y * 7.7 + seed) * Math.sin(vertex.z * 9.1 + seed * 1.3);

    vertex.multiplyScalar(lump);
    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();

  return geometry;
}

// Distance haze (same law as the ground) injected into the standard material,
// plus a screen-door dissolve for the fade in/out.
function lightRock(shader: ShaderLike) {
  shader.uniforms.uHaze = landingUniforms.haze;
  shader.uniforms.uFade = landingUniforms.fade;
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      "#include <common>\nuniform vec3 uHaze;\nuniform float uFade;"
    )
    .replace(
      "void main() {",
      "void main() {\n  if (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) > uFade) discard;"
    )
    .replace(
      "#include <fog_fragment>",
      `#include <fog_fragment>
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uHaze * 0.9, 1.0 - exp(-pow(length(vViewPosition) * 0.0035, 1.35)));`
    );
}

function createShadowTexture() {
  const canvas = document.createElement("canvas");

  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);

    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.45, "rgba(0,0,0,0.6)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }

  return new THREE.CanvasTexture(canvas);
}

interface Rock {
  x: number;
  z: number;
  size: number;
  yaw: number;
  tint: number;
  seed: number;
}

function scatterRocks(count: number): Rock[] {
  const rocks: Rock[] = [];
  let attempt = 0;

  while (rocks.length < count && attempt < count * 6) {
    const seed = attempt * 3.31 + 7;

    attempt += 1;

    // Mostly ahead of the lander, some to the sides and behind.
    const spread = seededRandom(seed) < 0.78 ? 1.0 : 2.6;
    const offset = (seededRandom(seed + 1) - 0.5) * 2 * 1.3 * spread;
    const angle = FORWARD_ANGLE + offset;
    const radius = 9 + 175 * Math.pow(seededRandom(seed + 2), 1.8);

    // Keep the lane straight ahead clear so the horizon (and, later, the outpost)
    // stays visible from the hatch.
    if (Math.abs(offset) < 0.32 && radius < 70) continue;

    const small = Math.pow(seededRandom(seed + 3), 4.5);
    // Distant rocks are scaled up a little so they still read at that distance,
    // but nothing near the lander may rise above eye level.
    const size = (0.1 + 1.35 * small) * (1 + radius / 130);

    rocks.push({
      x: ANCHOR.x + Math.cos(angle) * radius,
      z: ANCHOR.z - Math.sin(angle) * radius,
      size,
      yaw: seededRandom(seed + 4) * Math.PI * 2,
      tint: 0.7 + seededRandom(seed + 5) * 0.5,
      seed,
    });
  }

  return rocks;
}

const scratch = {
  matrix: new THREE.Matrix4(),
  position: new THREE.Vector3(),
  scale: new THREE.Vector3(),
  quaternion: new THREE.Quaternion(),
  euler: new THREE.Euler(),
  color: new THREE.Color(),
  axis: new THREE.Vector3(0, 1, 0),
};

/** Boulders and their long, soft morning shadows. */
export default function LandingRocks({ isCompact }: { isCompact: boolean }) {
  const rockRef = useRef<THREE.InstancedMesh>(null);
  const shadowRef = useRef<THREE.InstancedMesh>(null);
  const shadowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const count = isCompact ? 70 : 130;
  const rocks = useMemo(() => scatterRocks(count), [count]);
  const geometry = useMemo(() => createRockGeometry(2.7), []);
  const shadowGeometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(1, 1);

    plane.rotateX(-Math.PI / 2);

    return plane;
  }, []);
  const shadowTexture = useMemo(() => createShadowTexture(), []);
  const rockMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: "#8c7260",
      roughness: 1,
      metalness: 0,
      fog: false,
    });

    material.onBeforeCompile = lightRock;
    material.customProgramCacheKey = () => "landing-rock";

    return material;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => shadowGeometry.dispose(), [shadowGeometry]);
  useEffect(() => () => shadowTexture.dispose(), [shadowTexture]);
  useEffect(() => () => rockMaterial.dispose(), [rockMaterial]);

  useLayoutEffect(() => {
    const rockMesh = rockRef.current;
    const shadowMesh = shadowRef.current;

    if (!rockMesh || !shadowMesh) return;

    rockMesh.count = rocks.length;
    shadowMesh.count = rocks.length;
    // Shadows fall away from the sun, along the ground.
    const sun = landingUniforms.sun.value;
    const horizontal = Math.hypot(sun.x, sun.z);
    const shadowX = -sun.x / horizontal;
    const shadowZ = -sun.z / horizontal;
    const shadowYaw = Math.atan2(-shadowZ, shadowX);

    rocks.forEach((rock, index) => {
      const { matrix, position, scale, quaternion, euler, color } = scratch;
      const height = rock.size * 0.55;

      euler.set(0, rock.yaw, 0);
      quaternion.setFromEuler(euler);
      position.set(rock.x, GROUND_Y + height * 0.28, rock.z);
      scale.set(rock.size, height, rock.size * 0.9);
      matrix.compose(position, quaternion, scale);
      rockMesh.setMatrixAt(index, matrix);
      color.setScalar(rock.tint);
      rockMesh.setColorAt(index, color);

      const length = (height * 0.9) / Math.tan(sunElevation) + rock.size * 0.9;

      quaternion.setFromAxisAngle(scratch.axis, shadowYaw);
      position.set(
        rock.x + shadowX * length * 0.42,
        GROUND_Y + 0.03,
        rock.z + shadowZ * length * 0.42
      );
      scale.set(length * 1.1, 1, rock.size * 1.5);
      matrix.compose(position, quaternion, scale);
      shadowMesh.setMatrixAt(index, matrix);
    });

    rockMesh.instanceMatrix.needsUpdate = true;
    if (rockMesh.instanceColor) rockMesh.instanceColor.needsUpdate = true;
    shadowMesh.instanceMatrix.needsUpdate = true;
  }, [rocks]);

  useFrame(() => {
    if (shadowMaterialRef.current) {
      shadowMaterialRef.current.opacity = 0.5 * landingUniforms.fade.value;
    }
  });

  return (
    <>
      <instancedMesh
        ref={shadowRef}
        args={[shadowGeometry, undefined, count]}
        renderOrder={2}
        frustumCulled={false}
      >
        <meshBasicMaterial
          ref={shadowMaterialRef}
          map={shadowTexture}
          color="#000000"
          transparent
          opacity={0}
          depthWrite={false}
          fog={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </instancedMesh>

      <instancedMesh
        ref={rockRef}
        args={[geometry, rockMaterial, count]}
        frustumCulled={false}
      />
    </>
  );
}
