---
tags:
  - post
title: Claude's Got Frontend Skills
description: an article about life, technology and/or music by omar delarosa
author: omardelarosa
slug: claude-frontend-skills
---
A few days ago I wrote about [[A New Vibe-coded Site Builder]] and it did a pretty decent job of migrating my site-builder off of Obsidian Publish and back onto a static build process akin to what I had before in [[Moving Back To Github Pages (or Static Hosting Saga 3)]]

It was very functional, but the style left a little bit to be desired.

Here is what that looked like:

![[Screenshot 2026-02-09 at 8.54.44 AM.png]]

However, today I started incorporating more of Claude's specialized skills into my [claude configs](https://github.com/omardelarosa/claude-configs) and added the `frontend-design` from the [anthropic skills repo](https://github.com/anthropics/skills).

I prompted it as follows:

```
Look at the @website/packages/obs-static-site/build.js script and @website/packages/obs-static-site/templates/app.js
  and their respective HTML and CSS outputs.  Fix up the color theme and layout to have a cleaner more balanced design
  similar to the aesthetic of lospec.com.

  While fixing the color theme try to stick to the color pallete CC-29 found here https://lospec.com/palette-list/cc-29
```

The result was nice, but the font `Syne` looked a little strange so I modified it a bit:

```
Replace the Syne font with one that has slightly taller glyphs and ensure that in dark mode the .social-title
  elements have higher contrast with their background colors.
```

And here's what came out:

![[Screenshot 2026-02-12 at 10.11.07 AM.png]]

And this is Dark Mode:

![[Screenshot 2026-02-12 at 10.11.12 AM.png]]

Not too shabby.  You can see the entire [PR here](https://github.com/omardelarosa/website/pull/73).