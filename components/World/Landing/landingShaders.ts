import * as THREE from "three";

/**
 * Landing plain surface.
 *
 * A tileable height + albedo map is baked once on the GPU (periodic noise and
 * craters at three scales). At runtime the ground samples that one map at two
 * scales (macro terrain + fine detail), derives relief from the height channel
 * and lights it with the low morning sun, so every frame is only a handful of
 * texture reads.
 */
export const MAP_SIZE = 1024;
/** World size (units) one tile of the map covers at the macro and detail scales. */
export const MACRO_TILE = 900;
export const DETAIL_TILE = 48;

const bakeVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const bakeFragmentShader = /* glsl */ `
  varying vec2 vUv;

  const vec3 LIGHT = vec3(0.4342, 0.2542, 0.1412);
  const vec3 MID = vec3(0.2623, 0.1441, 0.0782);
  const vec3 SHADOW = vec3(0.0482, 0.0284, 0.0185);

  // Periodic hash: the lattice wraps every n cells, so the map tiles seamlessly.
  float hashp(vec2 cell, float n) {
    cell = mod(cell, n);
    vec3 p3 = fract(vec3(cell.xyx) * 0.1031);

    p3 += dot(p3, p3.yzx + 33.33);

    return fract((p3.x + p3.y) * p3.z);
  }

  float pnoise(vec2 p, float n) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hashp(i, n), hashp(i + vec2(1.0, 0.0), n), f.x),
      mix(hashp(i + vec2(0.0, 1.0), n), hashp(i + vec2(1.0, 1.0), n), f.x),
      f.y
    );
  }

  float pfbm(vec2 uv, float base) {
    float value = 0.0;
    float amplitude = 0.5;
    float n = base;

    for (int octave = 0; octave < 6; octave++) {
      value += amplitude * pnoise(uv * n, n);
      n *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  // Bowls with raised rims on a wrapping grid of g x g cells.
  float craters(vec2 uv, float g) {
    vec2 p = uv * g;
    vec2 cell = floor(p);
    vec2 local = fract(p);
    float result = 0.0;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 offset = vec2(float(x), float(y));
        vec2 c = cell + offset;
        float h1 = hashp(c, g);
        float h2 = hashp(c + 17.0, g);
        float h3 = hashp(c + 41.0, g);
        float h4 = hashp(c + 73.0, g);
        vec2 center = offset + 0.2 + 0.6 * vec2(h1, h2);
        float d = length(center - local);
        float radius = 0.08 + 0.28 * h3 * h3;
        float presence = step(0.55, h4);
        float depth = 0.6 + 0.4 * h3;
        float bowl = smoothstep(radius, radius * 0.3, d);
        float rim = exp(-pow((d - radius) / (radius * 0.18), 2.0));

        result += presence * depth * (-0.9 * bowl + 0.5 * rim);
      }
    }

    return result;
  }

  void main() {
    vec2 uv = vUv;
    float broad = pfbm(uv, 4.0);
    float h = 0.45 + 0.5 * (broad - 0.5)
      + 0.3 * craters(uv, 7.0)
      + 0.22 * craters(uv, 19.0)
      + 0.14 * craters(uv, 53.0);

    h = clamp(h, 0.0, 1.0);

    float tone = pfbm(uv + 0.31, 5.0);
    float basalt = smoothstep(0.55, 0.8, pfbm(uv + 0.77, 3.0));
    vec3 albedo = mix(MID, LIGHT, smoothstep(0.35, 0.7, tone));

    albedo = mix(albedo, SHADOW, basalt * 0.55);
    albedo *= 0.62 + 0.75 * h;
    albedo *= 0.88 + 0.24 * pnoise(uv * 256.0, 256.0);

    gl_FragColor = vec4(albedo, h);
  }
`;

