---
title: d3_gram_types
layout: api
---

[gram.js API](../README.md) / [Exports](../modules.md) / d3-gram-types

# Module: d3-gram-types

## Table of contents

### Interfaces

- [GramGraphData](../interfaces/d3_gram_types.gramgraphdata.md)
- [GramLinkDatum](../interfaces/d3_gram_types.gramlinkdatum.md)
- [GramNodeDatum](../interfaces/d3_gram_types.gramnodedatum.md)
- [GramPathDatum](../interfaces/d3_gram_types.grampathdatum.md)

### Type aliases

- [PathDatumRecord](d3_gram_types.md#pathdatumrecord)

### Variables

- [MISSING\_ID](d3_gram_types.md#missing_id)

### Functions

- [isGramNodeDatum](d3_gram_types.md#isgramnodedatum)
- [makeGramLinkDatum](d3_gram_types.md#makegramlinkdatum)
- [makeGramNodeDatum](d3_gram_types.md#makegramnodedatum)

## Type aliases

### PathDatumRecord

Ƭ **PathDatumRecord**: { [key: string]: *any*;  }

Defined in: [src/d3-gram-types.ts:5](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L5)

## Variables

### MISSING\_ID

• `Const` **MISSING\_ID**: *__missing_id__*= '\_\_missing\_id\_\_'

Defined in: [src/d3-gram-types.ts:3](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L3)

## Functions

### isGramNodeDatum

▸ `Const`**isGramNodeDatum**(`o`: *any*): o is GramNodeDatum

#### Parameters:

Name | Type |
------ | ------ |
`o` | *any* |

**Returns:** o is GramNodeDatum

Defined in: [src/d3-gram-types.ts:25](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L25)

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

Defined in: [src/d3-gram-types.ts:35](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L35)

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

Defined in: [src/d3-gram-types.ts:13](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L13)
