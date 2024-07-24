const automationsRepository = require('../repositories/automationsRepository');

async function startAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (automation.isActive) return res.sendStatus(204);
    automation.isActive = true;
    //Atualiza cerebro beholder
    await automation.save();

    if (automation.logs) console.log(`Automation ${automation.name} has started`)

    res.json(automation);
}

async function stopAutomation(req, res, next) {
    const id = req.params.id;
    const automation = await automationsRepository.getAutomation(id);
    if (!automation.isActive) return res.sendStatus(204);

    automation.isActive = false;
    //Atualiza cerebro beholder
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
    const savedAutomation = await automationsRepository.insertAutomation(newAutomation);

    if (savedAutomation.isActive) {
        //Atualiza Cerebro beholder
    }

    res.status(201).json(savedAutomation.get({ plain: true }));
}

async function updateAutomation(req, res, next) {
    const id = req.params.id;
    const newAutomation = req.body;
    const updatedAutomation = await automationsRepository.updateAutomation(id, newAutomation);

    if (updatedAutomation.isActive) {
        //Avisar o beholder
    }
    else {
        //Avisar o beholder
    }

    res.json(updatedAutomation);
}

async function deleteAutomation(req, res, next) {
    const id = req.params.id;
    const currentAutomation = await automationsRepository.getAutomation(id);

    if (currentAutomation.isActive) {
        //Limpar cerebro Beholder
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