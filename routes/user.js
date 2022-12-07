var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')

/* GET users listing. */
router.post('/get', function(req, res, next) {
    console.log(res.locals)
    userController.get({email: res.locals.user.email}).then((result) => {
        return res.json(result);
    }).catch((error) => {
        console.log(error)
        return res.sendStatus(500)
    })
});

module.exports = router;
