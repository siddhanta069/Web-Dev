const express = require("express")
const {UserModel, TodoModel} = require("./db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "SydenHarbourBridge"
const mongoose = require("mongoose")

const app = express()
app.use(express.json())
mongoose.connect("mongodb+srv://siddhanta027z:inqSvS92F7lenQ9T@cluster0.ga5zu.mongodb.net/todo-siddh-app")

app.post("/signup",async function(req, res) {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    await UserModel.create({
        email: email,
        password: password,
        name: name
    })

    res.json({
        message: "You are Signed Up"
    })
    
})


app.post("/signin",async function(req, res) {
    const email = req.body.email
    const password = req.body.password

    const user = await UserModel.findOne ({
        email: email,
        password: password
    })
    console.log(user)

    if(user) {
        const token = jwt.sign({
            id: user._id.toString()
        },JWT_SECRET)
        res.json({
            token: token

        })
    }else {
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }

})


app.post("/todo", auth, async function(req, res) {
    const userId = req.userId
    const title = req.body.title
    const done = req.body.done

    await TodoModel.create({
        title: title,
        done: done,
        userId: userId
    })

    res.json({
        message: "Created"
    })
    
})


app.get("/todos", auth, async function(req, res) {
    const userId = req.userId

    const todos = await TodoModel.find({
        userId
    })


    res.json({
        todos
    })
    
})


function auth(req, res, next) {
    const token = req.headers.token
    const userInfo = jwt.verify(token, JWT_SECRET)

    if(userInfo) {
        req.userId = userInfo.id
        next()
    }else {
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }
}


app.listen(3000)