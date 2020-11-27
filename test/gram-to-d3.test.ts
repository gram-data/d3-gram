import { d3Gram, GramNodeDatum, GramLinkDatum, isGramNodeDatum } from '../src';

describe('d3Gram from nodes', () => {
  it('(a)', () => {
    const src = '(a)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.nodes).toHaveLength(1);
    expect(isGramNodeDatum(gramGraph.nodes[0])).toBeTruthy();
    expect(gramGraph.nodes[0].id).toBe('a');
  });
  it('(a) (b)', () => {
    const src = '(a) (b)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.nodes).toHaveLength(2);
    expect(gramGraph.nodes[0].id).toBe('a');
    expect(gramGraph.nodes[1].id).toBe('b');
  });
  it('(a) (b) (c)', () => {
    const src = '(a) (b) (c)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.nodes).toHaveLength(3);
    expect(gramGraph.nodes[0].id).toBe('a');
    expect(gramGraph.nodes[1].id).toBe('b');
    expect(gramGraph.nodes[2].id).toBe('c');
  });
  it('(a) (a) (a)', () => {
    const src = '(a) (a) (a)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.nodes).toHaveLength(1);
  });
  it('(a:Aye)', () => {
    const src = '(a:Aye)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.nodes).toHaveLength(1);
    const n = gramGraph.nodes[0];
    expect(n.id).toBe('a');
    expect(n.labels[0]).toBe('Aye');
  });
});

describe('d3Gram with links', () => {
  it('links "right" direction from source to target', () => {
    const src = '(a)-->(b)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.links).toHaveLength(1);
    expect(gramGraph.links[0].source).toBe(gramGraph.nodes[0].id);
    expect(gramGraph.links[0].target).toBe(gramGraph.nodes[1].id);
  });
  it('links "left" direction from target to source', () => {
    const src = '(a)<--(b)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.links[0].source).toBe(gramGraph.nodes[1].id);
    expect(gramGraph.links[0].target).toBe(gramGraph.nodes[0].id);
  });
  it('links direction "either" from source to target', () => {
    const src = '(a)--(b)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.links[0].source).toBe(gramGraph.nodes[0].id);
    expect(gramGraph.links[0].target).toBe(gramGraph.nodes[1].id);
  });
  it('correctly links longer paths', () => {
    const src = '(a)-->(b)<--(c)';
    const gramGraph = d3Gram(src);
    expect(gramGraph.links[0].source).toBe(gramGraph.nodes[0].id);
    expect(gramGraph.links[0].target).toBe(gramGraph.nodes[1].id);
    expect(gramGraph.links[1].source).toBe(gramGraph.nodes[2].id);
    expect(gramGraph.links[1].target).toBe(gramGraph.nodes[1].id);
  });
  //   it('handles labelled nodes', () => {
  //     const src = '(a:Person)-->(c:Movie)';
  //     const gramGraph = gramParse(src);
  //     expect(gramGraph.nodes[0].labels).toHaveLength(1);
  //     expect(gramGraph.nodes[0].labels[0]).toBe('Person');
  //     expect(gramGraph.nodes[1].labels).toHaveLength(1);
  //     expect(gramGraph.nodes[1].labels[0]).toBe('Movie');
  //   });

  //   it('handles node data records as a nested "record" object', () => {
  //     const isoDate = '1969-01-01';
  //     const src = `(a:Person {born:date\`${isoDate}\`})`;
  //     const gramGraph = gramParse(src);
  //     const d3Node = gramGraph.nodes[0];
  //     expect(d3Node.record).toHaveProperty('born');
  //     expect(d3Node.record.born).toStrictEqual(new Date(isoDate));
  //   });

  //   it('handles node data records as a nested "record" object', () => {
  //     const name = 'Napoleon';
  //     const group = 1;
  //     const src = `(Napoleon{name:"${name}",group:${group}})`;
  //     const gramGraph = gramParse(src);
  //     const d3Node = gramGraph.nodes[0];

  //     expect(d3Node.record).toHaveProperty('name');
  //     expect(d3Node.record.name).toStrictEqual(name);
  //     expect(d3Node.record).toHaveProperty('group');
  //     expect(d3Node.record.group).toStrictEqual(group);
  //   });

  //   it('produces a gramGraph ready for d3-force simulation', () => {
  //     const src = '(a)-->(b)';
  //     const gramGraph = gramParse(src);

  //     const width = 1200,
  //       height = 900;
  //     const simulation = d3
  //       .forceSimulation(gramGraph.nodes)
  //       .force(
  //         'link',
  //         d3.forceLink<GramNodeDatum, GramLinkDatum>(gramGraph.links).id(d => d.id)
  //       )
  //       .force('charge', d3.forceManyBody())
  //       .force('center', d3.forceCenter(width / 2, height / 2));

  //     // run the simulation
  //     simulation.stop();
  //     while (simulation.alpha() > simulation.alphaMin()) {
  //       simulation.tick();
  //     }

  //     gramGraph.nodes.forEach(node => {
  //       expect(node).toHaveProperty('x');
  //       expect(node).toHaveProperty('y');
  //       expect(node).toHaveProperty('vx');
  //       expect(node).toHaveProperty('vy');
  //     });
  //   });
});
