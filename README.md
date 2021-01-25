D3 support for the [gram](http://gram-data.github.io) text format of graph data. `(a)-->(b)<--(c)`

## How to d3-gram

`d3Gram()` parses text in the gram format, producing a graph of nodes and links that is
ready to be used in a `d3-force` simulation.

``` TypeScript
import * as d3 from "d3";
import {parse, layout, draw, moveNodes, moveLinks} from 'd3-gram';

d3.text("https://raw.githubusercontent.com/gram-data/d3-gram/master/public/miserables.gram").then( gramSource => {

  let graph = parse(gramSource);

  let simulation = layout(graph);

  const {nodeSelection, linkSelection} = draw(graph, "svg");

  simulation.on("tick", () => {
    moveNodes(nodeSelection);
    moveLinks(linkSelection);
  });
}
```