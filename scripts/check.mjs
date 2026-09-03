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

console.log("IVYEJET GitHub Pages export checks passed.");
