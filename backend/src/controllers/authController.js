const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


function doLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (email === 'gabrielcorreiajobs@hotmail.com'
        && bcrypt.compareSync(password, '$2a$12$sTM3.tnSyp6AkHop3oQHbOBis.QmNEws/DSvsY1aL7rJghTZoVm4O')) {
            const token = jwt.sign({ id: 1}, process.env.JWT_SECRET,
                {expiresIn: parseInt(process.env.JWT_EXPIRES)}
            );
        res.json({token});
    }
    else res.sendStatus(401);
}

const blacklist = [];

function doLogout(req, res, next) {
    const token = req.headers['autorization'];
    blacklist.push(token);
    res.sendStatus(200)
}

function isBlacklisted(token) {
    return blacklist.some(t => t === token);
}

module.exports = {
    doLogin,
    doLogout,
    isBlacklisted
}