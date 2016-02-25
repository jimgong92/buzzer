var express = require('express');
var morgan = require('morgan');
var app = express();



app.use(morgan('dev'));
app.get('/', function(req, res) {
  return res.sendStatus(200);
});
app.set('port', 8001);
app.listen(app.get('port'), function() {
  console.log('Listening on port %d', app.get('port'));
});

console.log(app);

var SUITE = {
  APP: app,
  ENDPOINT: 'http://localhost:8001'
};

require('./buzzer')(SUITE);
