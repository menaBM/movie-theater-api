const {Router} = require("express")
const {User, Show} = require("../models")

const userRouter = Router()


userRouter.get("/", async(req,res)=>{
    res.send(await User.findAll())
})

userRouter.get("/:id", async(req,res)=>{
    res.send(await User.findByPk(req.params.id))
})

userRouter.get("/:id/shows", async(req,res)=>{
    res.send(await (await User.findOne({where: {id :req.params.id}})).getShows())
})

userRouter.put('/:id/shows/:num', async(req,res)=>{
    console.log("here")
    const show = await Show.findByPk(req.params.num)
    const user = await User.findByPk(req.params.id)
    await user.addShows([show])
    res.send(await user.getShows() )
})


module.exports = userRouter