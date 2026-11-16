export const CROPS = [
  { id: "4:5", label: "4:5", width: 4, height: 5, note: "Portrait" },
  { id: "3:4", label: "3:4", width: 3, height: 4, note: "Classic" },
  { id: "9:16", label: "9:16", width: 9, height: 16, note: "Story" },
  { id: "1:1", label: "1:1", width: 1, height: 1, note: "Square" },
];

export const POSES = [
  { id: "easy", name: "The easy stand", category: "EVERYDAY", description: "Let one knee soften, shift a little weight into the back foot, and keep your shoulders loose." },
  { id: "walk", name: "A step in motion", category: "CANDID", description: "Take a slow step toward the camera. Let your hands move naturally rather than arranging them." },
  { id: "profile", name: "The quiet profile", category: "EDITORIAL", description: "Turn your body three-quarters away, then bring your eyes back toward the light." },
  { id: "sit", name: "The relaxed sit", category: "RELAXED", description: "Sit near the front edge, angle your knees slightly, and lengthen your back without stiffening." },
  { id: "lean", name: "The soft lean", category: "EDITORIAL", description: "Rest one shoulder lightly against a wall. Keep a small gap between your arms and waist." },
  { id: "hands", name: "Hands at ease", category: "DETAIL", description: "Give your hands a simple job: hold a bag, touch a cuff, or brush a strand of hair." },
  { id: "lookback", name: "The look back", category: "CANDID", description: "Turn away from the camera and glance back over one shoulder. Keep the turn gentle." },
  { id: "grounded", name: "Grounded and calm", category: "PORTRAIT", description: "Stand evenly, lengthen through the crown of your head, and let your arms fall naturally." },
];

const CORE_LANDMARKS = [0,  11, 12, 23, 24, 27, 28];
const OPTIONAL_EDGE_LANDMARKS = [15, 16, 27, 28, 31, 32];

export function getCropRect(stageWidth, stageHeight, aspectRatio) {
  if (!stageWidth || !stageHeight || !aspectRatio || aspectRatio <= 0) {
    return { left: 0.1, top: 0.05, width: 0.8, height: 0.9 };
  }
  // This mirrors the camera UI's crop frame: at most 82% of stage height
  // and at most 80% of stage width, always centered.
  const maxHeight = stageHeight * 0.82;
  const maxWidth = stageWidth * 0.8;
  const width = Math.min(maxWidth, maxHeight * aspectRatio);
  const height = width / aspectRatio;
  return {
    left: (stageWidth - width) / (2 * stageWidth),
    top: (stageHeight - height) / (2 * stageHeight),
    width: width / stageWidth,
    height: height / stageHeight,
  };
}

export function createVideoToStageTransform(sourceWidth, sourceHeight, stageWidth, stageHeight, mirrored = true) {
  if (![sourceWidth, sourceHeight, stageWidth, stageHeight].every(Number.isFinite) ||
      sourceWidth <= 0 || sourceHeight <= 0 || stageWidth <= 0 || stageHeight <= 0) {
    return { mapPoint: (point) => ({ x: point.x, y: point.y }) };
  }

  // Match object-fit: cover before applying the preview's horizontal mirror.
  const scale = Math.max(stageWidth / sourceWidth, stageHeight / sourceHeight);
  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;
  const offsetX = (stageWidth - renderedWidth) / 2;
  const offsetY = (stageHeight - renderedHeight) / 2;

  return {
    scale,
    offsetX,
    offsetY,
    renderedWidth,
    renderedHeight,
    mirrored,
    mapPoint(point) {
      const pixelX = point.x * renderedWidth + offsetX;
      const pixelY = point.y * renderedHeight + offsetY;
      return {
        x: (mirrored ? stageWidth - pixelX : pixelX) / stageWidth,
        y: pixelY / stageHeight,
      };
    },
  };
}

export function mapLandmarksToStage(landmarks, transform) {
  if (!Array.isArray(landmarks)) return null;
  return landmarks.map((point) => {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return point;
    return { ...point, ...transform.mapPoint(point) };
  });
}

export function getSourceCropRect(stageRect, transform, sourceWidth, sourceHeight, stageWidth, stageHeight) {
  if (!stageRect || !transform || !transform.scale ||
      ![sourceWidth, sourceHeight, stageWidth, stageHeight].every(Number.isFinite)) {
    return { x: 0, y: 0, width: sourceWidth, height: sourceHeight };
  }

  const leftPx = stageRect.left * stageWidth;
  const rightPx = (stageRect.left + stageRect.width) * stageWidth;
  const topPx = stageRect.top * stageHeight;
  const bottomPx = (stageRect.top + stageRect.height) * stageHeight;

  // Invert the exact cover-and-mirror transform used for the preview overlay.
  const previewLeft = transform.mirrored ? stageWidth - rightPx : leftPx;
  const previewRight = transform.mirrored ? stageWidth - leftPx : rightPx;
  const x = (previewLeft - transform.offsetX) / transform.scale;
  const y = (topPx - transform.offsetY) / transform.scale;
  const right = (previewRight - transform.offsetX) / transform.scale;
  const bottom = (bottomPx - transform.offsetY) / transform.scale;
  const clampedX = Math.max(0, Math.min(sourceWidth, x));
  const clampedY = Math.max(0, Math.min(sourceHeight, y));
  const clampedRight = Math.max(clampedX, Math.min(sourceWidth, right));
  const clampedBottom = Math.max(clampedY, Math.min(sourceHeight, bottom));

  return {
    x: clampedX,
    y: clampedY,
    width: clampedRight - clampedX,
    height: clampedBottom - clampedY,
  };
}

