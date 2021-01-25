---
title: README
layout: api
---

gram.js API / [Exports](modules.md)

D3 support for the [gram](http://gram-data.github.io) text format of graph data. `(a)-->(b)<--(c)`

## How to d3-gram

`d3Gram()` parses text in the gram format, producing a graph of nodes and links that is
ready to be used in a `d3-force` simulation.

``` TypeScript
import * as d3 from "d3";
import {d3Gram} from 'd3-gram';

d3.text("https://raw.githubusercontent.com/gram-data/d3-gram/master/public/miserables.gram").then( gramSource => {

  let graph = d3Gram(gramSource);

  let simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(300,200)) // preferably calculate the center of the svg
    .force('collision', d3.forceCollide());

  simulation.nodes(graph.nodes);
  simulation.force("link", d3.forceLink(graph.links).id((d:any) => d.id))

```
