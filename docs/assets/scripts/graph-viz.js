  
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


const drawGraph = (gramSrc, svgElement) => {

  let svg = d3.select(svgElement),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  let graph = gram.d3.parse(gramSrc);
  let simulation = gram.d3.layout(graph, {width, height});

  const {nodeSelection, linkSelection} = gram.d3.draw(graph, svgElement, {shapeRadius:20});

  simulation.on("tick", () => {
    gram.d3.moveNodes(nodeSelection);
    gram.d3.moveLinks(linkSelection);
  });

}
