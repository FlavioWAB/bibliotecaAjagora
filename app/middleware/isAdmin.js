module.exports = function (req, res, next) {

    if (req.user) {
        if(!req.user.admin){
            return res.status(403).send('Forbidden');
        }
        return next();
    }
    
    return res.status(401).send('Unauthorized');
};