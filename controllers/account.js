const bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    User = require('../models/user.js'),
    emailValidator = require("email-validator"),
    passwordValidator = require('password-validator'),
    crypto = require('crypto'),
    moment = require('moment')

var passwordSchema = new passwordValidator();



const accountController = {
    signup: (opts, callback) => {
        var passwordValidationResult = validatePassword(opts.password)

        if (!opts.email || !emailValidator.validate(opts.email))
            return callback({ err: true, message: 'Nieprawidłowy adres e-mail' })
        if (!opts.password || passwordValidationResult.err)
            return callback(passwordValidationResult)

        User.get({ email: opts.email }).then(dbUser => {
            if (dbUser) {
                return callback({ err: true, message: "Konto z takim adresem e-mail juz istnieje" });
            } else if (opts.email && opts.password) {
                bcrypt.hash(opts.password, 12, (err, passwordHash) => {
                    if (err) {
                        return callback({ err: true, message: "Błąd zapisu hasła" });
                    } else if (passwordHash) {
                        var emailToken = crypto.createHash('md5').update(moment().format('x'), 'utf-8').digest('hex')
                        var userData = {
                            email: opts.email,
                            name: opts.name,
                            password: passwordHash,
                            emailToken: emailToken
                        }
                        User.update((userData))
                            .then((result) => {
                                userData.id = result.insertId
                                const token = jwt.sign({ email: opts.email }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRATION + ' days' });
                                return callback({ message: "Pomyślnie utworzono uytkownika. Aby aktywować konto kliknij w link wysłany na podanego maila.", "token": token, user: JSON.stringify(userData) });
                            })
                            .catch(err => {
                                console.log(err);
                                return callback({ err: true, message: "error while creating the user" });
                            });
                    };
                });
            };
        })
            .catch(err => {
                console.log('error', err);
            });
    },
    signin: (opts, callback) => {
        return new Promise((resolve, reject) => {
            if (!opts.email)
                return reject({ message: 'Brak adresu e-mail' })
            if (!opts.password)
                return reject({ message: 'Brak hasła' })

            User.get(opts)
                .then(dbUser => {
                    if (!dbUser) {
                        return reject({ message: "Nie znaleziono takiego użytkownika" });
                    } else {
                        // password hash
                        bcrypt.compare(opts.password, dbUser.password, (err, compareRes) => {
                            if (err) { // error while comparing
                                return reject({ message: "Błąd logowania" });
                            } else if (compareRes) { // password match
                                const token = jwt.sign({ email: opts.email }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRATION + ' days' });
                                delete dbUser.password;
                                return resolve({ message: "Zalogowano pomyślnie", "token": token, user: JSON.stringify(dbUser) });
                            } else { // password doesnt match
                                return reject({ message: "Nieprawidłowe dane logowania" });
                            };
                        });
                    };
                })
                .catch(err => {
                    console.log('error', err);
                });
        })
    },
    activate: (opts, callback) => {
        if (!opts.id)
            return callback({ err: 'Brak ID' })
        if (!opts.token)
            return callback({ err: 'Brak tokenu' })

        User.activateAccount(opts).then((result) => {
            return callback({ success: 'Pomyślnie aktywowano konto' })
        }).catch((err) => { return callback({ err }) })

    },
    changePassword: (opts, callback) => {

    }
}


const validatePassword = (password) => {
    passwordSchema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        // .has().digits(2)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']);

    var result = passwordSchema.validate(password)
    if (!result)
        result = { err: true, message: 'Hasło powinno zawierać minimum 8 znaków, duże i małe litery.' }
    return result
}

module.exports = accountController