const groundVertexShader = /* glsl */ `
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);

    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const groundFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform vec3 uHaze;
  uniform vec3 uZenith;
  uniform float uFade;
  uniform float uMacro;
  uniform float uDetail;
  varying vec3 vWorld;

  void main() {
    vec3 toEye = cameraPosition - vWorld;
    float dist = length(toEye);
    vec3 viewDir = toEye / dist;
    vec2 uvM = vWorld.xz / ${MACRO_TILE.toFixed(1)};
    vec2 uvD = vWorld.xz / ${DETAIL_TILE.toFixed(1)};
    float e = 1.0 / ${MAP_SIZE.toFixed(1)};

    vec4 macro = texture2D(uMap, uvM);
    float mx = texture2D(uMap, uvM + vec2(e, 0.0)).a - texture2D(uMap, uvM - vec2(e, 0.0)).a;
    float mz = texture2D(uMap, uvM + vec2(0.0, e)).a - texture2D(uMap, uvM - vec2(0.0, e)).a;

    // Fine detail fades with distance (it would only shimmer far away).
    float detailAmount = 1.0 - smoothstep(30.0, 240.0, dist);
    vec4 detail = texture2D(uMap, uvD);
    float dx = texture2D(uMap, uvD + vec2(e, 0.0)).a - texture2D(uMap, uvD - vec2(e, 0.0)).a;
    float dz = texture2D(uMap, uvD + vec2(0.0, e)).a - texture2D(uMap, uvD - vec2(0.0, e)).a;

    vec3 normal = normalize(vec3(
      -(mx * uMacro + dx * uDetail * detailAmount),
      1.0,
      -(mz * uMacro + dz * uDetail * detailAmount)
    ));

    vec3 albedo = macro.rgb * mix(1.0, 0.7 + 0.6 * detail.a, detailAmount * 0.85);
    float diffuse = max(dot(normal, uSun), 0.0);
    vec3 ambient = uZenith * 0.5 + uHaze * 0.12;
    vec3 color = albedo * (uSunColor * diffuse * 2.6 + ambient);

    // Dust haze thickens with distance and glows toward the sun.
    float haze = 1.0 - exp(-pow(dist * 0.0035, 1.35));
    float toward = pow(max(dot(-viewDir, uSun), 0.0), 5.0);
    vec3 hazeColor = uHaze + uSunColor * 0.32 * toward;

    color = mix(color, hazeColor, haze);
    color = 1.0 - exp(-color * 1.25);
    gl_FragColor = vec4(color, uFade);
    #include <colorspace_fragment>
  }
`;

const skyVertexShader = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    vDirection = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform vec3 uHaze;
  uniform vec3 uZenith;
  uniform vec3 uBase;
  uniform float uAltitude;
  uniform float uFade;
  uniform float uSunGlow;
  varying vec3 vDirection;

  void main() {
    vec3 direction = normalize(vDirection);
    float elevation = direction.y;
    float up = pow(clamp(elevation, 0.0, 1.0), 0.55);
    // From high above, the thin air is nearly black overhead.
    vec3 zenith = mix(uZenith, vec3(0.012, 0.011, 0.016), uAltitude * 0.92);
    vec3 color = mix(uHaze, zenith, smoothstep(0.0, 0.78, up));

    // Thin bright band hugging the horizon.
    color += uHaze * exp(-max(elevation, 0.0) * 26.0) * 0.55 * (0.3 + uAltitude);

    float s = max(dot(direction, uSun), 0.0);
    float aboveHorizon = smoothstep(-0.04, 0.03, uSun.y);
    float disc = smoothstep(0.99985, 0.99997, s) * aboveHorizon;

    color += uSunColor * uSunGlow * (disc * 9.0 + pow(s, 70.0) * 0.45 + pow(s, 7.0) * 0.14);
    color = 1.0 - exp(-color * 1.3);
    gl_FragColor = vec4(mix(uBase, color, uFade), 1.0);
    #include <colorspace_fragment>
  }
`;

const hillsVertexShader = /* glsl */ `
  attribute float aTop;
  varying float vTop;
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);

    vTop = aTop;
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const hillsFragmentShader = /* glsl */ `
  uniform vec3 uHaze;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform vec3 uTint;
  uniform float uFade;
  varying float vTop;
  varying vec3 vWorld;

  void main() {
    vec3 toEye = cameraPosition - vWorld;
    vec3 viewDir = normalize(toEye);
    float toward = pow(max(dot(-viewDir, uSun), 0.0), 5.0);
    vec3 hazeColor = uHaze + uSunColor * 0.32 * toward;
    // Distant ridges: mostly haze, slightly darker toward the crest-less base.
    vec3 color = mix(hazeColor, uTint, 0.38 * (1.0 - vTop * 0.45));

    color = 1.0 - exp(-color * 1.25);
    gl_FragColor = vec4(color, uFade);
    #include <colorspace_fragment>
  }
`;

export {
  groundFragmentShader,
  groundVertexShader,
  hillsFragmentShader,
  hillsVertexShader,
  skyFragmentShader,
  skyVertexShader,
};

const mapCache = new WeakMap<THREE.WebGLRenderer, THREE.WebGLRenderTarget>();

/** Bakes (once per renderer) the tileable height + albedo map of the plain. */
export function getGroundMap(renderer: THREE.WebGLRenderer, size = MAP_SIZE) {
  const cached = mapCache.get(renderer);

  if (cached) return cached.texture;

  const target = new THREE.WebGLRenderTarget(size, size, {
    type: THREE.HalfFloatType,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    depthBuffer: false,
  });

  target.texture.anisotropy = 8;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: bakeVertexShader,
    fragmentShader: bakeFragmentShader,
    depthTest: false,
    depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);

  quad.frustumCulled = false;
  scene.add(quad);

  const previousTarget = renderer.getRenderTarget();

  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  renderer.setRenderTarget(previousTarget);

  quad.geometry.dispose();
  material.dispose();
  mapCache.set(renderer, target);

  return target.texture;
}
