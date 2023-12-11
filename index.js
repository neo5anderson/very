;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
    module.exports = exports = factory(require("veryme/core"), require("veryme/ify"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./ify"], factory);
	} else {
		// Global (browser)
    root.Very = factory(root.Very)
	}
}(this, function (Very) {
	return Very;
}));
