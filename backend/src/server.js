const database = require('./db');
const app = require('./app');
const settingsRepository = require('./repositories/settingsRepository');
const automationsRepository = require('./repositories/automationsRepository');
const appEm = require('./app-em');
const appWs = require('./app-ws');
const beholder = require('./beholder');

(async () => {
    console.log('Getting the default settings');
    
    const settings = await settingsRepository.getDefaultSettings();
    if(!settings) return new Error(`There is not settings`);

    console.log(`Initializing the Beholder Brain...`)
    const automations = await automationsRepository.getActiveAutomations();
    beholder.init(automations);

    console.log(`Starting the Server Apps...`)
    const server = app.listen(process.env.PORT, () => {
        console.log('App is running at ' + process.env.PORT);
    })

    const wss = appWs(server);

    await appEm.init(settings, wss, beholder);

})();
