import test from "node:test";
import assert from "node:assert/strict";
import {
  CROPS,
  POSES,
  assessFrame,
  createVideoToStageTransform,
  getCropRect,
  getSourceCropRect,
  mapLandmarksToStage,
} from "../src/pose-engine.js";

function sample(cropRect, { center = 0.5, headY = 0.08, ankleY = 0.94 } = {}) {
  const point = (x, y, visibility = 0.95) => ({
    x: cropRect.left + x * cropRect.width,
    y: cropRect.top + y * cropRect.height,
    visibility,
  });
  const landmarks = Array.from({ length: 33 }, () => point(center, 0.5));
  landmarks[0] = point(center, headY, 0.98);
  landmarks[11] = point(center - 0.14, 0.28, 0.98);
  landmarks[12] = point(center + 0.14, 0.28, 0.98);
  landmarks[13] = point(center - 0.19, 0.39);
  landmarks[14] = point(center + 0.19, 0.39);
  landmarks[15] = point(center - 0.22, 0.50);
  landmarks[16] = point(center + 0.22, 0.50);
  landmarks[23] = point(center - 0.10, 0.55, 0.98);
  landmarks[24] = point(center + 0.10, 0.55, 0.98);
  landmarks[25] = point(center - 0.10, 0.73, 0.98);
  landmarks[26] = point(center + 0.10, 0.73, 0.98);
  landmarks[27] = point(center - 0.10, ankleY, 0.98);
  landmarks[28] = point(center + 0.10, ankleY, 0.98);
  landmarks[31] = point(center - 0.12, Math.min(0.98, ankleY + 0.02));
  landmarks[32] = point(center + 0.12, Math.min(0.98, ankleY + 0.02));
  return landmarks;
}

const standardCrop = getCropRect(1000, 750, 4 / 5);

test("eight curated poses and four crop presets remain available", () => {
  assert.equal(POSES.length, 8);
  assert.deepEqual(CROPS.map((crop) => crop.id), ["4:5", "3:4", "9:16", "1:1"]);
});

test("crop frame is centered and preserves each selected aspect ratio", () => {
  for (const crop of CROPS) {
    const rect = getCropRect(1000, 750, crop.width / crop.height);
    assert.ok(Math.abs(rect.left + rect.width / 2 - 0.5) < 1e-9);
    assert.ok(Math.abs(rect.top + rect.height / 2 - 0.5) < 1e-9);
    assert.ok(Math.abs((rect.width * 1000) / (rect.height * 750) - crop.width / crop.height) < 1e-9);
    assert.ok(rect.width <= 0.800001);
    assert.ok(rect.height <= 0.820001);
  }
});

test("cover transform accounts for video crop and front-camera mirroring", () => {
  const transform = createVideoToStageTransform(1280, 720, 400, 500, true);
  const center = transform.mapPoint({ x: 0.5, y: 0.5 });
  const leftOfCenter = transform.mapPoint({ x: 0.4, y: 0.5 });
  assert.ok(Math.abs(center.x - 0.5) < 1e-9);
  assert.ok(Math.abs(center.y - 0.5) < 1e-9);
  assert.ok(leftOfCenter.x > 0.5, "mirrored preview should reverse horizontal direction");
  assert.ok(leftOfCenter.y >= 0 && leftOfCenter.y <= 1);
});

test("landmark mapping preserves confidence while transforming coordinates", () => {
  const transform = createVideoToStageTransform(1280, 720, 400, 500, true);
  const mapped = mapLandmarksToStage([{ x: 0.4, y: 0.5, visibility: 0.9 }], transform);
  assert.equal(mapped[0].visibility, 0.9);
  assert.ok(mapped[0].x > 0.5);
});

test("source photo crop is the inverse of the visible mirrored composition guide", () => {
  const sourceWidth = 1280;
  const sourceHeight = 720;
  const stageWidth = 400;
  const stageHeight = 500;
  const transform = createVideoToStageTransform(sourceWidth, sourceHeight, stageWidth, stageHeight, true);
  const guide = getCropRect(stageWidth, stageHeight, 4 / 5);
  const sourceCrop = getSourceCropRect(
    guide,
    transform,
    sourceWidth,
    sourceHeight,
    stageWidth,
    stageHeight,
  );

  assert.ok(sourceCrop.x >= 0 && sourceCrop.y >= 0);
  assert.ok(sourceCrop.x + sourceCrop.width <= sourceWidth + 1e-6);
  assert.ok(sourceCrop.y + sourceCrop.height <= sourceHeight + 1e-6);
  assert.ok(Math.abs(sourceCrop.width / sourceCrop.height - 4 / 5) < 1e-9);

  const leftStageEdge = transform.mapPoint({ x: (sourceCrop.x + sourceCrop.width) / sourceWidth, y: 0.5 });
  const rightStageEdge = transform.mapPoint({ x: sourceCrop.x / sourceWidth, y: 0.5 });
  assert.ok(Math.abs(leftStageEdge.x - (guide.left + guide.width)) < 1e-9);
  assert.ok(Math.abs(rightStageEdge.x - guide.left) < 1e-9);
});

test("a visibly tilted shoulder line requests a gentle camera-level adjustment", () => {
  const landmarks = sample(standardCrop);
  landmarks[12].y += standardCrop.height * 0.12;
  const result = assessFrame(landmarks, standardCrop);
  assert.equal(result.ready, false);
  assert.match(result.title, /level/i);
});

test("full-body position aligned with the reference guide is capture-ready", () => {
  const result = assessFrame(sample(standardCrop), standardCrop);
  assert.equal(result.ready, true);
  assert.match(result.title, /frame/i);
});

test("off-centre subject is asked to move toward the centre of the guide", () => {
  const result = assessFrame(sample(standardCrop, { center: 0.22 }), standardCrop, "subject");
  assert.equal(result.ready, false);
  assert.match(result.title, /middle/i);
});

test("feet outside the selected crop cannot pass the shutter gate", () => {
  const result = assessFrame(sample(standardCrop, { ankleY: 0.995 }), standardCrop);
  assert.equal(result.ready, false);
  assert.match(result.title, /feet/i);
});

test("subject too small in the guide is asked to come closer", () => {
  const result = assessFrame(sample(standardCrop, { headY: 0.18, ankleY: 0.78 }), standardCrop);
  assert.equal(result.ready, false);
  assert.match(result.title, /closer|guide/i);
});

test("missing landmarks cannot pass the shutter gate", () => {
  assert.equal(assessFrame(null, standardCrop).ready, false);
});

test("landmarks with insufficient body visibility cannot pass the shutter gate", () => {
  const landmarks = sample(standardCrop);
  for (const index of [0, 11, 12, 23, 24, 27, 28]) {
    landmarks[index].visibility = 0.1;
  }
  assert.equal(assessFrame(landmarks, standardCrop).ready, false);
});
