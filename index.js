'use strict';

var logLevels = require('sails-bunyan').logLevels;
var ns;

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
module.exports.initialize = function (namespace, sails) {
    ns = namespace;
    sails = sails || global.sails;

    Object.keys(logLevels).forEach(function (sailsLevel) {
        var bunyanLevel = logLevels[sailsLevel];

        if (!bunyanLevel) {
            return;
        }

        sails.log[bunyanLevel] = (function () {
            var globalLog = sails.log[bunyanLevel];

            return function () {
                var logger = ns.get('logger');

                if (logger && logger[bunyanLevel]) {
                    logger[bunyanLevel].apply(logger, arguments);
                } else {
                    globalLog.apply(globalLog.logger, arguments);
                }
            }
        })();
    });

    /**
     * Replace the logger in the current namespace with a new child logger with the additional context.
     * @param {object} params The information to append to the context.
     */
    sails.log.addContext = function addContext(params) {
        var logger = ns.get('logger'); // Throws an error if the CLS middleware hasn't been run yet.
        logger = logger.child(params);
        ns.set('logger', logger);
    }
};

module.exports.middleware = function (req, res, next) {
    ns.run(function () {
        ns.set('req', req);
        ns.set('res', res);
        ns.set('logger', sails.log.logger);
        next();
    });
};
