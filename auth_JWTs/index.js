const express = require("express")
const jwt = require("jsonwebtoken")
// const cors = require("cors")

const JWT_SECRET = "sydenharbourbridge"
const app = express()
app.use(express.json())


const users = []

// function generateToken() {
//     return Math.random()
// }

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/front/index.html")
})


app.post("/signup",function(req, res) {
    const userName = req.body.username
    const userPassword = req.body.password

    users.push( { 
        username:userName,
        password:userPassword
 
    })

    res.json({
        message:"You are signed up"
    })

    console.log(users)

} )


app.post("/signin",function(req, res) {
    const userName = req.body.username
    const userPassword = req.body.password

    let foundUser = null

    for(let i=0; i<users.length; i++) { // let the users come and signed in with any other types of objects
        if(users[i].username == userName && users[i].password == userPassword) {
            foundUser = users[i] 
        }
    }

    if(foundUser) {
        const token = jwt.sign({
            username: userName
        },JWT_SECRET)
        // foundUser.token = token
        res.json({
            Token: token
        })
    }
    else {
        res.status(403).send({
            message: "Invalid username or password" 
        })
    }

    console.log(users)


    
} )

function auth(req, res, next) {
    const token = req.headers.token
    const decodedInformation = jwt.verify(token, JWT_SECRET)
    const userName = decodedInformation.username

    if(username) {
        req.username = userName  //to send current user to the next function {it could be req = {status, headers,....., username, password}}
        next()
    }
    else  {
        res.json({
            message: "you are not logged in"
        })
    }

}

app.get("/me", auth, function(req, res) {
    

    let foundUser = null

    for(let i=0; i<users.length; i++) {
        if(users[i].username == req.username) {
            foundUser = users[i]
        }
    }

    if(foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }
    else {
        res.json({
            message: "Invalid token"
        })
    }

})


app.listen(3000)
 