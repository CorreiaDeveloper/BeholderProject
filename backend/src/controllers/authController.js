const jwt = require('jsonwebtoken');

function doLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (email === 'contato@luiztools.com.br'
        && password === '123456') {
        const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRES)
        });
        return res.json({ token });
    }
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