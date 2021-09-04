const settingsRepository = require('../repositories/settingsRepository');

async function getSettings(req, res, next) {
    const id = res.locals.token.id;
    const settings = await settingsRepository.getSettings(id);
    const plainSettings = settings.get({ plain: true });
    delete plainSettings.secretKey;
    res.json(plainSettings);
}

async function updateSettings(req, res, next) {
    const id = res.locals.token.id;
    const newSettings = req.body;

    await settingsRepository.updateSettings(id, newSettings);
    res.sendStatus(200);
}

module.exports = {
    getSettings,
    updateSettings
}