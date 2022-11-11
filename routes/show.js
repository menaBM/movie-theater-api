const {Router} = require("express")
const {Show }= require("../models/Show")
const {body,param, validationResult} = require("express-validator")
const checkShowId = require("../middleware/checkShowId")
const checkGenre = require("../middleware/checkGenre")

const showRouter = Router()

showRouter.get("/", async(req,res)=>{
    res.send(await Show.findAll())
})

showRouter.get("/:id",checkShowId, async(req,res)=>{
    res.send(await Show.findByPk(req.params.id))
})

showRouter.get("/genres/:genre", checkGenre, async(req,res)=>{
    res.send(await Show.findAll({where:{genre: req.params.genre}}))
})

showRouter.put("/:id/watched/:rating", checkShowId,
param("rating").notEmpty({ignore_whitespace: true}).exists().not().equals("null").not().equals("undefined"), 
async(req,res)=>{
    const errors = validationResult(req)
    if (errors.isEmpty()){
        if (req.params.rating >= 0 && req.params.rating <= 10){
            res.send(await (await Show.findByPk(req.params.id)).update({
                rating : req.params.rating 
            }))
        }else{
            res.status(400).send("rating must be between 0 and 10")
        }
    }else{
        res.status(400).send("cannot have empty parameters")
    }
})

showRouter.put("/:id/updates", checkShowId,
body("status").isLength({min:5, max:25}).exists(), 
async(req,res)=>{
    const errors = validationResult(req)
    if (errors.isEmpty()){
        const show = await Show.findByPk(req.params.id)
        await show.update({status: req.body.status})
        res.send(await Show.findByPk(req.params.id))
    }else{
        res.status(400).send("status cannot be empty or whitespace and must be between 5 and 25 characters")
    }
})

showRouter.delete("/:id", checkShowId, async(req,res)=>{
    await (await Show.findByPk(req.params.id)).destroy()
    res.send("show deleted")
})


module.exports = showRouter