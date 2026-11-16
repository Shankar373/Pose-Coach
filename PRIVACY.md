# Privacy notes

- Camera access starts only after the user presses Open camera.
- Live frames and landmarks are processed locally in the browser.
- No camera footage or captured photo is transmitted to a Pose Coach backend.
- Captured images are created in a browser canvas and downloaded to the user's device.
- The pose model and WebAssembly runtime are loaded from Google-hosted model storage and jsDelivr when live guidance starts.
- Camera tracks are stopped when the user pauses the camera or unloads the page.
- Do not add remote photo scanning or image uploads without a privacy review and explicit user consent.