---
title: Project | Final CityLens Prototype | Week 14
date: 1557349223522
createdAt: 1557349223522
publishedAt: 1557349223522
slug: project-or-final-prototype
tags: ["process", "w14", "augmented-reality", "ar", "citylens"]
aliases:
- project-or-final-prototype
---

The name I have finally settled on for my project is **CityLens**. The final result is a combination of a few pieces.

1. A brief demo video.
2. The hosted functional prototype application for the MTA use-case.
3. An open-source repository of markers and code.

## Video

This demo video summarizes the CityLens use case as a platform for MTA announcements accessible to mobile phone screens:

<iframe width="560" height="315" src="https://www.youtube.com/embed/QVppPxScGUE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Hosted Application

I purchased the domain `view.tips` for the purposes of hosting this project and having a simple URL. The demo project is hosted here:

[https://mta.view.tips](https://mta.view.tips)

To test this out:

1. Open [a marker pattern](https://github.com/omardelarosa/citylens/blob/master/designs/marker_pattern_1.pdf) in a browser window.
2. Open the [Test App](https://mta.view.tips) in another window.
3. Allow Camera access and point the camera at the tab with the marker.

## Code Repository

Finally, all the code for my project is available on GitHub here:

[https://github.com/omardelarosa/citylens](https://github.com/omardelarosa/citylens)

It's a `create-react-app` project and the key files are as follows:

```
src
├── App.tsx  # React app shell
├── index.css
└── index.tsx  # app bootstrap

public
├── images   # svgs for app
│   ├── camera-icon.svg
│   └── x-icon.svg
├── index.html  # outer template
└── models  # 3D models
    ├── MTA_Platform_Spread.glb
    └── MTA_Platform_Stand.glb
```

#process, #w14, #augmented-reality, #ar, #citylens
