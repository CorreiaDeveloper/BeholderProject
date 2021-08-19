function doLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (email === 'contato@luiztools.com.br'
        && password === '123456')
        return res.sendStatus(200);
    else
        return res.sendStatus(401);
}

function doLogout(req, res, next) {
    return res.sendStatus(200);
}

module.exports = {
    doLogin,
    doLogout
}