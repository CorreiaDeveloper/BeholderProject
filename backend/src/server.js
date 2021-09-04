const database = require('./db');
const app = require('./app');

app.listen(process.env.PORT, () => {
    console.log('App is running at ' + process.env.PORT);
})