var utils = require('./utils');

module.exports = Player = function(id, name) {
  this.id = id;
  this.name = utils.randomName();

  // map sequence IDs > won or lost
  // or something
  this.results = {};


  this.getData = function() {
    return {
      id: this.id,
      name: this.name
    }
  }
}
