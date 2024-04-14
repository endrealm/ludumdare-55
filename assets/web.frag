#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 uv;
varying vec3 color;

uniform float seconds;

float circle(vec2 pos, vec2 center, float radius)
{
    float dist = length(pos - center);
    return abs(dist - radius);
}

float line(vec2 pos, vec2 a, vec2 b, float r )
{
    vec2 pa = pos - a, ba = b - a;
    float h = clamp(dot(pa,ba) / dot(ba,ba), 0.0, 1.0 );
    return abs(length(pa - ba * h) - r);
}

vec2 distort_pos(vec2 pos)
{
    pos.x += cos(seconds * 10.0 + pos.x * 7.5 + pos.y * 3.0) * 0.04;
    pos.y += sin(seconds * 10.0 + pos.y * 7.5 + pos.x * 3.0) * 0.04;
    return pos;
}

void main()
{
    vec2 pos = distort_pos(2.0 * uv - vec2(1.0));
    // NOTE: From 1 to 0

    // float d = circle(pos, vec2(0, 0), 0.8);
    // d = min(d, line(pos, vec2(-0.8, 0), vec2(0.8, 0), 0));

    float a = line(pos, vec2(-0.8, 0.0), vec2(0.8, 0.0), 0.0);
    float b = line(pos, vec2(0.8, 0.0), vec2(0.0, 0.8), 0.0);
    float c = line(pos, vec2(-0.8, 0.0), vec2(0.0, 0.8), 0.0);

    float d = min(a, b);
    d = min(d, c);

    float thickness = 0.06;
    float intensity = thickness / d;
    intensity = intensity * intensity * intensity;
    gl_FragColor = vec4(color * intensity, 1.0);
}
