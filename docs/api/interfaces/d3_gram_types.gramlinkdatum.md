---
title: d3_gram_types.gramlinkdatum
layout: api
---

[gram.js API](../README.md) / [Exports](../modules.md) / [d3-gram-types](../modules/d3_gram_types.md) / GramLinkDatum

# Interface: GramLinkDatum

[d3-gram-types](../modules/d3_gram_types.md).GramLinkDatum

## Hierarchy

* *SimulationLinkDatum*<[*GramNodeDatum*](d3_gram_types.gramnodedatum.md)\>

  ↳ **GramLinkDatum**

## Table of contents

### Properties

- [id](d3_gram_types.gramlinkdatum.md#id)
- [index](d3_gram_types.gramlinkdatum.md#index)
- [labels](d3_gram_types.gramlinkdatum.md#labels)
- [record](d3_gram_types.gramlinkdatum.md#record)
- [source](d3_gram_types.gramlinkdatum.md#source)
- [target](d3_gram_types.gramlinkdatum.md#target)

## Properties

### id

• **id**: *string*

Defined in: [src/d3-gram-types.ts:30](https://github.com/gram-data/d3-gram/blob/f6f773c/src/d3-gram-types.ts#L30)

___

### index

• `Optional` **index**: *undefined* | *number*

The zero-based index into the links array. Internally generated when calling ForceLink.links(...)

Defined in: node_modules/@types/d3-force/index.d.ts:90

___

### labels

• `Optional` **labels**: *undefined* | *string*[]

Defined in: [src/d3-gram-types.ts:31](https://github.com/gram-data/d3-gram/blob/f6f773c/src/d3-gram-types.ts#L31)

___

### record

• **record**: [*PathDatumRecord*](../modules/d3_gram_types.md#pathdatumrecord)

Defined in: [src/d3-gram-types.ts:32](https://github.com/gram-data/d3-gram/blob/f6f773c/src/d3-gram-types.ts#L32)

___

### source

• **source**: *string* | *number* | [*GramNodeDatum*](d3_gram_types.gramnodedatum.md)

Link’s source node.
For convenience, a link’s source and target properties may be initialized using numeric or string identifiers rather than object references; see link.id.
When the link force is initialized (or re-initialized, as when the nodes or links change), any link.source or link.target property which is not an object
is replaced by an object reference to the corresponding node with the given identifier.
After initialization, the source property represents the source node object.

Defined in: node_modules/@types/d3-force/index.d.ts:78

___

### target

• **target**: *string* | *number* | [*GramNodeDatum*](d3_gram_types.gramnodedatum.md)

Link’s source link
For convenience, a link’s source and target properties may be initialized using numeric or string identifiers rather than object references; see link.id.
When the link force is initialized (or re-initialized, as when the nodes or links change), any link.source or link.target property which is not an object
is replaced by an object reference to the corresponding node with the given identifier.
After initialization, the target property represents the target node object.

Defined in: node_modules/@types/d3-force/index.d.ts:86
