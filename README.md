# Pose Coach

A thoughtful camera-side photography director using local, browser-based pose guidance.

## Experience
- Eight curated pose directions for everyday, editorial and candid photographs.
- Outfit-aware and place-aware deterministic styling notes.
- Live body tracking with MediaPipe Tasks Vision in the browser.
- Dotted landmark guide rather than a solid skeleton.
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
Pose guidance is a deterministic composition aid, not a photographic quality guarantee or body assessment. Tracking can be affected by lighting, occlusion, camera angle and device performance. This release offers curated pose guidance with live framing feedback; it does not claim to recognise every named pose or analyse clothing imagery.