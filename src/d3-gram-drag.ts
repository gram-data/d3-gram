import {
  Simulation,
  SimulationNodeDatum,
  SimulationLinkDatum,
  drag as d3Drag,
} from 'd3';

export const drag = <
  ActualNodeDatum extends SimulationNodeDatum,
  ActualLinkDatum extends SimulationLinkDatum<ActualNodeDatum>
>(
  simulation: Simulation<ActualNodeDatum, ActualLinkDatum>
) => {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3Drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};
