/**
 * Allows you to 'call' a function multiple times, each time with a callback supplied, but only ever have one instance of the function running concurrently
 * 
 * @param  {Function} func - An anonymous function with a single callback param, which -inside- calls your real function. Example: function (roCallback) { myRealFunction(roCallback); }
 * @param  {Function} callback - Callback to call
 */
function oneConcurrent(func, callback) {

	let funcName = func; // func.name returned nothing, so using the Function object itself as a key

	var getStoredCallbacks = function () {

		oneConcurrent.callbacks = oneConcurrent.callbacks || {}; // Ensure there's a persistant key=>value object to store callbacks

		oneConcurrent.callbacks[funcName] = oneConcurrent.callbacks[funcName] || []; // Ensure there's an array, with the function as the key, in our callbacks object

		return oneConcurrent.callbacks[funcName];
	};

	var removeStoredCallbacks = function () {
		delete oneConcurrent.callbacks[funcName];
	};

	var callbacks = getStoredCallbacks();

	callbacks.push(callback); // Add the supplied callback

	if (callbacks.length == 1) { // Only actually run the supplied function if there is just one callback already stored; i.e. if it's the first run

		var fauxCallback = function () { // This faux callback will let us eventually call all of the stored callbacks

			for (var i in callbacks) {
				let callback = callbacks[i];

				callback.apply(this, arguments); // Call this stored callback, with any/all arguments that were provided
			}

			removeStoredCallbacks(); // Remove our stored callbacks
		};

		func(fauxCallback); // Call the supplied function, supplying it with a single faux callback
	}
}

module.exports = oneConcurrent;