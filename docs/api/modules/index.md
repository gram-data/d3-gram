---
title: index
layout: api
---

[gram.js API](../README.md) / [Exports](../modules.md) / index

# Module: index

## Table of contents

### References

- [default](index.md#default)

### Interfaces

- [D3GramLayoutConfiguration](../interfaces/index.d3gramlayoutconfiguration.md)
- [GramGraphData](../interfaces/index.gramgraphdata.md)
- [GramLinkDatum](../interfaces/index.gramlinkdatum.md)
- [GramNodeDatum](../interfaces/index.gramnodedatum.md)
- [GramPathDatum](../interfaces/index.grampathdatum.md)

### Type aliases

- [PathDatumRecord](index.md#pathdatumrecord)

### Variables

- [MISSING\_ID](index.md#missing_id)

### Functions

- [dataFromPath](index.md#datafrompath)
- [draw](index.md#draw)
- [edgeToD3](index.md#edgetod3)
- [isGramNodeDatum](index.md#isgramnodedatum)
- [layout](index.md#layout)
- [makeGramLinkDatum](index.md#makegramlinkdatum)
- [makeGramNodeDatum](index.md#makegramnodedatum)
- [moveLinks](index.md#movelinks)
- [moveNodes](index.md#movenodes)
- [nodeToD3](index.md#nodetod3)
- [parse](index.md#parse)

## References

### default

Renames and exports: [parse](d3_gram_parse.md#parse)

## Type aliases

### PathDatumRecord

Ƭ **PathDatumRecord**: { [key: string]: *any*;  }

Defined in: [src/d3-gram-types.ts:5](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-types.ts#L5)

## Variables

### MISSING\_ID

• `Const` **MISSING\_ID**: *__missing_id__*= '\_\_missing\_id\_\_'

Defined in: [src/d3-gram-types.ts:3](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-types.ts#L3)

## Functions

### dataFromPath

▸ `Const`**dataFromPath**(`p`: GramPath): [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord)

#### Parameters:

Name | Type |
------ | ------ |
`p` | GramPath |

**Returns:** [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord)

Defined in: [src/d3-gram-parse.ts:42](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-parse.ts#L42)

___

### draw

▸ `Const`**draw**(`graph`: [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md), `selector`: *string*, `configuration?`: D3GramDrawConfiguration): *object*

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`graph` | [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md) | - | gram source text   |
`selector` | *string* | - | dom selector for an svg element   |
`configuration` | D3GramDrawConfiguration | ... | - |

**Returns:** *object*

Name | Type |
------ | ------ |
`links` | *Selection*<*any*, [*GramLinkDatum*](../interfaces/d3_gram_types.gramlinkdatum.md), *any*, *unknown*\> |
`nodes` | *Selection*<*any*, [*GramNodeDatum*](../interfaces/d3_gram_types.gramnodedatum.md), *any*, *unknown*\> |

Defined in: [src/d3-gram-renderer.ts:121](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-renderer.ts#L121)

___

### edgeToD3

▸ `Const`**edgeToD3**(`edge`: GramEdge): [*GramLinkDatum*](../interfaces/d3_gram_types.gramlinkdatum.md)

#### Parameters:

Name | Type |
------ | ------ |
`edge` | GramEdge |

**Returns:** [*GramLinkDatum*](../interfaces/d3_gram_types.gramlinkdatum.md)

Defined in: [src/d3-gram-parse.ts:66](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-parse.ts#L66)

___

### isGramNodeDatum

▸ `Const`**isGramNodeDatum**(`o`: *any*): o is GramNodeDatum

#### Parameters:

Name | Type |
------ | ------ |
`o` | *any* |

**Returns:** o is GramNodeDatum

Defined in: [src/d3-gram-types.ts:25](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-types.ts#L25)

___

### layout

▸ `Const`**layout**(`graph`: [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md), `configuration?`: *Partial*<[*D3GramLayoutConfiguration*](../interfaces/d3_gram_layout.d3gramlayoutconfiguration.md)\>): *Simulation*<SimulationNodeDatum, *undefined*\>

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`graph` | [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md) | - |  |
`configuration` | *Partial*<[*D3GramLayoutConfiguration*](../interfaces/d3_gram_layout.d3gramlayoutconfiguration.md)\> | ... |     |

**Returns:** *Simulation*<SimulationNodeDatum, *undefined*\>

Defined in: [src/d3-gram-layout.ts:44](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-layout.ts#L44)

___

### makeGramLinkDatum

▸ `Const`**makeGramLinkDatum**(`source`: *string*, `target`: *string*, `id?`: *string*, `labels?`: *string*[], `record?`: [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord)): *object*

#### Parameters:

Name | Type |
------ | ------ |
`source` | *string* |
`target` | *string* |
`id?` | *string* |
`labels?` | *string*[] |
`record?` | [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord) |

**Returns:** *object*

Name | Type |
------ | ------ |
`id` | *string* |
`labels` | *string*[] |
`record` | [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord) |
`source` | *string* |
`target` | *string* |

Defined in: [src/d3-gram-types.ts:35](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-types.ts#L35)

___

### makeGramNodeDatum

▸ `Const`**makeGramNodeDatum**(`id?`: *string*, `labels?`: *string*[], `record?`: [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord)): *object*

#### Parameters:

Name | Type |
------ | ------ |
`id?` | *string* |
`labels?` | *string*[] |
`record?` | [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord) |

**Returns:** *object*

Name | Type |
------ | ------ |
`id` | *string* |
`labels` | *string*[] |
`record` | [*PathDatumRecord*](d3_gram_types.md#pathdatumrecord) |

Defined in: [src/d3-gram-types.ts:13](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-types.ts#L13)

___

### moveLinks

▸ `Const`**moveLinks**(`links`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`links` | *any* |

**Returns:** *void*

Defined in: [src/d3-gram-renderer.ts:89](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-renderer.ts#L89)

___

### moveNodes

▸ `Const`**moveNodes**(`nodes`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`nodes` | *any* |

**Returns:** *void*

Defined in: [src/d3-gram-renderer.ts:105](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-renderer.ts#L105)

___

### nodeToD3

▸ `Const`**nodeToD3**(`node`: GramNode): [*GramNodeDatum*](../interfaces/d3_gram_types.gramnodedatum.md)

#### Parameters:

Name | Type |
------ | ------ |
`node` | GramNode |

**Returns:** [*GramNodeDatum*](../interfaces/d3_gram_types.gramnodedatum.md)

Defined in: [src/d3-gram-parse.ts:50](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-parse.ts#L50)

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

Defined in: [src/d3-gram-parse.ts:29](https://github.com/gram-data/d3-gram/blob/b65614d/src/d3-gram-parse.ts#L29)
