const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./db');

const app = express();

app.use(morgan('dev'));

app.use(express.json({}));
app.use(express.json({
  extended: true
}));

dotenv.config({
  path: './config.env'
});

connectDB(); 

app.use('/api/jobmatchapi/auth', require('./routes/user'));
app.use('/api/jobmatchapi', require('./routes/joma'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,
  console.log(`Server running on port ${PORT}`.red.underline.bold)
);