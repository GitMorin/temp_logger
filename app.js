const express = require('express');
const routes = require('./routes/api');

const app = express();

app.use(express.static('public'));
app.use('/api', routes);

app.get('/', function(req, res){
  res.file('index.html');
})

const port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`Server started on port ${port}!`);
})