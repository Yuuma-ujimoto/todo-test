const express = require("express")
const router = express.Router()
const crypto = require("crypto")

const connection = require("../config/mysql")

router.get("/", (req, res) => {
    res.render("sign-in")
})

router.post("/check", (req, res, next) => {
        const mail_address = req.body.mail_address
        const password = req.body.password

        const hash = crypto.createHash("sha1")
        hash.update(password)
        const crypto_password = hash.digest("hex")

        const sql = "select count(*) as count from user_data where mail_address = ? and password = ?"
        connection.query(sql, [mail_address, crypto_password], (err, result) => {
            if (err) {
                console.log(err)
                res.render("error", {error: 0})
                return
            }
            if (!result[0].count) {
                res.render("error", {error: 1})
                return
            }
            next()
        })
    }
    , (req, res) => {
        const sql = "select id from user_data where mail_address = ?"
        const mail_address = req.body.mail_address
        connection.query(sql,
            [mail_address],
            (err, result) => {
            if (err) {
                console.log(err)
                res.render("error", {error: 6})
            }
            console.log(result)
            req.session.user_id = result[0].id
            res.redirect("/")
        })
    }
)

module.exports = router