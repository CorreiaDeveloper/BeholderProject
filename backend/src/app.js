const express = require('express');
require('express-async-errors');

const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const authMiddleware = require('./middlewares/authMiddleware');
const errorMiddleware = require('./middlewares/errorMiddleware');

const settingsRouter = require('./routers/settingsRouter');
const symbolsRouter = require('./routers/symbolsRouter');

const authController = require('./controllers/authController');

const app = express();

app.use(morgan('dev'));

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use(helmet());

app.use(express.json());

app.post('/login', authController.doLogin);

app.use('/settings', authMiddleware, settingsRouter);

app.use('/symbols', authMiddleware, symbolsRouter);

app.post('/logout', authController.doLogout);

app.use(errorMiddleware);

module.exports = app;