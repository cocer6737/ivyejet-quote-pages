import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = join(root, "site");

for (const file of [
  "index.html",
  ".nojekyll",
  "brand/Image9.png",
  "brand/itinerary-jet.png",
  "aircraft/cabin-01.jpg",
  "downloads/quote-zh.pdf",
  "downloads/quote-zht.pdf",
  "downloads/quote-en.pdf",
  "downloads/quote-zh.txt",
  "downloads/quote-zht.txt",
  "downloads/quote-en.txt"
]) {
  await access(join(site, file));
}

const markup = await readFile(join(site, "index.html"), "utf8");
for (const reference of [
  "/ivyejet-quote-pages/_next/",
  "/ivyejet-quote-pages/downloads/quote-zh.pdf",
  "/ivyejet-quote-pages/downloads/quote-zh.txt"
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
if (!stylesheet.includes("translate(-50%,-50%) rotate(-90deg)")) {
  throw new Error("The centered English itinerary-label rule is missing.");
}

console.log("IVYEJET GitHub Pages export checks passed.");
