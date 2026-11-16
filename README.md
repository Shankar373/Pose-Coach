# Pose Coach

A photography director for people who want a better picture without needing a professional photographer.

## Deployment status — staging branch is incomplete

**Do not deploy this branch yet.** The `vercel-deploy` branch currently contains deployment scaffolding and an incomplete source-bundle upload; it does not contain the complete application source. Vercel's build will correctly fail until the complete source bundle is committed.

Use the complete project ZIP provided in this conversation for local testing and Vercel CLI deployment. The `main` branch has not been changed.

## Product experience

- Outfit and location-aware pose ideas from the curated pose library.
- Full-body dotted target contour, not a solid skeleton overlay.
- Local MediaPipe body landmark tracking.
- Separate live guidance for the person in frame and the photographer.
- Framing feedback, crop selection (4:5, 3:4, 9:16, 1:1), and capture-readiness gating.
- Editorial, responsive website and mobile-first camera studio.

## Intended Vercel settings

- Framework: Vite
- Build command: `npm run vercel-build`
- Output directory: `dist/web`

The public core experience requires no Claude key or paid AI key. Live camera frames and landmarks remain on-device; photo scanning is disabled in the privacy-first public configuration.

See `VERCEL-DEPLOY-WINDOWS.md` and `PRIVACY.md` once the full source is committed.
