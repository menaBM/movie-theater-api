const seed = require("./seed")
const express = require("express")
const {userRouter, showRouter} = require("./routes")

const app = express()
app.use(express.json())


app.use("/users", userRouter)
app.use("/shows", showRouter)


// app.listen(3000, async()=>{
//     await seed()
//     console.log("listening on port 3000")
// })

module.exports = app