import * as d3 from 'd3';
import { select } from 'd3-selection';

import {
  GramNodeDatum,
  GramLinkDatum,
  isGramNodeDatum,
  GramGraphData,
} from './d3-gram-types';

const shapeRadius = 2;
const shapeSize = Math.PI * shapeRadius * shapeRadius; // the area of the shape

const shapeDomain = new Map([
  ['Person', 'square'],
  ['Triangle', 'triangle'],
  ['Movie', 'star'],
  ['Event', 'wye'],
]);

const symbolPathData = new Map([
  [
    'circle',
    d3
      .symbol()
      .type(d3.symbolCircle)
      .size(shapeSize)(),
  ],
  [
    'square',
    d3
      .symbol()
      .type(d3.symbolSquare)
      .size(shapeSize)(),
  ],
  [
    'triangle',
    d3
      .symbol()
      .type(d3.symbolTriangle)
      .size(shapeSize)(),
  ],
  [
    'cross',
    d3
      .symbol()
      .type(d3.symbolCross)
      .size(shapeSize)(),
  ],
  [
    'diamond',
    d3
      .symbol()
      .type(d3.symbolDiamond)
      .size(shapeSize)(),
  ],
  [
    'star',
    d3
      .symbol()
      .type(d3.symbolStar)
      .size(shapeSize)(),
  ],
  [
    'wye',
    d3
      .symbol()
      .type(d3.symbolWye)
      .size(shapeSize)(),
  ],
]);

const shapeFor = (node: GramNodeDatum) => {
  const shape =
    node.labels !== undefined
      ? shapeDomain.get(node.labels[0]) || 'circle'
      : 'circle';
  return symbolPathData.get(shape) || '';
};

const color = d3.scaleOrdinal(d3.schemeCategory10);
color.domain(['Default', 'Person', 'Movie', 'Event']);

const colorFor = (node: GramNodeDatum) => {
  const label = node.labels !== undefined ? node.labels[0] : 'Default';
  return color(label) || 'gray';
};

export const moveLinks = (links: any) => {
  links
    .attr('x1', (d: GramLinkDatum) =>
      isGramNodeDatum(d.source) ? d.source.x : 0
    )
    .attr('y1', (d: GramLinkDatum) =>
      isGramNodeDatum(d.source) ? d.source.y : 0
    )
    .attr('x2', (d: GramLinkDatum) =>
      isGramNodeDatum(d.target) ? d.target.x : 0
    )
    .attr('y2', (d: GramLinkDatum) =>
      isGramNodeDatum(d.target) ? d.target.y : 0
    );
};

export const moveNodes = (nodes: any) => {
  nodes.attr('transform', function(d: any) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
};

interface D3GramDrawConfiguration {}

const defaultConfiguration: D3GramDrawConfiguration = {};

/**
 *
 * @param graph gram source text
 * @param selector dom selector for an svg element
 * @param D3GramDrawConfiguration
 */
export const draw = (
  graph: GramGraphData,
  selector: string,
  configuration: D3GramDrawConfiguration = {}
) => {
  const mergedConfiguration = Object.assign(
    defaultConfiguration,
    configuration
  );
  console.log(mergedConfiguration);

  const svg = select(selector);

  let linkSelection = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(graph.links)
    .join('line')
    .attr('stroke-width', 2);
  // .attr("stroke-width", d => Math.sqrt(d.value));

  let nodeSelection = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(graph.nodes)
    .enter()
    .append('g');

  nodeSelection
    .append('path')
    .attr('fill', colorFor)
    .attr('stroke', d =>
      (d3.color(colorFor(d)) || d3.rgb(0x33, 0x33, 0x33)).darker().hex()
    )
    .attr('stroke-width', 4)
    .attr('d', shapeFor);

  nodeSelection.append('title').text(function(d) {
    return d.id;
  });

  moveNodes(nodeSelection);
  moveLinks(linkSelection);

  return {
    nodeSelection,
    linkSelection,
  };
};
