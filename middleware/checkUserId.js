const {User} = require("../models")

async function checkUserId(req,res,next){
    if (await User.findByPk(req.params.id)){
        next()
    }else{
        res.status(400).send("invalid user id")
    }
}

module.exports = checkUserId