#!/usr/bin/env node
// md-cover — Fetch Pexels cover images and patch Markdown/MDX frontmatter automatically.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const args = process.argv.slice(2);
const inlineFlag = args.indexOf("--inline");
const inlineName = inlineFlag === -1 ? null : args[inlineFlag + 1];
if (inlineFlag !== -1) args.splice(inlineFlag, 2);

const [slug, query, indexArg = "0"] = args;
if (!slug || !query || slug === "--help" || slug === "-h") {
  console.log(`Usage:
  md-cover <slug> "<search query>" [resultIndex]
    Saves public/blog/<slug>/cover.jpg and writes cover + attribution fields into content/posts/<slug>.md frontmatter.

  md-cover <slug> "<search query>" [resultIndex] --inline <name>
    Saves public/blog/<slug>/<name>.jpg and prints a ready-to-paste Markdown image + photographer credit.`);
  process.exit(slug ? 0 : 1);
}

const root = process.cwd();
for (const envName of [".env.local", ".env"]) {
  const envFile = path.join(root, envName);
  if (!process.env.PEXELS_API_KEY && fs.existsSync(envFile)) {
    const line = fs
      .readFileSync(envFile, "utf8")
      .split("\n")
      .find((l) => l.startsWith("PEXELS_API_KEY="));
    if (line) {
      process.env.PEXELS_API_KEY = line.slice("PEXELS_API_KEY=".length).replace(/^["']|["']$/g, "");
    }
  }
}

const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) {
  console.error("Error: PEXELS_API_KEY is not set in environment or .env.local");
  process.exit(1);
}

const postsDir = process.env.MD_COVER_POSTS_DIR || path.join(root, "content", "posts");
const postPath = fs.existsSync(path.join(postsDir, `${slug}.mdx`))
  ? path.join(postsDir, `${slug}.mdx`)
  : path.join(postsDir, `${slug}.md`);

if (!fs.existsSync(postPath)) {
  console.error(`No post found at ${postPath}`);
  process.exit(1);
}

const url = new URL("https://api.pexels.com/v1/search");
url.searchParams.set("query", query);
url.searchParams.set("orientation", "landscape");
url.searchParams.set("per_page", "15");

const res = await fetch(url, { headers: { Authorization: apiKey } });
if (!res.ok) {
  console.error(`Pexels API error (${res.status}): ${await res.text()}`);
  process.exit(1);
}

const { photos } = await res.json();
const photo = photos?.[Number(indexArg)];
if (!photo) {
  console.error(`No result #${indexArg} for "${query}" (${photos?.length ?? 0} results).`);
  process.exit(1);
}

const imageUrl = `${photo.src.original}?auto=compress&cs=tinysrgb&fm=jpg&fit=crop&w=1600&h=840`;
const image = await fetch(imageUrl);
if (!image.ok) {
  console.error(`Image download failed: ${image.status}`);
  process.exit(1);
}

const outDir = path.join(root, "public", "blog", slug);
fs.mkdirSync(outDir, { recursive: true });
const fileName = `${inlineName ?? "cover"}.jpg`;
fs.writeFileSync(path.join(outDir, fileName), Buffer.from(await image.arrayBuffer()));

if (inlineName) {
  const alt = (photo.alt?.trim() || query).replace(/[[\]]/g, "");
  console.log(
    `![${alt}](/blog/${slug}/${fileName})\n*Photo by [${photo.photographer}](${photo.photographer_url}) on [Pexels](${photo.url})*`
  );
  process.exit(0);
}

const file = matter(fs.readFileSync(postPath, "utf8"));
Object.assign(file.data, {
  cover: `/blog/${slug}/cover.jpg`,
  coverAlt: photo.alt?.trim() || file.data.coverAlt || file.data.title,
  coverCredit: photo.photographer,
  coverCreditUrl: photo.photographer_url,
  coverSource: "Pexels",
  coverSourceUrl: photo.url,
});
fs.writeFileSync(postPath, matter.stringify(file.content, file.data));

console.log(`✓ Saved cover for ${slug}: "${photo.alt}" by ${photo.photographer} (${photo.url})`);
