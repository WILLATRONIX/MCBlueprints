const log = console.log;

console.log = function (...args) {
	// TODO: maybe intercept logging and send it to telemetry? idk

	log.apply(console, args);
};
