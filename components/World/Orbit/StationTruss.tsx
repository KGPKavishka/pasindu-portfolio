"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  type OrbitLayerProps,
  applyDissolve,
  orbitDissolve,
  seededRandom,
} from "./orbitLayout";

const Y_AXIS = new THREE.Vector3(0, 1, 0);

type Segment = readonly [THREE.Vector3, THREE.Vector3];

function createSolarTexture() {
  const canvas = document.createElement("canvas");

  canvas.width = 256;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#0d1119";
    context.fillRect(0, 0, 256, 512);

    const columns = 8;
    const rows = 20;
    const cellWidth = 256 / columns;
    const cellHeight = 512 / rows;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const tone = 16 + Math.floor(seededRandom(row * 17 + column * 3.1) * 14);

        context.fillStyle = `rgb(${tone}, ${tone + 6}, ${tone + 22})`;
        context.fillRect(
          column * cellWidth + 2,
          row * cellHeight + 2,
          cellWidth - 4,
          cellHeight - 4
        );
      }
    }

    context.strokeStyle = "rgba(201, 164, 92, 0.55)";
    context.lineWidth = 3;
    context.strokeRect(1.5, 1.5, 253, 509);
  }

  const texture = new THREE.CanvasTexture(context ? canvas : document.createElement("canvas"));

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  return texture;
}

function buildTrussSegments(bays: number, bay: number, half: number) {
  const corner = (index: number, bayIndex: number) =>
    new THREE.Vector3(
      bayIndex * bay,
      index === 0 || index === 3 ? half : -half,
      index < 2 ? half : -half
    );
  const rings: Segment[] = [];
  const longerons: Segment[] = [];
  const braces: Segment[] = [];
  const nodes: THREE.Vector3[] = [];

  for (let bayIndex = 0; bayIndex <= bays; bayIndex += 1) {
    for (let index = 0; index < 4; index += 1) {
      nodes.push(corner(index, bayIndex));
      rings.push([corner(index, bayIndex), corner((index + 1) % 4, bayIndex)]);

      if (bayIndex < bays) {
        longerons.push([corner(index, bayIndex), corner(index, bayIndex + 1)]);
        braces.push([
          corner(index, bayIndex),
          corner((index + 1 + (bayIndex % 2)) % 4, bayIndex + 1),
        ]);
      }
    }
  }

  return { segments: [...rings, ...longerons, ...braces], nodes };
}

const scratch = {
  matrix: new THREE.Matrix4(),
  quaternion: new THREE.Quaternion(),
  scale: new THREE.Vector3(),
  position: new THREE.Vector3(),
  direction: new THREE.Vector3(),
};

interface StationTrussProps extends OrbitLayerProps {
  environment: THREE.Texture;
}

