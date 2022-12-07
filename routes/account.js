
var express = require('express');
var router = express.Router();

const accountController = require('../controllers/account');
const middleware = require('../middleware/authentication')


router.post('/signup', function (req, res, next) {
    console.log(req.body)
    accountController.signup(req.body, function (result) {
        console.log(result)

        return res.json(result)
    })
});

router.post('/login', function (req, res, next) {
    console.log(req.body)
    accountController.signin(req.body)
        .then((result) => {
            console.log(result)
            return res.json(result)
        })
        .catch((err) => {
            console.log(err)
            return res.json({ err: true, message: err.message })
        })
});

router.get('/activate', function (req, res, next) {
    accountController.activate(req.query, function (result) {
        res.render('activated', { title: 'Express', activation: result });
    })
});

router.post('/password/change', middleware.requireToken, function (req, res, next) {
    console.log(req.body)
    accountController.changePassword(req.body, function (result) {
        return res.json(result)
    })
});
module.exports = router;
