---
title: Constant I/O (or Project 2) | Procedurally Generated Levels in the Style of Spelunky | Week 5
date: 1551894841303
createdAt: 1551894841303
publishedAt: 1551894841303
slug: project-2-procedurally-generated-levels
tags:
    [
        "process",
        "w05",
        "gamedev",
        "unity",
        "updates",
        "spelunky",
        "csharp",
        ".net",
    ]
---

## Constant I/O (or Project 2, Part 2)

### Background

In part 1 of project 2, I studied the creative process of [Derek Yu](https://twitter.com/mossmouth?lang=en) with regards to Spelunky and read through [his book on the subject](https://bossfightbooks.com/products/spelunky-by-derek-yu). During that time, I paid close attention to the PGC (Procedurally Generated Content) approach he took to level building. From this I learned a few tricks that I applied to my own project.

### Procedurally Generated Levels

So from Derek Yu's book, I took away that he begins with a grid abstraction layer, somewhat decoupled from the game logic itself. I decided to start here, with the more abstract tool and work my way down to the more concrete (i.e. integration into a Unity project) afterwards.

To begin, [I setup a repo on Github for a more generic, CLI interface for level generation](https://github.com/omardelarosa/tilemapgen) with the intent of taking the core modules/classes and porting them into unity later. I called this [`tilemapgen`](https://github.com/omardelarosa/tilemapgen).

The core of this is a `PGCMap` class. ([github code link here](https://github.com/omardelarosa/tilemapgen/blob/master/src/PGCMap.cs)). This class serves as an abstraction layer that generates matrices (at the core). These matrices look like this:

```
W W W W W W W W W W W W W W W W W W W W W W W W W D W W W W W W
W       B   B B B     B     B     B         B   B .   B       W
W             B           B   B             B B   .         B W
W     B         B       B B B B B     B   . . . B .   B       W
W B   B         B   B B           B   . . . B . . . B     B B W
W     B             B           B   B .       B   B B B B B   W
W B   B           B                   . . B         B . . . . W
W         B B   B B     B B     B       . .         . .   B . W
W     B   B           B B               B . . . . . . B B . . W
W B B B     B B   B     B B   B   B       B       B B B   .   W
W     B B               B B     B     B   B B B B         . . W
W         B   B B B       B     B     B         B       B   . W
W B     B     B       B           B B     B B B   B       B . W
W       B B B     B B B                     B           B   . W
W   B     B B           B B   B B     B     B B       B . . . W
W W W W W W W W W W W W W W W W W W W W W W W W W W W W D W W W
```

Each character stands for a position in the matrix and the `Tile` enum at that location. For example, the `B` characters represent a `Tile.Barrier`, `W` a `Tile.Wall` and `.` a `Tile.Path`.

Using a series of helpers, like a `Graph` class, I generated an rudimentary pathfinding algorithm based on [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) that traces a path from entrance to exit. These helpers are used to validate maps and make sure they're not impossible (or at least retry a few times in the attempt of making them possible.) Here's the implementation of dijkstra's algorithm that I used to validate maps. (True priority queue / minheap coming soon.)

```csharp
    public PathData<T> Dijkstra(T source, T target)
    {
        PathData<T> pd = new PathData<T>();
        HashSet<T> set = new HashSet<T>();

        // Initialize all routes
        foreach (T n in nodesList)
        {
            Guid id = n.GetGuid();
            pd.distances.Add(id, int.MaxValue);
            // pd.paths[id] = Node.NULL_GUID;
            set.Add(n);
        }

        // Set start to min
        pd.distances[source.GetGuid()] = 0;

        while (set.Count > 0)
        {
            Guid uid = pd.GetGuidOfMinInSet(set);
            set.Remove(Find(uid));

            // No edges containing uid case
            if (!edges.ContainsKey(uid))
            {
                break;
            }
            List<Guid> neighbors = edges[uid];

            // No neighbors case.
            if (neighbors.Count == 0)
            {
                break;
            }

            foreach (Guid nid in neighbors)
            {
                T n = Find(nid);
                if (n.IsNull())
                {
                    throw new InvalidOperationException("Node with id: " + nid + " not found during path data construction.");
                }
                Guid vid = n.GetGuid();
                int alt = pd.distances[uid] + Length(vid, uid);
                if (alt < pd.distances[vid])
                {
                    pd.distances[vid] = alt;
                    pd.paths.Add(vid, uid);
                }
            }
        }

        return pd;
    }
```

The map is also configurable for `NxM` dimensions and is generic enough to plug right into Unity. This makes it easy to scale up / down map complexity etc.

Here is a demo of the CLI in action:

 <!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/5fb27mhTriY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->

### Unity Integration

After this was mostly working, I had to bring this into Unity. Unfortunately, due to my lack of familiarity with C# in general perhaps, I didn't know of a simple way to share code between .NET and
