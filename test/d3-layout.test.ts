import {
  GramNodeDatum,
  GramLinkDatum,
  makeGramNodeDatum,
  makeGramLinkDatum,
  layout,
  GramGraphData
} from '../src';
import * as d3 from 'd3-force';

const makeGraph = ():GramGraphData => {
  const nodeA = makeGramNodeDatum('a');
  const nodeB = makeGramNodeDatum('b');
  const nodes: GramNodeDatum[] = [nodeA, nodeB];
  const linkR = makeGramLinkDatum(nodeA.id, nodeB.id, 'r');
  const links: GramLinkDatum[] = [linkR];

  return {
    nodes,
    links,
    paths: []
  }
}

describe('D3Force with D3Gram model', () => {
  it('accepts GramNodeDatum', () => {
    const nodes: GramNodeDatum[] = [];
    nodes.push(makeGramNodeDatum('a'));
    d3.forceSimulation(nodes);
  });
  it('accepts GramLinkDatum', () => {
    const links: GramLinkDatum[] = [];
    d3.forceLink(links);
  });
  it('will position nodes', () => {
    const width = 1200;
    const height = 900;
    const graph = makeGraph();

    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        'link',
        d3.forceLink<GramNodeDatum, GramLinkDatum>(graph.links).id(d => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    // run the simulation
    simulation.stop();
    while (simulation.alpha() > simulation.alphaMin()) {
      simulation.tick();
    }

    graph.nodes.forEach(node => {
      expect(node).toHaveProperty('x');
      expect(node).toHaveProperty('y');
      expect(node).toHaveProperty('vx');
      expect(node).toHaveProperty('vy');        
    });
  });
});

describe("d3-gram-layout", () => {
  it("positions nodes using d3", () => {
    const graph = makeGraph();

    layout(graph);

    graph.nodes.forEach(node => {
      expect(node).toHaveProperty('x');
      expect(node).toHaveProperty('y');
      expect(node).toHaveProperty('vx');
      expect(node).toHaveProperty('vy');        
    });
  });

  it("returns a D3 simulation", () => {
    const graph = makeGraph();

    const simulation = layout(graph);

    simulation.restart();
  });

});