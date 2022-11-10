const seed = require("./seed")
const express = require("express")
const {userRouter, showRouter} = require("./routes")

const app = express()
app.use(express.json())
app.use("/users", userRouter)
app.use("/shows", showRouter)

//
//nodemon and postman testing
//use express validator import etc
// make supertests


app.listen(3000, ()=>{
    seed() //need to await?
    console.log("listening on port 3000")
})