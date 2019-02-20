---
title: Constant I/O | Tilemaps | Week 3
date: 1550502097462
createdAt: 1550502097462
publishedAt: 1550502097462
slug: constant-io-tilemaps-and-unity
tags: ["process", "unity", "gamedev", "w03", "tilemaps", "pixelart", "update"]
---

Thus far, all of the pixelart you've seen on this site and in the game screenshots thus far has been made using PyxelEdit. This is an awesome tool, but when it comes to integrating directly with Unity it does have a few limitations. Though not overtly bad, there isn't a one-shot way for me to add a tilemap directly into unity.

Although I found a semi-okay PyxelEdit tilemap importer on the unity asset store, it failed to create objects using the new-ish `UnityEngine.Tilemaps` module, which is ultimately what I wanted to use. Naturally, I ended up making my own importer script.

### Drawing and Exporting The Tilemap Data

The first step is drawing the tilemap in PyxelEdit.

![](./pyxeledit1.png)

Once I have my map looking as expected, I make sure all my layers were coherently set up.

![](./pyxeledit2.png)

After that, I begin exporting the pieces, starting with the tileset image asset:

![](./pyxeledit3.png)

![](./pyxeledit3-1.png)

Once that's out in file form, I export the tilemap data as JSON:

![](./pyxeledit4.png)

![](./pyxeledit4-1.png)

This leaves me with two files that I import into Unity via drag 'n drop:

Afterwards, using [a custom C# sharp script extension I wrote for unity](https://gist.github.com/omardelarosa/859a05f8881fe089f7e389b399f690bb), I drag and drop them into the custom GUI window and build the map:

<iframe src="https://www.youtube.com/embed/nooMScdCLU4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The end result (using a small test build), with player and enemy sprites added, ends up looking something like this:

![](./haunted_mansion_room_hifi.gif)

Now to build some actual AI for these zombie enemies so they don't wander around so aimlessly.
