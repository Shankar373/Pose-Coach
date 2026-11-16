export const CROPS = [
  { id: "4:5", label: "4:5", width: 4, height: 5, note: "Portrait" },
  { id: "3:4", label: "3:4", width: 3, height: 4, note: "Classic" },
  { id: "9:16", label: "9:16", width: 9, height: 16, note: "Story" },
  { id: "1:1", label: "1:1", width: 1, height: 1, note: "Square" },
];

export const POSES = [
  {
    id: "easy", name: "The easy stand", category: "EVERYDAY",
    description: "A relaxed starting point that moves from a soft stance into a more expressive portrait.",
    phases: [
      { title: "Find your base", action: "Stand softly", instruction: "Let your feet settle under your hips. Keep your knees unlocked and let your arms fall naturally.", guide: { head: 0, torso: 0, leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0 } },
      { title: "Shift your weight", action: "Shift and soften", instruction: "Move your weight into one leg. Let the opposite knee bend slightly and allow your shoulders to follow.", guide: { head: -2, torso: -4, leftArm: 7, rightArm: -9, leftLeg: 9, rightLeg: -4 } },
      { title: "Turn into the light", action: "Turn toward the light", instruction: "Rotate your shoulders a little, bring your chin toward the light and let one hand rest loosely by your side.", guide: { head: 13, torso: -9, leftArm: 2, rightArm: -17, leftLeg: 3, rightLeg: -3 } },
    ],
  },
  {
    id: "walk", name: "A step in motion", category: "CANDID",
    description: "A three-beat walking sequence. Keep moving gently instead of freezing in one pose.",
    phases: [
      { title: "Prepare the step", action: "Prepare to move", instruction: "Place one foot slightly behind you. Let the opposite arm move forward; keep your shoulders loose.", guide: { head: 0, torso: -2, leftArm: -17, rightArm: 17, leftLeg: 12, rightLeg: -12 } },
      { title: "Take the step", action: "Take one slow step", instruction: "Walk slowly toward the camera. Let your arms swing naturally in opposition to your legs.", guide: { head: 2, torso: 3, leftArm: 19, rightArm: -19, leftLeg: -16, rightLeg: 17 } },
      { title: "Catch the pause", action: "Pause mid-movement", instruction: "Let your front foot land, soften the back knee and pause for a candid frame without stopping your breath.", guide: { head: 4, torso: 0, leftArm: 8, rightArm: -7, leftLeg: 5, rightLeg: -4 } },
    ],
  },
  {
    id: "profile", name: "The quiet profile", category: "EDITORIAL",
    description: "Turn through a natural three-quarter angle, then bring your attention back to the camera.",
    phases: [
      { title: "Turn three-quarters", action: "Turn three-quarters", instruction: "Rotate your body away from the camera. Keep your feet grounded and let the shoulder nearest the camera move slightly forward.", guide: { head: -10, torso: -14, leftArm: -7, rightArm: 11, leftLeg: -5, rightLeg: 5 } },
      { title: "Find the light", action: "Find the light", instruction: "Keep your body turned. Slowly bring your face toward the brightest soft light without lifting your chin too high.", guide: { head: 12, torso: -17, leftArm: -2, rightArm: 7, leftLeg: -4, rightLeg: 4 } },
      { title: "Hold the profile", action: "Hold the profile", instruction: "Lengthen through the crown of your head, relax your hands and hold the angle for one calm frame.", guide: { head: 20, torso: -19, leftArm: -4, rightArm: 5, leftLeg: -3, rightLeg: 3 } },
    ],
  },
  {
    id: "sit", name: "The relaxed sit", category: "RELAXED",
    description: "A seated sequence with a gentle leg angle and relaxed upper body.",
    phases: [
      { title: "Find your seat", action: "Sit near the edge", instruction: "Sit near the front edge of a bench or chair. Keep your back long and place both feet comfortably on the ground.", guide: { head: 0, torso: -3, leftArm: -8, rightArm: 8, leftLeg: 42, rightLeg: 52 } },
      { title: "Angle your knees", action: "Angle your knees", instruction: "Turn both knees slightly to one side. Keep a little space between your feet and let your hands rest loosely.", guide: { head: 2, torso: -8, leftArm: -18, rightArm: 15, leftLeg: 58, rightLeg: 43 } },
      { title: "Relax into the frame", action: "Relax into the frame", instruction: "Lean forward just a touch from your hips, soften your shoulders and look just past the camera.", guide: { head: 8, torso: -12, leftArm: -25, rightArm: 20, leftLeg: 52, rightLeg: 48 } },
    ],
  },
  {
    id: "lean", name: "The soft lean", category: "EDITORIAL",
    description: "Use a wall or column as a light prop while the body moves through three easy positions.",
    phases: [
      { title: "Meet the wall", action: "Find a light lean", instruction: "Rest one shoulder lightly against the wall. Keep your weight mostly on your outside leg.", guide: { head: 0, torso: -10, leftArm: 20, rightArm: -5, leftLeg: 8, rightLeg: -4 } },
      { title: "Create a line", action: "Create a long line", instruction: "Place one foot slightly forward and let the opposite hand rest near your pocket or hip.", guide: { head: -3, torso: -14, leftArm: 29, rightArm: -18, leftLeg: 13, rightLeg: -7 } },
      { title: "Turn your face", action: "Turn toward the lens", instruction: "Keep the lean, turn your face toward the camera and relax the hand closest to the wall.", guide: { head: 15, torso: -9, leftArm: 18, rightArm: -8, leftLeg: 8, rightLeg: -4 } },
    ],
  },
  {
    id: "hands", name: "Hands at ease", category: "DETAIL",
    description: "Give your hands a natural task, then change the hand position for a second frame.",
    phases: [
      { title: "Give one hand a place", action: "Rest one hand at your waist", instruction: "Rest one hand loosely near your waist or pocket. Keep the elbow soft rather than sharply pointed.", guide: { head: 0, torso: 0, leftArm: -34, rightArm: 5, leftLeg: 0, rightLeg: 0 } },
      { title: "Add a small detail", action: "Touch a cuff or drape", instruction: "Let the other hand lightly touch a cuff, bag strap or saree drape. Avoid gripping the fabric.", guide: { head: 4, torso: -3, leftArm: -38, rightArm: 27, leftLeg: 2, rightLeg: -2 } },
      { title: "Let the hands fall", action: "Release the hands", instruction: "Release both hands slowly and let them settle. Keep a little space between your arms and waist.", guide: { head: 0, torso: 2, leftArm: -12, rightArm: 13, leftLeg: 0, rightLeg: 0 } },
    ],
  },
  {
    id: "lookback", name: "The look back", category: "CANDID",
    description: "A small turn into a glance over the shoulder, designed to feel caught rather than staged.",
    phases: [
      { title: "Turn away", action: "Turn away from camera", instruction: "Turn your shoulders away from the lens. Keep your feet steady and let your arms follow naturally.", guide: { head: -8, torso: -17, leftArm: -5, rightArm: 8, leftLeg: -4, rightLeg: 4 } },
      { title: "Look back", action: "Look back over a shoulder", instruction: "Bring your gaze back over the shoulder closest to the light. Keep your chin level and your neck relaxed.", guide: { head: 26, torso: -19, leftArm: -4, rightArm: 8, leftLeg: -4, rightLeg: 4 } },
      { title: "Hold the glance", action: "Hold the glance", instruction: "Pause for a beat, soften your eyes and let the rest of your body stay turned away.", guide: { head: 34, torso: -17, leftArm: -7, rightArm: 9, leftLeg: -4, rightLeg: 4 } },
    ],
  },
  {
    id: "grounded", name: "Grounded and calm", category: "PORTRAIT",
    description: "A confident stance that opens through the feet, shoulders and hands.",
    phases: [
      { title: "Set your stance", action: "Set your feet", instruction: "Place your feet a little wider than your hips. Keep your weight balanced instead of locking your knees.", guide: { head: 0, torso: 0, leftArm: 0, rightArm: 0, leftLeg: 13, rightLeg: -13 } },
      { title: "Open the shoulders", action: "Open your shoulders", instruction: "Let your shoulders settle back and down. Keep your chest open without pushing it forward.", guide: { head: -2, torso: 3, leftArm: 8, rightArm: -8, leftLeg: 17, rightLeg: -17 } },
      { title: "Finish with ease", action: "Finish with ease", instruction: "Shift gently into one hip, let one hand move naturally and look toward the camera.", guide: { head: 12, torso: -4, leftArm: 3, rightArm: -13, leftLeg: 10, rightLeg: -6 } },
    ],
  },
];

