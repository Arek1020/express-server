const jwt = require('jsonwebtoken'),
    User = require('../models/user')

const authMiddleware = {
    requireToken: (req, res, next) => {
        const authHeader = req.get("Authorization");
        console.log('authHeader', authHeader);

        if (!authHeader) {
            return res.status(401).json({ message: 'not authenticated' });
        };
        const token = authHeader.split(' ')[1];
        console.log('token1', token);

        if (!token || token == 'null' || token == null) {
            console.log('rwerwerwrewrewrew')
            return res.status(401).json({ message: 'not authenticated' });
        };

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.SECRET);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: err.message || 'could not decode the token' });
        };

        if (!decodedToken) {
            res.status(403).json({ message: 'forbidden' });
        } else {
            console.log('token', JSON.stringify(decodedToken));
            User.get({ email: decodedToken.email }).then((user) => {
                if (!user)
                    res.status(403).json({ message: 'forbidden' });

                res.locals.user = user
                console.log('ussser', res.locals.user);
                return next();
            })

        };
    }
}

module.exports = authMiddleware;