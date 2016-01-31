var express = require('express');

var configs = require('./server/configs');
var GameSession = require('./server/game-session');
var Player = require('./server/player');
var utils = require('./server/utils');

var currentGameSession = GameSession;

// ================================================== network
var app = express();

// serve client files
app.use(express.static(__dirname));
app.listen(80);


app.get('/hello', function(req, res) {
    res.end("Hello and welcome to KUNG FU WIZARD BATTLE");
})


// ================================================== central-client endpoints

app.get('/session/start', function(req, res) {
  res.set('Content-Type', 'application/json');
  console.log('/session/start', req.query);

  // see if there's already a gamesession going
  if (currentGameSession.alive) {
    return res.end(JSON.stringify({
      error: configs.errors.GAME_ALREADY_STARTED,
      session: null
    }));
  }

  currentGameSession.initialize();

  var output = {
    session: currentGameSession.getData()
  }

  res.end(JSON.stringify(output));
})

app.get('/session/poll', function(req, res) {
  res.set('Content-Type', 'application/json');
  // console.log('/session/poll', req.query);

  var output = {
    session: currentGameSession.getData()
  }

  res.end(JSON.stringify(output));
})

app.get('/session/end', function(req, res) {
  res.set('Content-Type', 'application/json');
  console.log('/session/end', req.query);

  // Todo: have the browser client send a key to identify itself
  currentGameSession.end();

  var output = {
    session: currentGameSession.getData()
  }

  res.end(JSON.stringify(output));
})
// ================================================== player endpoints

app.get('/player/connect', function(req, res) {
  res.set('Content-Type', 'application/json');
  console.log('/player/connect', req.query);

  if (!currentGameSession || !currentGameSession.alive) {
    return res.end(JSON.stringify({
      error: configs.errors.GAME_NOT_STARTED,
      session: null,
      id: null
    }));
  }

  var id = utils.nextPlayerId();

  var player = new Player(id);

  // Try to connect the player to a game session
  currentGameSession.addPlayer(player);

  var output = {
    message: 'Welcome ' + player.name + '!',
    id: id,
    session: currentGameSession.getData()
  }

  res.end(JSON.stringify(output));
})

app.get('/player/poll', function(req, res) {
  if (!currentGameSession || !currentGameSession.alive) {
    return res.end(JSON.stringify({
      error: configs.errors.GAME_NOT_STARTED,
      session: null
    }));
  }

  // send whole game state
  var output = {
    session: currentGameSession.getData()
  }

  res.end(JSON.stringify(output));
})


app.get('/player/sequence/fail', function(req, res) {
  res.end('NYI');
})

app.get('/player/sequence/succeed', function(req, res) {
  res.end('NYI');
})