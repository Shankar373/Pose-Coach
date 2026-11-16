# Pose Coach

A photography director for people who want a better picture without needing a professional photographer.

## Product experience

- Outfit and location-aware pose ideas, using the curated pose library when no AI service is configured.
- Full-body dotted target pose overlay (not a solid skeleton).
- Local MediaPipe body landmark tracking.
- Separate live guidance for the person in frame and the photographer.
- Framing feedback, crop selection (4:5, 3:4, 9:16, 1:1), and capture-readiness gating.
- Editorial, responsive website and mobile-first camera studio.

## Vercel deployment

1. Import this repository at https://vercel.com/new.
2. Choose the `vercel-deploy` branch.
3. Confirm framework: Vite.
4. Build command: `npm run vercel-build`.
5. Output directory: `dist/web`.
6. Deploy. Vercel provides the actual `*.vercel.app` URL.

The build command restores the full app from the checked-in source bundle, then typechecks and builds it. No Claude key is required. No environment variables are required for the core public experience.

## Local development (Windows PowerShell)

Requires Node.js 22.22.2+ and npm 10+. Clone the repository, then run:

```powershell
npm.cmd install
npm.cmd run vercel-build
```

For local development, start two terminals after the source bundle has been restored:

```powershell
npm.cmd run server
```

```powershell
npm.cmd run dev
```

Open `http://localhost:5173` and allow camera access. Use `npm.cmd` in PowerShell to avoid the `npm.ps1` execution-policy error.

## Privacy and limitations

The public configuration does not upload camera frames or body landmarks. Photo scanning is disabled; describe outfit and location manually. Camera analysis runs on the device. Initial MediaPipe model loading requires internet access. Framing and pose checks are deterministic heuristics, not a guarantee of professional quality; test on real Android/iOS devices before a broad launch. See `PRIVACY.md`.
