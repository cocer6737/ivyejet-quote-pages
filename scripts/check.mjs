import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = join(root, "site");

for (const file of [
  "index.html",
  ".nojekyll",
  "brand/Image9.png",
  "brand/ivyejet-slogan-white.png",
  "brand/itinerary-jet.png",
  "aircraft/cabin-01.jpg",
  "downloads/quote-zh-usd.pdf",
  "downloads/quote-zht-usd.pdf",
  "downloads/quote-en-usd.pdf",
  "downloads/quote-zh-usd.txt",
  "downloads/quote-zht-usd.txt",
  "downloads/quote-en-usd.txt",
  "downloads/quote-zh-cny.pdf",
  "downloads/quote-zht-cny.pdf",
  "downloads/quote-en-cny.pdf",
  "downloads/quote-zh-cny.txt",
  "downloads/quote-zht-cny.txt",
  "downloads/quote-en-cny.txt"
]) {
  await access(join(site, file));
}

const markup = await readFile(join(site, "index.html"), "utf8");
for (const reference of [
  "/ivyejet-quote-pages/_next/",
  "/ivyejet-quote-pages/downloads/quote-zh-usd.pdf",
  "/ivyejet-quote-pages/downloads/quote-zh-usd.txt",
  "方案一",
  "吸烟",
  "查看完整图片"
]) {
  if (!markup.includes(reference)) {
    throw new Error(`Static quote is missing ${reference}.`);
  }
}

if (markup.includes("/api/public/")) {
  throw new Error("Static quote still points to a server-only API route.");
}

if (!markup.includes('<span class="mobile-label">文字</span>')) {
  throw new Error("The mobile text-download control is missing.");
}

const cssReference = markup.match(/href="(\/ivyejet-quote-pages\/_next\/static\/css\/[^"]+\.css)"/)?.[1];
if (!cssReference) {
  throw new Error("The quote stylesheet reference is missing.");
}
const stylesheet = await readFile(join(site, cssReference.replace("/ivyejet-quote-pages/", "")), "utf8");
if (!stylesheet.includes("translate(-50%,-50%) rotate(90deg)")) {
  throw new Error("The centered itinerary barcode rule is missing.");
}

console.log("IVYEJET GitHub Pages export checks passed.");
