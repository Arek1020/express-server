const User = require('../models/user.js'),
    moment = require('moment')


const userController = {
    get: (opts) => {
        return new Promise((resolve, reject) => {
            User.get({email: opts.email}).then((user) => {
                console.log(user)
                return resolve(user)
            }).catch((err) => { 
                console.log(err)
                return reject(err)
            })
        })
    }
}

module.exports = userController