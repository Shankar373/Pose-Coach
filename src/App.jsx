import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CROPS,
  POSES,
  assessFrame,
  createVideoToStageTransform,
  getCropRect,
  mapLandmarksToStage,
} from "./pose-engine.js";

const MODEL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm";

function Mark() {
  return <span className="brand-mark"><i /><i /><i /><i /></span>;
}

/**
 * A fixed visual reference. It is intentionally not derived from the person
 * in the camera: the person moves until their live image fits this guide.
 */
function HumanGuide({ opacity = 48 }) {
  return (
    <svg
      className="reference-silhouette"
      viewBox="0 0 300 760"
      role="img"
      aria-label="Transparent full-body standing position guide"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="guide-soft-edge" x="-20%" y="-10%" width="140%" height="120%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <g opacity={opacity / 100}>
        <g className="silhouette-glow" fill="#fff" filter="url(#guide-soft-edge)">
          <path d="M150 27 C119 27 98 52 98 87 C98 119 118 143 150 147 C182 143 202 119 202 87 C202 52 181 27 150 27Z" />
          <path d="M128 132 C122 149 112 154 98 159 C82 165 75 180 69 199 L49 272 C45 287 50 306 60 323 L76 352 C82 363 95 363 102 355 C108 348 105 337 100 328 L89 300 L116 226 L121 315 C119 350 112 387 105 420 C102 437 113 450 130 452 L170 452 C187 450 198 437 195 420 C188 387 181 350 179 315 L184 226 L211 300 L200 328 C195 337 192 348 198 355 C205 363 218 363 224 352 L240 323 C250 306 255 287 251 272 L231 199 C225 180 218 165 202 159 C188 154 178 149 172 132Z" />
          <path d="M111 416 C123 424 137 428 151 428 L147 462 C144 493 139 525 137 559 L132 678 C131 695 122 706 111 706 C100 706 93 695 93 678 L89 559 C87 522 91 485 98 454 C101 438 105 425 111 416Z" />
          <path d="M189 416 C177 424 163 428 149 428 L153 462 C156 493 161 525 163 559 L168 678 C169 695 178 706 189 706 C200 706 207 695 207 678 L211 559 C213 522 209 485 202 454 C199 438 195 425 189 416Z" />
          <path d="M93 674 C99 690 105 699 108 713 C110 726 100 738 83 740 L55 740 C45 740 42 733 47 725 C55 714 70 705 87 696Z" />
          <path d="M207 674 C201 690 195 699 192 713 C190 726 200 738 217 740 L245 740 C255 740 258 733 253 725 C245 714 230 705 213 696Z" />
        </g>
        <g className="silhouette-body" fill="rgba(255,255,255,.22)" stroke="rgba(255,255,255,.92)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M150 27 C119 27 98 52 98 87 C98 119 118 143 150 147 C182 143 202 119 202 87 C202 52 181 27 150 27Z" />
          <path d="M128 132 C128 151 124 160 116 171 L184 171 C176 160 172 151 172 132Z" />
          <path d="M116 157 C99 158 87 168 80 185 L52 273 C47 288 51 305 60 323 L76 352 C82 363 95 363 102 355 C108 348 105 337 100 328 L89 300 L117 225 L128 180Z" />
          <path d="M184 157 C201 158 213 168 220 185 L248 273 C253 288 249 305 240 323 L224 352 C218 363 205 363 198 355 C192 348 195 337 200 328 L211 300 L183 225 L172 180Z" />
          <path d="M116 157 C128 153 139 163 150 163 C161 163 172 153 184 157 C194 161 203 169 207 183 L184 226 L180 313 C179 350 186 388 194 420 C198 437 187 450 170 452 L130 452 C113 450 102 437 106 420 C114 388 121 350 120 313 L116 226 L93 183 C97 169 106 161 116 157Z" />
          <path d="M111 416 C123 424 137 428 151 428 L147 462 C144 493 139 525 137 559 L132 678 C131 695 122 706 111 706 C100 706 93 695 93 678 L89 559 C87 522 91 485 98 454 C101 438 105 425 111 416Z" />
          <path d="M189 416 C177 424 163 428 149 428 L153 462 C156 493 161 525 163 559 L168 678 C169 695 178 706 189 706 C200 706 207 695 207 678 L211 559 C213 522 209 485 202 454 C199 438 195 425 189 416Z" />
          <path d="M93 674 C99 690 105 699 108 713 C110 726 100 738 83 740 L55 740 C45 740 42 733 47 725 C55 714 70 705 87 696Z" />
          <path d="M207 674 C201 690 195 699 192 713 C190 726 200 738 217 740 L245 740 C255 740 258 733 253 725 C245 714 230 705 213 696Z" />
        </g>
        <path className="silhouette-center" d="M150 177 L150 413" fill="none" stroke="rgba(255,255,255,.24)" strokeWidth="1" strokeDasharray="3 9" />
      </g>
    </svg>
  );
}

