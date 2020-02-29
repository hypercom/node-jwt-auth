const jwt = require('jsonwebtoken');

module.exports = {
    //verify token
    validateToken: (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        let result;
        if (authorizationHeader) {
            const token = req.headers.authorization.split(' ')[1]   //Bearer <token>
            const options = {
                expiresIn: '2d',
                issuer: 'https://smarthome.io'
            };
            try {
                //verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, process.env.JWT_SECRET, options);

                //let's pass back the decoded token to the request object
                req.decoded = result;

                //next to pass execution to the subsequent middleware
                next();

            } catch (err) {
                result = {
                    error: err,
                    status: 500
                };
    
                res.status(500).send(result);
            }
        } else {
            result = {
                error: `Authentication error. Token required`,
                status: 401
            };

            res.status(401).send(result);
        }
    },
}