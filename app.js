const express = require('express');
var moment = require('moment');
const routes = require('./routes/api');
var bodyParser = require("body-parser");
var path = require('path');


const app = express();

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,"public")));
// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.static('public'));
app.use('/api', routes);

app.get('/', function(req, res){
  //res.file('index.html');
  res.render('pages/index');
})

// app.get('/new', function(req, res){
//   //res.file('index.html');
//   res.render('pages/newbeer');
// })

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`Server started on port ${port}!`);
})