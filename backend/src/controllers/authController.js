const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function doLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (email === 'contato@luiztools.com.br'
        && bcrypt.compareSync(password, '$2a$12$7eYPuLs30rH/nBuH5ZiXSulDHzr8hOTnO1kllrtkLw0J1GnjYIc4S')) {
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