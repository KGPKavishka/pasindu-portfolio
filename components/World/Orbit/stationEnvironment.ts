import * as THREE from "three";

/**
 * Small HDR environment shared by everything in the orbit view that needs
 * believable reflections: a hot sun, warm bounce light from the planet and
 * near-black space.
 */
export function createStationEnvironment(
  renderer: THREE.WebGLRenderer,
  sunDirection: THREE.Vector3,
  planetDirection: THREE.Vector3
) {
  const scene = new THREE.Scene();
  const hdr = (color: string, scale: number) =>
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(scale),
      side: THREE.DoubleSide,
      toneMapped: false,
    });

  scene.background = new THREE.Color("#020202");

  const sun = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), hdr("#fff4e2", 60));

  sun.position.copy(sunDirection).multiplyScalar(18);
  scene.add(sun);

  const bounce = new THREE.Mesh(new THREE.CircleGeometry(16, 32), hdr("#b08a68", 1.1));

  bounce.position.copy(planetDirection).multiplyScalar(12);
  bounce.lookAt(0, 0, 0);
  scene.add(bounce);

  const fill = new THREE.Mesh(new THREE.SphereGeometry(30, 16, 16), hdr("#d9b79a", 0.025));

  scene.add(fill);

  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(scene, 0.03);

  generator.dispose();
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      object.material.dispose();
    }
  });

  return target.texture;
}
