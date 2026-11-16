# Pose Coach

A thoughtful camera-side photography director using local, browser-based pose guidance.

## Experience
- Eight movement-driven pose sequences with three animated stages each (24 guided positions).
- Deterministic pose selection shaped by outfit and setting, including steps, gardens, walls, benches, railings and architecture.
- Live body tracking with MediaPipe Tasks Vision in the browser.
- Animated dotted full-body reference guide that transitions through each pose sequence.
- Separate prompts for the person in frame and the photographer.
- Framing feedback and capture gating.
- 4:5, 3:4, 9:16 and 1:1 crop presets.
- Browser-local photo capture.

## Run locally
Requires Node.js 22.22.2+ and npm 10+.

\`\`\`bash
npm install
npm test
npm run dev
npm run build
\`\`\`

## Privacy
Camera access starts only after an explicit user action. Live frames and pose landmarks are processed in the browser. Captured images are created in a local canvas and downloaded by the browser. No camera frame or photo is uploaded to a Pose Coach backend. The model and WebAssembly runtime are fetched from their public distribution hosts when the live guide starts.

## Scope
Pose guidance is a deterministic composition aid, not a photographic quality guarantee or body assessment. Tracking can be affected by lighting, occlusion, camera angle and device performance. This release offers curated movement sequences, context-aware pose recommendations and live framing feedback. The animated guide is a visual movement reference; capture readiness currently validates framing and landmark visibility, not exact joint-by-joint matching to every named pose. It does not analyse clothing imagery.