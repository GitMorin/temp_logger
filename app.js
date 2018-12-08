const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('./db/knex');

const app = express();


// let jsonParser = bodyParser.json() Only need this for postReq
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.json())
app.use(express.static('public'));

// routes
app.get('/', function(req, res){
  res.file('index.html');
})

app.get('/temp/room', function(req, res){
  knex.raw("select TO_CHAR(timestamp, 'YYYY-MM-dd HH24:MI:SS') as x, temperature AS y from temp_room where timestamp > '2018-12-08'")
  .then(function(temps){
    res.json(temps.rows)
  })
})

app.get('/temp/beer', function(req, res){
  knex.raw("select TO_CHAR(timestamp, 'YYYY-MM-dd HH24:MI:SS') as x, temperature AS y from temp_beer where timestamp > '2018-12-08'")
  .then(function(temps){
    res.json(temps.rows)
  })
})

app.get('/temp/outdoor', function(req, res){
  knex.raw("select TO_CHAR(timestamp, 'YYYY-MM-dd HH24:MI:SS') as x, temperature AS y from temp_openweather where timestamp > '2018-12-08'")
  .then(function(temps){
    res.json(temps.rows)
  })
})

app.listen(3000, function(){
  console.log('Server started on port 3000!');
})