const {Router} = require("express")
const {User, Show} = require("../models")
const checkUserId = require("../middleware/checkUserId")
const checkShowId = require("../middleware/checkShowId")

const userRouter = Router()


userRouter.get("/", async(req,res)=>{
    res.send(await User.findAll())
})

userRouter.get("/:id", checkUserId, async(req,res)=>{
    res.send(await User.findByPk(req.params.id))
})

userRouter.get("/:id/shows", checkUserId, async(req,res)=>{
    res.send(await (await User.findByPk(req.params.id)).getShows())
})

userRouter.put('/:id/shows/:num', checkUserId, checkShowId, async(req,res)=>{
    const show = await Show.findByPk(req.params.num)
    const user = await User.findByPk(req.params.id)
    await user.addShows([show])
    res.send(await user.getShows() )
})


module.exports = userRouter