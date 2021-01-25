import * as d3 from 'd3';

import { GramGraphData } from './d3-gram-types';

const initializeSimulation = (center: { x: number; y: number }) =>
  d3
    .forceSimulation()
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(center.x, center.y))
    .force('collision', d3.forceCollide().radius(30))
    .stop();

/**
 *
 * All numbers are in scale-free units.
 *
 */
export interface D3GramLayoutConfiguration {
  /**
   * Scene width.
   */
  width: number;
  /**
   * Scene height.
   */
  height: number;
  /**
   * How long to run the simulation.
   */
  ticks: number;
}

const defaultLayoutConfiguration: D3GramLayoutConfiguration = {
  width: 1200,
  height: 800,
  ticks: 300,
};

/**
 *
 * @param graph
 * @param configuration
 */
export const layout = (
  graph: GramGraphData,
  configuration: Partial<D3GramLayoutConfiguration> = {}
) => {
  const _config: D3GramLayoutConfiguration = Object.assign(
    defaultLayoutConfiguration,
    configuration
  );

  const center = { x: _config.width / 2, y: _config.height / 2 };
  let simulation = initializeSimulation(center);

  simulation.nodes(graph.nodes);
  simulation.force(
    'link',
    d3.forceLink(graph.links).id((d: any) => d.id)
  );

  for (
    let tick = 0;
    tick < _config.ticks && simulation.alpha() > simulation.alphaMin();
    tick++
  ) {
    simulation.tick();
  }

  return simulation;
};
