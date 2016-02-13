module.exports = configs = {
  errors: {
    NEED_VALID_ROOM_CODE: 'NEED_VALID_ROOM_CODE',
    GAME_ALREADY_STARTED: 'GAME_ALREADY_STARTED',
    GAME_NOT_STARTED: 'GAME_NOT_STARTED',
    GAME_FULL: 'GAME_FULL'
  },

  gestures: [
    'SLASH',
    'SPIN',
    'RAISEARMS',
    'SHAKE'
  ],

  finishGesture: 'FINISH',

  playersPerSession: 2,

  sessionTimeout: 20 * 1000 // end the game session after 20 seconds of silence from browser
}
