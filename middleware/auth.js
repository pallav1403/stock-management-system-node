const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

module.exports.checkAuth = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        console.log(req.headers['authorization'])
        const verify=jwt.verify(token, config.jwtSecret);
        req.user=verify.user_id;  
        console.log(req.user,"user")
        next();
    } catch(err) {
        res.json({
            error: true,
            message: 'Not Authorized'
        });
    }
}

module.exports.checkAdmin = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decodedToken = jwt.verify(token, config.jwtSecret);
        if (decodedToken.role = 'admin') {
            next();
        } else {
            throw "Not Authorized";
        }                                          
    } catch(err) {
        res.json({
            error: true,
            message: 'Not Authorized'
        });                                  
    }
}

module.exports.checkUser = (req, res, next) => {
    try {                                                                  
        const token = req.headers['authorization'].split(' ')[1];
        const decodedToken = jwt.verify(token, config.jwtSecret);
        if (decodedToken.role = 'user') {
            next();
        } else {
            throw "Not Authorized";
        }
    } catch(err) {
        res.json({
            error: true,
            message: 'Not Authorized'
        });
    }
}