---
title: d3_gram_renderer
layout: api
---

[gram.js API](../README.md) / [Exports](../modules.md) / d3-gram-renderer

# Module: d3-gram-renderer

## Table of contents

### Functions

- [draw](d3_gram_renderer.md#draw)
- [updateLinks](d3_gram_renderer.md#updatelinks)
- [updateNodes](d3_gram_renderer.md#updatenodes)

## Functions

### draw

▸ `Const`**draw**(`graph`: [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md), `selector`: *any*, `configuration?`: *Partial*<D3GramDrawConfiguration\>): *object*

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`graph` | [*GramGraphData*](../interfaces/d3_gram_types.gramgraphdata.md) | - | gram source text   |
`selector` | *any* | - | dom selector for an svg element   |
`configuration` | *Partial*<D3GramDrawConfiguration\> | ... | - |

**Returns:** *object*

Name | Type |
------ | ------ |
`linkSelection` | *Selection*<*any*, [*GramLinkDatum*](../interfaces/d3_gram_types.gramlinkdatum.md), *any*, *unknown*\> |
`nodeSelection` | *Selection*<*any*, [*GramNodeDatum*](../interfaces/d3_gram_types.gramnodedatum.md), *any*, *unknown*\> |

Defined in: [src/d3-gram-renderer.ts:150](https://github.com/gram-data/d3-gram/blob/f6f773c/src/d3-gram-renderer.ts#L150)

___

### updateLinks

▸ `Const`**updateLinks**(`links`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`links` | *any* |

**Returns:** *void*

Defined in: [src/d3-gram-renderer.ts:114](https://github.com/gram-data/d3-gram/blob/f6f773c/src/d3-gram-renderer.ts#L114)

___

### updateNodes

▸ `Const`**updateNodes**(`nodes`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`nodes` | *any* |

**Returns:** *void*

Defined in: [src/d3-gram-renderer.ts:130](https://github.com/gram-data/d3-gram/blob/f6f773c/src/d3-gram-renderer.ts#L130)