export function getPosePhase(poseId, phaseIndex = 0) {
  const pose = POSES.find((item) => item.id === poseId) || POSES[0];
  const phases = pose.phases || [];
  return phases.length ? phases[((phaseIndex % phases.length) + phases.length) % phases.length] : null;
}

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


const PLACE_POSE_ORDER = {
  "Open space": ["easy", "grounded", "walk", "lookback", "profile"],
  "Steps / stairs": ["sit", "walk", "grounded", "lookback"],
  "Garden": ["walk", "lookback", "profile", "easy"],
  "Wall / architecture": ["lean", "profile", "hands", "lookback"],
  "Bench / seating": ["sit", "hands", "lookback", "easy"],
  "Railing / balcony": ["lean", "profile", "lookback", "grounded"],
  "Monument / architecture": ["grounded", "profile", "walk", "lookback"],
};

const OUTFIT_POSE_ORDER = {
  Everyday: ["easy", "walk", "grounded", "lookback"],
  Saree: ["profile", "hands", "lookback", "grounded"],
  Dress: ["walk", "profile", "lookback", "sit"],
  Jacket: ["lean", "grounded", "hands", "profile"],
};

/**
 * Deterministic context-aware pose rotation. It combines location and outfit
 * preferences, removes duplicates, and returns the next distinct pose.
 */
export function getNextRecommendedPose(outfit = "Everyday", place = "Open space", currentPoseId = "easy") {
  const contextualOrder = [
    ...(PLACE_POSE_ORDER[place] || PLACE_POSE_ORDER["Open space"]),
    ...(OUTFIT_POSE_ORDER[outfit] || OUTFIT_POSE_ORDER.Everyday),
  ].filter((id, index, all) => all.indexOf(id) === index);
  const order = contextualOrder.length ? contextualOrder : POSES.map((item) => item.id);
  const currentIndex = order.indexOf(currentPoseId);
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % order.length;
  const nextId = order[nextIndex];
  return POSES.find((item) => item.id === nextId) || POSES[0];
}
