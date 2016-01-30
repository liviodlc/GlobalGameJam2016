var express = require('express');
var app = express();

// serve client files
app.use(express.static(__dirname));
app.listen(4004);

// Server
app.get('/', function(req, res) {
    res.end("Hello and welcome to KUNG FU WIZARD BATTLE");
})

