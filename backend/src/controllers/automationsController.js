const automationsRepository = require('../repositories/automationsRepository');
const beholder = require('../beholder');


function validateConditions(conditions) {
    return /^(MEMORY\[\'.+?\'\](\..+)?[><=!]+([0-9\.\-]+|(\'.+?\')|true|false|MEMORY\[\'.+?\'\](\..+)?)( && )?)+$/ig.test(conditions);
}

async function startAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (automation.isActive) return res.sendStatus(204);

    automation.isActive = true;
    beholder.updateBrain(automation.get({ plain: true }));
    await automation.save();

    if (automation.logs) console.log(`Automation ${automation.name} has started`)

    res.json(automation);
}

async function stopAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (!automation.isActive) return res.sendStatus(204);

    automation.isActive = false;
    beholder.deleteBrain(automation.get({ plain: true }));
    await automation.save();

    if (automation.logs) console.log(`Automation ${automation.name} has stopped`)

    res.json(automation);
}

async function getAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    res.json(automation);
}

async function getAutomations(req, res, next) {
    const page = req.query.page;
    const automations = await automationsRepository.getAutomations(page);
    res.json(automations);
}

async function insertAutomation(req, res, next) {
    const newAutomation = req.body;


    if (!validateConditions(newAutomation.conditions))
        return res.status(400).json('You need to have at least one condition per automation!');

    const savedAutomation = await automationsRepository.insertAutomation(newAutomation);

    if (savedAutomation.isActive) {
        beholder.updateBrain(savedAutomation.get({ plain: true }))
    }

    res.status(201).json(savedAutomation.get({ plain: true }));
}

async function updateAutomation(req, res, next) {
    const id = req.params.id;
    const newAutomation = req.body;

    if (!validateConditions(newAutomation.conditions))
        return res.status(400).json('You need to have at least one condition per automation!');

    const updatedAutomation = await automationsRepository.updateAutomation(id, newAutomation);
    const plainAutomation = updatedAutomation.get({ plain: true })

    if (updatedAutomation.isActive) {
        beholder.deleteBrain(plainAutomation);
        beholder.updateBrain(plainAutomation);
    }
    else {
        beholder.deleteBrain(plainAutomation);
    }

    res.json(updatedAutomation);
}

async function deleteAutomation(req, res, next) {
    const id = req.params.id;
    const currentAutomation = await automationsRepository.getAutomation(id);

    if (currentAutomation.isActive) {
        beholder.deleteBrain(currentAutomation.get({ plain: true }));
    }
    await automationsRepository.deleteAutomation(id);

    res.sendStatus(204);
}

module.exports = {
    startAutomation,
    stopAutomation,
    getAutomation,
    getAutomations,
    insertAutomation,
    updateAutomation,
    deleteAutomation
}