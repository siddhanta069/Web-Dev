const users=["raman", "siddhanta"]

let username
for(let i=0; i<users.length; i++) {
    username= users[i]
}

console.log(username)

else {
    res.status(403).send({
        message: "Invalid username or password"
    })
}

console.log(users)


