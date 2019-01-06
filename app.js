const express = require('express');
const routes = require('./routes/api');
var moment = require('moment');
var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', routes);

app.get('/', function(req, res){
  res.file('index.html');
})

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`Server started on port ${port}!`);
})