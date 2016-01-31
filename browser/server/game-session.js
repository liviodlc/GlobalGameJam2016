// Each connection by a CWC (central web client) creates a game session

// For the CWC to retain the game session, it has to keep pinging the server

// FOR NOW: only one game session, until we implement rooms
// in which case there can be multiple of these GameSession objects

var configs = require('./configs');
var Sequence = require('./sequence');

module.exports = GameSession = {
  roomId: '',   // to be used for multiple rooms
  alive: false, // the CWC must keep pinging the server to keep it alive
  started: false,
  players: [],
  sequence: [],

  // this will be sent to the CWC and the player phones
  getData: function() {
    return {
      // roomId: this.roomId,
      status: this.getStatus(),
      players: this.players.map(function(player) {
        return player.getData();
      }),
      sequence: this.sequence
    }
  },

  getStatus: function() {
    if (!this.alive) {
      return 'DEAD';
    }
    else if (this.players.length < configs.playersPerSession) {
      return 'WAITING';
    }
    else {
      return 'STARTED'
    }
  },

  initialize: function() {
    this.alive = true;
    this.sequence = Sequence(3) // generates a random sequence of gesture strings
  },

  end: function() {
    this.alive = false;
    this.players = [];
  },

  addPlayer: function(player) {
    this.players.push(player);
    if (this.players.length >= configs.playersPerSession) {
      this.start();
    }
  },

  hasPlayerId: function(id) {
    var hasId = false;
    this.players.forEach(function(p) { hasId = hasId || (id === p.id); });
    return hasId;
  },

  isFull: function() {
    return this.players.length === configs.playersPerSession;
  },

  start: function() {
    this.started = true;
  }

};
