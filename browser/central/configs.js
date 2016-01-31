var endpoints = {
  // connect: '/central/connect'
  startSession: 'http://localhost:8080/session/start',
  pollSession: 'http://localhost:8080/session/poll',
}

var configs = {
  pollInterval: 2000 // ms
}

var gestureData = {
  SLASH: {
    label: 'Slash your arm across!',
    image: 'http://localhost:8080/images/placeholder-slash.png'
  },
  SPIN: {
    label: 'Spin around!',
    image: 'http://localhost:8080/images/placeholder-spin.png'
  },
  RAISEARMS: {
    label: 'Raise your arms up!',
    image: 'http://localhost:8080/images/placeholder-raisearms.png'
  },
  SHAKE: {
    label: 'Shake the phone!',
    image: 'http://localhost:8080/images/placeholder-shake.png'
  },
}