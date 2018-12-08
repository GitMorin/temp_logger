// will need a production connection when we deploy
const environment = process.env.NODE_ENV || 'development';
const knex = require('knex'); // require knex module
const config = require('../knexfile'); // require knexfile, needed for connetion parameters

const environmentConfig = config[environment]; // envconfig att current environment
const connection = knex(environmentConfig); // knex invoked with the environmentConfig
// whenever we pass a configuration into knex, it creates a new db connection

console.log(environmentConfig);
// export the connection to be available in app.js
module.exports = connection;