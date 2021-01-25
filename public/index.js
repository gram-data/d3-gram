import * as d3 from "d3";

import {parse, layout, draw, moveNodes, moveLinks} from './d3-gram.umd.development.js';

// a trick enabled by parcel. `miserables` will  be a URL
const miserables = require('./miserables.gram'); 

const shapeRadius = 2;
const shapeSize = Math.PI * shapeRadius * shapeRadius; // the area of the shape

    
const drag = (simulation) => {
  
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

window.onload = () => {

  d3.text(miserables).then( gramSource => {
    const altGramSource = [
      gramSource,
      "(a:Person {born:date`1969-01-01`})-->(b:Event)<--(c:Movie)",
      "(a)-->(b)<--(c)",
      "(a) (b) (c)",
      "(a) (b) (a)"
    ]

    let graph = parse(altGramSource[0]);

    console.log("D3 Graph Loaded:");
    console.dir(graph);

    let simulation = layout(graph);
  
    const {nodeSelection, linkSelection} = draw(graph, "svg");

    nodeSelection.call(drag(simulation));

    simulation.on("tick", () => {
      moveNodes(nodeSelection);
      moveLinks(linkSelection);
    });
  
  })


};