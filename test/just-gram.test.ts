import { toAST } from '@gram-data/gram-parse';
import { GramPath, isGramPath, isGramSeq } from '@gram-data/gram-ast';
import { head, tail, nodes, edges } from '@gram-data/gram-ops';

describe('Gram', () => {
  it('parses text into an ast', () => {
    const src = '(a)-->(b)';
    const seq = toAST(src);

    expect(seq).toBeDefined();
    expect(isGramSeq(seq)).toBeTruthy();
    const path = seq.children[0];
    expect(path).toBeDefined();
    expect(isGramPath(path)).toBeTruthy();
  });
  it('extracts nodes from the path', () => {
    const src = '(a)-->(b)';
    const seq = toAST(src);
    const path = seq.children[0];
    const ns: GramPath[] = nodes(path);
    expect(ns).toHaveLength(2);
    expect(head(path).id).toBe('a');
    expect(tail(path).id).toBe('b');
  });
  it('deduplicates nodes from the path', () => {
    const src = '(a)-->(a)';
    const seq = toAST(src);
    const path = seq.children[0];
    const ns: GramPath[] = nodes(path);
    expect(ns).toHaveLength(1);
    expect(head(path).id).toBe('a');
    expect(tail(path).id).toBe('a');
  });
  it('extracts links from the ast', () => {
    const src = '(a)-->(b)';
    const seq = toAST(src);
    const path = seq.children[0];
    const es: GramPath[] = edges(path);
    expect(es).toHaveLength(1);
  });
  it('preserves node labels', () => {
    const src = '(a:Aye)';
    const seq = toAST(src);
    const path = seq.children[0];
    const ns: GramPath[] = nodes(path);
    expect(ns).toHaveLength(1);
    const n = ns[0];
    expect(n.labels[0]).toBe('Aye');
  });
});
