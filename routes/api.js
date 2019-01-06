const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const path = require('path');

// Get Beer list
router.get('/beerlist', function(req, res){
  knex.select().table('beers')
  .then(function(beers){
    res.json(beers)
  })
})

// Between dates
router.get('/temp/room/:from/:to', function(req, res){
  toDate = req.params.to
  if (req.params.from == req.params.to) {
    //padd extra hours to end of day..
    toDate = `${req.params.to} 23:00`
  }
  knex.raw("select TO_CHAR(timestamp, 'YYYY-MM-dd HH24:MI:SS') as x, temperature AS y from temp_room where timestamp BETWEEN ? AND ?", [req.params.from, toDate])
  .then(function(temps){
    res.json(temps.rows)
  })
})

router.get('/temp/beer/:sensor/:from/:to', function(req, res){
  console.log(req.params.sensor);
  console.log(req.params.from);
  console.log(req.params.to);
  toDate = req.params.to
  if (req.params.from == req.params.to) {
    //padd extra hours to end of day..
    toDate = `${req.params.to} 23:00`
  }
  knex.raw("select TO_CHAR(timestamp, 'YYYY-MM-dd HH24:MI:SS') as x, temperature AS y from temp_beer where sensor=? AND (timestamp BETWEEN ? AND ?)", [req.params.sensor,req.params.from, toDate])
  .then(function(temps){
    res.json(temps.rows)
  })
})

router.get('/temp/outdoor/:from/:to', function(req, res){
  toDate = req.params.to
  if (req.params.from == req.params.to) {
    //padd extra hours to end of day..
    toDate = `${req.params.to} 23:00`
  }
  knex.raw("select TO_CHAR(timestamp, 'YYYY-MM-dd HH24:MI:SS') as x, temperature AS y from temp_openweather where timestamp BETWEEN ? AND ?", [req.params.from, toDate])
  .then(function(temps){
    res.json(temps.rows)
  })
})

router.post('/temp', function(req, res){
  console.log(req.body);
  //console.log(req.body.sensor,req.body.temp)
  //knex.raw("insert into temp_beer(temperature, timestamp, sensor) values(?, ?, ?)", [15, knex.fn.now(), 't3'])
  knex.raw("insert into temp_beer(temperature, timestamp, sensor) values(?, ?, ?)", [req.body.temp, knex.fn.now(), req.body.sensor])
  //res.end(req.body)
  .then( function (result) {
    res.json({ success: true, message: 'ok' });
    });
  //res.end;
})

module.exports = router;