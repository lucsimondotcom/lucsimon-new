import { sphereGlsl } from "@/lib/designTokens";

export const sphereVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const sphereFragmentShader = /* glsl */ `
uniform float uGlowMix;
uniform float uFadeMix;

varying vec3 vNormal;
varying vec3 vViewDir;

vec3 palette(float t) {
  vec3 pearl = ${sphereGlsl.pearl};
  vec3 cyan = ${sphereGlsl.cyan};
  vec3 magenta = ${sphereGlsl.magenta};
  vec3 violet = ${sphereGlsl.violet};
  vec3 mint = ${sphereGlsl.mint};

  vec3 a = mix(pearl, cyan, smoothstep(0.0, 0.35, t));
  vec3 b = mix(magenta, violet, smoothstep(0.25, 0.65, t));
  vec3 c = mix(violet, mint, smoothstep(0.55, 1.0, t));
  return mix(mix(a, b, smoothstep(0.1, 0.7, t)), c, smoothstep(0.45, 1.0, t));
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);
  float ndv = max(dot(n, v), 0.0);

  float fresnel = pow(1.0 - ndv, 2.4);
  float film = fresnel * 0.5 + ndv * 0.25 + sin(ndv * 6.283185) * 0.022;

  vec3 base = palette(film);
  vec3 cyan = ${sphereGlsl.cyan};
  vec3 innerGlow = ${sphereGlsl.innerGlow};

  vec3 lightDir = normalize(vec3(0.4, 0.85, 0.5));
  vec3 halfDir = normalize(lightDir + v);
  float diffuse = max(dot(n, lightDir), 0.0);
  float spec = pow(max(dot(n, halfDir), 0.0), 64.0);

  vec3 color = base * (0.52 + diffuse * 0.32);
  color += palette(fresnel + 0.12) * fresnel * 0.28;
  color += ${sphereGlsl.glassTint} * spec * 0.35;
  color += cyan * fresnel * 0.12;
  color += innerGlow * uGlowMix * (0.06 + fresnel * 0.1);
  color = mix(color, innerGlow, smoothstep(0.3, 0.95, ndv) * 0.08);

  float glassAlpha = mix(0.45, 0.8, fresnel);
  float alpha = mix(glassAlpha, 0.15, uFadeMix);
  gl_FragColor = vec4(color, alpha);
}
`;
