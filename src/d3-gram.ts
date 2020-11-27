import { toAST } from '@gram-data/gram-parse';
import { edges, nodes } from '@gram-data/gram-ops';
import {
  GramGraphData,
  GramLinkDatum,
  GramNodeDatum,
  GramPathDatum,
  makeGramLinkDatum,
  makeGramNodeDatum,
  MISSING_ID,
} from './gram-d3-types';
import { GramEdge, GramNode, GramPath, isGramNode } from '@gram-data/gram-ast';

/**
 * Parses text as [gram](https://github.com/gram-data/gram-js),
 * returning a graph representated nodes, links and paths.
 *
 * @param src
 */
export const d3Gram = (src: string): GramGraphData => {
  const parsed = toAST(src);
  const d3Gram = {
    nodes: (nodes(parsed) as GramNode[]).map(nodeToD3),
    links: parsed.children.reduce(
      (acc: GramLinkDatum[], p: GramPath) =>
        acc.concat((edges(p) as GramEdge[]).map(edgeToD3)),
      [] as GramLinkDatum[]
    ),
    paths: [] as GramPathDatum[],
  };

  return d3Gram;
};

export const nodeToD3 = (node: GramNode): GramNodeDatum => {
  return isGramNode(node)
    ? makeGramNodeDatum(node.id, node.labels, node.record)
    : makeGramNodeDatum('random');
};

const source = (edge: GramEdge): string => {
  if (edge.kind === 'left') return edge.children[1].id || MISSING_ID;
  return edge.children[0].id || MISSING_ID;
};

const target = (edge: GramEdge): string => {
  if (edge.kind === 'left') return edge.children[0].id || MISSING_ID;
  return edge.children[1].id || MISSING_ID;
};

export const edgeToD3 = (edge: GramEdge): GramLinkDatum => {
  return makeGramLinkDatum(
    source(edge),
    target(edge),
    edge.id,
    edge.labels,
    edge.record
  );
};
