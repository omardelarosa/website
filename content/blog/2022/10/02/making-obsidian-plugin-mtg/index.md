---
title: Making An Obsidian Plugin for MtG
author: omardelarosa
date: 1664746807915
createdAt: 1664746807915
publishedAt: 1664746807915
slug: making-obsidian-plugin-mtg
tags: ["mtg", "code", "obsidian"]
ogDescription: an article about making a plugin for Obsidian note-taking app
---

So I play a ton of [Magic: The Gathering](https://magic.wizards.com/en) these days.  Perhaps that warrants its own post, but as my collection grows and I try to keep up with meta decks I found that using [Deckbox.org](https://deckbox.org/) is nice but cumbersome.  It forces me into its UI and clicking around to add/remove cards.  What I've always wanted is something close to plain-text decklists and just have my collection magically available to them.  

Since I couldn't find such a tool, I decided to make my own as a plugin for the Obsidian app:

https://github.com/omardelarosa/obsidian-mtg

This plugin primarily lets you enter your cards as code blocks inside any `.md` file as follows:

```
4 Delver of Secrets // Insectile Aberration
4 Haughty Djinn
3 Tolarian Terror
4 Consider
4 Essence Scatter
4 Fading Hope
4 Make Disappear # consider Negate instead
4 Slip Out the Back
3 Spell Pierce
3 Thirst for Discovery
20 Island
1 Otawara, Soaring City
1 Otherworldly Gaze
1 Reckoner Bankbuster

Sideboard:
2 Disdainful Stroke
4 Negate
4 Out of the Way
1 Reckoner Bankbuster
4 Ertai's Scorn
```

And using the `mtg-deck` language hint it will render something like this:

![obsidian-mtg-v1.0.0.png](https://github.com/omardelarosa/obsidian-mtg/raw/master/docs/img/example_decklist.png)
This gives you some information about which cards you are missing to build the deck.  It works by letting you add your MtG collection as CSV files and behind the scenes counts up how many copies of each card you have.

Anyway, I've just submitted a pull request to the Obsidian releases repo and hopefully this should be available on the community plugins list soon.

## Making an Obsidian Plugin

It turns out that making an Obsidian plugin is pretty simple using [the Obsidian Sample Plugin code](https://github.com/obsidianmd/obsidian-sample-plugin) as a base.  I pretty much started there and then just made a simple renderer that handles `mtg-deck` extensions.

The whole thing basically works like this:
```typescript
this.registerMarkdownCodeBlockProcessor(
	'mtg-deck', 
	async (source: string, el: HTMLElement, ctx) => {
	     // Get the counts from your CSV file
		this.cardCounts = await syncCounts(vault, this.settings);

		// Add render your syntax block
		const containerEl: Element = renderDecklist(source, this.cardCounts);
	     el.appendChild(containerEl);
	});
```

The bulk of the work is done by the `renderDecklist` function and a `syncCounts` that reads your CSV-based MtG card collection.  It's pretty schema agnostic and the plugin lets you choose whatever your column names are, but here's how I have mine configured:

```csv
Name,Count,Set
Delver of Secrets // Insectile Aberration,1,MID
"Otawara, Soaring City",6,NEO
"Rona's Vortex",3,DMU
Ledger Shredder,5,SNC
```

I've named my card name column `Name` and my card quantity `Count` .  If you use the plugin and need to change those values, you can do that in settings:

![Obsidian MtG settings](https://github.com/omardelarosa/obsidian-mtg/raw/master/docs/img/example_settings.png)

Anyway, if you use the plugin and like it, please let me know.  I hope it gets accepted into the core plugins registry and, whether it does or not, I hope to add more features to it soon.