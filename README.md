# sails-bunyan-cls

A module modifying the sails-bunyan logger to support adding context with CLS. Support sails 0.10.x.

To use, simply initialize the logger in `config/bootstrap.js` after injecting with sails-bunyan.

```JavaScript
var createNamespace = require('continuation-local-storage').createNamespace;
var injectBunyan = require('sails-bunyan').injectBunyan;
var ns = createNamespace('mynamespace');
var initializeCls = require('sails-bunyan-cls').initialize;

module.exports.bootstrap = function (done) {
  injectBunyan();
  initializeCls(ns);
  done();
}
```

To add context, use `sails.log.addContext`.

```JavaScript
function processRequest(params) {
    sails.log.info('About to fetch widget.');

    fetchWidget(params, function onWidgetChosen(widget) {
        sails.log.addContext({widget: widget});
        sails.log.info('Got widget successfully.');
    });
}
```

Log output looks like this.

```
{"name":"myapp","hostname":"myhost","pid":34572,"level":30,"msg":"start","time":"2013-01-04T07:47:25.814Z","v":0}
{"name":"myapp","hostname":"myhost","pid":34572,"widget":{widgetType: "foo"},"level":30,"msg":"creating a wuzzle","time":"2013-01-04T07:47:25.815Z","v":0}
```

