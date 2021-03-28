const express = require("express")
const router = express.Router()

const connection = require("../config/mysql")

router.get("/", (req, res) => {
    if (!!req.session.user_id) {
        res.render("index/login")
        return
    }
    res.render("index/nologin")
})



router.get("/mypage", (req, res, next) => {
    res.render("mypage")
})

module.exports = router