function cropPoint(point, cropRect) {
  return {
    x: (point.x - cropRect.left) / cropRect.width,
    y: (point.y - cropRect.top) / cropRect.height,
  };
}

export function assessFrame(landmarks, cropRect, mode = "subject") {
  if (!Array.isArray(landmarks) || landmarks.length < 29) {
    return {
      tracking: false, ready: false, title: "Step into the guide",
      detail: "Stand far enough back for the camera to see your full body.", score: 0,
    };
  }

  const visible = (index) => {
    const point = landmarks[index];
    return point && (point.visibility ?? 1) > 0.55 && Number.isFinite(point.x) && Number.isFinite(point.y);
  };
  const visibleCore = CORE_LANDMARKS.filter(visible);
  const score = Math.round((visibleCore.length / CORE_LANDMARKS.length) * 100);
  if (visibleCore.length < 6 || !visible(0) || !visible(11) || !visible(12) || !visible(23) || !visible(24)) {
    return {
      tracking: false, ready: false, title: "Finding your full outline",
      detail: "Face the camera and make sure your head, shoulders and hips are visible.", score,
    };
  }

  const rect = cropRect || { left: 0, top: 0, width: 1, height: 1 };
  const local = {};
  for (const index of [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 31, 32]) {
    if (visible(index)) local[index] = cropPoint(landmarks[index], rect);
  }

  if (!visible(27) || !visible(28)) {
    return {
      tracking: true, ready: false, title: "Let the guide see your feet",
      detail: mode === "photographer" ? "Reframe to include both feet before capturing." : "Take a small step back until both feet are visible.", score,
    };
  }

  const head = local[0];
  const shoulderCenter = (local[11].x + local[12].x) / 2;
  const hipCenter = (local[23].x + local[24].x) / 2;
  const centerX = (shoulderCenter + hipCenter) / 2;
  const top = head.y;
  const bottom = Math.max(local[27].y, local[28].y);
  const bodyHeight = bottom - top;
  const shoulderTilt = Math.abs(
    Math.atan2(
      local[12].y - local[11].y,
      Math.max(0.0001, Math.abs(local[12].x - local[11].x)),
    ) * (180 / Math.PI),
  );

  const edgePoints = OPTIONAL_EDGE_LANDMARKS.filter((index) => local[index]);
  const outerLeft = Math.min(
    local[11].x, local[12].x, local[23].x, local[24].x,
    ...edgePoints.map((index) => local[index].x),
  );
  const outerRight = Math.max(
    local[11].x, local[12].x, local[23].x, local[24].x,
    ...edgePoints.map((index) => local[index].x),
  );

  let title = "You're in the frame";
  let detail = "Your position fits the guide. Relax your shoulders and take a breath.";
  let ready = true;

  if (shoulderTilt > 12) {
    title = "Level the camera";
    detail = "Your shoulder line looks tilted. Straighten the phone slightly, then relax your shoulders.";
    ready = false;
  } else if (top < 0.035) {
    title = "Give your head a little room";
    detail = mode === "photographer" ? "Tilt the camera slightly up to include more space above the head." : "Reframe slightly higher so there is a little space above your head.";
    ready = false;
  } else if (top > 0.19) {
    title = "Move up into the guide";
    detail = "Raise the camera framing slightly so your full silhouette sits comfortably in the guide.";
    ready = false;
  } else if (bottom > 0.985) {
    title = "Keep both feet in the frame";
    detail = mode === "photographer" ? "Tilt the camera slightly down to include the feet." : "Reframe slightly lower until both feet have a little breathing room.";
    ready = false;
  } else if (bottom < 0.76 || bodyHeight < 0.64) {
    title = "Come a little closer";
    detail = mode === "photographer" ? "Move the camera or subject closer so the person fills more of the guide." : "Take a small step toward the camera to fill the guide.";
    ready = false;
  } else if (bodyHeight > 0.96) {
    title = "Create a little more space";
    detail = mode === "photographer" ? "Move the camera back to leave room around the full body." : "Take a small step back so your full body fits comfortably.";
    ready = false;
  } else if (centerX < 0.39 || centerX > 0.61) {
    title = "Move toward the middle of the guide";
    detail = mode === "photographer" ? "Reposition the camera or subject so the body sits in the center of the guide." : "Shift gently toward the center of the transparent outline.";
    ready = false;
  } else if (outerLeft < 0.015 || outerRight > 0.985) {
    title = "Bring your outline inside the frame";
    detail = "Keep your arms relaxed and leave a little space at both sides.";
    ready = false;
  } else if (bodyHeight < 0.75) {
    title = "Fill a little more of the guide";
    detail = "Move a little closer while keeping your head and feet inside the frame.";
    ready = false;
  }

  return { tracking: true, ready, title, detail, score };
}
