---
title: Google Publisher Tags and React Playing in Harmony
author: omardelarosa
date: 1487820831393
createdAt: 1487820831393
publishedAt: 1487820831393
slug: gpt-and-react
tags:
    [
        "webdev",
        "tutorial",
        "development",
        "technology",
        "react",
        "gpt",
        "adtech",
    ]
ogDescription: an article about using react and google publisher tag together in harmony
---

# Doing Google Publisher Tags the React Way

For all the wonders Webpack and Babel have brought to Front-End JavaScript, the modern, modular applications you build with those tools don't play well with third-party, drop-this-JavaScript-snippet-in-the-head-tag libraries.

For example, [Google Publisher Tag (aka GPT)](https://developers.google.com/doubleclick-gpt/reference) has a great API and lots of clear documentation. Unfortunately, they expect something clunky and external to your nice, modern bundled ES2017 application. They expect something like this at the top of your markup:

```html
<html>
    <head>
        <script
            async="async"
            src="https://www.googletagservices.com/tag/js/gpt.js"
        ></script>
        <script>
            var googletag = googletag || {};
            googletag.cmd = googletag.cmd || [];
        </script>
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
```

Meanwhile, the rest of your modern, modular, ES2017 application code looks like a jumble of `() => {}` Arrow Functions, `class` keywords, `const` and `let` and `import` and `...` and... you get the idea.

By comparison, GPT's closure-y architecture feels retro.

## Reconciling Retro Libraries with Modern Application Code

Alright, so very recently, I was working on a project in which I needed to fix a race condition between GPT and a React component. What would happen was that React would render the DOM (including all the ad containers), fire all their respective component-lifecycle events before GPT was ready.

After treading water and pulling my hair out for hours, I stumbled upon a very simple way to keep everything in sync.

First, you need do load GPT in your head tag. Duh:

```javascript
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
```

Now you can let the `<script async="async" src="https://www.googletagservices.com/tag/js/gpt.js">` take its sweet time loading, because you have that handy-dandy `cmd` `Array`.

According to [this one Google article about avoiding implementation mistakes](https://developers.google.com/doubleclick-gpt/common_implementation_mistakes), this handy `cmd` `Array` can be your best friend.

Assuming a `React` situation kinda of like this:

```jsx

import React, { Component } from 'react';
import { render } from 'react-dom';

class AdUnit extends Component {

	componentDidMount() {
		this.beginGPTsetup();
	}

	beginGPTSetup = () => {
		// Begin GPT slot rendering, etc.
	}

	render() {
		return (
			<div id='ad-selector-abc'></div>
		);
	}
}

class App extends Component {
	render() {
    	return (
    		<div>
    			<h1>My Application Heading</h1>
    			<div>Content Fragment 1</div>
    			<AdUnit />
    			<div>Content Fragment 2</div>
    		<div>
    	)
  }
}

render(<App />, document.getElementById('root'));
```

As much as you can control what happens _inside_ You can never really guarantee that GPT will be ready and fully loaded by the time your `<App />` goes to render the `<AdUnit />`.

However, with a few modifications, you can use React's own `state` to control your timing and avoid race conditions.

Let's add a few lifecycle methods to the `App` component:

```jsx
class App extends Component {
	// Create an initial state.
	state = {
		// Ensure that the GPTHasLoaded boolean is false
		GPTHasLoaded: false
	}

	componentWillMount() {
		// Let's destructure the cmd array out of GPT.
		const { googletag: { cmd }} = window;

		// Feel free to get really paranoid here and check for Array-ness, too.
		if (cmd) {
			// Enqueue a function onto GPT
			cmd.push(() => this.setState({ GPTHasLoaded: true });
		}
	}

	render() {
		// Reference the GPT boolean here.
		const { state: { GPTHasLoaded }} = this;
    	return (
    		<div>
    			<h1>My Application Heading</h1>
    			<div>Content Fragment 1</div>
    			{ GPTHasLoaded && <AdUnit /> }
    			<div>Content Fragment 2</div>
    		<div>
    	)
  }
}
```

And voila! Now React's own lifecycle methods will take care of avoiding race conditions.

The secret lies in how this little guy:

```javascript
cmd.push(() => this.setState({ GPTHasLoaded: true });
```

Kind of combines the best of both GPT and React in one little lambda callback of goodness.

Because googletag's `cmd` queue is automatically picked up once GPT is ready, it will process your `setState` if and only if GPT has loaded. Or in their words:

> googletag.cmd maintains a list of commands that will be run as soon as GPT is ready. This is the correct way to make sure your callback is run when GPT has loaded.

This avoids using any event-listeners or clumsy `googletag.apiReady` checks or `scriptEl.onload = function () {}`-style callbacks.

Instead, you let `React` be `React` and `GPT` be `GPT`. A shiny, new modern library working in tandem with a semi-retro, closure-y one.

[ Insert GIF of React logo shaking hands with Google For Publishers Logo Here ]
