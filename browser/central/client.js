$(window).on('load', function() {
  console.log('Loaded');
  startSession();
  // render.nextSequence(['SLASH', 'SPIN', 'SPIN']); // for testing
})

var gameState = {
  running: false,
  status: null,
  sequence: []
}

function stopPolling() {
  gameState.running = false;
}

function startSession() {
  console.log(endpoints.connect);
  $.post(endpoints.startSession, function(response) {
    console.log('new session response data:', response);

    if (response.error) {
      return render.error(response.error);
    }

    gameState.running = true;
    handleUpdatedGameSession(response.session);
    poll();
  });
}

function poll() {
  if (!gameState.running) { return; }

  $.post(endpoints.pollSession, function(response) {

    // todo: what if server is down?
    console.log('session poll data:', response);

    if (response.error) {
      return render.error(response.error);
    }

    var status = response.session.status;

    if (response.session.status !== gameState.status) {
      handleUpdatedGameSession(response.session);
    }
    else if (response.session.status === 'WAITING') {
      render.players(response.session);
      render.gameSessionStatus(response.session);
    }
  });

  window.setTimeout(poll, configs.pollInterval);
}


function handleUpdatedGameSession(session) {
  gameState.status = session.status;

  console.log('********* UPDATED STATUS:', session.status);

  if (session.status === 'STARTED') {
    gameState.sequence = session.sequence;
    render.nextSequence(session.sequence);
  }

  render.players(session);

  render.gameSessionStatus(session);
}


var render = {
  error: function(error) {
    if (error === 'GAME_ALREADY_STARTED') {
      $("#game-status").text('A game has already been started somewhere!')
    }
  },

  gameSessionStatus: function(session) {
    var text = session.status.toLowerCase();
    if (session.status === 'WAITING') {
      text = 'waiting for player ' + (session.players.length + 1);
    }
    $('#game-status').text('The game is: ' + text);
  },

  players: function(session) {
    for (var i = 0; i < session.players.length; i++) {
      $('#player-' + i).text('Player ' + (i+1) + ': ' + session.players[i].name);
    }
  },

  nextSequence: function(sequence) {
    var $container = $('#next-sequence');

    for (var i = 0; i < sequence.length; i++) {
      gesture = sequence[i];
      if (!(gesture in gestureData)) return;
      var data = gestureData[gesture]

      var $gesture = $('<div>').addClass('gesture').addClass('gesture-' + gesture);
      var $img = $('<img>').attr('src', data.image);
      var $text = $('<span>').text(data.label);
      $gesture.append($img).append($text).appendTo($container);
    }
  }
}