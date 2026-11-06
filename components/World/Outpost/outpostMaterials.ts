import * as THREE from "three";

/**
 * Shared physically-based materials for the outpost structures
 * (docs/DESIGN_PLAN.md §4): white thermal panels, gold foil, brushed
 * aluminium, dark service panels and International Orange safety markings.
 * One instance each, reused by every structure.
 */
export const outpostMaterials = {
  panelWhite: new THREE.MeshStandardMaterial({
    color: "#e9e6df",
    roughness: 0.62,
    metalness: 0.06,
  }),
  panelShade: new THREE.MeshStandardMaterial({
    color: "#cbc6bb",
    roughness: 0.7,
    metalness: 0.08,
  }),
  aluminium: new THREE.MeshStandardMaterial({
    color: "#a9abac",
    roughness: 0.48,
    metalness: 0.4,
  }),
  aluminiumDark: new THREE.MeshStandardMaterial({
    color: "#74777a",
    roughness: 0.55,
    metalness: 0.4,
  }),
  foilGold: new THREE.MeshStandardMaterial({
    color: "#c9a45c",
    roughness: 0.4,
    metalness: 0.55,
    side: THREE.DoubleSide,
  }),
  darkPanel: new THREE.MeshStandardMaterial({
    color: "#2b2a28",
    roughness: 0.72,
    metalness: 0.2,
  }),
  rubber: new THREE.MeshStandardMaterial({
    color: "#1c1b1a",
    roughness: 0.92,
    metalness: 0.05,
  }),
  windowGlass: new THREE.MeshStandardMaterial({
    color: "#1b222a",
    roughness: 0.18,
    metalness: 0.35,
  }),
  orange: new THREE.MeshStandardMaterial({
    color: "#ff4f00",
    roughness: 0.6,
    metalness: 0.05,
  }),
  amber: new THREE.MeshStandardMaterial({
    color: "#e8a33d",
    roughness: 0.6,
    metalness: 0.05,
  }),
  pad: new THREE.MeshStandardMaterial({
    color: "#4d3f34",
    roughness: 0.96,
    metalness: 0.02,
  }),
  soil: new THREE.MeshStandardMaterial({
    color: "#3a2d24",
    roughness: 1,
    metalness: 0,
  }),
  plantLight: new THREE.MeshStandardMaterial({
    color: "#7a9a68",
    roughness: 0.85,
  }),
  plantDark: new THREE.MeshStandardMaterial({
    color: "#46613d",
    roughness: 0.9,
  }),
  solarCell: new THREE.MeshStandardMaterial({
    color: "#222a36",
    roughness: 0.35,
    metalness: 0.5,
  }),
  growLight: new THREE.MeshStandardMaterial({
    color: "#ffe9c4",
    emissive: "#ffd9a0",
    emissiveIntensity: 1.1,
    roughness: 0.5,
  }),
  glassDome: new THREE.MeshStandardMaterial({
    color: "#d7e6da",
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    side: THREE.DoubleSide,
  }),
  domeFrame: new THREE.MeshStandardMaterial({
    color: "#b4b7b8",
    roughness: 0.5,
    metalness: 0.4,
    wireframe: true,
  }),
  trackMark: new THREE.MeshStandardMaterial({
    color: "#2a211b",
    roughness: 1,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  }),
} as const;

export const m = outpostMaterials;

