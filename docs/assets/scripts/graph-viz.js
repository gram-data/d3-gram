
const drawGraph = (gramSrc, svgElement) => {

  let svg = d3.select(svgElement),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  let graph = gram.d3.parse(gramSrc);
  let simulation = gram.d3.layout(graph, {width, height});

  const {nodeSelection, linkSelection} = gram.d3.draw(graph, svgElement, {shapeRadius:20});

  nodeSelection.call(gram.d3.drag(simulation));

  simulation.on("tick", () => {
    gram.d3.updateNodes(nodeSelection);
    gram.d3.updateLinks(linkSelection);
  });

}
