import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

export const MISSING_ID = '__missing_id__';

export interface GramNodeDatum extends SimulationNodeDatum {
  id: string;
  labels: string[];
  record: { [key: string]: any };
}

export const makeGramNodeDatum = (
  id?: string,
  labels?: string[],
  record?: { [key: string]: any }
) => {
  return {
    id: id || MISSING_ID,
    labels: labels || [],
    record: record || {},
  };
};

export const isGramNodeDatum = (o: any): o is GramNodeDatum => {
  return (o as GramNodeDatum).id !== undefined;
};

export interface GramLinkDatum extends SimulationLinkDatum<GramNodeDatum> {
  id: string;
  labels?: string[];
  record: { [key: string]: any };
}

export const makeGramLinkDatum = (
  source: string,
  target: string,
  id?: string,
  labels?: string[],
  record?: { [key: string]: any }
) => {
  return {
    id: id || MISSING_ID,
    labels: labels || [],
    record: record || {},
    source,
    target,
  };
};

export interface GramPathDatum {
  links: GramLinkDatum[];
}

export interface GramGraphData {
  nodes: GramNodeDatum[];
  links: GramLinkDatum[];
  paths: GramPathDatum[];
}
