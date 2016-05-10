var _ = require('lodash');

module.exports = function maxwell (maxwellOptions) {
  if (typeof maxwellOptions == 'object') {
    maxwellOptions = _.map(maxwellOptions, function (value, key) {
      return ('--' + key + '=' + value);
    }).concat(['--bootstrapper=none']);
  } else {
    maxwellOptions = ['--bootstrapper=none'];
  }
  var spawn        = require('child_process').spawn,
      path         = require('path'),
      readline     = require('readline'),
      EventEmitter = require('events').EventEmitter;

  var maxwellProcess  = spawn(__dirname + '/maxwells-daemon/bin/maxwell', maxwellOptions, {cwd: __dirname + '/maxwells-daemon'}),
      maxwellReadLine = readline.createInterface({ input: maxwellProcess.stdout, terminal: false }),
      maxwellEmitter  = new EventEmitter();

  maxwellProcess.on('exit', function (code) {
    maxwellEmitter.emit('exit', code);
  });
  
  maxwellProcess.stderr.on('data', function (err) {
    maxwellEmitter.emit('info', err.toString());
  });

  maxwellReadLine.on('line', function (line) {
    var event;
    try {
      event = JSON.parse(line);
    } catch (e) {
      console.log('node-maxwell Error: ', e);
      console.log('data :', line);
    }
    maxwellEmitter.emit('data', event);
  });

  return maxwellEmitter;
};
