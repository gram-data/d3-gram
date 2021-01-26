(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory((global.gram = global.gram || {}, global.gram.d3 = {})));
}(this, (function (exports) { 'use strict';

  const MISSING_ID = '__missing_id__';
  const makeGramNodeDatum = (id, labels, record) => {
    return {
      id: id || MISSING_ID,
      labels: labels || [],
      record: record || []
    };
  };
  const isGramNodeDatum = o => {
    return o.id !== undefined;
  };
  const makeGramLinkDatum = (source, target, id, labels, record) => {
    return {
      id: id || MISSING_ID,
      labels: labels || [],
      record: record || [],
      source,
      target
    };
  };

  var _boolean = /true|false|TRUE|FALSE\b(?!@)/;
  var hexadecimal$1 = /-?0x(?:[0-9a-fA-F]+)\b(?!@)/;
  var octal$1 = /-?0(?:[0-7]+)\b(?!@)/;
  var measurement$1 = /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?[a-zA-Z]+\b(?!@)/;
  var decimal$1 = /-?(?:[0-9]|[1-9][0-9]+)\.[0-9]+(?:[eE][-+]?[0-9]+)?\b(?!@)/;
  var integer$1 = /-?(?:[0-9]|[1-9][0-9]+)(?:[eE][-+]?[0-9]+)?\b(?!@)/;
  var taggedString$1 = /[a-zA-Z][0-9a-zA-Z_@]*`(?:\\[`bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^`\\])*`/;
  var doubleQuotedString$1 = /"(?:\\["bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/;
  var singleQuotedString$1 = /'(?:\\['bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^'\\])*'/;
  var tickedString$1 = /`(?:\\[`bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^`\\])*`/;
  var symbol$1 = /[a-zA-Z_][0-9a-zA-Z_]*\b(?!@)/;
  var identifier$1 = /[0-9a-zA-Z_@]+\b@*/;
  var checkIdentifierRegex = /*#__PURE__*/new RegExp('^' + identifier$1.source + '$');
  /**
   * Checks whether the given string is a valid identifier.
   *
   */

  var isValidIdentifier = function isValidIdentifier(s) {
    return s && checkIdentifierRegex.test(s);
  };

  var gramTokens = {
    __proto__: null,
    boolean: _boolean,
    hexadecimal: hexadecimal$1,
    octal: octal$1,
    measurement: measurement$1,
    decimal: decimal$1,
    integer: integer$1,
    taggedString: taggedString$1,
    doubleQuotedString: doubleQuotedString$1,
    singleQuotedString: singleQuotedString$1,
    tickedString: tickedString$1,
    symbol: symbol$1,
    identifier: identifier$1,
    isValidIdentifier: isValidIdentifier
  };

  /**
   * # Gram AST Types
   *
   * References:
   *
   * - [unist](https://github.com/syntax-tree/unist) - Universal Synax Tree
   * - [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
   * @packageDocumentation
   */
  /**
   * Type guard for GramSeq.
   *
   * @param o any object
   */

  var isGramSeq = function isGramSeq(o) {
    return !!o.type && o.type === 'seq';
  };
  /**
   * Type guard for a Path.
   *
   * @param o any object
   */

  var isGramPath = function isGramPath(o) {
    return !!o.type && o.type === 'path';
  };
  /**
   * Constant identity for empty paths: `ø`.
   */

  var EMPTY_PATH_ID = 'ø';
  /**
   * Type guard for GramEmptyPath.
   *
   * @param o any object
   */

  var isGramEmptyPath = function isGramEmptyPath(o) {
    return isGramPath(o) && o.id === EMPTY_PATH_ID;
  };
  /**
   * Type guard for GramNode.
   *
   * @param o any object
   */

  var isGramNode = function isGramNode(o) {
    return isGramPath(o) && o.children && o.children.length === 0 && o.id !== EMPTY_PATH_ID;
  };
  /**
   * A type guard to narrow a GramRecordValue to a GramRecord.
   *
   * Warning: this is not a runtime guarantee
   *
   * @param v any GramRecordValue
   */

  var isGramRecord = function isGramRecord(v) {
    return typeof v == 'object' && v instanceof Map;
  };
  var isGramLiteralArray = function isGramLiteralArray(v) {
    return Array.isArray(v) && isGramLiteral(v[0]);
  };
  /**
   * Type guard for GramLiteral.
   *
   * @param o any object
   */

  var isGramLiteral = function isGramLiteral(o) {
    return !!o.type && !!o.value && o.type !== 'property';
  };

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function normalizeChildren(children) {
    if (Array.isArray(children)) {
      return children;
    } else if (children instanceof Function) {
      var res = children();
      return normalizeChildren(res);
    } else if (typeof children === 'undefined') {
      return [];
    } else {
      return [children];
    }
  }

  var dateToYMD = function dateToYMD(d) {
    return d.toISOString().slice(0, 10);
  };
  /**
   * Build a path sequence that represents a graph.
   *
   * @param paths sequence of paths through history
   * @param id optional reference identifier. The "name" of this graph instance.
   * @param labels optional labels
   * @param record optional graph-level data
   */


  var seq = function seq(paths, id, labels, record) {
    return _extends({
      type: 'seq',
      id: id
    }, labels && {
      labels: labels
    }, record && {
      record: record
    }, {
      children: normalizeChildren(paths)
    });
  };
  /**
   * Build a path.
   *
   * @param members sub-paths to compose
   * @param attributes attributes
   */

  var cons = function cons(members, attributes) {
    if (attributes === void 0) {
      attributes = {};
    }

    var element = _extends({
      type: 'path'
    }, attributes.id && {
      id: attributes.id
    }, attributes.labels && {
      labels: attributes.labels
    }, attributes.record && {
      record: attributes.record
    });

    if (members === undefined) {
      if (element.id && element.id !== EMPTY_PATH_ID) {
        element.children = [];
        return element;
      }

      element.children = undefined;
      return EMPTY_PATH;
    } else if (members.length === 0) {
      if (element.id === EMPTY_PATH_ID) {
        return EMPTY_PATH;
      }

      element.children = [];
      return element;
    } else if (members.length === 1) {
      var lhs = members[0];

      if (isGramEmptyPath(lhs)) {
        element.children = [];
        return element;
      } else {
        element.children = [lhs];
        return element;
      }
    } else if (members.length === 2) {
      if (attributes.kind && attributes.kind !== 'pair' && isGramNode(members[0]) && isGramNode(members[1])) {
        element.kind = attributes.kind;
        element.children = [members[0], members[1]];
        return element;
      } else if (isGramEmptyPath(members[0]) && isGramEmptyPath(members[1])) {
        element.kind = attributes.kind;
        element.children = [];
        return element;
      }

      element.children = [members[0], members[1]];
    }

    element.kind = attributes.kind || 'pair';
    return element;
  };
  /**
   * Singleton instance of GramEmptyPath
   */

  var EMPTY_PATH = {
    type: 'path',
    id: EMPTY_PATH_ID,
    labels: undefined,
    record: undefined,
    children: []
  };
  /**
   * Convenience function for retrieving the singleton GramEmptyPath.
   */

  var empty = function empty() {
    return EMPTY_PATH;
  };
  /**
   * Build a GramNode.
   *
   * @param id identifier
   * @param labels
   * @param record
   * @param annotation
   */

  var node = function node(id, labels, record) {
    return _extends({
      type: 'path'
    }, id && {
      id: id
    }, labels && {
      labels: labels
    }, record && {
      record: record
    }, {
      children: []
    });
  };
  /**
   * Build an Edge.
   *
   * @param children
   * @param kind
   * @param id
   * @param labels
   * @param record
   */

  var edge = function edge(children, kind, id, labels, record) {
    return _extends({
      type: 'path',
      id: id
    }, labels && {
      labels: labels
    }, record && {
      record: record
    }, {
      kind: kind,
      children: children
    });
  };
  /**
   * Build a pair
   *
   * @param children
   * @param id
   * @param labels
   * @param record
   */

  var path = function path(kind, members, id, labels, record) {
    return _extends({
      type: 'path',
      kind: kind,
      id: id
    }, labels && {
      labels: labels
    }, record && {
      record: record
    }, {
      children: members
    });
  };
  /**
   * Build a pair
   *
   * @param children
   * @param id
   * @param labels
   * @param record
   */

  var pair = function pair(members, id, labels, record) {
    return path('pair', members, id, labels, record);
  };
  /**
   * Create a new, empty GramRecord.
   *
   */

  var emptyRecord = function emptyRecord() {
    return new Map();
  };
  /**
   * Reduces an array of GramProperties into a GramRecord.
   *
   * @param properties
   */

  var propertiesToRecord = function propertiesToRecord(properties) {
    return properties.reduce(function (acc, p) {
      acc.set(p.name, p.value);
      return acc;
    }, emptyRecord());
  };
  /**
   * Transforms a plain js object into a GramRecord.
   *
   * @param o
   */

  var objectToRecord = function objectToRecord(o) {
    return Object.entries(o).reduce(function (acc, _ref) {
      var k = _ref[0],
          v = _ref[1];
      acc.set(k, propertyValue(v));
      return acc;
    }, emptyRecord());
  };
  /**
   * Builds a GramProperty from a name
   * @param name
   * @param value
   */

  var property = function property(name, value) {
    var Node = {
      type: 'property',
      name: name,
      value: isGramLiteral(value) ? value : propertyValue(value)
    };
    return Node;
  };
  var propertyValue = function propertyValue(value) {
    if (Array.isArray(value)) {
      return value.map(function (v) {
        return propertyValue(v);
      });
    } else if (typeof value === 'object') {
      if (value instanceof Date) {
        return date(value);
      } else if (isGramLiteral(value)) {
        return value;
      }

      return objectToRecord(value);
    } else {
      switch (typeof value) {
        case 'string':
          return string(value);

        case 'bigint':
          return decimal$2(value.toString());

        case 'boolean':
          return _boolean$1(value);

        case 'number':
          return decimal$2(value.toString());

        case 'symbol':
          return string(value.toString());

        default:
          throw new Error("Unsupported value: " + value);
      }
    }
  };

  var _boolean$1 = function _boolean(value) {
    return {
      type: 'boolean',
      value: value ? 'true' : 'false'
    };
  };
  var string = function string(value) {
    return {
      type: 'string',
      value: value
    };
  };
  var tagged = function tagged(tag, value) {
    return {
      type: 'tagged',
      value: value,
      tag: tag
    };
  };
  var integer$2 = function integer(value) {
    return {
      type: 'integer',
      value: String(value)
    };
  };
  var decimal$2 = function decimal(value) {
    return {
      type: 'decimal',
      value: String(value)
    };
  };
  var hexadecimal$2 = function hexadecimal(value) {
    return {
      type: 'hexadecimal',
      value: typeof value === 'number' ? value.toString(16) : value
    };
  };
  var octal$2 = function octal(value) {
    return {
      type: 'octal',
      value: typeof value === 'number' ? value.toString(8) : value
    };
  };
  var measurement$2 = function measurement(unit, value) {
    return {
      type: 'measurement',
      value: String(value),
      unit: unit
    };
  };
  var date = function date(value) {
    return tagged('date', value instanceof Date ? dateToYMD(value) : value);
  };
  var flatten = function flatten(xs, depth) {
    if (depth === void 0) {
      depth = 1;
    }

    return xs.flat(depth).filter(function (x) {
      return x !== null;
    });
  };

  var head = function head(p) {
    return p.children === undefined || p.children.length === 0 ? p : head(p.children[0]);
  };
  var tail = function tail(p) {
    return p.children === undefined || p.children.length === 0 ? p : tail(p.children[p.children.length - 1]);
  };
  /**
   * Node set projected from within a path.
   *
   * @param p paths from which to project nodes
   */

  var nodes = function nodes(p) {
    if (isGramNode(p)) return [p];
    if (isGramSeq(p)) return nodes(p.children);

    if (Array.isArray(p)) {
      var unidentifiedNodes = [];
      var nodemap = p.map(nodes).flat().reduce(function (acc, child) {
        if (child.id) {
          if (acc.has(child.id)) {
            acc.set(child.id, Object.assign(acc.get(child.id), child));
          } else {
            acc.set(child.id, child);
          }
        } else {
          unidentifiedNodes.push(child);
        }

        return acc;
      }, new Map());
      return Array.from(nodemap.values()).concat(unidentifiedNodes);
    } else {
      return nodes(p.children);
    }
  };
  var edges = function edges(p) {
    return p === undefined ? [] : p.children === undefined || p.children.length === 0 ? [] : p.children.length === 2 ? [].concat(edges(p.children[0]), p.kind !== undefined && p.kind !== 'pair' ? [edge([tail(p.children[0]), head(p.children[1])], p.kind, p.id, p.labels, p.record)] : [], edges(p.children[1])) : p.children.reduce(function (acc, child) {
      return [].concat(acc, edges(child));
    }, []);
  };

  var bail_1 = bail;

  function bail(err) {
    if (err) {
      throw err
    }
  }

  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */

  var isBuffer = function isBuffer (obj) {
    return obj != null && obj.constructor != null &&
      typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  };

  var hasOwn = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;
  var defineProperty = Object.defineProperty;
  var gOPD = Object.getOwnPropertyDescriptor;

  var isArray = function isArray(arr) {
  	if (typeof Array.isArray === 'function') {
  		return Array.isArray(arr);
  	}

  	return toStr.call(arr) === '[object Array]';
  };

  var isPlainObject = function isPlainObject(obj) {
  	if (!obj || toStr.call(obj) !== '[object Object]') {
  		return false;
  	}

  	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
  	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  	// Not own constructor property must be Object
  	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
  		return false;
  	}

  	// Own properties are enumerated firstly, so to speed up,
  	// if last one is own, then all properties are own.
  	var key;
  	for (key in obj) { /**/ }

  	return typeof key === 'undefined' || hasOwn.call(obj, key);
  };

  // If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
  var setProperty = function setProperty(target, options) {
  	if (defineProperty && options.name === '__proto__') {
  		defineProperty(target, options.name, {
  			enumerable: true,
  			configurable: true,
  			value: options.newValue,
  			writable: true
  		});
  	} else {
  		target[options.name] = options.newValue;
  	}
  };

  // Return undefined instead of __proto__ if '__proto__' is not an own property
  var getProperty = function getProperty(obj, name) {
  	if (name === '__proto__') {
  		if (!hasOwn.call(obj, name)) {
  			return void 0;
  		} else if (gOPD) {
  			// In early versions of node, obj['__proto__'] is buggy when obj has
  			// __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
  			return gOPD(obj, name).value;
  		}
  	}

  	return obj[name];
  };

  var extend = function extend() {
  	var options, name, src, copy, copyIsArray, clone;
  	var target = arguments[0];
  	var i = 1;
  	var length = arguments.length;
  	var deep = false;

  	// Handle a deep copy situation
  	if (typeof target === 'boolean') {
  		deep = target;
  		target = arguments[1] || {};
  		// skip the boolean and the target
  		i = 2;
  	}
  	if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
  		target = {};
  	}

  	for (; i < length; ++i) {
  		options = arguments[i];
  		// Only deal with non-null/undefined values
  		if (options != null) {
  			// Extend the base object
  			for (name in options) {
  				src = getProperty(target, name);
  				copy = getProperty(options, name);

  				// Prevent never-ending loop
  				if (target !== copy) {
  					// Recurse if we're merging plain objects or arrays
  					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
  						if (copyIsArray) {
  							copyIsArray = false;
  							clone = src && isArray(src) ? src : [];
  						} else {
  							clone = src && isPlainObject(src) ? src : {};
  						}

  						// Never move original objects, clone them
  						setProperty(target, { name: name, newValue: extend(deep, clone, copy) });

  					// Don't bring in undefined values
  					} else if (typeof copy !== 'undefined') {
  						setProperty(target, { name: name, newValue: copy });
  					}
  				}
  			}
  		}
  	}

  	// Return the modified object
  	return target;
  };

  var isPlainObj = value => {
  	if (Object.prototype.toString.call(value) !== '[object Object]') {
  		return false;
  	}

  	const prototype = Object.getPrototypeOf(value);
  	return prototype === null || prototype === Object.prototype;
  };

  var slice = [].slice;

  var wrap_1 = wrap;

  // Wrap `fn`.
  // Can be sync or async; return a promise, receive a completion handler, return
  // new values and errors.
  function wrap(fn, callback) {
    var invoked;

    return wrapped

    function wrapped() {
      var params = slice.call(arguments, 0);
      var callback = fn.length > params.length;
      var result;

      if (callback) {
        params.push(done);
      }

      try {
        result = fn.apply(null, params);
      } catch (error) {
        // Well, this is quite the pickle.
        // `fn` received a callback and invoked it (thus continuing the pipeline),
        // but later also threw an error.
        // We’re not about to restart the pipeline again, so the only thing left
        // to do is to throw the thing instead.
        if (callback && invoked) {
          throw error
        }

        return done(error)
      }

      if (!callback) {
        if (result && typeof result.then === 'function') {
          result.then(then, done);
        } else if (result instanceof Error) {
          done(result);
        } else {
          then(result);
        }
      }
    }

    // Invoke `next`, only once.
    function done() {
      if (!invoked) {
        invoked = true;

        callback.apply(null, arguments);
      }
    }

    // Invoke `done` with one value.
    // Tracks if an error is passed, too.
    function then(value) {
      done(null, value);
    }
  }

  var trough_1 = trough;

  trough.wrap = wrap_1;

  var slice$1 = [].slice;

  // Create new middleware.
  function trough() {
    var fns = [];
    var middleware = {};

    middleware.run = run;
    middleware.use = use;

    return middleware

    // Run `fns`.  Last argument must be a completion handler.
    function run() {
      var index = -1;
      var input = slice$1.call(arguments, 0, -1);
      var done = arguments[arguments.length - 1];

      if (typeof done !== 'function') {
        throw new Error('Expected function as last argument, not ' + done)
      }

      next.apply(null, [null].concat(input));

      // Run the next `fn`, if any.
      function next(err) {
        var fn = fns[++index];
        var params = slice$1.call(arguments, 0);
        var values = params.slice(1);
        var length = input.length;
        var pos = -1;

        if (err) {
          done(err);
          return
        }

        // Copy non-nully input into values.
        while (++pos < length) {
          if (values[pos] === null || values[pos] === undefined) {
            values[pos] = input[pos];
          }
        }

        input = values;

        // Next or done.
        if (fn) {
          wrap_1(fn, next).apply(null, input);
        } else {
          done.apply(null, [null].concat(input));
        }
      }
    }

    // Add `fn` to the list.
    function use(fn) {
      if (typeof fn !== 'function') {
        throw new Error('Expected `fn` to be a function, not ' + fn)
      }

      fns.push(fn);

      return middleware
    }
  }

  var own = {}.hasOwnProperty;

  var unistUtilStringifyPosition = stringify;

  function stringify(value) {
    // Nothing.
    if (!value || typeof value !== 'object') {
      return ''
    }

    // Node.
    if (own.call(value, 'position') || own.call(value, 'type')) {
      return position(value.position)
    }

    // Position.
    if (own.call(value, 'start') || own.call(value, 'end')) {
      return position(value)
    }

    // Point.
    if (own.call(value, 'line') || own.call(value, 'column')) {
      return point(value)
    }

    // ?
    return ''
  }

  function point(point) {
    if (!point || typeof point !== 'object') {
      point = {};
    }

    return index(point.line) + ':' + index(point.column)
  }

  function position(pos) {
    if (!pos || typeof pos !== 'object') {
      pos = {};
    }

    return point(pos.start) + '-' + point(pos.end)
  }

  function index(value) {
    return value && typeof value === 'number' ? value : 1
  }

  var vfileMessage = VMessage;

  // Inherit from `Error#`.
  function VMessagePrototype() {}
  VMessagePrototype.prototype = Error.prototype;
  VMessage.prototype = new VMessagePrototype();

  // Message properties.
  var proto = VMessage.prototype;

  proto.file = '';
  proto.name = '';
  proto.reason = '';
  proto.message = '';
  proto.stack = '';
  proto.fatal = null;
  proto.column = null;
  proto.line = null;

  // Construct a new VMessage.
  //
  // Note: We cannot invoke `Error` on the created context, as that adds readonly
  // `line` and `column` attributes on Safari 9, thus throwing and failing the
  // data.
  function VMessage(reason, position, origin) {
    var parts;
    var range;
    var location;

    if (typeof position === 'string') {
      origin = position;
      position = null;
    }

    parts = parseOrigin(origin);
    range = unistUtilStringifyPosition(position) || '1:1';

    location = {
      start: {line: null, column: null},
      end: {line: null, column: null}
    };

    // Node.
    if (position && position.position) {
      position = position.position;
    }

    if (position) {
      // Position.
      if (position.start) {
        location = position;
        position = position.start;
      } else {
        // Point.
        location.start = position;
      }
    }

    if (reason.stack) {
      this.stack = reason.stack;
      reason = reason.message;
    }

    this.message = reason;
    this.name = range;
    this.reason = reason;
    this.line = position ? position.line : null;
    this.column = position ? position.column : null;
    this.location = location;
    this.source = parts[0];
    this.ruleId = parts[1];
  }

  function parseOrigin(origin) {
    var result = [null, null];
    var index;

    if (typeof origin === 'string') {
      index = origin.indexOf(':');

      if (index === -1) {
        result[1] = origin;
      } else {
        result[0] = origin.slice(0, index);
        result[1] = origin.slice(index + 1);
      }
    }

    return result
  }

  // A derivative work based on:
  // <https://github.com/browserify/path-browserify>.
  // Which is licensed:
  //
  // MIT License
  //
  // Copyright (c) 2013 James Halliday
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy of
  // this software and associated documentation files (the "Software"), to deal in
  // the Software without restriction, including without limitation the rights to
  // use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  // the Software, and to permit persons to whom the Software is furnished to do so,
  // subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  // FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  // COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  // IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  // CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  // A derivative work based on:
  //
  // Parts of that are extracted from Node’s internal `path` module:
  // <https://github.com/nodejs/node/blob/master/lib/path.js>.
  // Which is licensed:
  //
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  var basename_1 = basename;
  var dirname_1 = dirname;
  var extname_1 = extname;
  var join_1 = join;
  var sep = '/';

  function basename(path, ext) {
    var start = 0;
    var end = -1;
    var index;
    var firstNonSlashEnd;
    var seenNonSlash;
    var extIndex;

    if (ext !== undefined && typeof ext !== 'string') {
      throw new TypeError('"ext" argument must be a string')
    }

    assertPath(path);
    index = path.length;

    if (ext === undefined || !ext.length || ext.length > path.length) {
      while (index--) {
        if (path.charCodeAt(index) === 47 /* `/` */) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now.
          if (seenNonSlash) {
            start = index + 1;
            break
          }
        } else if (end < 0) {
          // We saw the first non-path separator, mark this as the end of our
          // path component.
          seenNonSlash = true;
          end = index + 1;
        }
      }

      return end < 0 ? '' : path.slice(start, end)
    }

    if (ext === path) {
      return ''
    }

    firstNonSlashEnd = -1;
    extIndex = ext.length - 1;

    while (index--) {
      if (path.charCodeAt(index) === 47 /* `/` */) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now.
        if (seenNonSlash) {
          start = index + 1;
          break
        }
      } else {
        if (firstNonSlashEnd < 0) {
          // We saw the first non-path separator, remember this index in case
          // we need it if the extension ends up not matching.
          seenNonSlash = true;
          firstNonSlashEnd = index + 1;
        }

        if (extIndex > -1) {
          // Try to match the explicit extension.
          if (path.charCodeAt(index) === ext.charCodeAt(extIndex--)) {
            if (extIndex < 0) {
              // We matched the extension, so mark this as the end of our path
              // component
              end = index;
            }
          } else {
            // Extension does not match, so our result is the entire path
            // component
            extIndex = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }

    if (start === end) {
      end = firstNonSlashEnd;
    } else if (end < 0) {
      end = path.length;
    }

    return path.slice(start, end)
  }

  function dirname(path) {
    var end;
    var unmatchedSlash;
    var index;

    assertPath(path);

    if (!path.length) {
      return '.'
    }

    end = -1;
    index = path.length;

    // Prefix `--` is important to not run on `0`.
    while (--index) {
      if (path.charCodeAt(index) === 47 /* `/` */) {
        if (unmatchedSlash) {
          end = index;
          break
        }
      } else if (!unmatchedSlash) {
        // We saw the first non-path separator
        unmatchedSlash = true;
      }
    }

    return end < 0
      ? path.charCodeAt(0) === 47 /* `/` */
        ? '/'
        : '.'
      : end === 1 && path.charCodeAt(0) === 47 /* `/` */
      ? '//'
      : path.slice(0, end)
  }

  function extname(path) {
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find.
    var preDotState = 0;
    var unmatchedSlash;
    var code;
    var index;

    assertPath(path);

    index = path.length;

    while (index--) {
      code = path.charCodeAt(index);

      if (code === 47 /* `/` */) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now.
        if (unmatchedSlash) {
          startPart = index + 1;
          break
        }

        continue
      }

      if (end < 0) {
        // We saw the first non-path separator, mark this as the end of our
        // extension.
        unmatchedSlash = true;
        end = index + 1;
      }

      if (code === 46 /* `.` */) {
        // If this is our first dot, mark it as the start of our extension.
        if (startDot < 0) {
          startDot = index;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot > -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension.
        preDotState = -1;
      }
    }

    if (
      startDot < 0 ||
      end < 0 ||
      // We saw a non-dot character immediately before the dot.
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly `..`.
      (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    ) {
      return ''
    }

    return path.slice(startDot, end)
  }

  function join() {
    var index = -1;
    var joined;

    while (++index < arguments.length) {
      assertPath(arguments[index]);

      if (arguments[index]) {
        joined =
          joined === undefined
            ? arguments[index]
            : joined + '/' + arguments[index];
      }
    }

    return joined === undefined ? '.' : normalize(joined)
  }

  // Note: `normalize` is not exposed as `path.normalize`, so some code is
  // manually removed from it.
  function normalize(path) {
    var absolute;
    var value;

    assertPath(path);

    absolute = path.charCodeAt(0) === 47; /* `/` */

    // Normalize the path according to POSIX rules.
    value = normalizeString(path, !absolute);

    if (!value.length && !absolute) {
      value = '.';
    }

    if (value.length && path.charCodeAt(path.length - 1) === 47 /* / */) {
      value += '/';
    }

    return absolute ? '/' + value : value
  }

  // Resolve `.` and `..` elements in a path with directory names.
  function normalizeString(path, allowAboveRoot) {
    var result = '';
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var index = -1;
    var code;
    var lastSlashIndex;

    while (++index <= path.length) {
      if (index < path.length) {
        code = path.charCodeAt(index);
      } else if (code === 47 /* `/` */) {
        break
      } else {
        code = 47; /* `/` */
      }

      if (code === 47 /* `/` */) {
        if (lastSlash === index - 1 || dots === 1) ; else if (lastSlash !== index - 1 && dots === 2) {
          if (
            result.length < 2 ||
            lastSegmentLength !== 2 ||
            result.charCodeAt(result.length - 1) !== 46 /* `.` */ ||
            result.charCodeAt(result.length - 2) !== 46 /* `.` */
          ) {
            if (result.length > 2) {
              lastSlashIndex = result.lastIndexOf('/');

              /* istanbul ignore else - No clue how to cover it. */
              if (lastSlashIndex !== result.length - 1) {
                if (lastSlashIndex < 0) {
                  result = '';
                  lastSegmentLength = 0;
                } else {
                  result = result.slice(0, lastSlashIndex);
                  lastSegmentLength = result.length - 1 - result.lastIndexOf('/');
                }

                lastSlash = index;
                dots = 0;
                continue
              }
            } else if (result.length) {
              result = '';
              lastSegmentLength = 0;
              lastSlash = index;
              dots = 0;
              continue
            }
          }

          if (allowAboveRoot) {
            result = result.length ? result + '/..' : '..';
            lastSegmentLength = 2;
          }
        } else {
          if (result.length) {
            result += '/' + path.slice(lastSlash + 1, index);
          } else {
            result = path.slice(lastSlash + 1, index);
          }

          lastSegmentLength = index - lastSlash - 1;
        }

        lastSlash = index;
        dots = 0;
      } else if (code === 46 /* `.` */ && dots > -1) {
        dots++;
      } else {
        dots = -1;
      }
    }

    return result
  }

  function assertPath(path) {
    if (typeof path !== 'string') {
      throw new TypeError(
        'Path must be a string. Received ' + JSON.stringify(path)
      )
    }
  }

  var minpath_browser = {
  	basename: basename_1,
  	dirname: dirname_1,
  	extname: extname_1,
  	join: join_1,
  	sep: sep
  };

  // Somewhat based on:
  // <https://github.com/defunctzombie/node-process/blob/master/browser.js>.
  // But I don’t think one tiny line of code can be copyrighted. 😅
  var cwd_1 = cwd;

  function cwd() {
    return '/'
  }

  var minproc_browser = {
  	cwd: cwd_1
  };

  var core = VFile;

  var own$1 = {}.hasOwnProperty;

  // Order of setting (least specific to most), we need this because otherwise
  // `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
  // stem can be set.
  var order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname'];

  VFile.prototype.toString = toString;

  // Access full path (`~/index.min.js`).
  Object.defineProperty(VFile.prototype, 'path', {get: getPath, set: setPath});

  // Access parent path (`~`).
  Object.defineProperty(VFile.prototype, 'dirname', {
    get: getDirname,
    set: setDirname
  });

  // Access basename (`index.min.js`).
  Object.defineProperty(VFile.prototype, 'basename', {
    get: getBasename,
    set: setBasename
  });

  // Access extname (`.js`).
  Object.defineProperty(VFile.prototype, 'extname', {
    get: getExtname,
    set: setExtname
  });

  // Access stem (`index.min`).
  Object.defineProperty(VFile.prototype, 'stem', {get: getStem, set: setStem});

  // Construct a new file.
  function VFile(options) {
    var prop;
    var index;

    if (!options) {
      options = {};
    } else if (typeof options === 'string' || isBuffer(options)) {
      options = {contents: options};
    } else if ('message' in options && 'messages' in options) {
      return options
    }

    if (!(this instanceof VFile)) {
      return new VFile(options)
    }

    this.data = {};
    this.messages = [];
    this.history = [];
    this.cwd = minproc_browser.cwd();

    // Set path related properties in the correct order.
    index = -1;

    while (++index < order.length) {
      prop = order[index];

      if (own$1.call(options, prop)) {
        this[prop] = options[prop];
      }
    }

    // Set non-path related properties.
    for (prop in options) {
      if (order.indexOf(prop) < 0) {
        this[prop] = options[prop];
      }
    }
  }

  function getPath() {
    return this.history[this.history.length - 1]
  }

  function setPath(path) {
    assertNonEmpty(path, 'path');

    if (this.path !== path) {
      this.history.push(path);
    }
  }

  function getDirname() {
    return typeof this.path === 'string' ? minpath_browser.dirname(this.path) : undefined
  }

  function setDirname(dirname) {
    assertPath$1(this.path, 'dirname');
    this.path = minpath_browser.join(dirname || '', this.basename);
  }

  function getBasename() {
    return typeof this.path === 'string' ? minpath_browser.basename(this.path) : undefined
  }

  function setBasename(basename) {
    assertNonEmpty(basename, 'basename');
    assertPart(basename, 'basename');
    this.path = minpath_browser.join(this.dirname || '', basename);
  }

  function getExtname() {
    return typeof this.path === 'string' ? minpath_browser.extname(this.path) : undefined
  }

  function setExtname(extname) {
    assertPart(extname, 'extname');
    assertPath$1(this.path, 'extname');

    if (extname) {
      if (extname.charCodeAt(0) !== 46 /* `.` */) {
        throw new Error('`extname` must start with `.`')
      }

      if (extname.indexOf('.', 1) > -1) {
        throw new Error('`extname` cannot contain multiple dots')
      }
    }

    this.path = minpath_browser.join(this.dirname, this.stem + (extname || ''));
  }

  function getStem() {
    return typeof this.path === 'string'
      ? minpath_browser.basename(this.path, this.extname)
      : undefined
  }

  function setStem(stem) {
    assertNonEmpty(stem, 'stem');
    assertPart(stem, 'stem');
    this.path = minpath_browser.join(this.dirname || '', stem + (this.extname || ''));
  }

  // Get the value of the file.
  function toString(encoding) {
    return (this.contents || '').toString(encoding)
  }

  // Assert that `part` is not a path (i.e., does not contain `p.sep`).
  function assertPart(part, name) {
    if (part && part.indexOf(minpath_browser.sep) > -1) {
      throw new Error(
        '`' + name + '` cannot be a path: did not expect `' + minpath_browser.sep + '`'
      )
    }
  }

  // Assert that `part` is not empty.
  function assertNonEmpty(part, name) {
    if (!part) {
      throw new Error('`' + name + '` cannot be empty')
    }
  }

  // Assert `path` exists.
  function assertPath$1(path, name) {
    if (!path) {
      throw new Error('Setting `' + name + '` requires `path` to be set too')
    }
  }

  var lib = core;

  core.prototype.message = message;
  core.prototype.info = info;
  core.prototype.fail = fail;

  // Create a message with `reason` at `position`.
  // When an error is passed in as `reason`, copies the stack.
  function message(reason, position, origin) {
    var message = new vfileMessage(reason, position, origin);

    if (this.path) {
      message.name = this.path + ':' + message.name;
      message.file = this.path;
    }

    message.fatal = false;

    this.messages.push(message);

    return message
  }

  // Fail: creates a vmessage, associates it with the file, and throws it.
  function fail() {
    var message = this.message.apply(this, arguments);

    message.fatal = true;

    throw message
  }

  // Info: creates a vmessage, associates it with the file, and marks the fatality
  // as null.
  function info() {
    var message = this.message.apply(this, arguments);

    message.fatal = null;

    return message
  }

  var vfile = lib;

  // Expose a frozen processor.
  var unified_1 = unified().freeze();

  var slice$2 = [].slice;
  var own$2 = {}.hasOwnProperty;

  // Process pipeline.
  var pipeline = trough_1()
    .use(pipelineParse)
    .use(pipelineRun)
    .use(pipelineStringify);

  function pipelineParse(p, ctx) {
    ctx.tree = p.parse(ctx.file);
  }

  function pipelineRun(p, ctx, next) {
    p.run(ctx.tree, ctx.file, done);

    function done(err, tree, file) {
      if (err) {
        next(err);
      } else {
        ctx.tree = tree;
        ctx.file = file;
        next();
      }
    }
  }

  function pipelineStringify(p, ctx) {
    var result = p.stringify(ctx.tree, ctx.file);
    var file = ctx.file;

    if (result === undefined || result === null) ; else if (typeof result === 'string' || isBuffer(result)) {
      file.contents = result;
    } else {
      file.result = result;
    }
  }

  // Function to create the first processor.
  function unified() {
    var attachers = [];
    var transformers = trough_1();
    var namespace = {};
    var frozen = false;
    var freezeIndex = -1;

    // Data management.
    processor.data = data;

    // Lock.
    processor.freeze = freeze;

    // Plugins.
    processor.attachers = attachers;
    processor.use = use;

    // API.
    processor.parse = parse;
    processor.stringify = stringify;
    processor.run = run;
    processor.runSync = runSync;
    processor.process = process;
    processor.processSync = processSync;

    // Expose.
    return processor

    // Create a new processor based on the processor in the current scope.
    function processor() {
      var destination = unified();
      var length = attachers.length;
      var index = -1;

      while (++index < length) {
        destination.use.apply(null, attachers[index]);
      }

      destination.data(extend(true, {}, namespace));

      return destination
    }

    // Freeze: used to signal a processor that has finished configuration.
    //
    // For example, take unified itself: it’s frozen.
    // Plugins should not be added to it.
    // Rather, it should be extended, by invoking it, before modifying it.
    //
    // In essence, always invoke this when exporting a processor.
    function freeze() {
      var values;
      var plugin;
      var options;
      var transformer;

      if (frozen) {
        return processor
      }

      while (++freezeIndex < attachers.length) {
        values = attachers[freezeIndex];
        plugin = values[0];
        options = values[1];
        transformer = null;

        if (options === false) {
          continue
        }

        if (options === true) {
          values[1] = undefined;
        }

        transformer = plugin.apply(processor, values.slice(1));

        if (typeof transformer === 'function') {
          transformers.use(transformer);
        }
      }

      frozen = true;
      freezeIndex = Infinity;

      return processor
    }

    // Data management.
    // Getter / setter for processor-specific informtion.
    function data(key, value) {
      if (typeof key === 'string') {
        // Set `key`.
        if (arguments.length === 2) {
          assertUnfrozen('data', frozen);

          namespace[key] = value;

          return processor
        }

        // Get `key`.
        return (own$2.call(namespace, key) && namespace[key]) || null
      }

      // Set space.
      if (key) {
        assertUnfrozen('data', frozen);
        namespace = key;
        return processor
      }

      // Get space.
      return namespace
    }

    // Plugin management.
    //
    // Pass it:
    // *   an attacher and options,
    // *   a preset,
    // *   a list of presets, attachers, and arguments (list of attachers and
    //     options).
    function use(value) {
      var settings;

      assertUnfrozen('use', frozen);

      if (value === null || value === undefined) ; else if (typeof value === 'function') {
        addPlugin.apply(null, arguments);
      } else if (typeof value === 'object') {
        if ('length' in value) {
          addList(value);
        } else {
          addPreset(value);
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`')
      }

      if (settings) {
        namespace.settings = extend(namespace.settings || {}, settings);
      }

      return processor

      function addPreset(result) {
        addList(result.plugins);

        if (result.settings) {
          settings = extend(settings || {}, result.settings);
        }
      }

      function add(value) {
        if (typeof value === 'function') {
          addPlugin(value);
        } else if (typeof value === 'object') {
          if ('length' in value) {
            addPlugin.apply(null, value);
          } else {
            addPreset(value);
          }
        } else {
          throw new Error('Expected usable value, not `' + value + '`')
        }
      }

      function addList(plugins) {
        var length;
        var index;

        if (plugins === null || plugins === undefined) ; else if (typeof plugins === 'object' && 'length' in plugins) {
          length = plugins.length;
          index = -1;

          while (++index < length) {
            add(plugins[index]);
          }
        } else {
          throw new Error('Expected a list of plugins, not `' + plugins + '`')
        }
      }

      function addPlugin(plugin, value) {
        var entry = find(plugin);

        if (entry) {
          if (isPlainObj(entry[1]) && isPlainObj(value)) {
            value = extend(entry[1], value);
          }

          entry[1] = value;
        } else {
          attachers.push(slice$2.call(arguments));
        }
      }
    }

    function find(plugin) {
      var length = attachers.length;
      var index = -1;
      var entry;

      while (++index < length) {
        entry = attachers[index];

        if (entry[0] === plugin) {
          return entry
        }
      }
    }

    // Parse a file (in string or vfile representation) into a unist node using
    // the `Parser` on the processor.
    function parse(doc) {
      var file = vfile(doc);
      var Parser;

      freeze();
      Parser = processor.Parser;
      assertParser('parse', Parser);

      if (newable(Parser, 'parse')) {
        return new Parser(String(file), file).parse()
      }

      return Parser(String(file), file) // eslint-disable-line new-cap
    }

    // Run transforms on a unist node representation of a file (in string or
    // vfile representation), async.
    function run(node, file, cb) {
      assertNode(node);
      freeze();

      if (!cb && typeof file === 'function') {
        cb = file;
        file = null;
      }

      if (!cb) {
        return new Promise(executor)
      }

      executor(null, cb);

      function executor(resolve, reject) {
        transformers.run(node, vfile(file), done);

        function done(err, tree, file) {
          tree = tree || node;
          if (err) {
            reject(err);
          } else if (resolve) {
            resolve(tree);
          } else {
            cb(null, tree, file);
          }
        }
      }
    }

    // Run transforms on a unist node representation of a file (in string or
    // vfile representation), sync.
    function runSync(node, file) {
      var complete = false;
      var result;

      run(node, file, done);

      assertDone('runSync', 'run', complete);

      return result

      function done(err, tree) {
        complete = true;
        bail_1(err);
        result = tree;
      }
    }

    // Stringify a unist node representation of a file (in string or vfile
    // representation) into a string using the `Compiler` on the processor.
    function stringify(node, doc) {
      var file = vfile(doc);
      var Compiler;

      freeze();
      Compiler = processor.Compiler;
      assertCompiler('stringify', Compiler);
      assertNode(node);

      if (newable(Compiler, 'compile')) {
        return new Compiler(node, file).compile()
      }

      return Compiler(node, file) // eslint-disable-line new-cap
    }

    // Parse a file (in string or vfile representation) into a unist node using
    // the `Parser` on the processor, then run transforms on that node, and
    // compile the resulting node using the `Compiler` on the processor, and
    // store that result on the vfile.
    function process(doc, cb) {
      freeze();
      assertParser('process', processor.Parser);
      assertCompiler('process', processor.Compiler);

      if (!cb) {
        return new Promise(executor)
      }

      executor(null, cb);

      function executor(resolve, reject) {
        var file = vfile(doc);

        pipeline.run(processor, {file: file}, done);

        function done(err) {
          if (err) {
            reject(err);
          } else if (resolve) {
            resolve(file);
          } else {
            cb(null, file);
          }
        }
      }
    }

    // Process the given document (in string or vfile representation), sync.
    function processSync(doc) {
      var complete = false;
      var file;

      freeze();
      assertParser('processSync', processor.Parser);
      assertCompiler('processSync', processor.Compiler);
      file = vfile(doc);

      process(file, done);

      assertDone('processSync', 'process', complete);

      return file

      function done(err) {
        complete = true;
        bail_1(err);
      }
    }
  }

  // Check if `value` is a constructor.
  function newable(value, name) {
    return (
      typeof value === 'function' &&
      value.prototype &&
      // A function with keys in its prototype is probably a constructor.
      // Classes’ prototype methods are not enumerable, so we check if some value
      // exists in the prototype.
      (keys(value.prototype) || name in value.prototype)
    )
  }

  // Check if `value` is an object with keys.
  function keys(value) {
    var key;
    for (key in value) {
      return true
    }

    return false
  }

  // Assert a parser is available.
  function assertParser(name, Parser) {
    if (typeof Parser !== 'function') {
      throw new Error('Cannot `' + name + '` without `Parser`')
    }
  }

  // Assert a compiler is available.
  function assertCompiler(name, Compiler) {
    if (typeof Compiler !== 'function') {
      throw new Error('Cannot `' + name + '` without `Compiler`')
    }
  }

  // Assert the processor is not frozen.
  function assertUnfrozen(name, frozen) {
    if (frozen) {
      throw new Error(
        'Cannot invoke `' +
          name +
          '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.'
      )
    }
  }

  // Assert `node` is a unist node.
  function assertNode(node) {
    if (!node || typeof node.type !== 'string') {
      throw new Error('Expected node, got `' + node + '`')
    }
  }

  // Assert that `complete` is `true`.
  function assertDone(name, asyncName, complete) {
    if (!complete) {
      throw new Error(
        '`' + name + '` finished async. Use `' + asyncName + '` instead'
      )
    }
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var nearley = createCommonjsModule(function (module) {
  (function(root, factory) {
      if ( module.exports) {
          module.exports = factory();
      } else {
          root.nearley = factory();
      }
  }(commonjsGlobal, function() {

      function Rule(name, symbols, postprocess) {
          this.id = ++Rule.highestId;
          this.name = name;
          this.symbols = symbols;        // a list of literal | regex class | nonterminal
          this.postprocess = postprocess;
          return this;
      }
      Rule.highestId = 0;

      Rule.prototype.toString = function(withCursorAt) {
          var symbolSequence = (typeof withCursorAt === "undefined")
                               ? this.symbols.map(getSymbolShortDisplay).join(' ')
                               : (   this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(' ')
                                   + " ● "
                                   + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(' ')     );
          return this.name + " → " + symbolSequence;
      };


      // a State is a rule at a position from a given starting point in the input stream (reference)
      function State(rule, dot, reference, wantedBy) {
          this.rule = rule;
          this.dot = dot;
          this.reference = reference;
          this.data = [];
          this.wantedBy = wantedBy;
          this.isComplete = this.dot === rule.symbols.length;
      }

      State.prototype.toString = function() {
          return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
      };

      State.prototype.nextState = function(child) {
          var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
          state.left = this;
          state.right = child;
          if (state.isComplete) {
              state.data = state.build();
              // Having right set here will prevent the right state and its children
              // form being garbage collected
              state.right = undefined;
          }
          return state;
      };

      State.prototype.build = function() {
          var children = [];
          var node = this;
          do {
              children.push(node.right.data);
              node = node.left;
          } while (node.left);
          children.reverse();
          return children;
      };

      State.prototype.finish = function() {
          if (this.rule.postprocess) {
              this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
          }
      };


      function Column(grammar, index) {
          this.grammar = grammar;
          this.index = index;
          this.states = [];
          this.wants = {}; // states indexed by the non-terminal they expect
          this.scannable = []; // list of states that expect a token
          this.completed = {}; // states that are nullable
      }


      Column.prototype.process = function(nextColumn) {
          var states = this.states;
          var wants = this.wants;
          var completed = this.completed;

          for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
              var state = states[w];

              if (state.isComplete) {
                  state.finish();
                  if (state.data !== Parser.fail) {
                      // complete
                      var wantedBy = state.wantedBy;
                      for (var i = wantedBy.length; i--; ) { // this line is hot
                          var left = wantedBy[i];
                          this.complete(left, state);
                      }

                      // special-case nullables
                      if (state.reference === this.index) {
                          // make sure future predictors of this rule get completed.
                          var exp = state.rule.name;
                          (this.completed[exp] = this.completed[exp] || []).push(state);
                      }
                  }

              } else {
                  // queue scannable states
                  var exp = state.rule.symbols[state.dot];
                  if (typeof exp !== 'string') {
                      this.scannable.push(state);
                      continue;
                  }

                  // predict
                  if (wants[exp]) {
                      wants[exp].push(state);

                      if (completed.hasOwnProperty(exp)) {
                          var nulls = completed[exp];
                          for (var i = 0; i < nulls.length; i++) {
                              var right = nulls[i];
                              this.complete(state, right);
                          }
                      }
                  } else {
                      wants[exp] = [state];
                      this.predict(exp);
                  }
              }
          }
      };

      Column.prototype.predict = function(exp) {
          var rules = this.grammar.byName[exp] || [];

          for (var i = 0; i < rules.length; i++) {
              var r = rules[i];
              var wantedBy = this.wants[exp];
              var s = new State(r, 0, this.index, wantedBy);
              this.states.push(s);
          }
      };

      Column.prototype.complete = function(left, right) {
          var copy = left.nextState(right);
          this.states.push(copy);
      };


      function Grammar(rules, start) {
          this.rules = rules;
          this.start = start || this.rules[0].name;
          var byName = this.byName = {};
          this.rules.forEach(function(rule) {
              if (!byName.hasOwnProperty(rule.name)) {
                  byName[rule.name] = [];
              }
              byName[rule.name].push(rule);
          });
      }

      // So we can allow passing (rules, start) directly to Parser for backwards compatibility
      Grammar.fromCompiled = function(rules, start) {
          var lexer = rules.Lexer;
          if (rules.ParserStart) {
            start = rules.ParserStart;
            rules = rules.ParserRules;
          }
          var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
          var g = new Grammar(rules, start);
          g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
          return g;
      };


      function StreamLexer() {
        this.reset("");
      }

      StreamLexer.prototype.reset = function(data, state) {
          this.buffer = data;
          this.index = 0;
          this.line = state ? state.line : 1;
          this.lastLineBreak = state ? -state.col : 0;
      };

      StreamLexer.prototype.next = function() {
          if (this.index < this.buffer.length) {
              var ch = this.buffer[this.index++];
              if (ch === '\n') {
                this.line += 1;
                this.lastLineBreak = this.index;
              }
              return {value: ch};
          }
      };

      StreamLexer.prototype.save = function() {
        return {
          line: this.line,
          col: this.index - this.lastLineBreak,
        }
      };

      StreamLexer.prototype.formatError = function(token, message) {
          // nb. this gets called after consuming the offending token,
          // so the culprit is index-1
          var buffer = this.buffer;
          if (typeof buffer === 'string') {
              var lines = buffer
                  .split("\n")
                  .slice(
                      Math.max(0, this.line - 5), 
                      this.line
                  );

              var nextLineBreak = buffer.indexOf('\n', this.index);
              if (nextLineBreak === -1) nextLineBreak = buffer.length;
              var col = this.index - this.lastLineBreak;
              var lastLineDigits = String(this.line).length;
              message += " at line " + this.line + " col " + col + ":\n\n";
              message += lines
                  .map(function(line, i) {
                      return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
                  }, this)
                  .join("\n");
              message += "\n" + pad("", lastLineDigits + col) + "^\n";
              return message;
          } else {
              return message + " at index " + (this.index - 1);
          }

          function pad(n, length) {
              var s = String(n);
              return Array(length - s.length + 1).join(" ") + s;
          }
      };

      function Parser(rules, start, options) {
          if (rules instanceof Grammar) {
              var grammar = rules;
              var options = start;
          } else {
              var grammar = Grammar.fromCompiled(rules, start);
          }
          this.grammar = grammar;

          // Read options
          this.options = {
              keepHistory: false,
              lexer: grammar.lexer || new StreamLexer,
          };
          for (var key in (options || {})) {
              this.options[key] = options[key];
          }

          // Setup lexer
          this.lexer = this.options.lexer;
          this.lexerState = undefined;

          // Setup a table
          var column = new Column(grammar, 0);
          var table = this.table = [column];

          // I could be expecting anything.
          column.wants[grammar.start] = [];
          column.predict(grammar.start);
          // TODO what if start rule is nullable?
          column.process();
          this.current = 0; // token index
      }

      // create a reserved token for indicating a parse fail
      Parser.fail = {};

      Parser.prototype.feed = function(chunk) {
          var lexer = this.lexer;
          lexer.reset(chunk, this.lexerState);

          var token;
          while (true) {
              try {
                  token = lexer.next();
                  if (!token) {
                      break;
                  }
              } catch (e) {
                  // Create the next column so that the error reporter
                  // can display the correctly predicted states.
                  var nextColumn = new Column(this.grammar, this.current + 1);
                  this.table.push(nextColumn);
                  var err = new Error(this.reportLexerError(e));
                  err.offset = this.current;
                  err.token = e.token;
                  throw err;
              }
              // We add new states to table[current+1]
              var column = this.table[this.current];

              // GC unused states
              if (!this.options.keepHistory) {
                  delete this.table[this.current - 1];
              }

              var n = this.current + 1;
              var nextColumn = new Column(this.grammar, n);
              this.table.push(nextColumn);

              // Advance all tokens that expect the symbol
              var literal = token.text !== undefined ? token.text : token.value;
              var value = lexer.constructor === StreamLexer ? token.value : token;
              var scannable = column.scannable;
              for (var w = scannable.length; w--; ) {
                  var state = scannable[w];
                  var expect = state.rule.symbols[state.dot];
                  // Try to consume the token
                  // either regex or literal
                  if (expect.test ? expect.test(value) :
                      expect.type ? expect.type === token.type
                                  : expect.literal === literal) {
                      // Add it
                      var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                      nextColumn.states.push(next);
                  }
              }

              // Next, for each of the rules, we either
              // (a) complete it, and try to see if the reference row expected that
              //     rule
              // (b) predict the next nonterminal it expects by adding that
              //     nonterminal's start state
              // To prevent duplication, we also keep track of rules we have already
              // added

              nextColumn.process();

              // If needed, throw an error:
              if (nextColumn.states.length === 0) {
                  // No states at all! This is not good.
                  var err = new Error(this.reportError(token));
                  err.offset = this.current;
                  err.token = token;
                  throw err;
              }

              // maybe save lexer state
              if (this.options.keepHistory) {
                column.lexerState = lexer.save();
              }

              this.current++;
          }
          if (column) {
            this.lexerState = lexer.save();
          }

          // Incrementally keep track of results
          this.results = this.finish();

          // Allow chaining, for whatever it's worth
          return this;
      };

      Parser.prototype.reportLexerError = function(lexerError) {
          var tokenDisplay, lexerMessage;
          // Planning to add a token property to moo's thrown error
          // even on erroring tokens to be used in error display below
          var token = lexerError.token;
          if (token) {
              tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
              lexerMessage = this.lexer.formatError(token, "Syntax error");
          } else {
              tokenDisplay = "input (lexer error)";
              lexerMessage = lexerError.message;
          }
          return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };

      Parser.prototype.reportError = function(token) {
          var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
          var lexerMessage = this.lexer.formatError(token, "Syntax error");
          return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };

      Parser.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
          var lines = [];
          lines.push(lexerMessage);
          var lastColumnIndex = this.table.length - 2;
          var lastColumn = this.table[lastColumnIndex];
          var expectantStates = lastColumn.states
              .filter(function(state) {
                  var nextSymbol = state.rule.symbols[state.dot];
                  return nextSymbol && typeof nextSymbol !== "string";
              });

          if (expectantStates.length === 0) {
              lines.push('Unexpected ' + tokenDisplay + '. I did not expect any more input. Here is the state of my parse table:\n');
              this.displayStateStack(lastColumn.states, lines);
          } else {
              lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
              // Display a "state stack" for each expectant state
              // - which shows you how this state came to be, step by step.
              // If there is more than one derivation, we only display the first one.
              var stateStacks = expectantStates
                  .map(function(state) {
                      return this.buildFirstStateStack(state, []) || [state];
                  }, this);
              // Display each state that is expecting a terminal symbol next.
              stateStacks.forEach(function(stateStack) {
                  var state = stateStack[0];
                  var nextSymbol = state.rule.symbols[state.dot];
                  var symbolDisplay = this.getSymbolDisplay(nextSymbol);
                  lines.push('A ' + symbolDisplay + ' based on:');
                  this.displayStateStack(stateStack, lines);
              }, this);
          }
          lines.push("");
          return lines.join("\n");
      };
      
      Parser.prototype.displayStateStack = function(stateStack, lines) {
          var lastDisplay;
          var sameDisplayCount = 0;
          for (var j = 0; j < stateStack.length; j++) {
              var state = stateStack[j];
              var display = state.rule.toString(state.dot);
              if (display === lastDisplay) {
                  sameDisplayCount++;
              } else {
                  if (sameDisplayCount > 0) {
                      lines.push('    ^ ' + sameDisplayCount + ' more lines identical to this');
                  }
                  sameDisplayCount = 0;
                  lines.push('    ' + display);
              }
              lastDisplay = display;
          }
      };

      Parser.prototype.getSymbolDisplay = function(symbol) {
          return getSymbolLongDisplay(symbol);
      };

      /*
      Builds a the first state stack. You can think of a state stack as the call stack
      of the recursive-descent parser which the Nearley parse algorithm simulates.
      A state stack is represented as an array of state objects. Within a
      state stack, the first item of the array will be the starting
      state, with each successive item in the array going further back into history.

      This function needs to be given a starting state and an empty array representing
      the visited states, and it returns an single state stack.

      */
      Parser.prototype.buildFirstStateStack = function(state, visited) {
          if (visited.indexOf(state) !== -1) {
              // Found cycle, return null
              // to eliminate this path from the results, because
              // we don't know how to display it meaningfully
              return null;
          }
          if (state.wantedBy.length === 0) {
              return [state];
          }
          var prevState = state.wantedBy[0];
          var childVisited = [state].concat(visited);
          var childResult = this.buildFirstStateStack(prevState, childVisited);
          if (childResult === null) {
              return null;
          }
          return [state].concat(childResult);
      };

      Parser.prototype.save = function() {
          var column = this.table[this.current];
          column.lexerState = this.lexerState;
          return column;
      };

      Parser.prototype.restore = function(column) {
          var index = column.index;
          this.current = index;
          this.table[index] = column;
          this.table.splice(index + 1);
          this.lexerState = column.lexerState;

          // Incrementally keep track of results
          this.results = this.finish();
      };

      // nb. deprecated: use save/restore instead!
      Parser.prototype.rewind = function(index) {
          if (!this.options.keepHistory) {
              throw new Error('set option `keepHistory` to enable rewinding')
          }
          // nb. recall column (table) indicies fall between token indicies.
          //        col 0   --   token 0   --   col 1
          this.restore(this.table[index]);
      };

      Parser.prototype.finish = function() {
          // Return the possible parsings
          var considerations = [];
          var start = this.grammar.start;
          var column = this.table[this.table.length - 1];
          column.states.forEach(function (t) {
              if (t.rule.name === start
                      && t.dot === t.rule.symbols.length
                      && t.reference === 0
                      && t.data !== Parser.fail) {
                  considerations.push(t);
              }
          });
          return considerations.map(function(c) {return c.data; });
      };

      function getSymbolLongDisplay(symbol) {
          var type = typeof symbol;
          if (type === "string") {
              return symbol;
          } else if (type === "object") {
              if (symbol.literal) {
                  return JSON.stringify(symbol.literal);
              } else if (symbol instanceof RegExp) {
                  return 'character matching ' + symbol;
              } else if (symbol.type) {
                  return symbol.type + ' token';
              } else if (symbol.test) {
                  return 'token matching ' + String(symbol.test);
              } else {
                  throw new Error('Unknown symbol type: ' + symbol);
              }
          }
      }

      function getSymbolShortDisplay(symbol) {
          var type = typeof symbol;
          if (type === "string") {
              return symbol;
          } else if (type === "object") {
              if (symbol.literal) {
                  return JSON.stringify(symbol.literal);
              } else if (symbol instanceof RegExp) {
                  return symbol.toString();
              } else if (symbol.type) {
                  return '%' + symbol.type;
              } else if (symbol.test) {
                  return '<' + String(symbol.test) + '>';
              } else {
                  throw new Error('Unknown symbol type: ' + symbol);
              }
          }
      }

      return {
          Parser: Parser,
          Grammar: Grammar,
          Rule: Rule,
      };

  }));
  });

  var moo = createCommonjsModule(function (module) {
  (function(root, factory) {
    if ( module.exports) {
      module.exports = factory();
    } else {
      root.moo = factory();
    }
  }(commonjsGlobal, function() {

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    var hasSticky = typeof new RegExp().sticky === 'boolean';

    /***************************************************************************/

    function isRegExp(o) { return o && toString.call(o) === '[object RegExp]' }
    function isObject(o) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

    function reEscape(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }
    function reGroups(s) {
      var re = new RegExp('|' + s);
      return re.exec('').length - 1
    }
    function reCapture(s) {
      return '(' + s + ')'
    }
    function reUnion(regexps) {
      if (!regexps.length) return '(?!)'
      var source =  regexps.map(function(s) {
        return "(?:" + s + ")"
      }).join('|');
      return "(?:" + source + ")"
    }

    function regexpOrLiteral(obj) {
      if (typeof obj === 'string') {
        return '(?:' + reEscape(obj) + ')'

      } else if (isRegExp(obj)) {
        // TODO: consider /u support
        if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed')
        if (obj.global) throw new Error('RegExp /g flag is implied')
        if (obj.sticky) throw new Error('RegExp /y flag is implied')
        if (obj.multiline) throw new Error('RegExp /m flag is implied')
        return obj.source

      } else {
        throw new Error('Not a pattern: ' + obj)
      }
    }

    function objectToRules(object) {
      var keys = Object.getOwnPropertyNames(object);
      var result = [];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var thing = object[key];
        var rules = [].concat(thing);
        if (key === 'include') {
          for (var j = 0; j < rules.length; j++) {
            result.push({include: rules[j]});
          }
          continue
        }
        var match = [];
        rules.forEach(function(rule) {
          if (isObject(rule)) {
            if (match.length) result.push(ruleOptions(key, match));
            result.push(ruleOptions(key, rule));
            match = [];
          } else {
            match.push(rule);
          }
        });
        if (match.length) result.push(ruleOptions(key, match));
      }
      return result
    }

    function arrayToRules(array) {
      var result = [];
      for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        if (obj.include) {
          var include = [].concat(obj.include);
          for (var j = 0; j < include.length; j++) {
            result.push({include: include[j]});
          }
          continue
        }
        if (!obj.type) {
          throw new Error('Rule has no type: ' + JSON.stringify(obj))
        }
        result.push(ruleOptions(obj.type, obj));
      }
      return result
    }

    function ruleOptions(type, obj) {
      if (!isObject(obj)) {
        obj = { match: obj };
      }
      if (obj.include) {
        throw new Error('Matching rules cannot also include states')
      }

      // nb. error and fallback imply lineBreaks
      var options = {
        defaultType: type,
        lineBreaks: !!obj.error || !!obj.fallback,
        pop: false,
        next: null,
        push: null,
        error: false,
        fallback: false,
        value: null,
        type: null,
        shouldThrow: false,
      };

      // Avoid Object.assign(), so we support IE9+
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          options[key] = obj[key];
        }
      }

      // type transform cannot be a string
      if (typeof options.type === 'string' && type !== options.type) {
        throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
      }

      // convert to array
      var match = options.match;
      options.match = Array.isArray(match) ? match : match ? [match] : [];
      options.match.sort(function(a, b) {
        return isRegExp(a) && isRegExp(b) ? 0
             : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
      });
      return options
    }

    function toRules(spec) {
      return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec)
    }

    var defaultErrorRule = ruleOptions('error', {lineBreaks: true, shouldThrow: true});
    function compileRules(rules, hasStates) {
      var errorRule = null;
      var fast = Object.create(null);
      var fastAllowed = true;
      var unicodeFlag = null;
      var groups = [];
      var parts = [];

      // If there is a fallback rule, then disable fast matching
      for (var i = 0; i < rules.length; i++) {
        if (rules[i].fallback) {
          fastAllowed = false;
        }
      }

      for (var i = 0; i < rules.length; i++) {
        var options = rules[i];

        if (options.include) {
          // all valid inclusions are removed by states() preprocessor
          throw new Error('Inheritance is not allowed in stateless lexers')
        }

        if (options.error || options.fallback) {
          // errorRule can only be set once
          if (errorRule) {
            if (!options.fallback === !errorRule.fallback) {
              throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
            } else {
              throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
            }
          }
          errorRule = options;
        }

        var match = options.match.slice();
        if (fastAllowed) {
          while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
            var word = match.shift();
            fast[word.charCodeAt(0)] = options;
          }
        }

        // Warn about inappropriate state-switching options
        if (options.pop || options.push || options.next) {
          if (!hasStates) {
            throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
          }
          if (options.fallback) {
            throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
          }
        }

        // Only rules with a .match are included in the RegExp
        if (match.length === 0) {
          continue
        }
        fastAllowed = false;

        groups.push(options);

        // Check unicode flag is used everywhere or nowhere
        for (var j = 0; j < match.length; j++) {
          var obj = match[j];
          if (!isRegExp(obj)) {
            continue
          }

          if (unicodeFlag === null) {
            unicodeFlag = obj.unicode;
          } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
            throw new Error('If one rule is /u then all must be')
          }
        }

        // convert to RegExp
        var pat = reUnion(match.map(regexpOrLiteral));

        // validate
        var regexp = new RegExp(pat);
        if (regexp.test("")) {
          throw new Error("RegExp matches empty string: " + regexp)
        }
        var groupCount = reGroups(pat);
        if (groupCount > 0) {
          throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
        }

        // try and detect rules matching newlines
        if (!options.lineBreaks && regexp.test('\n')) {
          throw new Error('Rule should declare lineBreaks: ' + regexp)
        }

        // store regex
        parts.push(reCapture(pat));
      }


      // If there's no fallback rule, use the sticky flag so we only look for
      // matches at the current index.
      //
      // If we don't support the sticky flag, then fake it using an irrefutable
      // match (i.e. an empty pattern).
      var fallbackRule = errorRule && errorRule.fallback;
      var flags = hasSticky && !fallbackRule ? 'ym' : 'gm';
      var suffix = hasSticky || fallbackRule ? '' : '|';

      if (unicodeFlag === true) flags += "u";
      var combined = new RegExp(reUnion(parts) + suffix, flags);
      return {regexp: combined, groups: groups, fast: fast, error: errorRule || defaultErrorRule}
    }

    function compile(rules) {
      var result = compileRules(toRules(rules));
      return new Lexer({start: result}, 'start')
    }

    function checkStateGroup(g, name, map) {
      var state = g && (g.push || g.next);
      if (state && !map[state]) {
        throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
      }
      if (g && g.pop && +g.pop !== 1) {
        throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
      }
    }
    function compileStates(states, start) {
      var all = states.$all ? toRules(states.$all) : [];
      delete states.$all;

      var keys = Object.getOwnPropertyNames(states);
      if (!start) start = keys[0];

      var ruleMap = Object.create(null);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        ruleMap[key] = toRules(states[key]).concat(all);
      }
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var rules = ruleMap[key];
        var included = Object.create(null);
        for (var j = 0; j < rules.length; j++) {
          var rule = rules[j];
          if (!rule.include) continue
          var splice = [j, 1];
          if (rule.include !== key && !included[rule.include]) {
            included[rule.include] = true;
            var newRules = ruleMap[rule.include];
            if (!newRules) {
              throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
            }
            for (var k = 0; k < newRules.length; k++) {
              var newRule = newRules[k];
              if (rules.indexOf(newRule) !== -1) continue
              splice.push(newRule);
            }
          }
          rules.splice.apply(rules, splice);
          j--;
        }
      }

      var map = Object.create(null);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        map[key] = compileRules(ruleMap[key], true);
      }

      for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var state = map[name];
        var groups = state.groups;
        for (var j = 0; j < groups.length; j++) {
          checkStateGroup(groups[j], name, map);
        }
        var fastKeys = Object.getOwnPropertyNames(state.fast);
        for (var j = 0; j < fastKeys.length; j++) {
          checkStateGroup(state.fast[fastKeys[j]], name, map);
        }
      }

      return new Lexer(map, start)
    }

    function keywordTransform(map) {
      var reverseMap = Object.create(null);
      var byLength = Object.create(null);
      var types = Object.getOwnPropertyNames(map);
      for (var i = 0; i < types.length; i++) {
        var tokenType = types[i];
        var item = map[tokenType];
        var keywordList = Array.isArray(item) ? item : [item];
        keywordList.forEach(function(keyword) {
          (byLength[keyword.length] = byLength[keyword.length] || []).push(keyword);
          if (typeof keyword !== 'string') {
            throw new Error("keyword must be string (in keyword '" + tokenType + "')")
          }
          reverseMap[keyword] = tokenType;
        });
      }

      // fast string lookup
      // https://jsperf.com/string-lookups
      function str(x) { return JSON.stringify(x) }
      var source = '';
      source += 'switch (value.length) {\n';
      for (var length in byLength) {
        var keywords = byLength[length];
        source += 'case ' + length + ':\n';
        source += 'switch (value) {\n';
        keywords.forEach(function(keyword) {
          var tokenType = reverseMap[keyword];
          source += 'case ' + str(keyword) + ': return ' + str(tokenType) + '\n';
        });
        source += '}\n';
      }
      source += '}\n';
      return Function('value', source) // type
    }

    /***************************************************************************/

    var Lexer = function(states, state) {
      this.startState = state;
      this.states = states;
      this.buffer = '';
      this.stack = [];
      this.reset();
    };

    Lexer.prototype.reset = function(data, info) {
      this.buffer = data || '';
      this.index = 0;
      this.line = info ? info.line : 1;
      this.col = info ? info.col : 1;
      this.queuedToken = info ? info.queuedToken : null;
      this.queuedThrow = info ? info.queuedThrow : null;
      this.setState(info ? info.state : this.startState);
      this.stack = info && info.stack ? info.stack.slice() : [];
      return this
    };

    Lexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.col,
        state: this.state,
        stack: this.stack.slice(),
        queuedToken: this.queuedToken,
        queuedThrow: this.queuedThrow,
      }
    };

    Lexer.prototype.setState = function(state) {
      if (!state || this.state === state) return
      this.state = state;
      var info = this.states[state];
      this.groups = info.groups;
      this.error = info.error;
      this.re = info.regexp;
      this.fast = info.fast;
    };

    Lexer.prototype.popState = function() {
      this.setState(this.stack.pop());
    };

    Lexer.prototype.pushState = function(state) {
      this.stack.push(this.state);
      this.setState(state);
    };

    var eat = hasSticky ? function(re, buffer) { // assume re is /y
      return re.exec(buffer)
    } : function(re, buffer) { // assume re is /g
      var match = re.exec(buffer);
      // will always match, since we used the |(?:) trick
      if (match[0].length === 0) {
        return null
      }
      return match
    };

    Lexer.prototype._getGroup = function(match) {
      var groupCount = this.groups.length;
      for (var i = 0; i < groupCount; i++) {
        if (match[i + 1] !== undefined) {
          return this.groups[i]
        }
      }
      throw new Error('Cannot find token type for matched text')
    };

    function tokenToString() {
      return this.value
    }

    Lexer.prototype.next = function() {
      var index = this.index;

      // If a fallback token matched, we don't need to re-run the RegExp
      if (this.queuedGroup) {
        var token = this._token(this.queuedGroup, this.queuedText, index);
        this.queuedGroup = null;
        this.queuedText = "";
        return token
      }

      var buffer = this.buffer;
      if (index === buffer.length) {
        return // EOF
      }

      // Fast matching for single characters
      var group = this.fast[buffer.charCodeAt(index)];
      if (group) {
        return this._token(group, buffer.charAt(index), index)
      }

      // Execute RegExp
      var re = this.re;
      re.lastIndex = index;
      var match = eat(re, buffer);

      // Error tokens match the remaining buffer
      var error = this.error;
      if (match == null) {
        return this._token(error, buffer.slice(index, buffer.length), index)
      }

      var group = this._getGroup(match);
      var text = match[0];

      if (error.fallback && match.index !== index) {
        this.queuedGroup = group;
        this.queuedText = text;

        // Fallback tokens contain the unmatched portion of the buffer
        return this._token(error, buffer.slice(index, match.index), index)
      }

      return this._token(group, text, index)
    };

    Lexer.prototype._token = function(group, text, offset) {
      // count line breaks
      var lineBreaks = 0;
      if (group.lineBreaks) {
        var matchNL = /\n/g;
        var nl = 1;
        if (text === '\n') {
          lineBreaks = 1;
        } else {
          while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex; }
        }
      }

      var token = {
        type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
        value: typeof group.value === 'function' ? group.value(text) : text,
        text: text,
        toString: tokenToString,
        offset: offset,
        lineBreaks: lineBreaks,
        line: this.line,
        col: this.col,
      };
      // nb. adding more props to token object will make V8 sad!

      var size = text.length;
      this.index += size;
      this.line += lineBreaks;
      if (lineBreaks !== 0) {
        this.col = size - nl + 1;
      } else {
        this.col += size;
      }

      // throw, if no rule with {error: true}
      if (group.shouldThrow) {
        throw new Error(this.formatError(token, "invalid syntax"))
      }

      if (group.pop) this.popState();
      else if (group.push) this.pushState(group.push);
      else if (group.next) this.setState(group.next);

      return token
    };

    if (typeof Symbol !== 'undefined' && Symbol.iterator) {
      var LexerIterator = function(lexer) {
        this.lexer = lexer;
      };

      LexerIterator.prototype.next = function() {
        var token = this.lexer.next();
        return {value: token, done: !token}
      };

      LexerIterator.prototype[Symbol.iterator] = function() {
        return this
      };

      Lexer.prototype[Symbol.iterator] = function() {
        return new LexerIterator(this)
      };
    }

    Lexer.prototype.formatError = function(token, message) {
      if (token == null) {
        // An undefined token indicates EOF
        var text = this.buffer.slice(this.index);
        var token = {
          text: text,
          offset: this.index,
          lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
          line: this.line,
          col: this.col,
        };
      }
      var start = Math.max(0, token.offset - token.col + 1);
      var eol = token.lineBreaks ? token.text.indexOf('\n') : token.text.length;
      var firstLine = this.buffer.substring(start, token.offset + eol);
      message += " at line " + token.line + " col " + token.col + ":\n\n";
      message += "  " + firstLine + "\n";
      message += "  " + Array(token.col).join(" ") + "^";
      return message
    };

    Lexer.prototype.clone = function() {
      return new Lexer(this.states, this.state)
    };

    Lexer.prototype.has = function(tokenType) {
      return true
    };


    return {
      compile: compile,
      states: compileStates,
      error: Object.freeze({error: true}),
      fallback: Object.freeze({fallback: true}),
      keywords: keywordTransform,
    }

  }));
  });

  function _extends$1() {
    _extends$1 = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends$1.apply(this, arguments);
  }

  function id(d) {
    return d[0];
  }

  var lexer = /*#__PURE__*/moo.compile({
    whitespace: {
      match: /\s+/,
      lineBreaks: true
    },
    lineComment: {
      match: /\/\/.*?\n?$/
    },
    hexadecimal: gramTokens.hexadecimal,
    octal: gramTokens.octal,
    measurement: gramTokens.measurement,
    decimal: gramTokens.decimal,
    integer: gramTokens.integer,
    taggedString: {
      match: gramTokens.taggedString
    },
    "boolean": ['true', 'TRUE', 'True', 'false', 'FALSE', 'False'],
    symbol: gramTokens.symbol,
    identifier: gramTokens.identifier,
    doubleQuotedString: {
      match: gramTokens.doubleQuotedString,
      value: function value(s) {
        return s.slice(1, -1);
      }
    },
    singleQuotedString: {
      match: gramTokens.singleQuotedString,
      value: function value(s) {
        return s.slice(1, -1);
      }
    },
    tickedString: {
      match: gramTokens.tickedString,
      value: function value(s) {
        return s.slice(1, -1);
      }
    },
    '-->': '-->',
    '--': '--',
    '<--': '<--',
    '-[]->': '-[]->',
    '-[]-': '-[]-',
    '<-[]-': '<-[]-',
    '<-[': '<-[',
    ']->': ']->',
    '-[': '-[',
    ']-': ']-',
    '{': '{',
    '}': '}',
    '[': '[',
    ']': ']',
    '(': '(',
    ')': ')',
    ',': ',',
    ':': ':',
    '`': '`',
    "'": "'",
    ø: 'ø'
  });

  var empty$1 = function empty() {
    return null;
  };

  var text = function text(_ref) {
    var token = _ref[0];
    return token.text;
  };
  /*
  # function extractPairs(pairGroups:Array<any>) {
  #     return pairGroups.map((pairGroup:Array<any>) => {
  #       return pairGroup[3];
  #     })
  # }

  # function extractArray(valueGroups:Array<any>):Array<any> {
  #     return valueGroups.map( (valueGroup) => valueGroup[3]);
  # }
  */


  function separateTagFromString(taggedStringValue) {
    var valueParts = taggedStringValue.match(/([^`]+)`(.+)`$/);
    if (valueParts === null || valueParts === undefined) throw Error("Malformed tagged string: " + taggedStringValue);
    return {
      tag: valueParts[1],
      value: valueParts[2]
    };
  }

  function separateNumberFromUnits(measurementValue) {
    var valueParts = measurementValue.match(/(-?[0-9.]+)([a-zA-Z]+)/);
    if (valueParts === null || valueParts === undefined) throw Error("Malformed measurement : " + measurementValue);
    return {
      value: valueParts[1],
      unit: valueParts[2]
    };
  }

  var grammar = {
    Lexer: lexer,
    ParserRules: [{
      name: 'GramSeq$ebnf$1$subexpression$1',
      symbols: ['Path'],
      postprocess: function postprocess(_ref2) {
        var pp = _ref2[0];
        return pp;
      }
    }, {
      name: 'GramSeq$ebnf$1',
      symbols: ['GramSeq$ebnf$1$subexpression$1']
    }, {
      name: 'GramSeq$ebnf$1$subexpression$2',
      symbols: ['Path'],
      postprocess: function postprocess(_ref3) {
        var pp = _ref3[0];
        return pp;
      }
    }, {
      name: 'GramSeq$ebnf$1',
      symbols: ['GramSeq$ebnf$1', 'GramSeq$ebnf$1$subexpression$2'],
      postprocess: function postprocess(d) {
        return d[0].concat([d[1]]);
      }
    }, {
      name: 'GramSeq',
      symbols: ['_', 'GramSeq$ebnf$1'],
      postprocess: function postprocess(_ref4) {
        var pp = _ref4[1];
        return seq(flatten(pp));
      }
    }, {
      name: 'Path',
      symbols: ['NodePattern'],
      postprocess: id
    }, {
      name: 'Path',
      symbols: ['PathComposition'],
      postprocess: id
    }, {
      name: 'Path',
      symbols: ['PathPair'],
      postprocess: id
    }, {
      name: 'NodePattern',
      symbols: ['Node', '_', 'Edge', '_', 'NodePattern'],
      postprocess: function postprocess(_ref5) {
        var n = _ref5[0],
            es = _ref5[2],
            np = _ref5[4];
        return cons([n, np], {
          kind: es.kind,
          id: es.id,
          labels: es.labels,
          record: es.record
        });
      }
    }, {
      name: 'NodePattern',
      symbols: ['Node'],
      postprocess: id
    }, {
      name: 'Node$ebnf$1',
      symbols: ['Attributes'],
      postprocess: id
    }, {
      name: 'Node$ebnf$1',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'Node',
      symbols: [{
        literal: '('
      }, '_', 'Node$ebnf$1', {
        literal: ')'
      }, '_'],
      postprocess: function postprocess(_ref6) {
        var attrs = _ref6[2];
        return attrs ? node(attrs.id, attrs.labels, attrs.record) : node();
      }
    }, {
      name: 'Edge$ebnf$1',
      symbols: ['Attributes'],
      postprocess: id
    }, {
      name: 'Edge$ebnf$1',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '-['
      }, '_', 'Edge$ebnf$1', {
        literal: ']->'
      }, '_'],
      postprocess: function postprocess(_ref7) {
        var attrs = _ref7[2];
        return _extends$1({
          kind: 'right'
        }, attrs);
      }
    }, {
      name: 'Edge$ebnf$2',
      symbols: ['Attributes'],
      postprocess: id
    }, {
      name: 'Edge$ebnf$2',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '-['
      }, '_', 'Edge$ebnf$2', {
        literal: ']-'
      }, '_'],
      postprocess: function postprocess(_ref8) {
        var attrs = _ref8[2];
        return _extends$1({
          kind: 'either'
        }, attrs);
      }
    }, {
      name: 'Edge$ebnf$3',
      symbols: ['Attributes'],
      postprocess: id
    }, {
      name: 'Edge$ebnf$3',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '<-['
      }, '_', 'Edge$ebnf$3', {
        literal: ']-'
      }, '_'],
      postprocess: function postprocess(_ref9) {
        var attrs = _ref9[2];
        return _extends$1({
          kind: 'left'
        }, attrs);
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '-[]->'
      }, '_'],
      postprocess: function postprocess() {
        return {
          kind: 'right'
        };
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '-[]-'
      }, '_'],
      postprocess: function postprocess() {
        return {
          kind: 'either'
        };
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '<-[]-'
      }, '_'],
      postprocess: function postprocess() {
        return {
          kind: 'left'
        };
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '-->'
      }, '_'],
      postprocess: function postprocess() {
        return {
          kind: 'right'
        };
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '--'
      }, '_'],
      postprocess: function postprocess() {
        return {
          kind: 'either'
        };
      }
    }, {
      name: 'Edge',
      symbols: [{
        literal: '<--'
      }, '_'],
      postprocess: function postprocess() {
        return {
          kind: 'left'
        };
      }
    }, {
      name: 'PathComposition',
      symbols: ['PathPoint'],
      postprocess: id
    }, {
      name: 'PathComposition',
      symbols: ['PathAnnotation'],
      postprocess: id
    }, {
      name: 'PathComposition',
      symbols: ['PathExpression'],
      postprocess: id
    }, {
      name: 'PathPoint$ebnf$1',
      symbols: ['Attributes'],
      postprocess: id
    }, {
      name: 'PathPoint$ebnf$1',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'PathPoint',
      symbols: [{
        literal: '['
      }, '_', 'PathPoint$ebnf$1', {
        literal: ']'
      }, '_'],
      postprocess: function postprocess(_ref10) {
        var attr = _ref10[2];

        if (attr && (attr.id || attr.labels || attr.record) && attr.id !== 'ø') {
          // console.log(attr);
          return node(attr.id, attr.labels, attr.record);
        } else {
          return empty();
        }
      }
    }, {
      name: 'PathAnnotation$ebnf$1',
      symbols: ['Attributes'],
      postprocess: id
    }, {
      name: 'PathAnnotation$ebnf$1',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'PathAnnotation',
      symbols: [{
        literal: '['
      }, '_', 'PathAnnotation$ebnf$1', 'Path', {
        literal: ']'
      }, '_'],
      postprocess: function postprocess(_ref11) {
        var attr = _ref11[2],
            lhs = _ref11[3];
        // console.log('annotate()', lhs)
        return cons([lhs], attr ? {
          id: attr.id,
          labels: attr.labels,
          record: attr.record
        } : {});
      }
    }, {
      name: 'PathExpression$ebnf$1',
      symbols: ['Attributes'],
      postprocess: id
    }, {
      name: 'PathExpression$ebnf$1',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'PathExpression$ebnf$2',
      symbols: ['Kind'],
      postprocess: id
    }, {
      name: 'PathExpression$ebnf$2',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'PathExpression',
      symbols: [{
        literal: '['
      }, '_', 'PathExpression$ebnf$1', 'PathExpression$ebnf$2', 'Path', 'Path', {
        literal: ']'
      }, '_'],
      postprocess: function postprocess(_ref12) {
        var attrs = _ref12[2],
            kind = _ref12[3],
            lhs = _ref12[4],
            rhs = _ref12[5];
        return cons([lhs, rhs], {
          kind: kind,
          id: attrs.id,
          labels: attrs.labels,
          record: attrs.record
        });
      }
    }, {
      name: 'PathPair$subexpression$1',
      symbols: ['NodePattern']
    }, {
      name: 'PathPair$subexpression$1',
      symbols: ['PathComposition']
    }, {
      name: 'PathPair',
      symbols: ['PathPair$subexpression$1', {
        literal: ','
      }, '_', 'Path'],
      postprocess: function postprocess(_ref13) {
        var lp = _ref13[0],
            rp = _ref13[3];
        return pair([lp[0], rp]);
      }
    }, {
      name: 'Kind',
      symbols: [{
        literal: ','
      }, '_'],
      postprocess: function postprocess() {
        return 'pair';
      }
    }, {
      name: 'Kind',
      symbols: [{
        literal: '-->'
      }, '_'],
      postprocess: function postprocess() {
        return 'right';
      }
    }, {
      name: 'Kind',
      symbols: [{
        literal: '--'
      }, '_'],
      postprocess: function postprocess() {
        return 'either';
      }
    }, {
      name: 'Kind',
      symbols: [{
        literal: '<--'
      }, '_'],
      postprocess: function postprocess() {
        return 'left';
      }
    }, {
      name: 'Attributes$ebnf$1',
      symbols: ['Identity'],
      postprocess: id
    }, {
      name: 'Attributes$ebnf$1',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'Attributes$ebnf$2',
      symbols: ['LabelList'],
      postprocess: id
    }, {
      name: 'Attributes$ebnf$2',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'Attributes$ebnf$3',
      symbols: ['Record'],
      postprocess: id
    }, {
      name: 'Attributes$ebnf$3',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: 'Attributes',
      symbols: ['Attributes$ebnf$1', 'Attributes$ebnf$2', 'Attributes$ebnf$3'],
      postprocess: function postprocess(d, _, reject) {
        var id = d[0],
            labels = d[1],
            record = d[2];

        if (id || labels || record) {
          return {
            id: id,
            labels: labels,
            record: record
          };
        } else return reject;
      }
    }, {
      name: 'LabelList$ebnf$1',
      symbols: ['Label']
    }, {
      name: 'LabelList$ebnf$1',
      symbols: ['LabelList$ebnf$1', 'Label'],
      postprocess: function postprocess(d) {
        return d[0].concat([d[1]]);
      }
    }, {
      name: 'LabelList',
      symbols: ['LabelList$ebnf$1'],
      postprocess: function postprocess(_ref14) {
        var labels = _ref14[0];
        return labels;
      }
    }, {
      name: 'Label',
      symbols: [{
        literal: ':'
      }, 'Symbol'],
      postprocess: function postprocess(_ref15) {
        var label = _ref15[1];
        return label;
      }
    }, {
      name: 'Identity',
      symbols: [/*#__PURE__*/lexer.has('identifier') ? {
        type: 'identifier'
      } : identifier, '_'],
      postprocess: text
    }, {
      name: 'Identity',
      symbols: [{
        literal: 'ø'
      }, '_'],
      postprocess: text
    }, {
      name: 'Identity',
      symbols: [/*#__PURE__*/lexer.has('symbol') ? {
        type: 'symbol'
      } : symbol, '_'],
      postprocess: text
    }, {
      name: 'Identity',
      symbols: [/*#__PURE__*/lexer.has('integer') ? {
        type: 'integer'
      } : integer, '_'],
      postprocess: text
    }, {
      name: 'Identity',
      symbols: [/*#__PURE__*/lexer.has('octal') ? {
        type: 'octal'
      } : octal, '_'],
      postprocess: text
    }, {
      name: 'Identity',
      symbols: [/*#__PURE__*/lexer.has('hexadecimal') ? {
        type: 'hexadecimal'
      } : hexadecimal, '_'],
      postprocess: text
    }, {
      name: 'Identity',
      symbols: [/*#__PURE__*/lexer.has('measurement') ? {
        type: 'measurement'
      } : measurement, '_'],
      postprocess: text
    }, {
      name: 'Identity',
      symbols: [/*#__PURE__*/lexer.has('tickedString') ? {
        type: 'tickedString'
      } : tickedString, '_'],
      postprocess: function postprocess(_ref16) {
        var t = _ref16[0];
        return t.text.slice(1, -1);
      }
    }, {
      name: 'Symbol',
      symbols: [/*#__PURE__*/lexer.has('symbol') ? {
        type: 'symbol'
      } : symbol, '_'],
      postprocess: text
    }, {
      name: 'Symbol',
      symbols: [/*#__PURE__*/lexer.has('tickedString') ? {
        type: 'tickedString'
      } : tickedString, '_'],
      postprocess: function postprocess(_ref17) {
        var t = _ref17[0];
        return t.text.slice(1, -1);
      }
    }, {
      name: 'Record',
      symbols: [{
        literal: '{'
      }, '_', {
        literal: '}'
      }, '_'],
      postprocess: empty$1
    }, {
      name: 'Record$ebnf$1',
      symbols: []
    }, {
      name: 'Record$ebnf$1$subexpression$1',
      symbols: [{
        literal: ','
      }, '_', 'Property'],
      postprocess: function postprocess(_ref18) {
        var p = _ref18[2];
        return p;
      }
    }, {
      name: 'Record$ebnf$1',
      symbols: ['Record$ebnf$1', 'Record$ebnf$1$subexpression$1'],
      postprocess: function postprocess(d) {
        return d[0].concat([d[1]]);
      }
    }, {
      name: 'Record',
      symbols: [{
        literal: '{'
      }, '_', 'Property', 'Record$ebnf$1', {
        literal: '}'
      }, '_'],
      postprocess: function postprocess(_ref19) {
        var p = _ref19[2],
            ps = _ref19[3];
        return propertiesToRecord([p].concat(ps));
      }
    }, {
      name: 'Property',
      symbols: ['Symbol', {
        literal: ':'
      }, '_', 'Value'],
      postprocess: function postprocess(_ref20) {
        var k = _ref20[0],
            v = _ref20[3];
        return property(k, v);
      }
    }, {
      name: 'Value',
      symbols: ['StringLiteral', '_'],
      postprocess: id
    }, {
      name: 'Value',
      symbols: ['NumericLiteral', '_'],
      postprocess: id
    }, {
      name: 'Value',
      symbols: [/*#__PURE__*/lexer.has('boolean') ? {
        type: 'boolean'
      } : boolean, '_'],
      postprocess: function postprocess(d) {
        return _boolean$1(JSON.parse(d[0].value.toLowerCase()));
      }
    }, {
      name: 'Value$ebnf$1',
      symbols: []
    }, {
      name: 'Value$ebnf$1$subexpression$1',
      symbols: [{
        literal: ','
      }, '_', 'Value'],
      postprocess: function postprocess(_ref21) {
        var v = _ref21[2];
        return v;
      }
    }, {
      name: 'Value$ebnf$1',
      symbols: ['Value$ebnf$1', 'Value$ebnf$1$subexpression$1'],
      postprocess: function postprocess(d) {
        return d[0].concat([d[1]]);
      }
    }, {
      name: 'Value',
      symbols: [{
        literal: '['
      }, '_', 'Value', 'Value$ebnf$1', {
        literal: ']'
      }, '_'],
      postprocess: function postprocess(_ref22) {
        var v = _ref22[2],
            vs = _ref22[3];
        return [v].concat(vs);
      }
    }, {
      name: 'StringLiteral',
      symbols: [/*#__PURE__*/lexer.has('singleQuotedString') ? {
        type: 'singleQuotedString'
      } : singleQuotedString],
      postprocess: function postprocess(d) {
        return string(d[0].value);
      }
    }, {
      name: 'StringLiteral',
      symbols: [/*#__PURE__*/lexer.has('doubleQuotedString') ? {
        type: 'doubleQuotedString'
      } : doubleQuotedString],
      postprocess: function postprocess(d) {
        return string(d[0].value);
      }
    }, {
      name: 'StringLiteral',
      symbols: [/*#__PURE__*/lexer.has('tickedString') ? {
        type: 'tickedString'
      } : tickedString],
      postprocess: function postprocess(d) {
        return string(d[0].value);
      }
    }, {
      name: 'StringLiteral',
      symbols: [/*#__PURE__*/lexer.has('taggedString') ? {
        type: 'taggedString'
      } : taggedString],
      postprocess: function postprocess(d) {
        var parts = separateTagFromString(d[0].value);
        return tagged(parts.tag, parts.value);
      }
    }, {
      name: 'NumericLiteral',
      symbols: [/*#__PURE__*/lexer.has('integer') ? {
        type: 'integer'
      } : integer],
      postprocess: function postprocess(d) {
        return integer$2(d[0].value);
      }
    }, {
      name: 'NumericLiteral',
      symbols: [/*#__PURE__*/lexer.has('decimal') ? {
        type: 'decimal'
      } : decimal],
      postprocess: function postprocess(d) {
        return decimal$2(d[0].value);
      }
    }, {
      name: 'NumericLiteral',
      symbols: [/*#__PURE__*/lexer.has('hexadecimal') ? {
        type: 'hexadecimal'
      } : hexadecimal],
      postprocess: function postprocess(d) {
        return hexadecimal$2(d[0].value);
      }
    }, {
      name: 'NumericLiteral',
      symbols: [/*#__PURE__*/lexer.has('octal') ? {
        type: 'octal'
      } : octal],
      postprocess: function postprocess(d) {
        return octal$2(d[0].value);
      }
    }, {
      name: 'NumericLiteral',
      symbols: [/*#__PURE__*/lexer.has('measurement') ? {
        type: 'measurement'
      } : measurement],
      postprocess: function postprocess(d) {
        var parts = separateNumberFromUnits(d[0].value);
        return measurement$2(parts.unit, parts.value);
      }
    }, {
      name: '_$ebnf$1',
      symbols: [/*#__PURE__*/lexer.has('whitespace') ? {
        type: 'whitespace'
      } : whitespace],
      postprocess: id
    }, {
      name: '_$ebnf$1',
      symbols: [],
      postprocess: function postprocess() {
        return null;
      }
    }, {
      name: '_',
      symbols: ['_$ebnf$1'],
      postprocess: empty$1
    }, {
      name: 'Comment',
      symbols: [/*#__PURE__*/lexer.has('lineComment') ? {
        type: 'lineComment'
      } : lineComment],
      postprocess: empty$1
    }, {
      name: 'EOL',
      symbols: [{
        literal: '\n'
      }],
      postprocess: empty$1
    }],
    ParserStart: 'GramSeq'
  };

  var INCOMPLETE_PARSE = 'Incomplete parse.';

  var lexerLocation = function lexerLocation(state) {
    return {
      line: state.line,
      column: state.col
    };
  };

  var tokenLocation = function tokenLocation(token) {
    return {
      line: token.line,
      column: token.col
    };
  };

  var parse = function parse(text, file) {
    var nearleyParser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    try {
      var parsed = nearleyParser.feed(text);

      if (parsed.results[0] === undefined && parsed.lexerState) {
        var location = lexerLocation(parsed.lexerState);
        file.fail(INCOMPLETE_PARSE, location);
      }

      if (parsed.results.length > 1) {
        file.info('[WARN] parsing is ambiguous');
      }

      return parsed.results[0] || {
        type: 'error'
      };
    } catch (e) {
      var _location = e.token ? tokenLocation(e.token) : {
        line: 0,
        column: 0
      };

      file.fail(e.message, _location);
    }
  };

  var gramParserPlugin = function gramParserPlugin() {
    this.Parser = parse;
  };

  // This file replaces `index.js` in bundlers like webpack or Rollup,

  {
    // All bundlers will remove this block in the production bundle.
    if (
      typeof navigator !== 'undefined' &&
      navigator.product === 'ReactNative' &&
      typeof crypto === 'undefined'
    ) {
      throw new Error(
        'React Native does not have a built-in secure random generator. ' +
          'If you don’t need unpredictable IDs use `nanoid/non-secure`. ' +
          'For secure IDs, import `react-native-get-random-values` ' +
          'before Nano ID. If you use Expo, install `expo-random` ' +
          'and use `nanoid/async`.'
      )
    }
    if (typeof msCrypto !== 'undefined' && typeof crypto === 'undefined') {
      throw new Error(
        'Import file with `if (!window.crypto) window.crypto = window.msCrypto`' +
          ' before importing Nano ID to fix IE 11 support'
      )
    }
    if (typeof crypto === 'undefined') {
      throw new Error(
        'Your browser does not have secure random generator. ' +
          'If you don’t need unpredictable IDs, you can use nanoid/non-secure.'
      )
    }
  }

  let random = bytes => crypto.getRandomValues(new Uint8Array(bytes));

  let customRandom = (alphabet, size, getRandom) => {
    // First, a bitmask is necessary to generate the ID. The bitmask makes bytes
    // values closer to the alphabet size. The bitmask calculates the closest
    // `2^31 - 1` number, which exceeds the alphabet size.
    // For example, the bitmask for the alphabet size 30 is 31 (00011111).
    // `Math.clz32` is not used, because it is not available in browsers.
    let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1;
    // Though, the bitmask solution is not perfect since the bytes exceeding
    // the alphabet size are refused. Therefore, to reliably generate the ID,
    // the random bytes redundancy has to be satisfied.

    // Note: every hardware random generator call is performance expensive,
    // because the system call for entropy collection takes a lot of time.
    // So, to avoid additional system calls, extra bytes are requested in advance.

    // Next, a step determines how many random bytes to generate.
    // The number of random bytes gets decided upon the ID size, mask,
    // alphabet size, and magic number 1.6 (using 1.6 peaks at performance
    // according to benchmarks).

    // `-~f => Math.ceil(f)` if f is a float
    // `-~i => i + 1` if i is an integer
    let step = -~((1.6 * mask * size) / alphabet.length);

    return () => {
      let id = '';
      while (true) {
        let bytes = getRandom(step);
        // A compact alternative for `for (var i = 0; i < step; i++)`.
        let j = step;
        while (j--) {
          // Adding `|| ''` refuses a random byte that exceeds the alphabet size.
          id += alphabet[bytes[j] & mask] || '';
          if (id.length === size) return id
        }
      }
    }
  };

  let customAlphabet = (alphabet, size) => customRandom(alphabet, size, random);

  var convert_1 = convert;

  function convert(test) {
    if (test == null) {
      return ok
    }

    if (typeof test === 'string') {
      return typeFactory(test)
    }

    if (typeof test === 'object') {
      return 'length' in test ? anyFactory(test) : allFactory(test)
    }

    if (typeof test === 'function') {
      return test
    }

    throw new Error('Expected function, string, or object as test')
  }

  // Utility assert each property in `test` is represented in `node`, and each
  // values are strictly equal.
  function allFactory(test) {
    return all

    function all(node) {
      var key;

      for (key in test) {
        if (node[key] !== test[key]) return false
      }

      return true
    }
  }

  function anyFactory(tests) {
    var checks = [];
    var index = -1;

    while (++index < tests.length) {
      checks[index] = convert(tests[index]);
    }

    return any

    function any() {
      var index = -1;

      while (++index < checks.length) {
        if (checks[index].apply(this, arguments)) {
          return true
        }
      }

      return false
    }
  }

  // Utility to convert a string into a function which checks a given node’s type
  // for said string.
  function typeFactory(test) {
    return type

    function type(node) {
      return Boolean(node && node.type === test)
    }
  }

  // Utility to return true.
  function ok() {
    return true
  }

  var color_browser = identity;
  function identity(d) {
    return d
  }

  var unistUtilVisitParents = visitParents;




  var CONTINUE = true;
  var SKIP = 'skip';
  var EXIT = false;

  visitParents.CONTINUE = CONTINUE;
  visitParents.SKIP = SKIP;
  visitParents.EXIT = EXIT;

  function visitParents(tree, test, visitor, reverse) {
    var step;
    var is;

    if (typeof test === 'function' && typeof visitor !== 'function') {
      reverse = visitor;
      visitor = test;
      test = null;
    }

    is = convert_1(test);
    step = reverse ? -1 : 1;

    factory(tree, null, [])();

    function factory(node, index, parents) {
      var value = typeof node === 'object' && node !== null ? node : {};
      var name;

      if (typeof value.type === 'string') {
        name =
          typeof value.tagName === 'string'
            ? value.tagName
            : typeof value.name === 'string'
            ? value.name
            : undefined;

        visit.displayName =
          'node (' + color_browser(value.type + (name ? '<' + name + '>' : '')) + ')';
      }

      return visit

      function visit() {
        var grandparents = parents.concat(node);
        var result = [];
        var subresult;
        var offset;

        if (!test || is(node, index, parents[parents.length - 1] || null)) {
          result = toResult(visitor(node, parents));

          if (result[0] === EXIT) {
            return result
          }
        }

        if (node.children && result[0] !== SKIP) {
          offset = (reverse ? node.children.length : -1) + step;

          while (offset > -1 && offset < node.children.length) {
            subresult = factory(node.children[offset], offset, grandparents)();

            if (subresult[0] === EXIT) {
              return subresult
            }

            offset =
              typeof subresult[1] === 'number' ? subresult[1] : offset + step;
          }
        }

        return result
      }
    }
  }

  function toResult(value) {
    if (value !== null && typeof value === 'object' && 'length' in value) {
      return value
    }

    if (typeof value === 'number') {
      return [CONTINUE, value]
    }

    return [value]
  }

  var unistUtilVisit = visit;



  var CONTINUE$1 = unistUtilVisitParents.CONTINUE;
  var SKIP$1 = unistUtilVisitParents.SKIP;
  var EXIT$1 = unistUtilVisitParents.EXIT;

  visit.CONTINUE = CONTINUE$1;
  visit.SKIP = SKIP$1;
  visit.EXIT = EXIT$1;

  function visit(tree, test, visitor, reverse) {
    if (typeof test === 'function' && typeof visitor !== 'function') {
      reverse = visitor;
      visitor = test;
      test = null;
    }

    unistUtilVisitParents(tree, test, overload, reverse);

    function overload(node, parents) {
      var parent = parents[parents.length - 1];
      var index = parent ? parent.children.indexOf(node) : null;
      return visitor(node, index, parent)
    }
  }

  var alphabets = {
    base2: '01',
    dieBase6: '⚀⚁⚂⚃⚄⚅',
    base8: '01234567',
    base10: '0123456789',
    astrologyBase12: '♈︎♉︎♊︎♋︎♌︎♍︎♎︎♏︎♐︎♑︎♒︎♓︎',
    base11: '0123456789a',
    chessBase12: '♚♛♜♝♞♟♔♕♖♗♘♙',
    base16: '0123456789abcdef',
    dominoBase28: '🁣🁤🁫🁥🁬🁳🁦🁭🁴🁻🁧🁮🁵🁼🂃🁨🁯🁶🁽🂊🂋🁩🁰🁷🁾🂅🂌🂓',
    base32: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    zBase32: 'ybndrfg8ejkmcpqxot1uwisza345h769',
    crock32: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
    base32Hex: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
    base36: '0123456789abcdefghijklmnopqrstuvwxyz',
    mahjongBase43: '🀑🀒🀓🀔🀕🀖🀗🀘🀙🀚🀛🀜🀝🀞🀟🀠🀡🀇🀈🀉🀊🀋🀌🀍🀎🀏🀀🀁🀂🀃🀄︎🀅🀆🀐🀢🀣🀤🀥🀦🀧🀨🀩🀪',
    cards56: '🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂬🂭🂮🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂼🂽🂾🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃌🃍🃎🃑🃒🃓🃔🃕🃖🃗🃘🃙🃝🃞',
    base58: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
    flickrBase58: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
    base62: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    base64: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@',
    cookieBase90: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&'()*+-./:<=>?@[]^_`{|}~"
  };

  /**
   * Creates an IDGenerator based on incrementing numbers.
   *
   */
  var counterIDGenerator = function counterIDGenerator(prefix) {
    var nextid = 0;
    return {
      generate: function generate() {
        return "" + (prefix || '') + nextid++;
      }
    };
  };

  /**
   * Factory for creating an IDGenerator based on
   * [nanoid](https://github.com/ai/nanoid)
   *
   */

  var nanoidGenerator = function nanoidGenerator(alphabet, size, prefix) {
    if (alphabet === void 0) {
      alphabet = alphabets.base64;
    }

    if (size === void 0) {
      size = 21;
    }

    var generator = customAlphabet(alphabet, size);
    return {
      generate: function generate() {
        return prefix ? prefix + generator() : generator();
      }
    };
  };

  function _extends$2() {
    _extends$2 = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends$2.apply(this, arguments);
  }

  var defaultSettings = {
    generator: 'counter',
    alphabet: alphabets.base58,
    prefix: undefined
  };
  var gramIdentityPlugin = function gramIdentityPlugin(settings) {
    var s = _extends$2({}, defaultSettings, settings);

    var identification = function identification(tree) {
      var generator;

      switch (s.generator) {
        case 'nanoid':
          generator = nanoidGenerator(s.alphabet, 21, s.prefix);
          break;

        case 'counter':
        default:
          generator = counterIDGenerator(s.prefix);
      }

      unistUtilVisit(tree, function (element) {
        if (isGramPath(element)) {
          element.id = element.id || generator.generate();
        }
      });
    };

    return identification;
  };

  function _extends$3() {
    _extends$3 = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends$3.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  var iso8601Year = /^([+-]\d{4,}\b|\d{4})$/;
  var iso8601YearMonth = /^([0-9]{4})-(1[0-2]|0[1-9])$/;
  var iso8601YearMonthDay = /^([0-9]{4})(-?)(1[0-2]|0[1-9])\2(3[01]|0[1-9]|[12][0-9])$/;

  var iso8601Time = /^(2[0-3]|[01][0-9]):?([0-5][0-9]):?([0-5][0-9](\.[0-9]{3})?)?(Z|([+-])((?:2[0-3]|[01][0-9]))(?::?([0-5][0-9]))?)?$/;

  var InvalidAstError = /*#__PURE__*/function (_Error) {
    _inheritsLoose(InvalidAstError, _Error);

    function InvalidAstError(ast) {
      var _this;

      _this = _Error.call(this, 'AST is invalid:' + JSON.stringify(ast)) || this;
      _this.name = 'InvalidAstError';
      _this.ast = ast;
      return _this;
    }

    return InvalidAstError;
  }( /*#__PURE__*/_wrapNativeSuper(Error));
  /**
   * Evaluates data structures and text literal values, returning
   * native objects and primitive values.
   *
   * @see {@linkcode valueOfLiteral} for default literal value evaluator
   */


  var valueOf = function valueOf(recordValue, literalValueEvaluator) {
    if (literalValueEvaluator === void 0) {
      literalValueEvaluator = valueOfLiteral;
    }

    if (isGramRecord(recordValue)) {
      return Array.from(recordValue).reduce(function (acc, _ref) {
        var k = _ref[0],
            v = _ref[1];
        acc[k] = valueOf(v);
        return acc;
      }, {});
    } else {
      if (isGramLiteralArray(recordValue)) {
        return recordValue.map(function (v) {
          return valueOf(v);
        });
      } else if (isGramLiteral(recordValue)) {
        return literalValueEvaluator(recordValue);
      } else if (typeof recordValue === 'object') {
        return Object.entries(recordValue).reduce(function (acc, _ref2) {
          var k = _ref2[0],
              v = _ref2[1];
          acc[k] = valueOf(v);
          return acc;
        }, {});
      }
    }
  };

  function assertNever(x) {
    throw new Error('Unexpected object: ' + x);
  }

  var valueOfLiteral = function valueOfLiteral(ast) {
    switch (ast.type) {
      case 'boolean':
        return valueOfBoolean(ast);

      case 'string':
        return valueOfString(ast);

      case 'integer':
        return valueOfInteger(ast);

      case 'decimal':
        return valueOfDecimal(ast);

      case 'hexadecimal':
        return valueOfHexadecimal(ast);

      case 'octal':
        return valueOfOctal(ast);

      case 'tagged':
        switch (ast.tag) {
          case 'date':
            return valueOfDate(ast);

          case 'time':
            return valueOfTime(ast);

          case 'datetime':
            return 'TODO';

          case 'interval':
            return 'TODO';

          case 'duration':
            return 'TODO';

          case 'uri':
            return ast.value;

          case 'wkt':
            return 'TODO';

          default:
            return 'TODO';
        }

      case 'measurement':
        return 'measure by measure';

      default:
        return assertNever(ast);
    }
  };
  var valueOfBoolean = function valueOfBoolean(ast) {
    return ast.value && ast.value.toLowerCase() === 'true';
  };
  var valueOfString = function valueOfString(ast) {
    if (ast.value) {
      return ast.value;
    }

    throw new InvalidAstError(ast);
  };
  var valueOfDate = function valueOfDate(ast) {
    if (ast.value) {
      var extracted = iso8601YearMonthDay.exec(ast.value);

      if (extracted) {
        return new Date(Date.UTC(Number.parseInt(extracted[1]), Number.parseInt(extracted[3]) - 1, Number.parseInt(extracted[4])));
      }

      extracted = iso8601YearMonth.exec(ast.value);

      if (extracted) {
        return new Date(Date.UTC(Number.parseInt(extracted[1]), Number.parseInt(extracted[2])));
      }

      extracted = iso8601Year.exec(ast.value);

      if (extracted) {
        return new Date(Number.parseInt(extracted[1]), 1);
      }

      throw SyntaxError("Unable to parse date from " + ast.value);
    }

    throw new InvalidAstError(ast);
  };
  var MILLIS_IN_A_SECOND = 1000;
  var MILLIS_IN_A_MINUTE = MILLIS_IN_A_SECOND * 60;
  var MILLIS_IN_AN_HOUR = MILLIS_IN_A_MINUTE * 60;
  /**
   * Value of time as number of milliseconds since midnight.
   *
   * @param ast
   */

  var valueOfTime = function valueOfTime(ast) {
    if (ast.value) {
      var extracted = iso8601Time.exec(ast.value);

      if (extracted) {
        var hours = Number.parseInt(extracted[1]);
        var minutes = extracted[1] ? Number.parseInt(extracted[2]) : 0;
        var seconds = extracted[3] ? Number.parseFloat(extracted[3]) : 0.0;
        var tz = extracted[5]; // console.log('time', extracted, hours, minutes, seconds, tz);

        var millis = hours * MILLIS_IN_AN_HOUR + minutes * MILLIS_IN_A_MINUTE + seconds * MILLIS_IN_A_SECOND;

        if (tz) {
          var offset = tz === 'Z' ? 0 : Number.parseInt(extracted[7]) * MILLIS_IN_AN_HOUR + Number.parseInt(extracted[8] || '0') * MILLIS_IN_A_MINUTE;
          return new Date(extracted[6] === '-' ? millis + offset : millis - offset);
        }

        return new Date(millis);
      }

      throw SyntaxError("Unable to parse time from " + ast.value);
    }

    throw new InvalidAstError(ast);
  };
  var valueOfInteger = function valueOfInteger(ast) {
    if (ast.value) {
      return Number.parseInt(ast.value);
    } else throw new InvalidAstError(ast);
  };
  var valueOfDecimal = function valueOfDecimal(ast) {
    if (ast.value) {
      return Number.parseFloat(ast.value);
    } else throw new InvalidAstError(ast);
  };
  var valueOfHexadecimal = function valueOfHexadecimal(ast) {
    if (ast.value) {
      return Number.parseInt(ast.value, 16);
    } else throw new InvalidAstError(ast);
  };
  var valueOfOctal = function valueOfOctal(ast) {
    if (ast.value) {
      return Number.parseInt(ast.value, 8);
    } else throw new InvalidAstError(ast);
  };

  var defaultSettings$1 = {
    literalValueEvaluator: valueOfLiteral
  };
  var gramValuePlugin = function gramValuePlugin(settings) {
    var s = _extends$3({}, defaultSettings$1, settings);

    var recordValueEvaluator = function recordValueEvaluator(tree) {
      unistUtilVisit(tree, function (element) {
        if (isGramPath(element) && element.record) {
          element.data = Object.assign(element.data || {}, {
            value: valueOf(element.record, s.literalValueEvaluator)
          });
        }
      });
    };

    return recordValueEvaluator;
  };

  var plugins = [gramIdentityPlugin, gramValuePlugin];

  var gramPresetBasic = {
    __proto__: null,
    plugins: plugins
  };

  const gramProcessor = /*#__PURE__*/unified_1().use(gramParserPlugin).use(gramPresetBasic);
  /**
   * Parses text as [gram](https://github.com/gram-data/gram-js),
   * returning a graph representated nodes, links and paths.
   *
   * @param src
   */

  const parse$1 = src => {
    const parsed = gramProcessor.runSync(gramProcessor.parse(src));
    const gramGraph = {
      nodes: nodes(parsed).map(nodeToD3),
      links: edges(parsed).map(edgeToD3),
      paths: []
    };
    return gramGraph;
  };
  const dataFromPath = p => {
    return p.data && p.data.value ? p.data.value : p.record ? p.record : {};
  };
  const nodeToD3 = node => {
    return isGramNode(node) ? makeGramNodeDatum(node.id, node.labels, dataFromPath(node)) : makeGramNodeDatum('random');
  };

  const source = edge => {
    if (edge.kind === 'left') return edge.children[1].id || MISSING_ID;
    return edge.children[0].id || MISSING_ID;
  };

  const target = edge => {
    if (edge.kind === 'left') return edge.children[0].id || MISSING_ID;
    return edge.children[1].id || MISSING_ID;
  };

  const edgeToD3 = edge => {
    return makeGramLinkDatum(source(edge), target(edge), edge.id, edge.labels, dataFromPath(edge));
  };

  var noop = {value: () => {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function array(x) {
    return typeof x === "object" && "length" in x
      ? x // Array, TypedArray, NodeList, array-like
      : Array.from(x); // Map, Set, iterable, string, or anything else
  }

  function empty$2() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty$2 : function() {
      return this.querySelectorAll(selector);
    };
  }

  function arrayAll(select) {
    return function() {
      var group = select.apply(this, arguments);
      return group == null ? [] : array(group);
    };
  }

  function selection_selectAll(select) {
    if (typeof select === "function") select = arrayAll(select);
    else select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  function matcher(selector) {
    return function() {
      return this.matches(selector);
    };
  }

  function childMatcher(selector) {
    return function(node) {
      return node.matches(selector);
    };
  }

  var find = Array.prototype.find;

  function childFind(match) {
    return function() {
      return find.call(this.children, match);
    };
  }

  function childFirst() {
    return this.firstElementChild;
  }

  function selection_selectChild(match) {
    return this.select(match == null ? childFirst
        : childFind(typeof match === "function" ? match : childMatcher(match)));
  }

  var filter = Array.prototype.filter;

  function children() {
    return this.children;
  }

  function childrenFilter(match) {
    return function() {
      return filter.call(this.children, match);
    };
  }

  function selection_selectChildren(match) {
    return this.selectAll(match == null ? children
        : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant(x) {
    return function() {
      return x;
    };
  }

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = new Map,
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) {
          exit[i] = node;
        } else {
          nodeByKeyValue.set(keyValue, node);
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = key.call(parent, data[i], i, data) + "";
      if (node = nodeByKeyValue.get(keyValue)) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue.delete(keyValue);
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
        exit[i] = node;
      }
    }
  }

  function datum(node) {
    return node.__data__;
  }

  function selection_data(value, key) {
    if (!arguments.length) return Array.from(this, datum);

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = array(value.call(parent, parent && parent.__data__, j, parents)),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_join(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
    if (onupdate != null) update = onupdate(update);
    if (onexit == null) exit.remove(); else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
  }

  function selection_merge(selection) {
    if (!(selection instanceof Selection)) throw new Error("invalid merge");

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    return Array.from(this);
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    let size = 0;
    for (const node of this) ++size; // eslint-disable-line no-unused-vars
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : styleValue(this.node(), name);
  }

  function styleValue(node, name) {
    return node.style.getPropertyValue(name)
        || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
  }

  function selection_clone(deep) {
    return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function contextListener(listener) {
    return function(event) {
      listener.call(this, event, this.__data__);
    };
  }

  function parseTypenames$1(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, options) {
    return function() {
      var on = this.__on, o, listener = contextListener(value);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, options);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, options) {
    var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
    return this;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (typeof event === "function") {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  function* selection_iterator() {
    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) yield node;
      }
    }
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection([[document.documentElement]], root);
  }

  function selection_selection() {
    return this;
  }

  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    selectChild: selection_selectChild,
    selectChildren: selection_selectChildren,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    join: selection_join,
    merge: selection_merge,
    selection: selection_selection,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    clone: selection_clone,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch,
    [Symbol.iterator]: selection_iterator
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }

  function sourceEvent(event) {
    let sourceEvent;
    while (sourceEvent = event.sourceEvent) event = sourceEvent;
    return event;
  }

  function pointer(event, node) {
    event = sourceEvent(event);
    if (node === undefined) node = event.currentTarget;
    if (node) {
      var svg = node.ownerSVGElement || node;
      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }
      if (node.getBoundingClientRect) {
        var rect = node.getBoundingClientRect();
        return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
      }
    }
    return [event.pageX, event.pageY];
  }

  function nopropagation(event) {
    event.stopImmediatePropagation();
  }

  function noevent(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function dragDisable(view) {
    var root = view.document.documentElement,
        selection = select(view).on("dragstart.drag", noevent, true);
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", noevent, true);
    } else {
      root.__noselect = root.style.MozUserSelect;
      root.style.MozUserSelect = "none";
    }
  }

  function yesdrag(view, noclick) {
    var root = view.document.documentElement,
        selection = select(view).on("dragstart.drag", null);
    if (noclick) {
      selection.on("click.drag", noevent, true);
      setTimeout(function() { selection.on("click.drag", null); }, 0);
    }
    if ("onselectstart" in root) {
      selection.on("selectstart.drag", null);
    } else {
      root.style.MozUserSelect = root.__noselect;
      delete root.__noselect;
    }
  }

  var constant$1 = x => () => x;

  function DragEvent(type, {
    sourceEvent,
    subject,
    target,
    identifier,
    active,
    x, y, dx, dy,
    dispatch
  }) {
    Object.defineProperties(this, {
      type: {value: type, enumerable: true, configurable: true},
      sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
      subject: {value: subject, enumerable: true, configurable: true},
      target: {value: target, enumerable: true, configurable: true},
      identifier: {value: identifier, enumerable: true, configurable: true},
      active: {value: active, enumerable: true, configurable: true},
      x: {value: x, enumerable: true, configurable: true},
      y: {value: y, enumerable: true, configurable: true},
      dx: {value: dx, enumerable: true, configurable: true},
      dy: {value: dy, enumerable: true, configurable: true},
      _: {value: dispatch}
    });
  }

  DragEvent.prototype.on = function() {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
  };

  // Ignore right-click, since that should open the context menu.
  function defaultFilter(event) {
    return !event.ctrlKey && !event.button;
  }

  function defaultContainer() {
    return this.parentNode;
  }

  function defaultSubject(event, d) {
    return d == null ? {x: event.x, y: event.y} : d;
  }

  function defaultTouchable() {
    return navigator.maxTouchPoints || ("ontouchstart" in this);
  }

  function d3Drag() {
    var filter = defaultFilter,
        container = defaultContainer,
        subject = defaultSubject,
        touchable = defaultTouchable,
        gestures = {},
        listeners = dispatch("start", "drag", "end"),
        active = 0,
        mousedownx,
        mousedowny,
        mousemoving,
        touchending,
        clickDistance2 = 0;

    function drag(selection) {
      selection
          .on("mousedown.drag", mousedowned)
        .filter(touchable)
          .on("touchstart.drag", touchstarted)
          .on("touchmove.drag", touchmoved)
          .on("touchend.drag touchcancel.drag", touchended)
          .style("touch-action", "none")
          .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }

    function mousedowned(event, d) {
      if (touchending || !filter.call(this, event, d)) return;
      var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
      if (!gesture) return;
      select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
      dragDisable(event.view);
      nopropagation(event);
      mousemoving = false;
      mousedownx = event.clientX;
      mousedowny = event.clientY;
      gesture("start", event);
    }

    function mousemoved(event) {
      noevent(event);
      if (!mousemoving) {
        var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
        mousemoving = dx * dx + dy * dy > clickDistance2;
      }
      gestures.mouse("drag", event);
    }

    function mouseupped(event) {
      select(event.view).on("mousemove.drag mouseup.drag", null);
      yesdrag(event.view, mousemoving);
      noevent(event);
      gestures.mouse("end", event);
    }

    function touchstarted(event, d) {
      if (!filter.call(this, event, d)) return;
      var touches = event.changedTouches,
          c = container.call(this, event, d),
          n = touches.length, i, gesture;

      for (i = 0; i < n; ++i) {
        if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
          nopropagation(event);
          gesture("start", event, touches[i]);
        }
      }
    }

    function touchmoved(event) {
      var touches = event.changedTouches,
          n = touches.length, i, gesture;

      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          noevent(event);
          gesture("drag", event, touches[i]);
        }
      }
    }

    function touchended(event) {
      var touches = event.changedTouches,
          n = touches.length, i, gesture;

      if (touchending) clearTimeout(touchending);
      touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
      for (i = 0; i < n; ++i) {
        if (gesture = gestures[touches[i].identifier]) {
          nopropagation(event);
          gesture("end", event, touches[i]);
        }
      }
    }

    function beforestart(that, container, event, d, identifier, touch) {
      var dispatch = listeners.copy(),
          p = pointer(touch || event, container), dx, dy,
          s;

      if ((s = subject.call(that, new DragEvent("beforestart", {
          sourceEvent: event,
          target: drag,
          identifier,
          active,
          x: p[0],
          y: p[1],
          dx: 0,
          dy: 0,
          dispatch
        }), d)) == null) return;

      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;

      return function gesture(type, event, touch) {
        var p0 = p, n;
        switch (type) {
          case "start": gestures[identifier] = gesture, n = active++; break;
          case "end": delete gestures[identifier], --active; // nobreak
          case "drag": p = pointer(touch || event, container), n = active; break;
        }
        dispatch.call(
          type,
          that,
          new DragEvent(type, {
            sourceEvent: event,
            subject: s,
            target: drag,
            identifier,
            active: n,
            x: p[0] + dx,
            y: p[1] + dy,
            dx: p[0] - p0[0],
            dy: p[1] - p0[1],
            dispatch
          }),
          d
        );
      };
    }

    drag.filter = function(_) {
      return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), drag) : filter;
    };

    drag.container = function(_) {
      return arguments.length ? (container = typeof _ === "function" ? _ : constant$1(_), drag) : container;
    };

    drag.subject = function(_) {
      return arguments.length ? (subject = typeof _ === "function" ? _ : constant$1(_), drag) : subject;
    };

    drag.touchable = function(_) {
      return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$1(!!_), drag) : touchable;
    };

    drag.on = function() {
      var value = listeners.on.apply(listeners, arguments);
      return value === listeners ? drag : value;
    };

    drag.clickDistance = function(_) {
      return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
    };

    return drag;
  }

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend$1(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex = /^#([0-9a-f]{3,8})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    copy: function(channels) {
      return Object.assign(new this.constructor, this, channels);
    },
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: color_formatHex, // Deprecated! Use color.formatHex.
    formatHex: color_formatHex,
    formatHsl: color_formatHsl,
    formatRgb: color_formatRgb,
    toString: color_formatRgb
  });

  function color_formatHex() {
    return this.rgb().formatHex();
  }

  function color_formatHsl() {
    return hslConvert(this).formatHsl();
  }

  function color_formatRgb() {
    return this.rgb().formatRgb();
  }

  function color(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
        : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
        : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
        : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
        : null) // invalid hex
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend$1(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: rgb_formatHex, // Deprecated! Use color.formatHex.
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb
  }));

  function rgb_formatHex() {
    return "#" + hex(this.r) + hex(this.g) + hex(this.b);
  }

  function rgb_formatRgb() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(")
        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
        + (a === 1 ? ")" : ", " + a + ")");
  }

  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend$1(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    formatHsl: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "hsl(" : "hsla(")
          + (this.h || 0) + ", "
          + (this.s || 0) * 100 + "%, "
          + (this.l || 0) * 100 + "%"
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var constant$2 = x => () => x;

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant$2(isNaN(a) ? b : a);
  }

  var interpolateRgb = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function interpolateNumber(a, b) {
    return a = +a, b = +b, function(t) {
      return a * (1 - t) + b * t;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  var degrees = 180 / Math.PI;

  var identity$1 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var svgNode;

  /* eslint-disable no-undef */
  function parseCss(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
  }

  function parseSvg(value) {
    if (value == null) return identity$1;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var frame = 0, // is an animation frame pending?
      timeout = 0, // is a timeout pending?
      interval = 0, // are any timers active?
      pokeDelay = 1000, // how frequently we check for clock skew
      taskHead,
      taskTail,
      clockLast = 0,
      clockNow = 0,
      clockSkew = 0,
      clock = typeof performance === "object" && performance.now ? performance : Date,
      setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

  function now() {
    return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
  }

  function clearNow() {
    clockNow = 0;
  }

  function Timer() {
    this._call =
    this._time =
    this._next = null;
  }

  Timer.prototype = timer.prototype = {
    constructor: Timer,
    restart: function(callback, delay, time) {
      if (typeof callback !== "function") throw new TypeError("callback is not a function");
      time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
      if (!this._next && taskTail !== this) {
        if (taskTail) taskTail._next = this;
        else taskHead = this;
        taskTail = this;
      }
      this._call = callback;
      this._time = time;
      sleep();
    },
    stop: function() {
      if (this._call) {
        this._call = null;
        this._time = Infinity;
        sleep();
      }
    }
  };

  function timer(callback, delay, time) {
    var t = new Timer;
    t.restart(callback, delay, time);
    return t;
  }

  function timerFlush() {
    now(); // Get the current time, if not already set.
    ++frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = taskHead, e;
    while (t) {
      if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
      t = t._next;
    }
    --frame;
  }

  function wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      nap();
      clockNow = 0;
    }
  }

  function poke() {
    var now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
  }

  function nap() {
    var t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    sleep(time);
  }

  function sleep(time) {
    if (frame) return; // Soonest alarm already set, or will be.
    if (timeout) timeout = clearTimeout(timeout);
    var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
      if (interval) interval = clearInterval(interval);
    } else {
      if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
      frame = 1, setFrame(wake);
    }
  }

  function timeout$1(callback, delay, time) {
    var t = new Timer;
    delay = delay == null ? 0 : +delay;
    t.restart(elapsed => {
      t.stop();
      callback(elapsed + delay);
    }, delay, time);
    return t;
  }

  var emptyOn = dispatch("start", "end", "cancel", "interrupt");
  var emptyTween = [];

  var CREATED = 0;
  var SCHEDULED = 1;
  var STARTING = 2;
  var STARTED = 3;
  var RUNNING = 4;
  var ENDING = 5;
  var ENDED = 6;

  function schedule(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    create(node, id, {
      name: name,
      index: index, // For context during callback.
      group: group, // For context during callback.
      on: emptyOn,
      tween: emptyTween,
      time: timing.time,
      delay: timing.delay,
      duration: timing.duration,
      ease: timing.ease,
      timer: null,
      state: CREATED
    });
  }

  function init(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > CREATED) throw new Error("too late; already scheduled");
    return schedule;
  }

  function set$1(node, id) {
    var schedule = get$1(node, id);
    if (schedule.state > STARTED) throw new Error("too late; already running");
    return schedule;
  }

  function get$1(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
  }

  function create(node, id, self) {
    var schedules = node.__transition,
        tween;

    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = timer(schedule, 0, self.time);

    function schedule(elapsed) {
      self.state = SCHEDULED;
      self.timer.restart(start, self.delay, self.time);

      // If the elapsed delay is less than our first sleep, start immediately.
      if (self.delay <= elapsed) start(elapsed - self.delay);
    }

    function start(elapsed) {
      var i, j, n, o;

      // If the state is not SCHEDULED, then we previously errored on start.
      if (self.state !== SCHEDULED) return stop();

      for (i in schedules) {
        o = schedules[i];
        if (o.name !== self.name) continue;

        // While this element already has a starting transition during this frame,
        // defer starting an interrupting transition until that transition has a
        // chance to tick (and possibly end); see d3/d3-transition#54!
        if (o.state === STARTED) return timeout$1(start);

        // Interrupt the active transition, if any.
        if (o.state === RUNNING) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("interrupt", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }

        // Cancel any pre-empted transitions.
        else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
      }

      // Defer the first tick to end of the current frame; see d3/d3#1576.
      // Note the transition may be canceled after start and before the first tick!
      // Note this must be scheduled before the start event; see d3/d3-transition#16!
      // Assuming this is successful, subsequent callbacks go straight to tick.
      timeout$1(function() {
        if (self.state === STARTED) {
          self.state = RUNNING;
          self.timer.restart(tick, self.delay, self.time);
          tick(elapsed);
        }
      });

      // Dispatch the start event.
      // Note this must be done before the tween are initialized.
      self.state = STARTING;
      self.on.call("start", node, node.__data__, self.index, self.group);
      if (self.state !== STARTING) return; // interrupted
      self.state = STARTED;

      // Initialize the tween, deleting null tween.
      tween = new Array(n = self.tween.length);
      for (i = 0, j = -1; i < n; ++i) {
        if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
          tween[++j] = o;
        }
      }
      tween.length = j + 1;
    }

    function tick(elapsed) {
      var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
          i = -1,
          n = tween.length;

      while (++i < n) {
        tween[i].call(node, t);
      }

      // Dispatch the end event.
      if (self.state === ENDING) {
        self.on.call("end", node, node.__data__, self.index, self.group);
        stop();
      }
    }

    function stop() {
      self.state = ENDED;
      self.timer.stop();
      delete schedules[id];
      for (var i in schedules) return; // eslint-disable-line no-unused-vars
      delete node.__transition;
    }
  }

  function interrupt(node, name) {
    var schedules = node.__transition,
        schedule,
        active,
        empty = true,
        i;

    if (!schedules) return;

    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
      active = schedule.state > STARTING && schedule.state < ENDING;
      schedule.state = ENDED;
      schedule.timer.stop();
      schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
      delete schedules[i];
    }

    if (empty) delete node.__transition;
  }

  function selection_interrupt(name) {
    return this.each(function() {
      interrupt(this, name);
    });
  }

  function tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = tween0 = tween;
        for (var i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1 = tween1.slice();
            tween1.splice(i, 1);
            break;
          }
        }
      }

      schedule.tween = tween1;
    };
  }

  function tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
      var schedule = set$1(this, id),
          tween = schedule.tween;

      // If this node shared tween with the previous node,
      // just assign the updated shared tween and we’re done!
      // Otherwise, copy-on-write.
      if (tween !== tween0) {
        tween1 = (tween0 = tween).slice();
        for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
          if (tween1[i].name === name) {
            tween1[i] = t;
            break;
          }
        }
        if (i === n) tween1.push(t);
      }

      schedule.tween = tween1;
    };
  }

  function transition_tween(name, value) {
    var id = this._id;

    name += "";

    if (arguments.length < 2) {
      var tween = get$1(this.node(), id).tween;
      for (var i = 0, n = tween.length, t; i < n; ++i) {
        if ((t = tween[i]).name === name) {
          return t.value;
        }
      }
      return null;
    }

    return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
  }

  function tweenValue(transition, name, value) {
    var id = transition._id;

    transition.each(function() {
      var schedule = set$1(this, id);
      (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });

    return function(node) {
      return get$1(node, id).value[name];
    };
  }

  function interpolate(a, b) {
    var c;
    return (typeof b === "number" ? interpolateNumber
        : b instanceof color ? interpolateRgb
        : (c = color(b)) ? (b = c, interpolateRgb)
        : interpolateString)(a, b);
  }

  function attrRemove$1(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS$1(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant$1(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttribute(name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrConstantNS$1(fullname, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = this.getAttributeNS(fullname.space, fullname.local);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function attrFunction$1(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttribute(name);
      string0 = this.getAttribute(name);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function attrFunctionNS$1(fullname, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0, value1 = value(this), string1;
      if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
      string0 = this.getAttributeNS(fullname.space, fullname.local);
      string1 = value1 + "";
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function transition_attr(name, value) {
    var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
    return this.attrTween(name, typeof value === "function"
        ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
        : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
        : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
  }

  function attrInterpolate(name, i) {
    return function(t) {
      this.setAttribute(name, i.call(this, t));
    };
  }

  function attrInterpolateNS(fullname, i) {
    return function(t) {
      this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
  }

  function attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function attrTween(name, value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_attrTween(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = namespace(name);
    return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
  }

  function delayFunction(id, value) {
    return function() {
      init(this, id).delay = +value.apply(this, arguments);
    };
  }

  function delayConstant(id, value) {
    return value = +value, function() {
      init(this, id).delay = value;
    };
  }

  function transition_delay(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? delayFunction
            : delayConstant)(id, value))
        : get$1(this.node(), id).delay;
  }

  function durationFunction(id, value) {
    return function() {
      set$1(this, id).duration = +value.apply(this, arguments);
    };
  }

  function durationConstant(id, value) {
    return value = +value, function() {
      set$1(this, id).duration = value;
    };
  }

  function transition_duration(value) {
    var id = this._id;

    return arguments.length
        ? this.each((typeof value === "function"
            ? durationFunction
            : durationConstant)(id, value))
        : get$1(this.node(), id).duration;
  }

  function easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
      set$1(this, id).ease = value;
    };
  }

  function transition_ease(value) {
    var id = this._id;

    return arguments.length
        ? this.each(easeConstant(id, value))
        : get$1(this.node(), id).ease;
  }

  function easeVarying(id, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (typeof v !== "function") throw new Error;
      set$1(this, id).ease = v;
    };
  }

  function transition_easeVarying(value) {
    if (typeof value !== "function") throw new Error;
    return this.each(easeVarying(this._id, value));
  }

  function transition_filter(match) {
    if (typeof match !== "function") match = matcher(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Transition(subgroups, this._parents, this._name, this._id);
  }

  function transition_merge(transition) {
    if (transition._id !== this._id) throw new Error;

    for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Transition(merges, this._parents, this._name, this._id);
  }

  function start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
      var i = t.indexOf(".");
      if (i >= 0) t = t.slice(0, i);
      return !t || t === "start";
    });
  }

  function onFunction(id, name, listener) {
    var on0, on1, sit = start(name) ? init : set$1;
    return function() {
      var schedule = sit(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

      schedule.on = on1;
    };
  }

  function transition_on(name, listener) {
    var id = this._id;

    return arguments.length < 2
        ? get$1(this.node(), id).on.on(name)
        : this.each(onFunction(id, name, listener));
  }

  function removeFunction(id) {
    return function() {
      var parent = this.parentNode;
      for (var i in this.__transition) if (+i !== id) return;
      if (parent) parent.removeChild(this);
    };
  }

  function transition_remove() {
    return this.on("end.remove", removeFunction(this._id));
  }

  function transition_select(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
          schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
        }
      }
    }

    return new Transition(subgroups, this._parents, name, id);
  }

  function transition_selectAll(select) {
    var name = this._name,
        id = this._id;

    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
            if (child = children[k]) {
              schedule(child, name, id, k, children, inherit);
            }
          }
          subgroups.push(children);
          parents.push(node);
        }
      }
    }

    return new Transition(subgroups, parents, name, id);
  }

  var Selection$1 = selection.prototype.constructor;

  function transition_selection() {
    return new Selection$1(this._groups, this._parents);
  }

  function styleNull(name, interpolate) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          string1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
  }

  function styleRemove$1(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant$1(name, interpolate, value1) {
    var string00,
        string1 = value1 + "",
        interpolate0;
    return function() {
      var string0 = styleValue(this, name);
      return string0 === string1 ? null
          : string0 === string00 ? interpolate0
          : interpolate0 = interpolate(string00 = string0, value1);
    };
  }

  function styleFunction$1(name, interpolate, value) {
    var string00,
        string10,
        interpolate0;
    return function() {
      var string0 = styleValue(this, name),
          value1 = value(this),
          string1 = value1 + "";
      if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
      return string0 === string1 ? null
          : string0 === string00 && string1 === string10 ? interpolate0
          : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
  }

  function styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
      var schedule = set$1(this, id),
          on = schedule.on,
          listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

      schedule.on = on1;
    };
  }

  function transition_style(name, value, priority) {
    var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
    return value == null ? this
        .styleTween(name, styleNull(name, i))
        .on("end.style." + name, styleRemove$1(name))
      : typeof value === "function" ? this
        .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
        .each(styleMaybeRemove(this._id, name))
      : this
        .styleTween(name, styleConstant$1(name, i, value), priority)
        .on("end.style." + name, null);
  }

  function styleInterpolate(name, i, priority) {
    return function(t) {
      this.style.setProperty(name, i.call(this, t), priority);
    };
  }

  function styleTween(name, value, priority) {
    var t, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
      return t;
    }
    tween._value = value;
    return tween;
  }

  function transition_styleTween(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
  }

  function textConstant$1(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction$1(value) {
    return function() {
      var value1 = value(this);
      this.textContent = value1 == null ? "" : value1;
    };
  }

  function transition_text(value) {
    return this.tween("text", typeof value === "function"
        ? textFunction$1(tweenValue(this, "text", value))
        : textConstant$1(value == null ? "" : value + ""));
  }

  function textInterpolate(i) {
    return function(t) {
      this.textContent = i.call(this, t);
    };
  }

  function textTween(value) {
    var t0, i0;
    function tween() {
      var i = value.apply(this, arguments);
      if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
      return t0;
    }
    tween._value = value;
    return tween;
  }

  function transition_textTween(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, textTween(value));
  }

  function transition_transition() {
    var name = this._name,
        id0 = this._id,
        id1 = newId();

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          var inherit = get$1(node, id0);
          schedule(node, name, id1, i, group, {
            time: inherit.time + inherit.delay + inherit.duration,
            delay: 0,
            duration: inherit.duration,
            ease: inherit.ease
          });
        }
      }
    }

    return new Transition(groups, this._parents, name, id1);
  }

  function transition_end() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
      var cancel = {value: reject},
          end = {value: function() { if (--size === 0) resolve(); }};

      that.each(function() {
        var schedule = set$1(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) {
          on1 = (on0 = on).copy();
          on1._.cancel.push(cancel);
          on1._.interrupt.push(cancel);
          on1._.end.push(end);
        }

        schedule.on = on1;
      });

      // The selection was empty, resolve end immediately
      if (size === 0) resolve();
    });
  }

  var id$1 = 0;

  function Transition(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
  }

  function transition(name) {
    return selection().transition(name);
  }

  function newId() {
    return ++id$1;
  }

  var selection_prototype = selection.prototype;

  Transition.prototype = transition.prototype = {
    constructor: Transition,
    select: transition_select,
    selectAll: transition_selectAll,
    filter: transition_filter,
    merge: transition_merge,
    selection: transition_selection,
    transition: transition_transition,
    call: selection_prototype.call,
    nodes: selection_prototype.nodes,
    node: selection_prototype.node,
    size: selection_prototype.size,
    empty: selection_prototype.empty,
    each: selection_prototype.each,
    on: transition_on,
    attr: transition_attr,
    attrTween: transition_attrTween,
    style: transition_style,
    styleTween: transition_styleTween,
    text: transition_text,
    textTween: transition_textTween,
    remove: transition_remove,
    tween: transition_tween,
    delay: transition_delay,
    duration: transition_duration,
    ease: transition_ease,
    easeVarying: transition_easeVarying,
    end: transition_end,
    [Symbol.iterator]: selection_prototype[Symbol.iterator]
  };

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var defaultTiming = {
    time: null, // Set on use.
    delay: 0,
    duration: 250,
    ease: cubicInOut
  };

  function inherit(node, id) {
    var timing;
    while (!(timing = node.__transition) || !(timing = timing[id])) {
      if (!(node = node.parentNode)) {
        throw new Error(`transition ${id} not found`);
      }
    }
    return timing;
  }

  function selection_transition(name) {
    var id,
        timing;

    if (name instanceof Transition) {
      id = name._id, name = name._name;
    } else {
      id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
    }

    for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          schedule(node, name, id, i, group, timing || inherit(node, id));
        }
      }
    }

    return new Transition(groups, this._parents, name, id);
  }

  selection.prototype.interrupt = selection_interrupt;
  selection.prototype.transition = selection_transition;

  const pi = Math.PI,
      tau = 2 * pi,
      epsilon = 1e-6,
      tauEpsilon = tau - epsilon;

  function Path() {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
  }

  function path$1() {
    return new Path;
  }

  Path.prototype = path$1.prototype = {
    constructor: Path,
    moveTo: function(x, y) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
    },
    closePath: function() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._ += "Z";
      }
    },
    lineTo: function(x, y) {
      this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    quadraticCurveTo: function(x1, y1, x, y) {
      this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    bezierCurveTo: function(x1, y1, x2, y2, x, y) {
      this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
    },
    arcTo: function(x1, y1, x2, y2, r) {
      x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
      var x0 = this._x1,
          y0 = this._y1,
          x21 = x2 - x1,
          y21 = y2 - y1,
          x01 = x0 - x1,
          y01 = y0 - y1,
          l01_2 = x01 * x01 + y01 * y01;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x1,y1).
      if (this._x1 === null) {
        this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
      }

      // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
      else if (!(l01_2 > epsilon));

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
        this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
      }

      // Otherwise, draw an arc!
      else {
        var x20 = x2 - x0,
            y20 = y2 - y0,
            l21_2 = x21 * x21 + y21 * y21,
            l20_2 = x20 * x20 + y20 * y20,
            l21 = Math.sqrt(l21_2),
            l01 = Math.sqrt(l01_2),
            l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
            t01 = l / l01,
            t21 = l / l21;

        // If the start tangent is not coincident with (x0,y0), line to.
        if (Math.abs(t01 - 1) > epsilon) {
          this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
        }

        this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
      }
    },
    arc: function(x, y, r, a0, a1, ccw) {
      x = +x, y = +y, r = +r, ccw = !!ccw;
      var dx = r * Math.cos(a0),
          dy = r * Math.sin(a0),
          x0 = x + dx,
          y0 = y + dy,
          cw = 1 ^ ccw,
          da = ccw ? a0 - a1 : a1 - a0;

      // Is the radius negative? Error.
      if (r < 0) throw new Error("negative radius: " + r);

      // Is this path empty? Move to (x0,y0).
      if (this._x1 === null) {
        this._ += "M" + x0 + "," + y0;
      }

      // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
      else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._ += "L" + x0 + "," + y0;
      }

      // Is this arc empty? We’re done.
      if (!r) return;

      // Does the angle go the wrong way? Flip the direction.
      if (da < 0) da = da % tau + tau;

      // Is this a complete circle? Draw two arcs to complete the circle.
      if (da > tauEpsilon) {
        this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
      }

      // Is this arc non-empty? Draw an arc!
      else if (da > epsilon) {
        this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
    },
    rect: function(x, y, w, h) {
      this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
    },
    toString: function() {
      return this._;
    }
  };

  function center(x, y) {
    var nodes, strength = 1;

    if (x == null) x = 0;
    if (y == null) y = 0;

    function force() {
      var i,
          n = nodes.length,
          node,
          sx = 0,
          sy = 0;

      for (i = 0; i < n; ++i) {
        node = nodes[i], sx += node.x, sy += node.y;
      }

      for (sx = (sx / n - x) * strength, sy = (sy / n - y) * strength, i = 0; i < n; ++i) {
        node = nodes[i], node.x -= sx, node.y -= sy;
      }
    }

    force.initialize = function(_) {
      nodes = _;
    };

    force.x = function(_) {
      return arguments.length ? (x = +_, force) : x;
    };

    force.y = function(_) {
      return arguments.length ? (y = +_, force) : y;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };

    return force;
  }

  function tree_add(d) {
    const x = +this._x.call(null, d),
        y = +this._y.call(null, d);
    return add(this.cover(x, y), x, y, d);
  }

  function add(tree, x, y, d) {
    if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

    var parent,
        node = tree._root,
        leaf = {data: d},
        x0 = tree._x0,
        y0 = tree._y0,
        x1 = tree._x1,
        y1 = tree._y1,
        xm,
        ym,
        xp,
        yp,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;

    // Find the existing leaf for the new point, or add it.
    while (node.length) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
    }

    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

    // Otherwise, split the leaf node until the old and new point are separated.
    do {
      parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
    } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
    return parent[j] = node, parent[i] = leaf, tree;
  }

  function addAll(data) {
    var d, i, n = data.length,
        x,
        y,
        xz = new Array(n),
        yz = new Array(n),
        x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity;

    // Compute the points and their extent.
    for (i = 0; i < n; ++i) {
      if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
      xz[i] = x;
      yz[i] = y;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }

    // If there were no (valid) points, abort.
    if (x0 > x1 || y0 > y1) return this;

    // Expand the tree to cover the new points.
    this.cover(x0, y0).cover(x1, y1);

    // Add the new points.
    for (i = 0; i < n; ++i) {
      add(this, xz[i], yz[i], data[i]);
    }

    return this;
  }

  function tree_cover(x, y) {
    if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

    var x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1;

    // If the quadtree has no extent, initialize them.
    // Integer extent are necessary so that if we later double the extent,
    // the existing quadrant boundaries don’t change due to floating point error!
    if (isNaN(x0)) {
      x1 = (x0 = Math.floor(x)) + 1;
      y1 = (y0 = Math.floor(y)) + 1;
    }

    // Otherwise, double repeatedly to cover.
    else {
      var z = x1 - x0 || 1,
          node = this._root,
          parent,
          i;

      while (x0 > x || x >= x1 || y0 > y || y >= y1) {
        i = (y < y0) << 1 | (x < x0);
        parent = new Array(4), parent[i] = node, node = parent, z *= 2;
        switch (i) {
          case 0: x1 = x0 + z, y1 = y0 + z; break;
          case 1: x0 = x1 - z, y1 = y0 + z; break;
          case 2: x1 = x0 + z, y0 = y1 - z; break;
          case 3: x0 = x1 - z, y0 = y1 - z; break;
        }
      }

      if (this._root && this._root.length) this._root = node;
    }

    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    return this;
  }

  function tree_data() {
    var data = [];
    this.visit(function(node) {
      if (!node.length) do data.push(node.data); while (node = node.next)
    });
    return data;
  }

  function tree_extent(_) {
    return arguments.length
        ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
        : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
  }

  function Quad(node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  function tree_find(x, y, radius) {
    var data,
        x0 = this._x0,
        y0 = this._y0,
        x1,
        y1,
        x2,
        y2,
        x3 = this._x1,
        y3 = this._y1,
        quads = [],
        node = this._root,
        q,
        i;

    if (node) quads.push(new Quad(node, x0, y0, x3, y3));
    if (radius == null) radius = Infinity;
    else {
      x0 = x - radius, y0 = y - radius;
      x3 = x + radius, y3 = y + radius;
      radius *= radius;
    }

    while (q = quads.pop()) {

      // Stop searching if this quadrant can’t contain a closer node.
      if (!(node = q.node)
          || (x1 = q.x0) > x3
          || (y1 = q.y0) > y3
          || (x2 = q.x1) < x0
          || (y2 = q.y1) < y0) continue;

      // Bisect the current quadrant.
      if (node.length) {
        var xm = (x1 + x2) / 2,
            ym = (y1 + y2) / 2;

        quads.push(
          new Quad(node[3], xm, ym, x2, y2),
          new Quad(node[2], x1, ym, xm, y2),
          new Quad(node[1], xm, y1, x2, ym),
          new Quad(node[0], x1, y1, xm, ym)
        );

        // Visit the closest quadrant first.
        if (i = (y >= ym) << 1 | (x >= xm)) {
          q = quads[quads.length - 1];
          quads[quads.length - 1] = quads[quads.length - 1 - i];
          quads[quads.length - 1 - i] = q;
        }
      }

      // Visit this point. (Visiting coincident points isn’t necessary!)
      else {
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            d2 = dx * dx + dy * dy;
        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        }
      }
    }

    return data;
  }

  function tree_remove(d) {
    if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

    var parent,
        node = this._root,
        retainer,
        previous,
        next,
        x0 = this._x0,
        y0 = this._y0,
        x1 = this._x1,
        y1 = this._y1,
        x,
        y,
        xm,
        ym,
        right,
        bottom,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return this;

    // Find the leaf node for the point.
    // While descending, also retain the deepest parent with a non-removed sibling.
    if (node.length) while (true) {
      if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
      if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
      if (!node.length) break;
      if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
    }

    // Find the point to remove.
    while (node.data !== d) if (!(previous = node, node = node.next)) return this;
    if (next = node.next) delete node.next;

    // If there are multiple coincident points, remove just the point.
    if (previous) return (next ? previous.next = next : delete previous.next), this;

    // If this is the root point, remove it.
    if (!parent) return this._root = next, this;

    // Remove this leaf.
    next ? parent[i] = next : delete parent[i];

    // If the parent now contains exactly one leaf, collapse superfluous parents.
    if ((node = parent[0] || parent[1] || parent[2] || parent[3])
        && node === (parent[3] || parent[2] || parent[1] || parent[0])
        && !node.length) {
      if (retainer) retainer[j] = node;
      else this._root = node;
    }

    return this;
  }

  function removeAll(data) {
    for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
    return this;
  }

  function tree_root() {
    return this._root;
  }

  function tree_size() {
    var size = 0;
    this.visit(function(node) {
      if (!node.length) do ++size; while (node = node.next)
    });
    return size;
  }

  function tree_visit(callback) {
    var quads = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
        var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
      }
    }
    return this;
  }

  function tree_visitAfter(callback) {
    var quads = [], next = [], q;
    if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = quads.pop()) {
      var node = q.node;
      if (node.length) {
        var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
        if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
        if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
        if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
      }
      next.push(q);
    }
    while (q = next.pop()) {
      callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
  }

  function defaultX(d) {
    return d[0];
  }

  function tree_x(_) {
    return arguments.length ? (this._x = _, this) : this._x;
  }

  function defaultY(d) {
    return d[1];
  }

  function tree_y(_) {
    return arguments.length ? (this._y = _, this) : this._y;
  }

  function quadtree(nodes, x, y) {
    var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
  }

  function Quadtree(x, y, x0, y0, x1, y1) {
    this._x = x;
    this._y = y;
    this._x0 = x0;
    this._y0 = y0;
    this._x1 = x1;
    this._y1 = y1;
    this._root = undefined;
  }

  function leaf_copy(leaf) {
    var copy = {data: leaf.data}, next = copy;
    while (leaf = leaf.next) next = next.next = {data: leaf.data};
    return copy;
  }

  var treeProto = quadtree.prototype = Quadtree.prototype;

  treeProto.copy = function() {
    var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
        node = this._root,
        nodes,
        child;

    if (!node) return copy;

    if (!node.length) return copy._root = leaf_copy(node), copy;

    nodes = [{source: node, target: copy._root = new Array(4)}];
    while (node = nodes.pop()) {
      for (var i = 0; i < 4; ++i) {
        if (child = node.source[i]) {
          if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
          else node.target[i] = leaf_copy(child);
        }
      }
    }

    return copy;
  };

  treeProto.add = tree_add;
  treeProto.addAll = addAll;
  treeProto.cover = tree_cover;
  treeProto.data = tree_data;
  treeProto.extent = tree_extent;
  treeProto.find = tree_find;
  treeProto.remove = tree_remove;
  treeProto.removeAll = removeAll;
  treeProto.root = tree_root;
  treeProto.size = tree_size;
  treeProto.visit = tree_visit;
  treeProto.visitAfter = tree_visitAfter;
  treeProto.x = tree_x;
  treeProto.y = tree_y;

  function constant$3(x) {
    return function() {
      return x;
    };
  }

  function jiggle(random) {
    return (random() - 0.5) * 1e-6;
  }

  function x(d) {
    return d.x + d.vx;
  }

  function y(d) {
    return d.y + d.vy;
  }

  function collide(radius) {
    var nodes,
        radii,
        random,
        strength = 1,
        iterations = 1;

    if (typeof radius !== "function") radius = constant$3(radius == null ? 1 : +radius);

    function force() {
      var i, n = nodes.length,
          tree,
          node,
          xi,
          yi,
          ri,
          ri2;

      for (var k = 0; k < iterations; ++k) {
        tree = quadtree(nodes, x, y).visitAfter(prepare);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          ri = radii[node.index], ri2 = ri * ri;
          xi = node.x + node.vx;
          yi = node.y + node.vy;
          tree.visit(apply);
        }
      }

      function apply(quad, x0, y0, x1, y1) {
        var data = quad.data, rj = quad.r, r = ri + rj;
        if (data) {
          if (data.index > node.index) {
            var x = xi - data.x - data.vx,
                y = yi - data.y - data.vy,
                l = x * x + y * y;
            if (l < r * r) {
              if (x === 0) x = jiggle(random), l += x * x;
              if (y === 0) y = jiggle(random), l += y * y;
              l = (r - (l = Math.sqrt(l))) / l * strength;
              node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
              node.vy += (y *= l) * r;
              data.vx -= x * (r = 1 - r);
              data.vy -= y * r;
            }
          }
          return;
        }
        return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
      }
    }

    function prepare(quad) {
      if (quad.data) return quad.r = radii[quad.data.index];
      for (var i = quad.r = 0; i < 4; ++i) {
        if (quad[i] && quad[i].r > quad.r) {
          quad.r = quad[i].r;
        }
      }
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      radii = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    }

    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };

    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = +_, force) : strength;
    };

    force.radius = function(_) {
      return arguments.length ? (radius = typeof _ === "function" ? _ : constant$3(+_), initialize(), force) : radius;
    };

    return force;
  }

  function index$1(d) {
    return d.index;
  }

  function find$1(nodeById, nodeId) {
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("node not found: " + nodeId);
    return node;
  }

  function link(links) {
    var id = index$1,
        strength = defaultStrength,
        strengths,
        distance = constant$3(30),
        distances,
        nodes,
        count,
        bias,
        random,
        iterations = 1;

    if (links == null) links = [];

    function defaultStrength(link) {
      return 1 / Math.min(count[link.source.index], count[link.target.index]);
    }

    function force(alpha) {
      for (var k = 0, n = links.length; k < iterations; ++k) {
        for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
          link = links[i], source = link.source, target = link.target;
          x = target.x + target.vx - source.x - source.vx || jiggle(random);
          y = target.y + target.vy - source.y - source.vy || jiggle(random);
          l = Math.sqrt(x * x + y * y);
          l = (l - distances[i]) / l * alpha * strengths[i];
          x *= l, y *= l;
          target.vx -= x * (b = bias[i]);
          target.vy -= y * b;
          source.vx += x * (b = 1 - b);
          source.vy += y * b;
        }
      }
    }

    function initialize() {
      if (!nodes) return;

      var i,
          n = nodes.length,
          m = links.length,
          nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d])),
          link;

      for (i = 0, count = new Array(n); i < m; ++i) {
        link = links[i], link.index = i;
        if (typeof link.source !== "object") link.source = find$1(nodeById, link.source);
        if (typeof link.target !== "object") link.target = find$1(nodeById, link.target);
        count[link.source.index] = (count[link.source.index] || 0) + 1;
        count[link.target.index] = (count[link.target.index] || 0) + 1;
      }

      for (i = 0, bias = new Array(m); i < m; ++i) {
        link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
      }

      strengths = new Array(m), initializeStrength();
      distances = new Array(m), initializeDistance();
    }

    function initializeStrength() {
      if (!nodes) return;

      for (var i = 0, n = links.length; i < n; ++i) {
        strengths[i] = +strength(links[i], i, links);
      }
    }

    function initializeDistance() {
      if (!nodes) return;

      for (var i = 0, n = links.length; i < n; ++i) {
        distances[i] = +distance(links[i], i, links);
      }
    }

    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };

    force.links = function(_) {
      return arguments.length ? (links = _, initialize(), force) : links;
    };

    force.id = function(_) {
      return arguments.length ? (id = _, force) : id;
    };

    force.iterations = function(_) {
      return arguments.length ? (iterations = +_, force) : iterations;
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$3(+_), initializeStrength(), force) : strength;
    };

    force.distance = function(_) {
      return arguments.length ? (distance = typeof _ === "function" ? _ : constant$3(+_), initializeDistance(), force) : distance;
    };

    return force;
  }

  // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
  const a = 1664525;
  const c = 1013904223;
  const m = 4294967296; // 2^32

  function lcg() {
    let s = 1;
    return () => (s = (a * s + c) % m) / m;
  }

  function x$1(d) {
    return d.x;
  }

  function y$1(d) {
    return d.y;
  }

  var initialRadius = 10,
      initialAngle = Math.PI * (3 - Math.sqrt(5));

  function simulation(nodes) {
    var simulation,
        alpha = 1,
        alphaMin = 0.001,
        alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
        alphaTarget = 0,
        velocityDecay = 0.6,
        forces = new Map(),
        stepper = timer(step),
        event = dispatch("tick", "end"),
        random = lcg();

    if (nodes == null) nodes = [];

    function step() {
      tick();
      event.call("tick", simulation);
      if (alpha < alphaMin) {
        stepper.stop();
        event.call("end", simulation);
      }
    }

    function tick(iterations) {
      var i, n = nodes.length, node;

      if (iterations === undefined) iterations = 1;

      for (var k = 0; k < iterations; ++k) {
        alpha += (alphaTarget - alpha) * alphaDecay;

        forces.forEach(function(force) {
          force(alpha);
        });

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          if (node.fx == null) node.x += node.vx *= velocityDecay;
          else node.x = node.fx, node.vx = 0;
          if (node.fy == null) node.y += node.vy *= velocityDecay;
          else node.y = node.fy, node.vy = 0;
        }
      }

      return simulation;
    }

    function initializeNodes() {
      for (var i = 0, n = nodes.length, node; i < n; ++i) {
        node = nodes[i], node.index = i;
        if (node.fx != null) node.x = node.fx;
        if (node.fy != null) node.y = node.fy;
        if (isNaN(node.x) || isNaN(node.y)) {
          var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
          node.x = radius * Math.cos(angle);
          node.y = radius * Math.sin(angle);
        }
        if (isNaN(node.vx) || isNaN(node.vy)) {
          node.vx = node.vy = 0;
        }
      }
    }

    function initializeForce(force) {
      if (force.initialize) force.initialize(nodes, random);
      return force;
    }

    initializeNodes();

    return simulation = {
      tick: tick,

      restart: function() {
        return stepper.restart(step), simulation;
      },

      stop: function() {
        return stepper.stop(), simulation;
      },

      nodes: function(_) {
        return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
      },

      alpha: function(_) {
        return arguments.length ? (alpha = +_, simulation) : alpha;
      },

      alphaMin: function(_) {
        return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
      },

      alphaDecay: function(_) {
        return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
      },

      alphaTarget: function(_) {
        return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
      },

      velocityDecay: function(_) {
        return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
      },

      randomSource: function(_) {
        return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
      },

      force: function(name, _) {
        return arguments.length > 1 ? ((_ == null ? forces.delete(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
      },

      find: function(x, y, radius) {
        var i = 0,
            n = nodes.length,
            dx,
            dy,
            d2,
            node,
            closest;

        if (radius == null) radius = Infinity;
        else radius *= radius;

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dx = x - node.x;
          dy = y - node.y;
          d2 = dx * dx + dy * dy;
          if (d2 < radius) closest = node, radius = d2;
        }

        return closest;
      },

      on: function(name, _) {
        return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
      }
    };
  }

  function manyBody() {
    var nodes,
        node,
        random,
        alpha,
        strength = constant$3(-30),
        strengths,
        distanceMin2 = 1,
        distanceMax2 = Infinity,
        theta2 = 0.81;

    function force(_) {
      var i, n = nodes.length, tree = quadtree(nodes, x$1, y$1).visitAfter(accumulate);
      for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    }

    function initialize() {
      if (!nodes) return;
      var i, n = nodes.length, node;
      strengths = new Array(n);
      for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
    }

    function accumulate(quad) {
      var strength = 0, q, c, weight = 0, x, y, i;

      // For internal nodes, accumulate forces from child quadrants.
      if (quad.length) {
        for (x = y = i = 0; i < 4; ++i) {
          if ((q = quad[i]) && (c = Math.abs(q.value))) {
            strength += q.value, weight += c, x += c * q.x, y += c * q.y;
          }
        }
        quad.x = x / weight;
        quad.y = y / weight;
      }

      // For leaf nodes, accumulate forces from coincident quadrants.
      else {
        q = quad;
        q.x = q.data.x;
        q.y = q.data.y;
        do strength += strengths[q.data.index];
        while (q = q.next);
      }

      quad.value = strength;
    }

    function apply(quad, x1, _, x2) {
      if (!quad.value) return true;

      var x = quad.x - node.x,
          y = quad.y - node.y,
          w = x2 - x1,
          l = x * x + y * y;

      // Apply the Barnes-Hut approximation if possible.
      // Limit forces for very close nodes; randomize direction if coincident.
      if (w * w / theta2 < l) {
        if (l < distanceMax2) {
          if (x === 0) x = jiggle(random), l += x * x;
          if (y === 0) y = jiggle(random), l += y * y;
          if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
          node.vx += x * quad.value * alpha / l;
          node.vy += y * quad.value * alpha / l;
        }
        return true;
      }

      // Otherwise, process points directly.
      else if (quad.length || l >= distanceMax2) return;

      // Limit forces for very close nodes; randomize direction if coincident.
      if (quad.data !== node || quad.next) {
        if (x === 0) x = jiggle(random), l += x * x;
        if (y === 0) y = jiggle(random), l += y * y;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
      }

      do if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x * w;
        node.vy += y * w;
      } while (quad = quad.next);
    }

    force.initialize = function(_nodes, _random) {
      nodes = _nodes;
      random = _random;
      initialize();
    };

    force.strength = function(_) {
      return arguments.length ? (strength = typeof _ === "function" ? _ : constant$3(+_), initialize(), force) : strength;
    };

    force.distanceMin = function(_) {
      return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
    };

    force.distanceMax = function(_) {
      return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
    };

    force.theta = function(_) {
      return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
    };

    return force;
  }

  function initRange(domain, range) {
    switch (arguments.length) {
      case 0: break;
      case 1: this.range(domain); break;
      default: this.range(range).domain(domain); break;
    }
    return this;
  }

  const implicit = Symbol("implicit");

  function ordinal() {
    var index = new Map(),
        domain = [],
        range = [],
        unknown = implicit;

    function scale(d) {
      var key = d + "", i = index.get(key);
      if (!i) {
        if (unknown !== implicit) return unknown;
        index.set(key, i = domain.push(d));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(_) {
      if (!arguments.length) return domain.slice();
      domain = [], index = new Map();
      for (const value of _) {
        const key = value + "";
        if (index.has(key)) continue;
        index.set(key, domain.push(value));
      }
      return scale;
    };

    scale.range = function(_) {
      return arguments.length ? (range = Array.from(_), scale) : range.slice();
    };

    scale.unknown = function(_) {
      return arguments.length ? (unknown = _, scale) : unknown;
    };

    scale.copy = function() {
      return ordinal(domain, range).unknown(unknown);
    };

    initRange.apply(scale, arguments);

    return scale;
  }

  function turbo(t) {
    t = Math.max(0, Math.min(1, t));
    return "rgb("
        + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", "
        + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66)))))))
        + ")";
  }

  function constant$4(x) {
    return function constant() {
      return x;
    };
  }

  var pi$1 = Math.PI;
  var tau$1 = 2 * pi$1;

  var circle = {
    draw: function(context, size) {
      var r = Math.sqrt(size / pi$1);
      context.moveTo(r, 0);
      context.arc(0, 0, r, 0, tau$1);
    }
  };

  var cross = {
    draw: function(context, size) {
      var r = Math.sqrt(size / 5) / 2;
      context.moveTo(-3 * r, -r);
      context.lineTo(-r, -r);
      context.lineTo(-r, -3 * r);
      context.lineTo(r, -3 * r);
      context.lineTo(r, -r);
      context.lineTo(3 * r, -r);
      context.lineTo(3 * r, r);
      context.lineTo(r, r);
      context.lineTo(r, 3 * r);
      context.lineTo(-r, 3 * r);
      context.lineTo(-r, r);
      context.lineTo(-3 * r, r);
      context.closePath();
    }
  };

  var tan30 = Math.sqrt(1 / 3),
      tan30_2 = tan30 * 2;

  var diamond = {
    draw: function(context, size) {
      var y = Math.sqrt(size / tan30_2),
          x = y * tan30;
      context.moveTo(0, -y);
      context.lineTo(x, 0);
      context.lineTo(0, y);
      context.lineTo(-x, 0);
      context.closePath();
    }
  };

  var ka = 0.89081309152928522810,
      kr = Math.sin(pi$1 / 10) / Math.sin(7 * pi$1 / 10),
      kx = Math.sin(tau$1 / 10) * kr,
      ky = -Math.cos(tau$1 / 10) * kr;

  var star = {
    draw: function(context, size) {
      var r = Math.sqrt(size * ka),
          x = kx * r,
          y = ky * r;
      context.moveTo(0, -r);
      context.lineTo(x, y);
      for (var i = 1; i < 5; ++i) {
        var a = tau$1 * i / 5,
            c = Math.cos(a),
            s = Math.sin(a);
        context.lineTo(s * r, -c * r);
        context.lineTo(c * x - s * y, s * x + c * y);
      }
      context.closePath();
    }
  };

  var square = {
    draw: function(context, size) {
      var w = Math.sqrt(size),
          x = -w / 2;
      context.rect(x, x, w, w);
    }
  };

  var sqrt3 = Math.sqrt(3);

  var triangle = {
    draw: function(context, size) {
      var y = -Math.sqrt(size / (sqrt3 * 3));
      context.moveTo(0, y * 2);
      context.lineTo(-sqrt3 * y, -y);
      context.lineTo(sqrt3 * y, -y);
      context.closePath();
    }
  };

  var c$1 = -0.5,
      s = Math.sqrt(3) / 2,
      k = 1 / Math.sqrt(12),
      a$1 = (k / 2 + 1) * 3;

  var wye = {
    draw: function(context, size) {
      var r = Math.sqrt(size / a$1),
          x0 = r / 2,
          y0 = r * k,
          x1 = x0,
          y1 = r * k + r,
          x2 = -x1,
          y2 = y1;
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(c$1 * x0 - s * y0, s * x0 + c$1 * y0);
      context.lineTo(c$1 * x1 - s * y1, s * x1 + c$1 * y1);
      context.lineTo(c$1 * x2 - s * y2, s * x2 + c$1 * y2);
      context.lineTo(c$1 * x0 + s * y0, c$1 * y0 - s * x0);
      context.lineTo(c$1 * x1 + s * y1, c$1 * y1 - s * x1);
      context.lineTo(c$1 * x2 + s * y2, c$1 * y2 - s * x2);
      context.closePath();
    }
  };

  function symbol$2(type, size) {
    var context = null;
    type = typeof type === "function" ? type : constant$4(type || circle);
    size = typeof size === "function" ? size : constant$4(size === undefined ? 64 : +size);

    function symbol() {
      var buffer;
      if (!context) context = buffer = path$1();
      type.apply(this, arguments).draw(context, +size.apply(this, arguments));
      if (buffer) return context = null, buffer + "" || null;
    }

    symbol.type = function(_) {
      return arguments.length ? (type = typeof _ === "function" ? _ : constant$4(_), symbol) : type;
    };

    symbol.size = function(_) {
      return arguments.length ? (size = typeof _ === "function" ? _ : constant$4(+_), symbol) : size;
    };

    symbol.context = function(_) {
      return arguments.length ? (context = _ == null ? null : _, symbol) : context;
    };

    return symbol;
  }

  const initializeSimulation = center$1 => simulation().force('charge', manyBody().strength(-30)).force('center', center(center$1.x, center$1.y)).force('collision', collide().radius(30)).stop();

  const defaultLayoutConfiguration = {
    width: 1200,
    height: 800,
    ticks: 300
  };
  /**
   *
   * @param graph
   * @param configuration
   */

  const layout = (graph, configuration = {}) => {
    const _config = Object.assign(defaultLayoutConfiguration, configuration);

    const center = {
      x: _config.width / 2,
      y: _config.height / 2
    };
    let simulation = initializeSimulation(center);
    simulation.nodes(graph.nodes);
    simulation.force('link', link(graph.links).id(d => d.id));

    for (let tick = 0; tick < _config.ticks && simulation.alpha() > simulation.alphaMin(); tick++) {
      simulation.tick();
    }

    return simulation;
  };

  const nodeShaper = shapeRadius => {
    const shapeSize = Math.PI * shapeRadius * shapeRadius; // the area of the shape

    const shapeDomain = new Map([['Person', 'square'], ['Triangle', 'triangle'], ['Movie', 'star'], ['Event', 'wye']]);
    const symbolPathData = new Map([['circle', symbol$2().type(circle).size(shapeSize)()], ['square', symbol$2().type(square).size(shapeSize)()], ['triangle', symbol$2().type(triangle).size(shapeSize)()], ['cross', symbol$2().type(cross).size(shapeSize)()], ['diamond', symbol$2().type(diamond).size(shapeSize)()], ['star', symbol$2().type(star).size(shapeSize)()], ['wye', symbol$2().type(wye).size(shapeSize)()]]);
    return node => {
      const shape = node.labels !== undefined ? shapeDomain.get(node.labels[0]) || 'circle' : 'circle';
      return symbolPathData.get(shape) || '';
    };
  };

  const interpolatedColorScheme = (size, interpolator) => {
    var interpolatedColors = [];

    for (let i = 1; i <= size; i++) {
      interpolatedColors.push(interpolator(i / size));
    }

    return interpolatedColors;
  };

  const colorsFor = graph => {
    const labelsFrom = graph => {
      return Array.from(graph.nodes.reduce((foundLabels, node) => {
        node.labels.forEach(label => foundLabels.add(label));
        return foundLabels;
      }, new Set()).values());
    };

    const labels = labelsFrom(graph); // const scale = d3.scaleOrdinal(d3.schemeCategory10);

    const scale = ordinal(interpolatedColorScheme(labels ? labels.length + 1 : 1, turbo));
    return d => scale(d.labels[0]);
  };

  const updateLinks = links => {
    links.attr('x1', d => isGramNodeDatum(d.source) ? d.source.x : 0).attr('y1', d => isGramNodeDatum(d.source) ? d.source.y : 0).attr('x2', d => isGramNodeDatum(d.target) ? d.target.x : 0).attr('y2', d => isGramNodeDatum(d.target) ? d.target.y : 0);
  };
  const updateNodes = nodes => {
    nodes.attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
  };
  const defaultConfiguration = {
    shapeRadius: 2
  };
  /**
   *
   * @param graph gram source text
   * @param selector dom selector for an svg element
   * @param D3GramDrawConfiguration
   */

  const draw = (graph, selector, configuration = {}) => {
    const mergedConfiguration = Object.assign(defaultConfiguration, configuration);
    const shapeFor = nodeShaper(mergedConfiguration.shapeRadius);
    const colorFor = colorsFor(graph);
    const svg = select(selector);
    let linkSelection = svg.append('g').attr('stroke', '#999').attr('stroke-opacity', 0.6).selectAll('line').data(graph.links).join('line').attr('stroke-width', 2); // .attr("stroke-width", d => Math.sqrt(d.value));

    let nodeSelection = svg.append('g').attr('class', 'nodes').selectAll('g').data(graph.nodes).enter().append('g');
    nodeSelection.append('path').attr('fill', colorFor).attr('stroke', d => (color(colorFor(d)) || rgb(0x33, 0x33, 0x33)).darker().hex()).attr('stroke-width', 4).attr('d', shapeFor);
    nodeSelection.append('title').text(function (d) {
      return d.id;
    });
    updateNodes(nodeSelection);
    updateLinks(linkSelection);
    return {
      nodeSelection,
      linkSelection
    };
  };

  const drag = simulation => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3Drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  };

  exports.MISSING_ID = MISSING_ID;
  exports.dataFromPath = dataFromPath;
  exports.drag = drag;
  exports.draw = draw;
  exports.edgeToD3 = edgeToD3;
  exports.isGramNodeDatum = isGramNodeDatum;
  exports.layout = layout;
  exports.makeGramLinkDatum = makeGramLinkDatum;
  exports.makeGramNodeDatum = makeGramNodeDatum;
  exports.nodeToD3 = nodeToD3;
  exports.parse = parse$1;
  exports.updateLinks = updateLinks;
  exports.updateNodes = updateNodes;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=d3-gram.umd.development.js.map
