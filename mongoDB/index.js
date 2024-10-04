const express = require("express")
const {UserModel, TodoModel} = require("./db")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "SydenHarbourBridge"
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { z } = require("zod")

const app = express()
app.use(express.json())
mongoose.connect("")

app.post("/signup",async function(req, res) {
    // input validation using zod
    const userSchema = z.object({
        email: z.string().min(3).max(20).email(),
        password: z.string().min(8).max(20),
        name: z.string().max(20)
    })
    // const parsedDataWithSuccess = userSchema.parse(req.body)  //this return only data if any error it will stop there
    const parsedDataWithSuccess = userSchema.safeParse(req.body) //this return the object {success: true | false, data: {}, error: []} 

    if(!parsedDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })

        return 
    }
    // error handling
    try {
            
        const email = req.body.email
        const password = req.body.password
        const name = req.body.name

        // hashing password
        const hashpassword = await bcrypt.hash(password, 5)

        await UserModel.create({
            email: email,
            password: hashpassword,
            name: name
        })

        res.json({
            message: "You are Signed Up"
        })
    } catch(e) {
        res.json({
            message: "User is Already exists"
        })
    }

    // another way to through error
    // throw new Error("user is Already exists")


})


app.post("/signin",async function(req, res) {
    const email = req.body.email
    const password = req.body.password

    const user = await UserModel.findOne ({
        email: email
    })

    if(!user) {
        res.json({
            message: "User does not exist."
        })

        return 
    }

    const matchUser = await bcrypt.compare(password, user.password)
    

    if(matchUser) {
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