function initialFeedback() {
  return {
    tracking: false,
    ready: false,
    title: "Stand inside the guide",
    detail: "Place your full body behind the transparent outline. The camera will help you adjust.",
    score: 0,
  };
}

export default function App() {
  const video = useRef(null);
  const canvas = useRef(null);
  const stage = useRef(null);
  const landmarker = useRef(null);
  const raf = useRef(0);
  const lastTime = useRef(-1);
  const lastUpdate = useRef(0);
  const countdownTimer = useRef(0);
  const photoUrl = useRef("");
  const feedbackRef = useRef(null);

  const [camera, setCamera] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [vision, setVision] = useState("idle");
  const [mode, setMode] = useState("subject");
  const [pose, setPose] = useState("easy");
  const [outfit, setOutfit] = useState("Everyday");
  const [place, setPlace] = useState("Open space");
  const [crop, setCrop] = useState("4:5");
  const [guideOpacity, setGuideOpacity] = useState(64);
  const [shot, setShot] = useState(false);
  const [selfTimer, setSelfTimer] = useState("3");
  const [countdown, setCountdown] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [captureMessage, setCaptureMessage] = useState("");
  const [stageSize, setStageSize] = useState({ width: 1000, height: 750 });
  const [feedback, setFeedback] = useState(initialFeedback);
  feedbackRef.current = feedback;

  const selected = useMemo(() => POSES.find((item) => item.id === pose) || POSES[0], [pose]);
  const ratio = useMemo(() => CROPS.find((item) => item.id === crop) || CROPS[0], [crop]);
  const cropRect = useMemo(
    () => getCropRect(stageSize.width, stageSize.height, ratio.width / ratio.height),
    [stageSize.width, stageSize.height, ratio],
  );
  const cropStyle = useMemo(() => ({
    left: `${cropRect.left * 100}%`,
    top: `${cropRect.top * 100}%`,
    width: `${cropRect.width * 100}%`,
    height: `${cropRect.height * 100}%`,
  }), [cropRect]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return undefined;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      if (bounds.width > 0 && bounds.height > 0) {
        setStageSize((current) => (
          Math.abs(current.width - bounds.width) < 0.5 && Math.abs(current.height - bounds.height) < 0.5
            ? current
            : { width: bounds.width, height: bounds.height }
        ));
      }
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (countdownTimer.current) {
      window.clearInterval(countdownTimer.current);
      countdownTimer.current = 0;
    }
    setCountdown(0);
    video.current?.srcObject?.getTracks?.().forEach((track) => track.stop());
    if (video.current) video.current.srcObject = null;
    landmarker.current?.close?.();
    landmarker.current = null;
    setCamera(false);
    setVision("idle");
    setCapturedPhoto("");
    setShot(false);
    setFeedback({
      tracking: false,
      ready: false,
      title: "Camera paused",
      detail: "Start again when you are ready to line up with the guide.",
      score: 0,
    });
  }, []);

  const start = useCallback(async () => {
    setError("");
    setShot(false);
    setCaptureMessage("");
    setCountdown(0);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access needs a secure browser context. Open this page over HTTPS and try again.");
      return;
    }

    setBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (!video.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      video.current.srcObject = stream;
      await video.current.play();
      lastTime.current = -1;
      lastUpdate.current = 0;
      setCamera(true);
      setVision("loading");
      setFeedback({
        tracking: false,
        ready: false,
        title: "Finding your outline",
        detail: "Your camera stays on this device while the guide gets ready.",
        score: 0,
      });

      try {
        const visionTasks = await import("@mediapipe/tasks-vision");
        const fileset = await visionTasks.FilesetResolver.forVisionTasks(WASM);
        const options = {
          baseOptions: { modelAssetPath: MODEL, delegate: "GPU" },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        };
        let poseLandmarker;
        try {
          poseLandmarker = await visionTasks.PoseLandmarker.createFromOptions(fileset, options);
        } catch {
          poseLandmarker = await visionTasks.PoseLandmarker.createFromOptions(fileset, {
            ...options,
            baseOptions: { modelAssetPath: MODEL, delegate: "CPU" },
          });
        }
        landmarker.current = poseLandmarker;
        setVision("ready");
      } catch {
        setVision("unavailable");
        setFeedback({
          tracking: false,
          ready: false,
          title: "The guide is ready, tracking is not",
          detail: "Your camera still works. Check your connection and refresh to enable positioning feedback.",
          score: 0,
        });
      }
    } catch (cameraError) {
      setError(
        cameraError?.name === "NotAllowedError"
          ? "Camera permission was not granted. Allow camera access in your browser settings and try again."
          : "The camera could not start. Close other camera apps and try again.",
      );
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!camera || vision !== "ready" || !landmarker.current || !video.current) return undefined;
    let active = true;

    const loop = () => {
      if (!active) return;
      const cameraVideo = video.current;
      const poseLandmarker = landmarker.current;

      if (
        cameraVideo &&
        poseLandmarker &&
        cameraVideo.readyState >= 2 &&
        cameraVideo.currentTime !== lastTime.current
      ) {
        lastTime.current = cameraVideo.currentTime;
        try {
          const result = poseLandmarker.detectForVideo(cameraVideo, performance.now());
          const sourceLandmarks = result.landmarks?.[0] || null;
          const now = performance.now();
          if (now - lastUpdate.current > 110) {
            lastUpdate.current = now;
            if (!sourceLandmarks) {
              setFeedback(assessFrame(null, cropRect, mode));
            } else {
              const transform = createVideoToStageTransform(
                cameraVideo.videoWidth,
                cameraVideo.videoHeight,
                stageSize.width,
                stageSize.height,
                true,
              );
              const stageLandmarks = mapLandmarksToStage(sourceLandmarks, transform);
              setFeedback(assessFrame(stageLandmarks, cropRect, mode));
            }
          }
        } catch {
          setFeedback({
            tracking: false,
            ready: false,
            title: "Tracking paused",
            detail: "Keep the camera steady and step into the guide again.",
            score: 0,
          });
        }
      }
      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      cancelAnimationFrame(raf.current);
    };
  }, [camera, vision, mode, cropRect, stageSize.width, stageSize.height]);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    if (countdownTimer.current) window.clearInterval(countdownTimer.current);
    video.current?.srcObject?.getTracks?.().forEach((track) => track.stop());
    landmarker.current?.close?.();
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
  }, []);

  const capture = () => {
    if (!video.current || !canvas.current || !feedbackRef.current?.ready) return;
    const cameraVideo = video.current;
    const output = canvas.current;
    const outputRatio = ratio.width / ratio.height;
    const sourceRatio = cameraVideo.videoWidth / cameraVideo.videoHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = cameraVideo.videoWidth;
    let sourceHeight = cameraVideo.videoHeight;

    if (sourceRatio > outputRatio) {
      sourceWidth = sourceHeight * outputRatio;
      sourceX = (cameraVideo.videoWidth - sourceWidth) / 2;
    } else {
      sourceHeight = sourceWidth / outputRatio;
      sourceY = (cameraVideo.videoHeight - sourceHeight) / 2;
    }

    output.width = 1200;
    output.height = Math.round(1200 / outputRatio);
    const context = output.getContext("2d");
    if (!context) return;

    // Match the mirrored front-camera preview so the downloaded photo matches
    // the composition the person saw while aligning with the reference.
    context.save();
    context.translate(output.width, 0);
    context.scale(-1, 1);
    context.drawImage(
      cameraVideo,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      output.width,
      output.height,
    );
    context.restore();

    output.toBlob((blob) => {
      if (!blob) {
        setCaptureMessage("The photo could not be prepared. Please try again.");
        return;
      }
      if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
      const url = URL.createObjectURL(blob);
      photoUrl.current = url;
      setCapturedPhoto(url);
      setShot(true);
      setCaptureMessage("");
    }, "image/jpeg", 0.94);
  };

  const beginCapture = () => {
    if (!feedbackRef.current?.ready || countdownTimer.current) return;
    const seconds = Number(selfTimer);
    if (seconds <= 0) {
      capture();
      return;
    }
    setCaptureMessage("");
    setCountdown(seconds);
    let remaining = seconds;
    countdownTimer.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(countdownTimer.current);
        countdownTimer.current = 0;
        setCountdown(0);
        if (feedbackRef.current?.ready) {
          capture();
        } else {
          setCaptureMessage("Your framing moved. Line up with the guide and try again.");
        }
        return;
      }
      setCountdown(remaining);
    }, 1000);
  };

  const closePhotoReview = () => {
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
    photoUrl.current = "";
    setCapturedPhoto("");
    setShot(false);
  };

  const outfitCue = outfit === "Saree"
    ? "Let the drape fall naturally; keep one hand soft near the pleats."
    : outfit === "Dress"
      ? "Turn three-quarters to let the fabric and waistline move."
      : outfit === "Jacket"
        ? "Keep the shoulder line easy and let one hand touch the cuff."
        : "Choose one relaxed hand position and let the rest of the pose breathe.";

  const placeCue = place === "Steps / stairs"
    ? "Use the step edge as a leading line; keep both feet visible."
    : place === "Garden"
      ? "Find a patch of even light and keep bright details behind you simple."
      : place === "Wall / architecture"
        ? "Leave a little distance from the wall to create depth."
        : "Look for open light and enough space around your outline.";

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><Mark /><span>pose coach</span></a>
        <nav className="topnav">
          <a href="#studio">The studio</a>
          <a href="#approach">Our approach</a>
          <span className="privacy-tag"><i /> On-device guidance</span>
        </nav>
      </header>

      <main>
        <section className="intro">
          <div className="eyebrow"><span>01</span><span>PHOTOGRAPHY, WITH A LITTLE DIRECTION</span></div>
          <h1>Find your frame.<br /><em>Feel like yourself.</em></h1>
          <p className="intro-copy">A thoughtful camera-side companion for the moments you want to remember. Choose a pose, find the light, and let the photograph happen.</p>
          <a className="scroll-link" href="#studio">Step into the studio <b>↘</b></a>
        </section>

        <section id="studio" className="studio-grid">
          <div className="studio-main">
            <div className="section-heading">
              <div>
                <span className="micro-label">THE LIVE STUDIO</span>
                <h2>Make a little room.</h2>
              </div>
              <span className="live-indicator"><i />{camera ? "CAMERA ACTIVE" : "READY WHEN YOU ARE"}</span>
            </div>

            <div ref={stage} className={`camera-stage ${camera ? "is-live" : ""}`}>
              <video ref={video} className="camera-feed" playsInline muted />
              {!camera && (
                <div className="stage-poster">
                  <div className="poster-caption">
                    <span>YOUR NEXT<br />GOOD PHOTO</span>
                    <span>START WITH<br />A BREATH</span>
                  </div>
                  <span className="poster-coordinate">PC / STUDIO 01</span>
                </div>
              )}

              <div className="stage-crop" style={cropStyle}>
                <HumanGuide opacity={guideOpacity} />
                <span className="guide-label">ALIGN WITH THE GUIDE</span>
              </div>

              {countdown > 0 && (
                <div className="capture-countdown" aria-live="assertive" aria-label={`Taking photo in ${countdown} seconds`}>
                  {countdown}
                  <small>GET INTO POSITION</small>
                </div>
              )}

              <div className="stage-meta">
                <span>{camera ? "LIVE / LOCAL CAMERA" : "NO UPLOADS. JUST YOU."}</span>
                <span>{crop} CROP</span>
              </div>

              <div className="stage-controls">
                {!camera ? (
                  <button className="button button-light" onClick={start} disabled={busy}>
                    {busy ? "Opening camera…" : "Open camera"} <b>↗</b>
                  </button>
                ) : (
                  <button className="button button-light" onClick={stop}>Pause camera <b>Ⅱ</b></button>
                )}
                <label className="opacity-control">
                  <span>GUIDE</span>
                  <input
                    aria-label="Reference guide visibility"
                    type="range"
                    min="25"
                    max="90"
                    value={guideOpacity}
                    onChange={(event) => setGuideOpacity(Number(event.target.value))}
                  />
                </label>
              </div>
            </div>

            {error && <div className="inline-alert" role="alert">{error}</div>}

            <div className="feedback-row" aria-live="polite">
              <div className={`feedback-icon ${feedback.ready ? "ready" : ""}`}>
                {feedback.ready ? "✓" : feedback.tracking ? "↗" : "○"}
              </div>
              <div className="feedback-copy">
                <span className="micro-label">
                  {feedback.ready ? "FRAME IS READY" : feedback.tracking ? "LIVE POSITIONING" : "YOUR NEXT STEP"}
                </span>
                <strong>{feedback.title}</strong>
                <p>{feedback.detail}</p>
              </div>
              {feedback.tracking && (
                <div className="score">
                  <strong>{feedback.score}</strong>
                  <span>VISIBILITY</span>
                </div>
              )}
              {camera && (
                <div className="capture-actions">
                  <label className="self-timer-control">
                    <span>SELF TIMER</span>
                    <select value={selfTimer} onChange={(event) => setSelfTimer(event.target.value)} disabled={countdown > 0}>
                      <option value="0">Off</option>
                      <option value="3">3 sec</option>
                      <option value="5">5 sec</option>
                      <option value="10">10 sec</option>
                    </select>
                  </label>
                  <button
                    className="capture-button"
                    onClick={beginCapture}
                    disabled={!feedback.ready || countdown > 0}
                    aria-label={feedback.ready ? "Take photo" : "Align with the guide before taking a photo"}
                  >
                    <span className="shutter-mark" />
                    {countdown > 0 ? `Taking in ${countdown}` : feedback.ready ? "Take photo" : "Align to take photo"}
                  </button>
                </div>
              )}
            </div>
            {captureMessage && <p className="capture-note capture-warning" role="status">{captureMessage}</p>}
            {shot && <p className="capture-note" role="status">Your photo is ready to review. Download it or retake it.</p>}
            <canvas ref={canvas} className="hidden-canvas" />

            {capturedPhoto && (
              <div className="photo-review-backdrop" role="presentation">
                <section className="photo-review" role="dialog" aria-modal="true" aria-labelledby="photo-review-title">
                  <div className="photo-review-heading">
                    <span className="micro-label">YOUR PHOTO / {crop}</span>
                    <button className="review-close" onClick={closePhotoReview} aria-label="Close photo review">×</button>
                  </div>
                  <h3 id="photo-review-title">A moment, just like that.</h3>
                  <img src={capturedPhoto} alt="Your photo captured with Pose Coach" />
                  <p>Your photo is saved locally in this browser session. Nothing is uploaded.</p>
                  <div className="photo-review-actions">
                    <button className="review-retake" onClick={closePhotoReview}>Retake photo</button>
                    <a className="review-download" href={capturedPhoto} download={`pose-coach-${crop.replace(":", "-")}.jpg`}>Download photo ↗</a>
                  </div>
                </section>
              </div>
            )}
          </div>

          <aside className="studio-side">
            <div className="side-block">
              <div className="side-title">
                <span className="micro-label">01 / YOUR DIRECTION</span>
                <span className="step-mark">✳</span>
              </div>
              <div className="segmented">
                <button className={mode === "subject" ? "active" : ""} onClick={() => setMode("subject")}>I'm in the photo</button>
                <button className={mode === "photographer" ? "active" : ""} onClick={() => setMode("photographer")}>I'm taking it</button>
              </div>
              <p className="side-help">
                {mode === "subject"
                  ? "Stand behind the transparent outline and let the camera guide your position."
                  : "Use the outline as a composition reference while you direct the person in front of your lens."}
              </p>
            </div>

            <div className="side-block">
              <div className="side-title">
                <span className="micro-label">02 / PICK A POSE</span>
                <span className="side-count">08</span>
              </div>
              <div className="pose-list">
                {POSES.map((item, index) => (
                  <button
                    key={item.id}
                    className={`pose-option ${pose === item.id ? "selected" : ""}`}
                    onClick={() => setPose(item.id)}
                  >
                    <span className="pose-number">0{index + 1}</span>
                    <span className="pose-name">{item.name}<small>{item.category}</small></span>
                    <span className="pose-arrow">{pose === item.id ? "↗" : "＋"}</span>
                  </button>
                ))}
              </div>
              <div className="pose-detail">
                <span className="micro-label">A SMALL THOUGHT</span>
                <p>{selected.description}</p>
              </div>
            </div>

            <div className="side-block">
              <div className="side-title"><span className="micro-label">03 / THE DETAILS</span></div>
              <label className="field-label">
                What are you wearing?
                <select value={outfit} onChange={(event) => setOutfit(event.target.value)}>
                  <option>Everyday</option><option>Saree</option><option>Dress</option><option>Jacket</option>
                </select>
              </label>
              <label className="field-label">
                Where are you?
                <select value={place} onChange={(event) => setPlace(event.target.value)}>
                  <option>Open space</option><option>Steps / stairs</option><option>Garden</option><option>Wall / architecture</option>
                </select>
              </label>
              <div className="context-note">
                <span>OUTFIT NOTE</span><p>{outfitCue}</p>
                <span>PLACE NOTE</span><p>{placeCue}</p>
              </div>
            </div>

            <div className="side-block crop-block">
              <div className="side-title"><span className="micro-label">04 / FRAME SHAPE</span></div>
              <div className="crop-picker">
                {CROPS.map((item) => (
                  <button key={item.id} className={crop === item.id ? "active" : ""} onClick={() => setCrop(item.id)}>
                    <span className="crop-icon" style={{ aspectRatio: `${item.width}/${item.height}` }} />
                    <strong>{item.label}</strong>
                    <small>{item.note}</small>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section id="approach" className="approach">
          <div className="approach-left">
            <span className="micro-label">A QUIETER KIND OF CAMERA APP</span>
            <h2>Good direction.<br /><em>No judgement.</em></h2>
          </div>
          <div className="approach-right">
            <p>Pose Coach looks for your outline and offers simple framing cues. It is here to make the process feel easier, not to tell you how you should look.</p>
            <div className="promise-grid">
              <div><span>01</span><strong>Your camera stays here.</strong><small>Live frames and pose landmarks are processed in this browser.</small></div>
              <div><span>02</span><strong>No account required.</strong><small>Open the studio and start when you're ready.</small></div>
              <div><span>03</span><strong>Your choice, always.</strong><small>Nothing is captured until you choose Capture.</small></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#"><Mark /><span>pose coach</span></a>
        <span>MADE FOR THE MOMENTS THAT MATTER.</span>
        <a href="/privacy.html">Privacy notes ↗</a>
      </footer>
    </div>
  );
}
