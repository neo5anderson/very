; (function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	} else {
		// Global (browser)
		root.Very = factory();
	}
}(this, function () {
	var Very = Very || (function (undefined) {
		var very;

		// Native very from window (Browser)
		if (typeof window !== 'undefined' && window.very) {
			very = window.very;
		}

		// Native very in web worker (Browser)
		if (typeof self !== 'undefined' && self.very) {
			very = self.very;
		}

		// Native very from worker
		if (typeof globalThis !== 'undefined' && globalThis.very) {
			very = globalThis.very;
		}

		// Native (experimental IE 11) very from window (Browser)
		if (!very && typeof window !== 'undefined' && window.msvery) {
			very = window.msvery;
		}

		// Native very from global (NodeJS)
		if (!very && typeof global !== 'undefined' && global.very) {
			very = global.very;
		}

		// Native very import via require (NodeJS)
		if (!very && typeof require === 'function') {
			try {
				very = require('very');
			} catch (err) { }
		}

		/*
		 * Local polyfill of Object.create

		 */
		var create = Object.create || (function () {
			function F() { }

			return function (obj) {
				var subtype;
				F.prototype = obj;
				subtype = new F();
				F.prototype = null;
				return subtype;
			};
		}());

		/**
		 * Very namespace.
		 */
		var V = {};

		/**
		 * Library namespace.
		 */
		var V_lib = V.lib = {};

		/**
		 * Base object for prototypal inheritance.
		 */
		var Base = V_lib.Base = (function () {


			return {
				/**
				 * Creates a new object that inherits from this object.
				 *
				 * @param {Object} overrides Properties to copy into the new object.
				 *
				 * @return {Object} The new object.
				 *
				 * @static
				 *
				 * @example
				 *
				 *     var MyType = Very.lib.Base.extend({
				 *         field: 'value',
				 *
				 *         method: function () {
				 *         }
				 *     });
				 */
				extend: function (overrides) {
					// Spawn
					var subtype = create(this);

					// Augment
					if (overrides) {
						subtype.mixIn(overrides);
					}

					// Create default initializer
					if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
						subtype.init = function () {
							subtype.$super.init.apply(this, arguments);
						};
					}

					// Initializer's prototype is the subtype object
					subtype.init.prototype = subtype;

					// Reference supertype
					subtype.$super = this;

					return subtype;
				},

				/**
				 * Extends this object and runs the init method.
				 * Arguments to create() will be passed to init().
				 *
				 * @return {Object} The new object.
				 *
				 * @static
				 *
				 * @example
				 *
				 *     var instance = MyType.create();
				 */
				create: function () {
					var instance = this.extend();
					instance.init.apply(instance, arguments);

					return instance;
				},

				/**
				 * Initializes a newly created object.
				 * Override this method to add some logic when your objects are created.
				 *
				 * @example
				 *
				 *     var MyType = Very.lib.Base.extend({
				 *         init: function () {
				 *             // ...
				 *         }
				 *     });
				 */
				init: function () {
				},

				/**
				 * Copies properties into this object.
				 *
				 * @param {Object} properties The properties to mix in.
				 *
				 * @example
				 *
				 *     MyType.mixIn({
				 *         field: 'value'
				 *     });
				 */
				mixIn: function (properties) {
					for (var propertyName in properties) {
						if (properties.hasOwnProperty(propertyName)) {
							this[propertyName] = properties[propertyName];
						}
					}

					// IE won't copy toString using the loop above
					if (properties.hasOwnProperty('toString')) {
						this.toString = properties.toString;
					}
				},

				/**
				 * Creates a copy of this object.
				 *
				 * @return {Object} The clone.
				 *
				 * @example
				 *
				 *     var clone = instance.clone();
				 */
				clone: function () {
					return this.init.prototype.extend(this);
				}
			};
		}());

		return V;
	}())

	return Very;
}));
