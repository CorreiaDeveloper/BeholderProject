const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use('/beholder', (req, res, next) => {
    res.send('Hello Beholder');
})

app.use('/', (req, res, next) => {
    res.send('Hello World');
})

app.use(errorMiddleware);

module.exports = app;