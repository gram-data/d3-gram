---
title: d3_gram_parse
layout: api
---

[gram.js API](../README.md) / [Exports](../modules.md) / d3-gram-parse

# Module: d3-gram-parse

## Table of contents

### Functions

- [dataFromPath](d3_gram_parse.md#datafrompath)
- [edgeToD3](d3_gram_parse.md#edgetod3)
- [nodeToD3](d3_gram_parse.md#nodetod3)
- [parse](d3_gram_parse.md#parse)

## Functions

### dataFromPath

▸ `Const`**dataFromPath**(`p`: GramPath): [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord)

#### Parameters:

Name | Type |
------ | ------ |
`p` | GramPath |

**Returns:** [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord)

Defined in: [src/d3-gram-parse.ts:42](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-parse.ts#L42)

___

### edgeToD3

▸ `Const`**edgeToD3**(`edge`: GramEdge): [*GramLinkDatum*](../interfaces/d3_gram_types.gramlinkdatum.md)

#### Parameters:

Name | Type |
------ | ------ |
`edge` | GramEdge |

**Returns:** [*GramLinkDatum*](../interfaces/d3_gram_types.gramlinkdatum.md)

Defined in: [src/d3-gram-parse.ts:66](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-parse.ts#L66)

___

### nodeToD3

▸ `Const`**nodeToD3**(`node`: GramNode): [*GramNodeDatum*](../interfaces/d3_gram_types.gramnodedatum.md)

#### Parameters:

Name | Type |
------ | ------ |
`node` | GramNode |

**Returns:** [*GramNodeDatum*](../interfaces/d3_gram_types.gramnodedatum.md)

Defined in: [src/d3-gram-parse.ts:50](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-parse.ts#L50)

___

### parse

▸ `Const`**parse**(`src`: *string*): [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md)

Parses text as [gram](https://github.com/gram-data/gram-js),
returning a graph representated nodes, links and paths.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`src` | *string* |     |

**Returns:** [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md)

Defined in: [src/d3-gram-parse.ts:29](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-parse.ts#L29)
