module.exports = utils = {
  choice: function(array) {
    var i = Math.floor(Math.random() * array.length);
    return array[i];
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
  }
}