# simpleheat.ts

`simpleheat.ts` is a library based on `simpleheat`, written in Typescript with the modern syntax of JavaScript, with some minor changes.

`simpleheat` is a super-tiny JavaScript library for drawing heatmaps with Canvas.
Inspired by [heatmap.js](https://github.com/pa7/heatmap.js), but with focus on simplicity and performance.

Demo: http://naramdash.github.io/simpleheat/demo

```ts
const heat = new SimpleHeat(canvas, width, height);
heat.data(data).draw();
```

## Reference

#### Constructor

```ts
// create a simpleheat object given an id or canvas reference
const heat = new SimpleHeat(canvas);
```

#### Data

```ts
// set data of [[x, y, value], ...] format
heat.data(data);

// set max data value (1 by default)
heat.max(max);

// add a data point
heat.add(point);

// clear data
heat.clear();
```

#### Appearance

```ts
// set point radius and blur radius (25 and 15 by default)
heat.radius(r, r2);

// set gradient colors as {<stop>: '<color>'}, e.g. {0.4: 'blue', 0.65: 'lime', 1: 'red'}
heat.gradient(grad);
```

#### Rendering

```ts
// draw the heatmap with optional minimum point opacity (0.05 by default)
heat.draw(minOpacity);
```
