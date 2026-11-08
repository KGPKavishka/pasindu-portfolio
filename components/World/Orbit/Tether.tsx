"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  type OrbitLayerProps,
  applyDissolve,
  orbitDissolve,
} from "./orbitLayout";

const SAMPLES = 28;
const SIDES = 6;
const RADIUS = 0.0055;
/** Distance at which the cable is fully taut and straight. */
const TAUT_DISTANCE = 16;
/** Suit hook in camera space: below the visor's lower edge, slightly to the right. */
const HOOK = new THREE.Vector3(0.26, -0.34, -0.5);

const scratch = {
  hook: new THREE.Vector3(),
  chord: new THREE.Vector3(),
  right: new THREE.Vector3(),
  up: new THREE.Vector3(),
  ahead: new THREE.Vector3(),
  swayA: new THREE.Vector3(),
  swayB: new THREE.Vector3(),
  c1: new THREE.Vector3(),
  c2: new THREE.Vector3(),
  point: new THREE.Vector3(),
  tangent: new THREE.Vector3(),
  side: new THREE.Vector3(),
  binormal: new THREE.Vector3(),
  offset: new THREE.Vector3(),
};

function createTetherGeometry() {
  const vertexCount = SAMPLES * SIDES;
  const indices: number[] = [];

  for (let sample = 0; sample < SAMPLES - 1; sample += 1) {
    for (let side = 0; side < SIDES; side += 1) {
      const a = sample * SIDES + side;
      const b = sample * SIDES + ((side + 1) % SIDES);
      const c = (sample + 1) * SIDES + side;
      const d = (sample + 1) * SIDES + ((side + 1) % SIDES);

      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3)
  );
  geometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3)
  );
  geometry.setIndex(indices);

  return geometry;
}

/**
 * The EVA safety tether: one end hooked to the suit (so it is attached to the
 * camera), the other clipped to the handrail. It is rebuilt every frame as a
 * cubic curve that sags in loose, slowly drifting loops while you are near the
 * anchor and pulls straight as you float away from it.
 */
export default function Tether({ layout, visibility, environment }: OrbitLayerProps & {
  environment: THREE.Texture;
}) {
  const { anchor } = layout.handrail;
  const rootRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => createTetherGeometry(), []);
  const material = useMemo(() => {
    const tetherMaterial = new THREE.MeshStandardMaterial({
      color: "#d8d4ca",
      roughness: 0.8,
      metalness: 0,
      envMap: environment,
      envMapIntensity: 1,
      side: THREE.DoubleSide,
    });

    applyDissolve(tetherMaterial, orbitDissolve);

    return tetherMaterial;
  }, [environment]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ camera }) => {
    const state = visibility.current;
    const isVisible = state.station * state.intro > 0.001;

    if (rootRef.current) rootRef.current.visible = isVisible;
    if (!isVisible) return;

    const {
      hook, chord, right, up, ahead, swayA, swayB, c1, c2, point, tangent, side, binormal, offset,
    } = scratch;

    hook.copy(HOOK).applyQuaternion(camera.quaternion).add(camera.position);
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    ahead.set(0, 0, -1).applyQuaternion(camera.quaternion);
    chord.subVectors(anchor, hook);

    const distance = chord.length();
    const slack = 1 - THREE.MathUtils.smoothstep(distance, 2.5, TAUT_DISTANCE);
    // Gentle, slowly drifting S-curve; slack shrinks as the cable pulls taut.
    const bulge = 0.04 + (0.07 * distance + 0.05) * slack;
    const angle = state.time * 0.3;

    swayA
      .copy(right).multiplyScalar(Math.cos(angle))
      .addScaledVector(up, Math.sin(angle) * 0.6);
    swayB
      .copy(right).multiplyScalar(Math.cos(angle + 2.4))
      .addScaledVector(up, Math.sin(angle + 2.4) * 0.6);
    // The cable leaves the hook heading forward into view, then swings back to
    // the anchor, so a short arc stays visible in the lower right while the
    // rest trails away behind the camera as you drift.
    c1.copy(hook).addScaledVector(ahead, 0.55).addScaledVector(swayA, bulge * 0.6);
    c2.copy(hook).addScaledVector(chord, 0.7).addScaledVector(swayB, bulge);

    const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
    const normals = geometry.getAttribute("normal") as THREE.BufferAttribute;

    for (let sample = 0; sample < SAMPLES; sample += 1) {
      const u = sample / (SAMPLES - 1);
      const v = 1 - u;
      const w0 = v * v * v;
      const w1 = 3 * v * v * u;
      const w2 = 3 * v * u * u;
      const w3 = u * u * u;

      point
        .copy(hook).multiplyScalar(w0)
        .addScaledVector(c1, w1)
        .addScaledVector(c2, w2)
        .addScaledVector(anchor, w3);

      // Derivative of the cubic Bézier.
      tangent
        .copy(c1).sub(hook).multiplyScalar(3 * v * v)
        .addScaledVector(offset.copy(c2).sub(c1), 6 * v * u)
        .addScaledVector(offset.copy(anchor).sub(c2), 3 * u * u)
        .normalize();

      side.crossVectors(tangent, Math.abs(tangent.dot(up)) > 0.95 ? right : up).normalize();
      binormal.crossVectors(tangent, side);

      for (let corner = 0; corner < SIDES; corner += 1) {
        const around = (corner / SIDES) * Math.PI * 2;

        offset
          .copy(side).multiplyScalar(Math.cos(around))
          .addScaledVector(binormal, Math.sin(around));

        const index = sample * SIDES + corner;

        normals.setXYZ(index, offset.x, offset.y, offset.z);
        positions.setXYZ(
          index,
          point.x + offset.x * RADIUS,
          point.y + offset.y * RADIUS,
          point.z + offset.z * RADIUS
        );
      }
    }

    positions.needsUpdate = true;
    normals.needsUpdate = true;
  });

  return (
    <group ref={rootRef} visible={false}>
      <mesh geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
