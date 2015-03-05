'use strict';

/**
 * Mapping of Sails log levels to Bunyan.
 */
var logLevels = {
  silly: null, // no place for silly around here
  verbose: 'trace',
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  crit: 'fatal',
  blank: 'info' // No idea what this is, but it's on sails.log at level info
};

/**
 * A Sails.js custom log factory. This is a bunyan logger that has been
 * customized to be a drop-in replacement for the Winston logger used in Sails.
 * Follows the `log.level` defined in `config/log.js`, or the corresponding
 * value defined by the Sails runtime.
 *
 * @param {object} ns The continuation-local-storage namespace.
 * @param {object} [sails] The sails global object. Defaults to `global.sails`
 * @returns {object} The newly created bunyan logger
 */
module.exports.initialize = function (ns, sails) {
    sails = sails || global.sails;

    logLevels.forEach(function (sailsLevel) {
        var bunyanLevel = logLevels(sailsLevel);
    });

    /**
     * Replace the logger in the current namespace with a new child logger with the additional context.
     * @param {object} params The information to append to the context.
     */
    sails.log.addContext = function addContext(params) {
        var log = ns.get('log');
        log = log.child(params);
        ns.set('log', log);
    }
};

