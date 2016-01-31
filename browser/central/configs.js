var endpoints = {
  // connect: '/central/connect'
  startSession: '/session/start',
  pollSession: '/session/poll',
  endSession: '/session/end',
}

var configs = {
  pollInterval: 2000 // ms
}

var gestureData = {
  SLASH: {
    label: 'Slash your arm across!',
    image: '/images/placeholder-slash.png'
  },
  SPIN: {
    label: 'Spin around!',
    image: '/images/placeholder-spin.png'
  },
  RAISEARMS: {
    label: 'Raise your arms up!',
    image: '/images/placeholder-raisearms.png'
  },
  SHAKE: {
    label: 'Shake the phone!',
    image: '/images/placeholder-shake.png'
  },
}