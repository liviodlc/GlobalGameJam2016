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

var end_clicked = false;
function endSession() {
  if (end_clicked) {
    window.location = '';
    return;
  }
  $.get(endpoints.endSession, function(response) {
    $('#end-game').attr('value', 'refresh to play again');
    end_clicked = true;
  });
  setTimeout(function() {
    gameState.running = false;
  }, configs.pollInterval * 2)
}

function startSession() {
  console.log(endpoints.connect);
  $.get(endpoints.startSession, function(response) {
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

  $.get(endpoints.pollSession, function(response) {

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
    $('#background-fire').addClass('faded-fire');
    setTimeout(function() {
      gameState.sequence = session.sequence;
      render.nextSequence(session.sequence);
    }, 2000);
  }

  render.players(session);

  render.gameSessionStatus(session);

  console.log('playersFinished:', session.playersFinished)

  render.playersFinished(session);

  if (session.status === 'DEAD') {
    render.clear();
  }
}


var render = {
  error: function(error) {
    if (error === 'GAME_ALREADY_STARTED') {
      $("#game-status").text('A game has already been started somewhere!')
    }
  },

  clear: function() {
    $('.player').empty();
    $('#next-sequence').empty();
  },

  gameSessionStatus: function(session) {
    var text = session.status.toLowerCase();
    if (session.status === 'WAITING') {
      text = 'waiting for player ' + (session.players.length + 1);
    }
    $('#game-status').text('The game is: ' + text);
  },

  players: function(session) {
    $('.player span').addClass('waiting-for-player').removeClass('has-player');
    for (var i = 0; i < session.players.length; i++) {
      $('#player-' + i)
        .removeClass('waiting-for-player')
        .addClass('has-player')
        .addClass('player-id-' + session.players[i].id)
        .text(session.players[i].name);
    }
  },

  playersFinished: function(session) {
    var winner_id = null;
    for (var id in session.playersFinished) {
      if (session.playersFinished[id]) {
        winner_id = id;
      }
    }
    if (winner_id) {
        $('.has-player').addClass('lost');
        $('.player-id-' + winner_id).addClass('won');
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

var getPlayerName = function(id, session) {
  for (var i = 0; i < session.players.length; i++) {
    if (session.players[i].id === id) {
      return session.players[i].name;
    }
  }
  return '';
}