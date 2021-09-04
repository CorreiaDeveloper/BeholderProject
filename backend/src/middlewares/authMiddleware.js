const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                if (!authController.isBlacklisted(token)) {
                    res.locals.token = decoded;
                    return next();
                }
            }
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError)
                console.error(err.message);
            else
                console.error(token, err);
        }
    }
    res.status(401).json('Unauthorized');
}