// Each connection by a CWC (central web client) creates a game session

// For the CWC to retain the game session, it has to keep pinging the server

// FOR NOW: only one game session, until we implement rooms
// in which case there can be multiple of these GameSession objects

var configs = require('./configs');
var Sequence = require('./sequence');
var utils = require('./utils');

module.exports = GameSession = function() {
  this.roomCode = utils.randomRoomCode();   // to be used for multiple rooms
  this.alive = false; // the CWC must keep pinging the server to keep it alive
  this.started = false;
  this.players = [];
  this.sequence = [];

  // map id > true / false
  this.playersFinished = {};

  this.someoneFinished = false;

  this.lastTimeout = null; // if this timeout runs out, close the session
}

// this will be sent to the CWC and the player phones
GameSession.prototype.getData = function() {
  return {
    roomCode: this.roomCode,
    status: this.getStatus(),
    players: this.players.map(function(player) {
      return player.getData();
    }),
    sequence: this.sequence,
    playersFinished: this.playersFinished 
  }
}

GameSession.prototype.getStatus = function() {
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
}

GameSession.prototype.initialize = function() {
  this.alive = true;
  this.sequence = Sequence(3) // generates a random sequence of gesture strings
}

GameSession.prototype.end = function() {
  this.alive = false;
  this.players = [];
  this.playersFinished = {};
  this.someoneFinished = false;
}

GameSession.prototype.addPlayer = function(player) {
  this.players.push(player);
  this.playersFinished[player.id] = false;
  if (this.players.length >= configs.playersPerSession) {
    this.start();
  }
}

GameSession.prototype.playerFinishedSequence = function(player_id) {
  if (!(player_id in this.playersFinished)) return;
  this.playersFinished[player_id] = true;
  this.someoneFinished = true;
}

GameSession.prototype.hasPlayerId = function(id) {
  var hasId = false;
  this.players.forEach(function(p) { hasId = hasId || (id === p.id); });
  return hasId;
}

GameSession.prototype.isFull = function() {
  return this.players.length === configs.playersPerSession;
}

GameSession.prototype.start = function() {
  this.started = true;
}

GameSession.prototype.refreshTimeout = function() {
  var _this = this;
  if (this.lastTimeout) clearTimeout(this.lastTimeout);
  this.lastTimeout = setTimeout(function() {
    console.log('Session timed out after', configs.sessionTimeout, 'milliseconds of silence')
    _this.end();
  }, configs.sessionTimeout);
}