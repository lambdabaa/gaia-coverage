#!/usr/bin/env node
var async = require('async'),
    exec = require('child_process').exec;


var APPS = [
  'bluetooth',
  'browser',
  'calendar',
  'camera',
  'clock',
  'contacts',
  'dialer',
  'ftu',
  'costcontrol',
  'email',
  'fm',
  'gallery',
  'homescreen',
  'keyboard',
  'music',
  'search',
  'settings',
  'sms',
  'system',
  'video'
];

function main() {
  var path = process.argv[2];

  var appToTestCount = {};
  var testruns = APPS.map(function(app) {
    return function(done) {
      exec([
        'make',
        '-C', path,
        'test-integration',
        'APP=' + app,
        'REPORTER=spec'
      ].join(' '), function(err, stdout, stderr) {
        var regex = /(\d+)\spassing/g;
        var result = regex.exec(stdout);
        var testCount = result[1];
        console.log('[' + app + ' = ' + testCount + ']');
        appToTestCount[app] = testCount;
        done();
      });
    };
  });

  async.series(testruns, function() {
    console.log(JSON.stringify(appToTestCount));
  });
}

if (require.main === module) {
  main();
}
