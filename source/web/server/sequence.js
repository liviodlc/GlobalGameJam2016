var configs = require('./configs');
var utils = require('./utils');

module.exports = Sequence = function(numGestures) {
  return ['SHAKE', 'FINISH']; // temporary

  //////

  // Generate a new sequence of gestures for people to do
  var seq = [];
  for (var i=0; i < numGestures - 1; i++) {
    seq.push(utils.choice(configs.gestures));
  }
  seq.push(configs.finishGesture)
  return seq;
}