export default function StationTruss({
  layout,
  visibility,
  environment,
}: StationTrussProps) {
  const { station, handrail } = layout;
  const rootRef = useRef<THREE.Group>(null);
  const segmentRef = useRef<THREE.InstancedMesh>(null);
  const nodeRef = useRef<THREE.InstancedMesh>(null);

  const { bays, length, half } = station;
  const bay = length / bays;
  const truss = useMemo(() => buildTrussSegments(bays, bay, half), [bays, bay, half]);
  const solarTexture = useMemo(() => createSolarTexture(), []);

  const materials = useMemo(() => {
    const make = (
      parameters: THREE.MeshStandardMaterialParameters
    ) => {
      const material = new THREE.MeshStandardMaterial({
        envMap: environment,
        ...parameters,
      });

      applyDissolve(material, orbitDissolve);

      return material;
    };

    return {
      aluminium: make({ color: "#b9b7ae", metalness: 0.85, roughness: 0.42, envMapIntensity: 1.2 }),
      white: make({ color: "#e9e6df", metalness: 0.05, roughness: 0.62, envMapIntensity: 0.9 }),
      gold: make({ color: "#c9a45c", metalness: 0.92, roughness: 0.3, envMapIntensity: 1.3 }),
      orange: make({ color: "#ff4f00", metalness: 0.1, roughness: 0.5, envMapIntensity: 0.8 }),
      panel: make({ map: solarTexture, metalness: 0.35, roughness: 0.32, envMapIntensity: 1.4 }),
      dark: make({ color: "#1b1c20", metalness: 0.5, roughness: 0.55, envMapIntensity: 0.8 }),
    };
  }, [environment, solarTexture]);

  useEffect(
    () => () => {
      solarTexture.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
    [solarTexture, materials]
  );

  useLayoutEffect(() => {
    const segments = segmentRef.current;
    const nodes = nodeRef.current;

    if (!segments || !nodes) return;

    truss.segments.forEach(([a, b], index) => {
      scratch.direction.subVectors(b, a);
      const segmentLength = scratch.direction.length();

      scratch.quaternion.setFromUnitVectors(Y_AXIS, scratch.direction.normalize());
      scratch.position.addVectors(a, b).multiplyScalar(0.5);
      scratch.scale.set(1, segmentLength, 1);
      scratch.matrix.compose(scratch.position, scratch.quaternion, scratch.scale);
      segments.setMatrixAt(index, scratch.matrix);
    });
    segments.instanceMatrix.needsUpdate = true;

    truss.nodes.forEach((node, index) => {
      scratch.matrix.makeTranslation(node.x, node.y, node.z);
      nodes.setMatrixAt(index, scratch.matrix);
    });
    nodes.instanceMatrix.needsUpdate = true;
  }, [truss]);

  const equipmentBoxes = useMemo(
    () =>
      [2, 5, 8, 11, 14]
        .filter((bayIndex) => bayIndex < bays)
        .map((bayIndex, index) => ({
          x: bayIndex * bay + bay * 0.5,
          side: index % 2 === 0 ? 1 : -1,
          height: 0.7 + seededRandom(index + 5) * 0.5,
        })),
    [bay, bays]
  );

  useFrame(() => {
    const state = visibility.current;
    const opacity = state.station * state.intro;

    if (rootRef.current) {
      rootRef.current.visible = opacity > 0.001;
      // Almost imperceptible drift of the whole structure.
      rootRef.current.rotation.z = Math.sin(state.time * 0.07) * 0.0035;
    }
  });

  return (
    <group ref={rootRef} visible={false}>
      <group position={station.start} quaternion={station.quaternion}>
        <instancedMesh
          ref={segmentRef}
          args={[undefined, undefined, truss.segments.length]}
          material={materials.aluminium}
          frustumCulled={false}
        >
          <cylinderGeometry args={[0.035, 0.035, 1, 6]} />
        </instancedMesh>

        <instancedMesh
          ref={nodeRef}
          args={[undefined, undefined, truss.nodes.length]}
          material={materials.gold}
          frustumCulled={false}
        >
          <sphereGeometry args={[0.07, 8, 8]} />
        </instancedMesh>

        {equipmentBoxes.map((box) => (
          <group key={box.x} position={[box.x, box.side * (half + 0.28), 0]}>
            <mesh material={materials.white}>
              <boxGeometry args={[bay * 0.7, 0.5, box.height]} />
            </mesh>
            <mesh material={materials.gold} position={[0, box.side * 0.26, 0]}>
              <boxGeometry args={[bay * 0.72, 0.03, box.height + 0.04]} />
            </mesh>
            <mesh material={materials.orange} position={[bay * 0.3, 0, box.height / 2 + 0.005]}>
              <boxGeometry args={[0.18, 0.12, 0.01]} />
            </mesh>
          </group>
        ))}

        {/* Habitable module at the far end of the truss. */}
        <group position={[length + 0.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.72}>
          <mesh material={materials.white}>
            <cylinderGeometry args={[1.35, 1.35, 6, 32]} />
          </mesh>
          {[-2.4, 0, 2.4].map((y) => (
            <mesh key={y} material={materials.gold} position={[0, y, 0]}>
              <cylinderGeometry args={[1.37, 1.37, 0.28, 32]} />
            </mesh>
          ))}
          <mesh material={materials.gold} position={[0, 3.35, 0]}>
            <cylinderGeometry args={[0.75, 1.3, 0.7, 32]} />
          </mesh>
          <mesh material={materials.dark} position={[0, 3.8, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.25, 24]} />
          </mesh>
          <mesh material={materials.orange} position={[1.352, 1.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <boxGeometry args={[0.5, 0.012, 0.3]} />
          </mesh>
          <mesh material={materials.aluminium} position={[0, -3.25, 0]}>
            <cylinderGeometry args={[1.0, 1.35, 0.5, 32]} />
          </mesh>
        </group>

        {/* Solar array: a boom with two wings, seen face-on from the lens. */}
        <group position={[length * 0.55, half + 0.2, 0]}>
          <mesh material={materials.aluminium} position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 2.2, 8]} />
          </mesh>
          <group position={[0, 5.2, 0]} rotation={[0, 0.5, 0.08]}>
            <mesh material={materials.panel} position={[0, 0, 1.3]}>
              <boxGeometry args={[0.035, 6.6, 2.4]} />
            </mesh>
            <mesh material={materials.panel} position={[0, 0, -1.3]}>
              <boxGeometry args={[0.035, 6.6, 2.4]} />
            </mesh>
            <mesh material={materials.gold} position={[0, -3.35, 0]}>
              <boxGeometry args={[0.12, 0.3, 0.7]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* EVA handrail close to the lens. */}
      <group position={handrail.position} rotation={handrail.rotation}>
        <mesh material={materials.gold}>
          <cylinderGeometry args={[0.024, 0.024, 0.9, 12]} />
        </mesh>
        {[-0.38, 0.38].map((y) => (
          <mesh key={y} material={materials.aluminium} position={[0.07, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
          </mesh>
        ))}
        <mesh material={materials.orange} position={[0, 0.12, 0.03]}>
          <cylinderGeometry args={[0.028, 0.028, 0.12, 12]} />
        </mesh>
      </group>
    </group>
  );
}
