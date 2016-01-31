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
  playersFinished: {
    // map id > true / false
  },
  someoneFinished: false,

  lastTimeout: null, // if this timeout runs out, close the session

  // this will be sent to the CWC and the player phones
  getData: function() {
    return {
      // roomId: this.roomId,
      status: this.getStatus(),
      players: this.players.map(function(player) {
        return player.getData();
      }),
      sequence: this.sequence,
      playersFinished: this.playersFinished 
    }
  },

  getStatus: function() {
    if (!this.alive) {
      return 'DEAD';
    }
    else if (this.players.length < configs.playersPerSession) {
      return 'WAITING';
    }
    else if (this.someoneFinished) {
      return 'FINISHED';
    }
    else {
      return 'STARTED';
    }
  },

  initialize: function() {
    this.alive = true;
    this.sequence = Sequence(3) // generates a random sequence of gesture strings
  },

  end: function() {
    this.alive = false;
    this.players = [];
    this.playersFinished = {};
    this.someoneFinished = false;
  },

  addPlayer: function(player) {
    this.players.push(player);
    this.playersFinished[player.id] = false;
    if (this.players.length >= configs.playersPerSession) {
      this.start();
    }
  },

  playerFinishedSequence: function(player_id) {
    console.log('Player finished:', player_id);
    console.log('My players:', JSON.stringify(this.playersFinished, null, '  '));
    if (!(player_id in this.playersFinished)) return;
    this.playersFinished[player_id] = true;
    this.someoneFinished = true;
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
  },

  refreshTimeout: function() {
    var _this = this;
    if (this.lastTimeout) clearTimeout(this.lastTimeout);
    this.lastTimeout = setTimeout(function() {
      console.log('Session timed out after', configs.sessionTimeout, 'milliseconds of silence')
      _this.end();
    }, configs.sessionTimeout);
  }

};
