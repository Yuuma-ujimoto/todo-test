//諸々のPackage読み込み
const express = require("express")
const path = require("path")
const cookieParser = require('cookie-parser');
const session = require("express-session")


//app init
const app = express()

// appの各種設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        secure: false,
        maxage: 1000 * 60 * 60 * 24 * 30
    }
}))

// routing

const IndexRouter = require("./router/index")
const SignUpRouter = require("./router/sign-up")
const SignInRouter = require("./router/sign-in")

const ApiRouter = require("./router/api")

app.use("/sign-up",SignUpRouter)
app.use("/sign-in",SignInRouter)
app.use("/api",ApiRouter)
app.use("/",IndexRouter)


//　ポート番号3000番で起動
app.listen(3000);
//一応Logにローカルホストのアドレスを表示させておく
console.log("http://localhost:3000/")