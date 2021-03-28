const express = require("express")
const router = express.Router()
const connection = require("../config/mysql")
connection.connect()

router.post("/get-mypage-data",
    (req, res, next) => {
    const user_id = req.session.user_id
        if(!user_id){
            res.json({check:false})
            return
        }
        const sql = "select mail_address,user_name from user_data where id = ?"
        connection.query("")
})


router.post("/get-task",(req, res) => {
    if(!req.session.user_id){
        res.json({error:true})
        return
    }
    const sql = "select * from task where user_id = ?"
    connection.query(sql,[req.session.user_id],(err, result) => {
        if(err){
            console.log(err)
            res.json({error:true})
            return
        }
        res.json({error:false,result:result})
    })
})

router.post("/add-task",(req, res) => {
    const sql = "insert into task(user_id,task_contents,limit_date,created_at) value(?,?,?,?)";
    const created_at = new Date()
    const user_id = req.session.user_id
    //const task_name = req.body.task_name;
    const task_contents = req.body.task_contents

    const limit_date = new Date(new Date().setDate(new Date().getDate()+1))
    console.log(limit_date)

    console.log(user_id,task_contents)
    const data_check = !(!!user_id&&!!task_contents)

    if(data_check){
        console.log(data_check)
        res.json({error:true})
        return
    }

    if(task_contents === "e"){
        res.json({error:true})
        return
    }

    connection.query(sql,[user_id,task_contents,limit_date,created_at],(err, result) => {
        if(err){
            console.log(err)
            res.json({error:true})
            return
        }
        res.json({error:false,result:result})

    })

})



router.get("/fin-task",(req, res) => {
    res.render("index")
})

router.get("/show-unfinished-task",(req, res) => {
    res.render("index")
})

router.get("/show-all-task",(req, res) => {
    res.render("index")
})





module.exports = router