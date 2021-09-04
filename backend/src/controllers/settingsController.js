function getSettings(req, res, next){
    return res.json({
        email: 'contato@luiztools.com.br'
    })
}

module.exports = {
    getSettings
}