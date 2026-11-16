import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const bundleDir = resolve(root, "_source_bundle");
const parts = readdirSync(bundleDir).filter((name) => /^part-\d+\.b64$/.test(name)).sort();
if (parts.length === 0) throw new Error("Pose Coach source bundle is missing.");
const encoded = parts.map((name) => readFileSync(join(bundleDir, name), "utf8").trim()).join("");
const archive = resolve(root, ".pose-coach-source.tar.gz");
writeFileSync(archive, Buffer.from(encoded, "base64"));
execFileSync("tar", ["-xzf", archive, "-C", root], { stdio: "inherit" });
rmSync(archive, { force: true });
rmSync(bundleDir, { recursive: true, force: true });
console.log("Pose Coach application source restored.");
