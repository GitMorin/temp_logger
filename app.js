const express = require('express');
const routes = require('./routes/api');
var moment = require('moment');
var bodyParser = require("body-parser");
var path = require('path');


const app = express();

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', routes);

app.get('/', function(req, res){
  //res.file('index.html');
  res.render('pages/index');
})

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`Server started on port ${port}!`);
})