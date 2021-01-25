---
title: index.gramlinkdatum
layout: api
---

[gram.js API](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / GramLinkDatum

# Interface: GramLinkDatum

[index](../modules/index.md).GramLinkDatum

## Hierarchy

* *SimulationLinkDatum*<[*GramNodeDatum*](d3_gram_types.gramnodedatum.md)\>

  ↳ **GramLinkDatum**

## Table of contents

### Properties

- [id](index.gramlinkdatum.md#id)
- [index](index.gramlinkdatum.md#index)
- [labels](index.gramlinkdatum.md#labels)
- [record](index.gramlinkdatum.md#record)
- [source](index.gramlinkdatum.md#source)
- [target](index.gramlinkdatum.md#target)

## Properties

### id

• **id**: *string*

Defined in: [src/d3-gram-types.ts:30](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L30)

___

### index

• `Optional` **index**: *undefined* | *number*

The zero-based index into the links array. Internally generated when calling ForceLink.links(...)

Defined in: node_modules/@types/d3-force/index.d.ts:90

___

### labels

• `Optional` **labels**: *undefined* | *string*[]

Defined in: [src/d3-gram-types.ts:31](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L31)

___

### record

• **record**: [*PathDatumRecord*](../modules/d3_gram_types.md#pathdatumrecord)

Defined in: [src/d3-gram-types.ts:32](https://github.com/gram-data/d3-gram/blob/3dd6a0d/src/d3-gram-types.ts#L32)

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
