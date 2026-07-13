#!/usr/bin/env node
/**
 * JD Infra image generation via Nano Banana Pro (Gemini 3 Pro Image).
 *
 * Usage:
 *   npm run generate:images                          # all missing
 *   npm run generate:images -- --force               # regenerate all
 *   npm run generate:images -- --only=doorsnede-straat --force
 *
 * Requires GEMINI_API_KEY (shell-env in ~/.zshrc of lokale .env).
 */

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "public", "images", "jd-infra", "generated");

if (!process.env.GEMINI_API_KEY) {
  console.error("\x1b[31mGEMINI_API_KEY is not set.\x1b[0m Add to ~/.zshrc: export GEMINI_API_KEY=AIza...");
  process.exit(1);
}

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BRAND = [
  "Photorealistic, sharp, realistic materials and textures, neutral daylight.",
  "No people, no text, no labels, no logos, no watermarks, no captions.",
].join(" ");

const IMAGES = [
  {
    name: "doorsnede-straat",
    prompt:
      "Photorealistic architectural cutaway cross-section, straight side view, of a Dutch residential street construction, like a clean museum diagram with a flat vertical cut face. " +
      "From top to bottom, clearly separated horizontal layers: 1) a top layer of tightly laid anthracite-grey concrete paver bricks seen on edge, 2) a thin pale bedding-sand layer, 3) a thick layer of grey crushed-rock gravel foundation, 4) a compacted yellow-brown sand sub-base. " +
      "Deep down in the lower sand sub-base on the right side, well BELOW the grey gravel foundation with a clear band of sand between the gravel and the pipe, a large round grey concrete sewer pipe shown in cross-section (the pipe must not touch the gravel layer). Near the bottom a faint horizontal groundwater line with slightly darker damp sand beneath it. " +
      "Above the paving a thin strip showing the finished street surface and a hint of soft sky. Clean, educational, precise, wide 4:3 composition.",
  },
  {
    name: "verband-halfsteens",
    prompt:
      "Top-down flat lay, camera directly overhead looking straight down, photorealistic anthracite-grey concrete paving bricks laid in a halfsteens running bond (each row offset by half a brick), " +
      "narrow fine sand joints, even outdoor daylight, crisp sharp detail, the pattern fills the entire square 1:1 frame edge to edge.",
  },
  {
    name: "verband-blok",
    prompt:
      "Top-down flat lay, camera directly overhead looking straight down, photorealistic square anthracite-grey concrete paving tiles laid in a perfectly aligned grid (stack bond): every joint lines up in straight continuous horizontal and vertical lines, like graph paper, no offset, no diagonal, no herringbone. " +
      "Narrow fine sand joints, even outdoor daylight, crisp sharp detail, the pattern fills the entire square 1:1 frame edge to edge.",
  },
  {
    name: "verband-visgraat",
    prompt:
      "Top-down flat lay, camera directly overhead looking straight down, photorealistic anthracite-grey concrete paving bricks laid in a 90-degree herringbone pattern (visgraat), interlocking perpendicular bricks, " +
      "narrow fine sand joints, even outdoor daylight, crisp sharp detail, the pattern fills the entire square 1:1 frame edge to edge.",
  },
  {
    name: "verband-keper",
    prompt:
      "Top-down flat lay, camera directly overhead looking straight down, photorealistic anthracite-grey concrete paving bricks laid in a 45-degree herringbone pattern (keperverband), interlocking bricks running diagonally at 45 degrees, " +
      "narrow fine sand joints, even outdoor daylight, crisp sharp detail, the pattern fills the entire square 1:1 frame edge to edge.",
  },
];

const filtered = ONLY ? IMAGES.filter((i) => i.name === ONLY) : IMAGES;
if (ONLY && filtered.length === 0) {
  console.error(`No image named "${ONLY}".`);
  process.exit(1);
}

async function generateOne({ name, prompt }) {
  const outPath = path.join(OUTPUT_DIR, `${name}.png`);
  if (fs.existsSync(outPath) && !FORCE) {
    console.log(`skip (exists): ${name}.png`);
    return { name, status: "skip" };
  }
  console.log(`generating: ${name}`);
  const t0 = Date.now();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: `${BRAND}\n\n${prompt}`,
    });
    const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) {
      console.warn(`  no image data returned for ${name}`);
      return { name, status: "empty" };
    }
    const buffer = Buffer.from(part.inlineData.data, "base64");
    fs.writeFileSync(outPath, buffer);
    console.log(`saved: ${name}.png (${(buffer.length / 1024).toFixed(0)} KB, ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    return { name, status: "ok" };
  } catch (err) {
    console.error(`failed: ${name}  ${err.message}`);
    return { name, status: "error" };
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const results = [];
  for (const img of filtered) results.push(await generateOne(img));
  const ok = results.filter((r) => r.status === "ok").length;
  const fail = results.filter((r) => r.status !== "ok" && r.status !== "skip").length;
  console.log(`\nDone: ${ok} generated, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main();
