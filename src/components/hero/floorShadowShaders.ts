export const floorShadowVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const floorShadowFragmentShader = /* glsl */ `
uniform vec3 uShadowCore;
uniform vec3 uShadowMid;
uniform vec3 uReflectionColor;
uniform float uStrength;

varying vec2 vUv;

void main() {
  vec2 c = vUv - 0.5;
  vec2 e = c * vec2(1.0, 0.46);
  float r = length(e) * 2.4;

  // Hors ellipse → pas de rendu (évite l'effet "plan" rectangulaire)
  if (r > 0.98) discard;

  // Fondu radial avant les bords du mesh
  float edgeFade = smoothstep(0.98, 0.55, r);
  edgeFade = pow(edgeFade, 2.2);

  float umbra = exp(-pow(r * 3.5, 2.0));
  float midRing = exp(-pow(r * 1.85, 2.0)) * 0.5;
  float penumbra = exp(-pow(r * 1.02, 2.0)) * 0.2;

  float shadow = (umbra + midRing + penumbra) * edgeFade;
  shadow = min(shadow, 1.0);

  vec3 shadowColor = mix(uShadowMid, uShadowCore, smoothstep(0.1, 0.72, shadow));

  float reflMask = smoothstep(0.32, 0.0, abs(c.y + 0.038));
  reflMask *= smoothstep(0.42, 0.028, abs(c.x));
  reflMask *= exp(-pow(r * 2.6, 2.0));
  float refl = pow(reflMask, 1.75) * 0.2 * edgeFade;

  vec3 color = shadowColor * shadow + uReflectionColor * refl;

  float alpha = (shadow * 0.88 + refl * 0.26) * uStrength;
  alpha = 1.0 - exp(-alpha * 1.45);

  if (alpha < 0.004) discard;

  gl_FragColor = vec4(color, alpha);
}
`;
