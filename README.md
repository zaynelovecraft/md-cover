# md-cover 🖼️

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Article](https://img.shields.io/badge/Deep_Dive-Read_Post-10b981)](https://www.zaynelovecraft.com/articles/building-custom-mcp-servers-typescript-youtube-skills)

A small CLI for Markdown blogs. Give it a post slug and a search phrase, and it finds a landscape photo on Pexels, saves a `1600×840` JPEG to `public/blog/<slug>/cover.jpg`, and writes the cover path, alt text and photographer credit into the post's frontmatter.

Built so a coding agent can publish a fully illustrated post in one command. It powers every cover on [zaynelovecraft.com](https://www.zaynelovecraft.com/articles).

> 📖 **Engineering write-up:** [Building Custom MCP Servers in TypeScript for Cursor](https://www.zaynelovecraft.com/articles/building-custom-mcp-servers-typescript-youtube-skills)

## Requirements

- Node.js 18 or newer
- A free Pexels API key: sign up at [pexels.com/api](https://www.pexels.com/api/) and copy the key from your dashboard
- A project laid out like this (the posts folder can be changed, see below):

```text
your-project/
├── content/posts/<slug>.md    # or <slug>.mdx
└── public/                    # covers are saved to public/blog/<slug>/
```

## Setup

Add your key to `.env.local` (or `.env`) in the project root:

```bash
PEXELS_API_KEY=your-key-here
```

`md-cover` reads it from there automatically, or you can export `PEXELS_API_KEY` in your shell.

## Quick start

Run from your project root:

```bash
npx -y github:zaynelovecraft/md-cover my-first-post "server racks data center"
```

Real output:

```text
✓ Saved cover for my-first-post: "Close-up of server racks in a data center highlighting modern technology infrastructure." by panumas nikhomkhai (https://www.pexels.com/photo/data-center-server-racks-with-active-equipment-37730212/)
```

And `content/posts/my-first-post.md` now has:

```yaml
---
title: My First Post
cover: /blog/my-first-post/cover.jpg
coverAlt: >-
  Close-up of server racks in a data center highlighting modern technology
  infrastructure.
coverCredit: panumas nikhomkhai
coverCreditUrl: 'https://www.pexels.com/@cookiecutter'
coverSource: Pexels
coverSourceUrl: >-
  https://www.pexels.com/photo/data-center-server-racks-with-active-equipment-37730212/
---
```

Your template reads those fields to render the image and a "Photo by … on Pexels" credit.

**Don't like the photo?** Add a number to pick a different search result (`0` is the first):

```bash
npx -y github:zaynelovecraft/md-cover my-first-post "server racks data center" 2
```

Concrete scenes ("laptop on a desk at night") give much better results than abstract words ("productivity").

## Inline images

To add a photo inside the article instead of as the cover, use `--inline <name>`. It saves `public/blog/<slug>/<name>.jpg` and prints Markdown you can paste into the post:

```bash
npx -y github:zaynelovecraft/md-cover my-first-post "terminal code screen" 0 --inline workflow
```

```markdown
![Alt text from Pexels](/blog/my-first-post/workflow.jpg)
*Photo by [Photographer](https://www.pexels.com/@photographer) on [Pexels](https://www.pexels.com/photo/...)*
```

## Options

| Option | What it does |
|--------|--------------|
| `<slug>` | Post filename without the extension |
| `"<query>"` | Pexels search phrase |
| `[index]` | Which search result to use (default `0`) |
| `--inline <name>` | Save as an inline image and print Markdown instead of editing frontmatter |
| `MD_COVER_POSTS_DIR` env var | Use a different posts folder (default `content/posts`) |

## License

MIT
