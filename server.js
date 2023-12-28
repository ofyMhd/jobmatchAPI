const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(morgan('dev'));
app.use(express.json());

dotenv.config({
     path: './.env'
});

app.use('/api/jobmatchapi/auth', require('./routes/user')(admin));
app.use('/api/jobmatchapi', require('./routes/joma')(admin));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.green.underline.bold)
);