import { getRequestListener } from "@hono/node-server";
import { createAnthropicProvider } from "../src/gen/anthropic";
import { createOpenRouterProvider } from "../src/gen/openrouter";
import { createMockProvider } from "../src/gen/mock";
import { MODELS, requirePricing } from "../src/config";
import { SEED_POSES } from "../src/seeds/library";
import { createApp } from "../server/app";
import type { ServerConfig } from "../server/config";
import { ProviderError } from "../src/gen/provider";

const env = process.env;
const openRouterKey = env.OPENROUTER_API_KEY?.trim();
const anthropicKey = env.ANTHROPIC_API_KEY?.trim();
const provider: ServerConfig["provider"] = openRouterKey
  ? "openrouter"
  : anthropicKey
    ? "anthropic"
    : "mock";
const model = env.POSE_MODEL_DEFAULT?.trim() || MODELS.default;
requirePricing(model);

const numberSetting = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const config: ServerConfig = {
  port: 3000,
  provider,
  model,
  ...(openRouterKey ? { openRouterApiKey: openRouterKey } : {}),
  ...(anthropicKey ? { anthropicApiKey: anthropicKey } : {}),
  trustProxy: true,
  posesPerMinute: numberSetting(env.RATE_LIMIT_POSES_PER_MIN, 4),
  scenePerMinute: 0,
  posesPerMinuteTotal: numberSetting(env.RATE_LIMIT_POSES_TOTAL_PER_MIN, 40),
  scenePerMinuteTotal: 0,
  posesDailyQuota: numberSetting(env.RATE_LIMIT_POSES_DAILY, 40),
  sceneDailyQuota: 0,
};

const sceneProviderUnavailable = {
  name: "unavailable",
  async check() {
    throw new ProviderError("auth", "Public photo scanning is disabled. Describe your outfit and location instead.");
  },
};

const poseProvider = provider === "openrouter"
  ? createOpenRouterProvider(openRouterKey!)
  : provider === "anthropic"
    ? createAnthropicProvider()
    : createMockProvider({ seeds: SEED_POSES, faults: false });

const app = createApp({
  config,
  seeds: SEED_POSES,
  poseProvider,
  sceneProvider: sceneProviderUnavailable,
  logError: (message) => console.error(`[pose-coach] ${message}`),
});

// Vercel's Node function adapter keeps the Hono API on the same origin as the Vite app.
export default getRequestListener(app.fetch);
