# md-cover 🖼️

A tiny CLI for Next.js / Astro Markdown blogs — searches Pexels for a landscape cover photo, downloads a pre-cropped `1600x840` optimized JPG into `public/blog/<slug>/cover.jpg`, and injects `cover`, `coverAlt`, and photographer attribution directly into your post's YAML frontmatter.

Built so an AI coding agent can publish a complete, illustrated blog post from the terminal in one command.

```bash
$ npx github:zaynelovecraft/md-cover top-10-ai-tools "minimalist dark server rack"
✓ Saved cover for top-10-ai-tools: "Server racks in dark room" by Panumas Nikhomkhai (https://www.pexels.com/photo/...)
```

## Frontmatter Diff

```diff
 ---
 title: "Top 10 AI Tools to Build With Today"
 date: "2026-10-30"
+cover: "/blog/top-10-ai-tools/cover.jpg"
+coverAlt: "Server racks in dark room"
+coverCredit: "Panumas Nikhomkhai"
+coverCreditUrl: "https://www.pexels.com/@cookiecutter"
+coverSource: "Pexels"
+coverSourceUrl: "https://www.pexels.com/photo/..."
 ---
```

## Inline Mode (`--inline`)

Need a mid-article figure instead of a frontmatter cover?

```bash
$ md-cover top-10-ai-tools "terminal code screen" 0 --inline workflow
![Close-up of terminal code](/blog/top-10-ai-tools/workflow.jpg)
*Photo by [Kevin Ku](https://www.pexels.com/@kevinku) on [Pexels](https://www.pexels.com/photo/...)*
```

## Setup

Add `PEXELS_API_KEY=...` to `.env.local` in your project root.

## License

MIT
