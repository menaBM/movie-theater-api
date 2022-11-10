const seed = require("./seed")
const express = require("express")

const app = express()
app.use(express.json())





app.listen(3000, ()=>{
    seed() //need to await?
})