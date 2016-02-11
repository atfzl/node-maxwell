var path       = require('path'),
    configPath = path.resolve('./config.properties.example');

var maxwell = require('.')({
  config: configPath
});

maxwell.on('info', function (info) {
  console.log(info);
});

maxwell.on('data', function (data) {
  console.log(data);
});
