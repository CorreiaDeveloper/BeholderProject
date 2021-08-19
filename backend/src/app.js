const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === 'contato@luiztools.com.br'
        && password === '123456')
        return res.sendStatus(200);
    else
        return res.sendStatus(401);
})

app.post('/logout', (req, res, next) => {
    return res.sendStatus(200);
})

app.use('/', (req, res, next) => {
    res.send('Hello World');
})

app.use(errorMiddleware);

module.exports = app;