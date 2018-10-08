const express = require('express');
const jsonParser = require('body-parser').json;
const logger = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes')

const app = express();
app.use(jsonParser());
app.use(logger('dev'));

// open mongoDb connection
mongoose.connect('mongodb://localhost/qaRest');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('connection to mongoDb successful'));


app.use('/questions', routes);

app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404
  next(err)
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
});

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`app is listening on port ${port}`)
})