const express = require('express');
require('express-async-errors');

const cors = require('cors');
const helmet = require('helmet');
const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authController = require('./controllers/authController');
const settingsController = require('./controllers/settingsController');

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.post('/login', authController.doLogin);

app.get('/settings', authMiddleware, settingsController.getSettings);

app.post('/logout', authController.doLogout);

app.use('/', (req, res, next) => {
    res.send('Hello World');
})

app.use(errorMiddleware);

module.exports = app;