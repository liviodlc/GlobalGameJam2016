var configs = require('./configs');
var utils = require('./utils');

module.exports = Sequence = function(numGestures) {
  // Generate a new sequence of gestures for people to do
  var seq = [];
  for (var i=0; i < numGestures; i++) {
    seq.push(utils.choice(configs.gestures));
  }
  return seq;
}