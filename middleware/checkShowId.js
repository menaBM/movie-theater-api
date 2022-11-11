const {Show} = require("../models")

async function checkShowId(req,res,next){
    if (await Show.findByPk(req.params.id)){
        next()
    }else{
        res.status(400).send("invalid show id")
    }
}

module.exports = checkShowId