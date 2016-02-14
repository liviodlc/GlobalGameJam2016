var express = require('express');

var configs = require('./server/configs');
var GameSession = require('./server/game-session');
var Player = require('./server/player');
var utils = require('./server/utils');

var gameSessions = {}; // map room code > session


// ================================================== network
var app = express();

// serve client files
app.use(express.static(__dirname));
app.listen(process.env.PORT || 80);


app.get('/hello', function(req, res) {
  res.end("Hello and welcome to KUNG FU WIZARD BATTLE");
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// ================================================== central-client endpoints

app.get('/session/start', function(req, res) {
  res.set('Content-Type', 'application/json');
  console.log('/session/start', req.query);

  // make a new session
  var currentGameSession = new GameSession();
  gameSessions[currentGameSession.roomCode] = currentGameSession;

  console.log('New game in session:', currentGameSession.roomCode);

  currentGameSession.initialize();
  res.end(standardOutput(currentGameSession));
})

app.get('/session/poll', function(req, res) {
  res.set('Content-Type', 'application/json');

  var currentGameSession = gameSessions[req.query.roomCode];
  if (!currentGameSession) return res.end(standardInvalidRoomCodeOutput());

  currentGameSession.refreshTimeout();
  res.end(standardOutput(currentGameSession));
})

app.get('/session/end', function(req, res) {
  res.set('Content-Type', 'application/json');
  console.log('/session/end', req.query);

  var currentGameSession = gameSessions[req.query.roomCode];
  if (!currentGameSession) return res.end(standardInvalidRoomCodeOutput());

  // Todo: have the browser client send a key to identify itself
  currentGameSession.end();

  res.end(standardOutput(currentGameSession));
})
// ================================================== player endpoints

app.get('/player/connect', function(req, res) {
  res.set('Content-Type', 'application/json');
  console.log('/player/connect', req.query);

  var currentGameSession = gameSessions[req.query.roomCode];
  if (!currentGameSession) return res.end(standardInvalidRoomCodeOutput());

  // make sure there isn't already a player with this id
  if (currentGameSession.hasPlayerId(req.query.id)) {
    return res.end(JSON.stringify({
      session: currentGameSession.getData()
    }));
  }

  // make sure the game isn't already full
  if (currentGameSession.isFull()) {
    return res.end(JSON.stringify({
      error: configs.errors.GAME_FULL,
      session: null
    }));
  }

  var player = new Player(req.query.id);

  // Try to connect the player to a game session
  currentGameSession.addPlayer(player);

  var output = {
    message: 'Welcome ' + player.name + '!',
    name: player.name,
    id: player.id,
    session: currentGameSession.getData()
  }

  res.end(JSON.stringify(output));
})

app.get('/player/poll', function(req, res) {
  var currentGameSession = gameSessions[req.query.roomCode];
  if (!currentGameSession) return res.end(standardInvalidRoomCodeOutput());

  res.end(standardOutput(currentGameSession));
})


app.get('/player/fail', function(req, res) {
  var id = req.query.id;
  var currentGameSession = gameSessions[req.query.roomCode];
  if (!currentGameSession) return res.end(standardInvalidRoomCodeOutput());

  res.end('NYI');
})

app.get('/player/sequence/finish', function(req, res) {
  console.log('/player/sequence/finish', req.query);
  var id = req.query.id;

  var currentGameSession = gameSessions[req.query.roomCode];
  if (!currentGameSession) return res.end(standardInvalidRoomCodeOutput());

  currentGameSession.playerFinishedSequence(req.query.id);
  res.end(standardOutput(currentGameSession));
})

// ================================================== misc

/// Standard res.end output
function standardOutput(session) {
  return JSON.stringify({
    session: session.getData()
  })
}

function standardInvalidRoomCodeOutput() {
  return JSON.stringify({
    error: configs.errors.NEED_VALID_ROOM_CODE,
    session: null
  })
}
