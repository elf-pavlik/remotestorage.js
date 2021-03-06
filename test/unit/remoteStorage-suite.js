if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['requirejs'], function(requirejs, undefined) {
  var suites = [];

  suites.push({
    name: "remoteStorage.js file tests",
    desc: "a collection of tests for remoteStorage.js",
    setup: function(env) {

      global.localStorage = require('localStorage');
      var _this = this;
      requirejs(['./src/remoteStorage'], function(remoteStorage) {
        _this.assertTypeAnd(remoteStorage.defineModule, 'function');
        global.remoteStorage = remoteStorage;
        // define test module
        var moduleName = 'test';
        remoteStorage.defineModule(moduleName, function(privateClient, publicClient) {
          return {
            name: 'test',
            exports: {
              makePath: function(path) {
                return privateClient.makePath(path);
              }
            }
          };
        });
        var moduleList = remoteStorage.getModuleList();

        //_this.assert(moduleList, ['test']);
        //_this.assertType(moduleList['test'], 'object');
        _this.result(true);
      });
    },
    takedown: function(env) {
      env = '';
      this.result(true);
    },
    tests: [
      {
        desc: "claimAccess()",
        run: function(env) {
          var _this = this;
          remoteStorage.claimAccess('test', 'rw').
            then(function() {
              _this.assertAnd(remoteStorage.getClaimedModuleList(), ['test'], JSON.stringify(remoteStorage.getClaimedModuleList()) + ' vs. ' + '["test"]');
              env.tm = remoteStorage.test;
              _this.assertType(env.tm, 'object');
            });
        }
      }
    ]
  });
  return suites;
});
