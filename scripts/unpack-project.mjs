import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const bundleDir = resolve(root, "_source_bundle");
const parts = readdirSync(bundleDir)
  .filter((name) => /^part-\d+\.b64$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]));
if (parts.length < 10) throw new Error("Pose Coach source bundle is incomplete.");
const encoded = parts.map((name) => readFileSync(join(bundleDir, name), "utf8").trim()).join("");
const archive = resolve(root, ".pose-coach-source.tar.gz");
const bytes = Buffer.from(encoded, "base64");
if (bytes.length < 100_000 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
  throw new Error("Pose Coach source bundle failed its gzip integrity check.");
}
writeFileSync(archive, bytes);
execFileSync("tar", ["-xzf", archive, "-C", root], { stdio: "inherit" });
rmSync(archive, { force: true });
rmSync(bundleDir, { recursive: true, force: true });
console.log("Pose Coach source restored from the release bundle.");
