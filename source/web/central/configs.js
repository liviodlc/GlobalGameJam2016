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
    image: '/assets/placeholder-slash.png'
  },
  SPIN: {
    label: 'Spin around!',
    image: '/assets/placeholder-spin.png'
  },
  RAISEARMS: {
    label: 'Raise your arms up!',
    image: '/assets/placeholder-raisearms.png'
  },
  SHAKE: {
    label: '1. Charge your wand!',
    image: '/assets/shake_animation.gif'
  },
  FINISH: {
    label: '2. Spin to charge EVEN MORE!',
    label2: '3. Finish With A Flourish!',
    image: '/assets/spin_animation.gif',
    image2: '/assets/finish_animation.gif',
  }
}