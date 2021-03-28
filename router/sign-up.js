const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const connection = require("../config/mysql")


router.get("/", (req, res) => {
    console.log("a")
    res.render("sign-up")
})

router.post("/check", (req, res, next) => {
        const user_name = req.body.user_name;
        const mail_address = req.body.mail_address
        const password = req.body.password
        const password_re = req.body.password_re

        if (!user_name || !mail_address || !password || !password_re) {
            res.render("error", {error: 0})
        }
        next()
    },
    (req, res, next) => {
        //ユーザー名
        const user_name = req.body.user_name
        //メールアドレス
        const mail_address = req.body.mail_address
        //パスワード
        const password = req.body.password
        //確認用パスワード
        const confirm_password = req.body.confirm_password
        //
        let error_flag = false
        let error_messages = []
        //--------------------------------------------------------------------------------------------------------------
        // ユーザー名&パスワード用正規表現リテラル

        const UserNameAndPassWordRELiteral = "/^[\w]+$/"
        // メールアドレス用正規表現リテラル
        const MailAddressRELiteral = "/^[\\w.\\-]+@[\\w\\-]+\\.[\\w.\\-]+\n$/"

        if (user_name.match(UserNameAndPassWordRELiteral)) {
            //ユーザー名が正規表現に引っかかった場合
            error_messages.push("ユーザー名:正規表現")
            error_flag = true;
        }
        if (user_name.length < 4 || 20 < user_name) {
            //ユーザー名の文字数チェック
            error_messages.push("ユーザー名:文字数")
            error_flag = true
        }

        if (mail_address.match(MailAddressRELiteral)) {
            //メールアドレスの正規表現チェック
            error_messages.push("メールアドレス:正規表現")
            error_flag = true
        }
        if (256 < mail_address.length) {
            //メールアドレス文字数チェック
            error_messages.push("メールアドレス:文字数")
            error_flag = true
        }

        if (password.match(UserNameAndPassWordRELiteral) && confirm_password.match(UserNameAndPassWordRELiteral)) {
            //パスワード正規表現チェック
            error_messages.push("パスワード:正規表現")
            error_flag = true
        }
        if (error_flag) {
            //二次チェック
            //ここでチェック挟むことでDBへの無駄なアクセスを制限
            res.render("error", {error: 1})
            return
        }
        next()
    },
    (req, res, next) => {
        const sql =
            "select count(*) as count from user_data where user_name = ?;" +
            "select count(*) as count from user_data where mail_address = ?"
        connection.query(sql, [req.body.user_name, req.body.mail_address], (err, result) => {
            if (err) {
                console.log(err)
                res.render("error", {error: 2})
                return
            }
            if (result[0][0].count) {
                res.render("error", {error: 3})
                return
            }
            if (result[1][0].count) {
                res.render("error", {error: 4})
                return
            }
            next()
        })

    },
    (req, res, next) => {
        const user_name = req.body.user_name;
        const mail_address = req.body.mail_address
        const password = req.body.password

        const hash = crypto.createHash("sha1")
        hash.update(password)
        const crypto_password = hash.digest("hex")

        const sql = "insert into user_data(user_name,mail_address,password) value(?,?,?)"
        connection.query(
            sql,
            [user_name, mail_address, crypto_password],
            (err, result) => {
                if (err){
                    console.log(err)
                    res.render("error",{error:5})
                    return
                }

                next()
            })
    },
    (req, res, next) => {
        const sql = "select id from user_data where mail_address = ? and user_name = ?"
        const user_name = req.body.user_name
        const mail_address = req.body.mail_address
        connection.query(sql, [mail_address,user_name],(err, result) => {
            if(err){
                console.log(err)
                res.render("error",{error:6})
            }
            console.log(result)
            req.session.user_id =  result[0].id
            res.redirect("/mypage")
        })
    }
)

module.exports = router