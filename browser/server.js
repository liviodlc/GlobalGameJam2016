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
app.listen(8080);


app.get('/hello', function(req, res) {
    res.end("Hello and welcome to KUNG FU WIZARD BATTLE");
})


// ================================================== central-client endpoints

app.post('/session/start', function(req, res) {
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

app.post('/session/poll', function(req, res) {
  res.set('Content-Type', 'application/json');
  // console.log('/session/poll', req.query);

  var output = {
    session: currentGameSession.getData()
  }

  res.end(JSON.stringify(output));
})

// ================================================== player endpoints

app.post('/player/connect', function(req, res) {
  res.set('Content-Type', 'application/json');
  console.log('/player/connect', req.query);

  if (!req.query.id) {
    return res.end(JSON.stringify({error: 'Give me your id'}));
  }
  // if (!req.query.name) {
  //   return res.end(JSON.stringify({error: 'Give me your name'}));
  // }

  if (!currentGameSession || !currentGameSession.alive) {
    return res.end(JSON.stringify({
      error: configs.errors.GAME_NOT_STARTED,
      session: null
    }));
  }


  var player = new Player(req.query.id);

  // Try to connect the player to a game session
  currentGameSession.addPlayer(player);

  var output = {
    message: 'Welcome ' + player.name + '!',
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

app.post('/player/hasGameStartedYet', function(req, res) {
})
app.post('/player/sequence/fail', function(req, res) {
})
app.post('/player/sequence/succeed', function(req, res) {
})
app.get('/player/sequence/getNext', function(req, res) {
})