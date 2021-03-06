---
title: A New Way of Blogging
author: omardelarosa
date: 1483396849251
createdAt: 1483396849251
publishedAt: 1483398779432
slug: new-blog
tags: ["webdev", "news", "md"]
ogDescription: an introduction to the new bloging system.
---

It's been a while since I wrote a blog post. Why? Well on the one hand, I've had a shortage of free time. On the other, I've spent way too much time configuring and dealing with [random](http://omardelarosa.tumblr.com) [blogging](http://blog.omardelarosa.com) platforms without really getting the things I want out of them:

1. The ability to write in Markdown.
2. Simple syntax highlighting for code.
3. Manage my own post data using the file system.
4. Use modern web development tools to build.
5. Easy to publish from a bash terminal.

These factors have made blogging just not feel very fun to me over the past few years. However, over this past winter holiday, I decided to spend a few of my vacation days building my own platform with all of the above features.

This very post is in fact, [written in pure markdown](http://github.com/omardelarosa/omardelarosa.github.io/blob/master/_posts/1483396849251_new-blog.md). It also supports:

```javascript
var msgArray = ["easy", "syntax", "highlighting"].join(" ");
```

As for the data itself, the entire system doesn't require databases or a backend. It uses the file system and compiles markdown (as well as ES6, stylus, etc.) to plain static assets using modern build tools like webpack.

Best of all, I can publish from the terminal with a simple:

```bash
$ npm run build
$ git commit -m "Added a new post!"
$ git push origin master
```

So yeah, this new website is still a work in progress, but more posts and updates to come.
