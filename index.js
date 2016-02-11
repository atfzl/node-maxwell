module.exports = function maxwell (maxwellOptions) {
  if (!maxwellOptions) {
    maxwellOptions = [];
  }
  var spawn        = require('child_process').spawn,
      readline     = require('readline'),
      EventEmitter = require('events').EventEmitter;

  var maxwellProcess  = spawn('bin/maxwell', maxwellOptions, {cwd: './maxwells-daemon'}),
      maxwellReadLine = readline.createInterface({ input: maxwellProcess.stdout }),
      maxwellEmitter  = new EventEmitter();

  maxwellProcess.stderr.on('data', function (err) {
    maxwellEmitter.emit('info', err.toString());
  });

  maxwellReadLine.on('line', function (line) {
    try {
      var event = JSON.parse(line);
      maxwellEmitter.emit('data', event);
    } catch (e) {
      console.log('node-maxwell Error, cannot JSON.parse: ', line);
    }
  });

  
  return maxwellEmitter;
};
