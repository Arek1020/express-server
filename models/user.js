const db = require(__dirname + '/../mysql')

const userModel = {
    get: function (opts) {
        return new Promise(function (resolve, reject) {
            let query = `SELECT * FROM Users where email = ${db.escape(opts.email)} AND active = 1`
            console.log('sdfdf', query)
            db.query(query, function (err, doc) {
                if (err) {
                    console.log(err)
                    return reject({ err: 'Błąd bazy danych.' })
                }

                return resolve(doc[0])
            })
        })
    },
    update: function (data) {
        return new Promise(function (resolve, reject) {
            let query = `INSERT INTO Users SET ? `
            db.query(query, data, function (err, doc) {
                if (err) {
                    console.log(err)
                    return reject({ err: 'Błąd bazy danych.' })
                }
                return resolve(doc)
            })
        })

    }, 
    activateAccount: function (data) {
        return new Promise(function (resolve, reject) {
            let query = `UPDATE Users SET emailToken = null WHERE emailToken = ${db.escape(data.token)} AND id = ${db.escape(data.id)}`
            console.log('qqqq', query)
            db.query(query, data, function (err, doc) {
                if (err) {
                    console.log(err)
                    return reject({ err: 'Błąd bazy danych.' })
                }
                return resolve(doc)
            })
        })

    }
}

module.exports = userModel