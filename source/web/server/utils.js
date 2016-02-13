module.exports = utils = {
  choice: function(array) {
    var i = Math.floor(Math.random() * array.length);
    return array[i];
  },

  randomRoomCode: function() {
    // 6 random numbers
    var id = '';
    for (var i = 0; i < 6; i++) {
      id += Math.floor(Math.random() * 10).toString();
    }
    return id;
  },

  randomName: function() {
    // http://www.namegenerator.biz/game-name-generator.php
    return this.choice([
      'Raleloth',
      'Wicaedda',
      'Lariwyr',
      'Belassi',
      'Larerradric',
      'Etigocien',
      'Ferawyth',
      'Gralerien',
      'Fohaa',
      'Dwilimeth',
      'Grays',
      'Mien',
      'Olardorid',
      'Adwirewia',
      'Ybelannor',
      'Ulaedith',
      'Unoidus',
      'Etendadia',
      'Cadirap',
      'Nydaurwen',
      'Creawyr',
      'Kerrama',
      'Lothendawyr',
      'Kaealle',
      'Agrerrawyn',
      'Weraniel',
      'Ybigoseth',
      'Qirabeth',
      'Yberilin',
      'Mirythien'
    ]);
  },

  nextPlayerId: function() {
    lastPlayerId += 1;
    return lastPlayerId;
  }
}

var lastPlayerId = 0;