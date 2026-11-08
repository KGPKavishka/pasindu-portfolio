import * as THREE from "three";

/**
 * Procedural rocky planet, lit by a single sun.
 *
 * The surface (basins, plains, highlands, craters, polar frost) is generated
 * once on the GPU into a cube map, then every frame is a single texture lookup
 * plus lighting. The orbit planet and the planet the camera approaches next
 * share the same baked map, so they read as one world.
 */
const albedoVertexShader = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    vDirection = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const albedoFragmentShader = /* glsl */ `
  varying vec3 vDirection;

  const vec3 LIGHT = vec3(0.4342, 0.2542, 0.1412);
  const vec3 MID = vec3(0.2623, 0.1441, 0.0782);
  const vec3 SHADOW = vec3(0.0482, 0.0284, 0.0185);
  const vec3 FROST = vec3(0.6867, 0.6105, 0.5395);

  float hash31(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  vec3 hash33(vec3 p) {
    return vec3(hash31(p), hash31(p + 19.19), hash31(p + 47.73));
  }

  float valueNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);

    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash31(i), hash31(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int octave = 0; octave < 6; octave++) {
      value += amplitude * valueNoise(p);
      p = p * 2.02 + vec3(1.7, 9.2, 3.3);
      amplitude *= 0.5;
    }

    return value;
  }

  // Bowl with a raised rim around random points of a 3D cell grid.
  float craters(vec3 p) {
    vec3 cell = floor(p);
    vec3 local = fract(p);
    float result = 0.0;

    for (int z = -1; z <= 1; z++) {
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec3 offset = vec3(float(x), float(y), float(z));
          vec3 random = hash33(cell + offset);
          float distanceToCenter = length(offset + 0.2 + 0.6 * random - local);
          float radius = 0.1 + 0.2 * hash31(cell + offset + 7.0);
          float presence = step(0.45, hash31(cell + offset + 3.0));
          float bowl = smoothstep(radius, radius * 0.35, distanceToCenter);
          float rim = exp(-pow((distanceToCenter - radius) / (radius * 0.16), 2.0));

          result += presence * (-0.55 * bowl + 0.4 * rim);
        }
      }
    }

    return result;
  }

  void main() {
    vec3 direction = normalize(vDirection);
    float height = fbm(direction * 2.4);
    float ridge = 1.0 - abs(2.0 * fbm(direction * 5.5 + 7.0) - 1.0);
    float grain = fbm(direction * 22.0);
    float impacts = craters(direction * 7.0) + 0.6 * craters(direction * 19.0 + 11.0);

    vec3 albedo = mix(SHADOW, MID, smoothstep(0.4, 0.58, height));
    albedo = mix(albedo, LIGHT, smoothstep(0.52, 0.74, height) * 0.85);
    albedo = mix(albedo, MID * 1.18, ridge * ridge * 0.35);
    albedo *= 0.78 + 0.44 * grain;
    albedo *= 0.6 + 0.8 * smoothstep(0.3, 0.7, height);
    albedo *= clamp(1.0 + 0.55 * impacts, 0.45, 1.6);

    float frost = smoothstep(0.88, 0.96, abs(direction.y) + (grain - 0.5) * 0.06);
    albedo = mix(albedo, FROST, frost);

    gl_FragColor = vec4(albedo, 1.0);
  }
`;

export const planetVertexShader = /* glsl */ `
  varying vec3 vObjectDirection;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vObjectDirection = normalize(position);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const planetFragmentShader = /* glsl */ `
  uniform samplerCube uAlbedo;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uDust;
  uniform vec3 uBlueHour;
  uniform float uOpacity;
  varying vec3 vObjectDirection;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 albedo = textureCube(uAlbedo, normalize(vObjectDirection)).rgb;

    float sunAngle = dot(normal, uSunDirection);
    float diffuse = smoothstep(-0.04, 0.34, sunAngle);
    float limb = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.6);
    float litLimb = limb * (0.2 + 0.8 * smoothstep(-0.2, 0.5, sunAngle));
    float twilight = smoothstep(-0.28, 0.08, sunAngle) * (1.0 - smoothstep(0.08, 0.5, sunAngle));

    vec3 color = albedo * uSunColor * diffuse * 0.85;
    color += mix(uDust, uBlueHour, smoothstep(0.0, 0.7, limb)) * litLimb * 0.5;
    color += uDust * twilight * 0.07;
    color += albedo * 0.02;
    color = 1.0 - exp(-color * 1.5);

    gl_FragColor = vec4(color, uOpacity);
    #include <colorspace_fragment>
  }
`;

const albedoCache = new WeakMap<THREE.WebGLRenderer, THREE.WebGLCubeRenderTarget>();

/** Bakes (once per renderer) the planet's surface into a mipmapped cube map. */
export function getPlanetAlbedo(renderer: THREE.WebGLRenderer, size: number) {
  const cached = albedoCache.get(renderer);

  if (cached) return cached.texture;

  const target = new THREE.WebGLCubeRenderTarget(size, {
    type: THREE.HalfFloatType,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
  });
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader: albedoVertexShader,
    fragmentShader: albedoFragmentShader,
    side: THREE.BackSide,
    depthTest: false,
    depthWrite: false,
  });

  scene.add(new THREE.Mesh(geometry, material));
  new THREE.CubeCamera(0.1, 10, target).update(renderer, scene);
  geometry.dispose();
  material.dispose();
  albedoCache.set(renderer, target);

  return target.texture;
}

export function createPlanetUniforms(
  sunDirection: THREE.Vector3,
  albedo: THREE.Texture
) {
  return {
    uAlbedo: { value: albedo },
    uSunDirection: { value: sunDirection.clone().normalize() },
    uSunColor: { value: new THREE.Color("#fff4e2") },
    uDust: { value: new THREE.Color("#d9b79a") },
    uBlueHour: { value: new THREE.Color("#6f8faf") },
    uOpacity: { value: 1 },
  };
}
