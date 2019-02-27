---
title: Constant I/O | The Core Game Loop | Week 4
date: 1551220924804
createdAt: 1551220924804
publishedAt: 1551220924804
slug: constant-io-the-core-game-loop
tags: ["process", "unity", "gamedev", "w04", "2d", "update"]
---

This week I focused on tighetning up the code in a few key ways to support a functioning game loop. This basically means I focused more on coding things this week than in prior weeks to make the code more maintanable and extensible moving forward. This means adding better code organization and a few actual programming design patterns I've been reading about in a few game dev books, tutorials.

## Object Pooling

I first got the idea of object pooling from a book I just finished reading [Developing 2D Games with Unity: Independent Game Programming with C#](https://www.amazon.com/dp/B07FKFVTML/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1) by [Jared Halpern](https://twitter.com/jaredehalpern). The idea behind object pooling is to build up all your objects at load time and then only activate/disactivate them rather than calling `Instantiate()` and then `Destroy()` every time. This did require some code refactoring. This being my first full Unity game, I had been `Instantiate()`ing and `Destroy()`ing all over the place. But the refactoring was well worth the work, as my game play did very notciably speed up a bit as I started to re-use objects from a single pool of memory.

Although a bit lengthy, I also found [Unity's official tutorial on Object Pooling](https://unity3d.com/learn/tutorials/topics/scripting/object-pooling) quite helpful for building a more general object pooling class. However, I made a few modifications in my own version.

## Scriptable Objects

Another interesting bit from Halpern's book was the notion of using `ScriptableObject` in order to define data objects in a single place and have multiple `MonoBehaviour` subclass instances. This means that both a `HealthBar` component and a `Player` component can both reference a single `HitPoints` scriptable object and "share" data. This allows for data model and/or application state to be decoupled from controllers. Though I'm not the biggest MVC evangelist (there are certainly bigger ones) these days, having some separation of concerns in my code does matter.

## `Command` Pattern

From yet another good book on the subject, [Game Programming Patterns](https://www.amazon.com/dp/B00P5URD96/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1) by [Robert Nystrom](https://twitter.com/munificentbob), I learned about the `Command` pattern. Though Nystrom didn't invent this, he admittedly got the idea from the ["Gang of Four" book on design patterns book](https://en.wikipedia.org/wiki/Design_Patterns), his application in games was very helpful. Though I'm not done reading his book yet, nor fully implementing this feature in my own game, the idea is to use an abstraction of "commands" to the game object actors (like in my case the `Zombie` and the `Player`) such as:

```typescript
class JumpCommand {
    public execute(actor) {
        actor.jump();
    }
}

class FireCommand {
    public execute(actor) {
        actor.fire();
    }
}
```

And then use streams of `Command` instances to connect to things like button presses:

```typescript
class Player {
    public OnHandleInput(key) {
        switch (key) {
            case X_BUTTON:
                jumpCommand.execute(this);
                break;
            case A_BUTTON:
                fireCommand.execute(this);
                break;
            default:
                break;
        }
    }
}
```

## Demo Time

And when you put all that together, it looks like this:

<iframe width="560" height="315" src="https://www.youtube.com/embed/EBKCJVqklG0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
