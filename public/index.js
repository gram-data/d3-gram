const d3 = require('d3');

const d3Gram = require('..').default;

// a trick enabled by parcel. `miserables` will  be a URL
const miserables = require('./miserables.gram'); 

const shapeRadius = 12;
const shapeSize = Math.PI * shapeRadius * shapeRadius; // the area of the shape

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    center = {x:width/2, y:height/2}

const shapeDomain = new Map([
  ["Person", "square"],
  ["Triangle", "triangle"],
  ["Movie", "star"],
  ["Event", "wye"]
]);

const symbolPathData = new Map([
  ["circle",d3.symbol().type(d3.symbolCircle).size(shapeSize)()],
  ["square",d3.symbol().type(d3.symbolSquare).size(shapeSize)()],
  ["triangle",d3.symbol().type(d3.symbolTriangle).size(shapeSize)()],
  ["cross",d3.symbol().type(d3.symbolCross).size(shapeSize)()],
  ["diamond",d3.symbol().type(d3.symbolDiamond).size(shapeSize)()],
  ["star", d3.symbol().type(d3.symbolStar).size(shapeSize)()],
  ["wye", d3.symbol().type(d3.symbolWye).size(shapeSize)()]
]);

const shapeFor = (node) => {
  const shape = (node.labels !== undefined) ? (shapeDomain.get(node.labels[0]) || 'circle') : 'circle';
  return symbolPathData.get(shape) || '';
}


const color = d3.scaleOrdinal(d3.schemeCategory10);  
color.domain(["Default", "Person", "Movie", "Event"]);

const colorFor = (node) => {
  const label = (node.labels !== undefined) ? node.labels[0] : 'Default';
  return color(label) || 'gray';
}
  
var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-30))
    .force("center", d3.forceCenter(center.x, center.y))
    .force('collision', d3.forceCollide().radius(30))
    ;
    
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

const drawLinks = (links) => {
  links
  .attr("x1", (d) => (d.source.x))
  .attr("y1", (d) => (d.source.y))
  .attr("x2", (d) => (d.target.x))
  .attr("y2", (d) => (d.target.y));

}

const drawNodes = (nodes) => {
  nodes
  .attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  })
}

window.onload = () => {

  d3.text(miserables).then( gramSource => {
    const altGramSource = [
      gramSource,
      "(a:Person {born:date`1969-01-01`})-->(b:Event)<--(c:Movie)",
      "(a)-->(b)<--(c)",
      "(a) (b) (c)",
      "(a) (b) (a)",
      "()-->()<--()"
    ]

    let graph = d3Gram(altGramSource[5]);

    console.log("D3 Graph Loaded:");
    console.dir(graph);
    
    simulation.nodes(graph.nodes);
    simulation.force("link", d3.forceLink(graph.links).id((d) => d.id))
  
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graph.links)
      .join("line")
        .attr("stroke-width", 2);
        // .attr("stroke-width", d => Math.sqrt(d.value));
  
    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter().append("g")
      .call(drag(simulation));
  
  // node.append("circle")
  //   .attr("r", 25)
  //   .attr("fill", "black")
  
  node.append('path')
    .attr('fill', colorFor)
    .attr('stroke', (d) => (d3.color(colorFor(d)) || d3.rgb(0x33, 0x33, 0x33)).darker().hex())
    .attr('stroke-width', 4)
    .attr('d', shapeFor)
  
  // node.append("text")
  //       .text(function(d) {
  //         return d.id;
  //       })
  //       .attr("text-anchor", "middle")
  //       .attr("fill", "white")
  //       .attr('x', 0)
  //       .attr('y', 4)
  //       .attr('pointer-events', 'none');
  
    node.append("title")
        .text(function(d) { return d.id; });
  
    simulation.on("tick", () => {
      drawLinks(link);
      drawNodes(node);
    });
  
  })


};