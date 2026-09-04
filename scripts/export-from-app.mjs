import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoot = resolve(repositoryRoot, "../ivyejet-quote-site");
const siteRoot = join(repositoryRoot, "site");
const stagingRoot = await mkdtemp(join(tmpdir(), "ivyejet-pages-"));
const basePath = "/ivyejet-quote-pages";
const origin = process.env.IVYEJET_EXPORT_ORIGIN || "http://127.0.0.1:3100";

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to export ${url}: ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function writeBytes(relativePath, bytes) {
  const target = join(stagingRoot, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
}

try {
  const markup = await fetchBytes(`${origin}${basePath}/`);
  await writeBytes("index.html", markup);
  await writeFile(join(stagingRoot, ".nojekyll"), "");
  await cp(join(sourceRoot, ".next", "static"), join(stagingRoot, "_next", "static"), { recursive: true });
  await cp(join(sourceRoot, "public", "brand"), join(stagingRoot, "brand"), { recursive: true });
  await cp(join(sourceRoot, "public", "aircraft"), join(stagingRoot, "aircraft"), { recursive: true });

  for (const lang of ["zh", "zht", "en"]) {
    for (const currency of ["USD", "CNY"]) {
      for (const format of ["pdf", "txt"]) {
        const url = `${origin}${basePath}/api/public/quotes/demo-hgh-dad-2026/download?format=${format}&lang=${lang}&currency=${currency}`;
        await writeBytes(`downloads/quote-${lang}-${currency.toLowerCase()}.${format}`, await fetchBytes(url));
      }
    }
  }

  const fallback = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${basePath}/"><title>IVYEJET Quote</title></head><body><a href="${basePath}/">返回报价页</a></body></html>`;
  await writeFile(join(stagingRoot, "404.html"), fallback);

  await rm(siteRoot, { recursive: true, force: true });
  await cp(stagingRoot, siteRoot, { recursive: true });

  const exportedMarkup = await readFile(join(siteRoot, "index.html"), "utf8");
  if (!exportedMarkup.includes(`${basePath}/downloads/quote-zh-usd.pdf`)) {
    throw new Error("Static download paths were not embedded in the exported page.");
  }
  console.log(`Exported IVYEJET quote to ${siteRoot}`);
} finally {
  await rm(stagingRoot, { recursive: true, force: true });
}
