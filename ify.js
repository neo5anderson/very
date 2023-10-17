;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("crypto-js"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core","crypto-js"], factory);
	} else {
		// Global (browser)
		factory(root.Very);
	}
}(this, function (Very, CryptoJS) {
	(function() {
		const get = function(url) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("GET", url, true)

				xhr.onload = function(e) {
					if(xhr.readyState === 4) {
						if(xhr.status === 200) {
							resolve(xhr.responseText);
						} else {
							reject(xhr.statusText);
							console.log(e, ", ", xhr.statusText)
						}
					}
				}

				xhr.onerror = function(e) {
					reject(xhr.statusText);
					console.log(e, ", ", xhr.statusText)
				}

				xhr.send(null)
			});
		}

		Very.ify = function(me) {
			return new Promise((resolve, reject) => {
				if(typeof document === "undefined") {
					reject("only use for web")
					return;
				}

				const cs = document.getElementsByTagName("script");

				let url = "";
				for (let i = 0; i < cs.length; i += 1) {
					console.log("verify:", i, cs[i].src);
					// TODO: combine
					url = cs[i].src;
				}

				get(url).then(c => {
					const content = c.replace(me, "").replace(new RegExp("-v-[0-9a-f]{8}", "gim"), "");
					const secret = CryptoJS.MD5(content).toString().toUpperCase();

					console.log("verify length:" + content.length, ", " + secret);

					if (me.length == 0) {
						console.warn("WARN: dev mode, add key after dist");

						let s = document.createElement("script");
						s.append('alert("DEV mode")');
						document.body.appendChild(s);

						resolve(0);
					} else if(secret == me) {
						resolve(1);
					} else {
						reject(-1)
					}
				}).catch(reject)
			});
		}

	}());
  
  return Very.ify;
}));
