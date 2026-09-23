// Inlines the Vite build's CSS and JS into dist/inline.html for the iOS shell.
import { readFileSync, writeFileSync } from "node:fs";

const dist = new URL("../dist/", import.meta.url);
const read = (path) => readFileSync(new URL(path, dist), "utf8");

const html = read("index.html")
  .replace(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g, (_, path) => `<style>${read(path)}</style>`)
  .replace(/<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/g, (_, path) => `<script type="module">${read(path)}</script>`);

if (/(src|href)="\.\/assets\//.test(html)) throw new Error("Unresolved asset reference in inline.html");
writeFileSync(new URL("inline.html", dist), html);
console.log(`Wrote dist/inline.html (${html.length} bytes)`);
