module.exports = function(req, res, next) {
    if(req.user.userType!='seller')
        return res.status(403).send('Access denied.');

    next();
}