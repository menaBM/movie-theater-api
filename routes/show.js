const {Router} = require("express")
const {Show }= require("../models/Show")

const showRouter = Router()

showRouter.get("/", async(req,res)=>{
    res.send(await Show.findAll())
})

showRouter.get("/:id", async(req,res)=>{
    res.send(await Show.findByPk(req.params.id))
})

showRouter.get("/genres/:genre", async(req,res)=>{
    res.send(await Show.findAll({where:{genre: req.params.genre}}))
})

showRouter.put("/:id/watched/:rating", async(req,res)=>{
    res.send(await (await Show.findByPk(req.params.id)).update({
        rating : req.params.rating 
    }))
})

showRouter.put("/:id/updates", async(req,res)=>{
    show = await Show.findByPk(req.params.id)
    if (show.status === "on-going")
    {
        await show.update({status: "canceled"})
    }else{
        await show.update({status:"on-going"})
    }
    res.send(await Show.findByPk(req.params.id))
})

showRouter.delete("/:id", async(req,res)=>{
    await (await Show.findByPk(req.params.id)).destroy()
    res.send("show deleted")
})


module.exports = showRouter