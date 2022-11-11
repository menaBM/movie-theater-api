const {Show} = require("../models")

async function checkGenre(req,res,next){
    const genres = ["Drama", "Sitcom", "Comedy", "Horror"]
    if (genres.includes(req.params.genre )){
        next()
    }else{
        res.status(400).send("invalid genre")
    }
}

module.exports = checkGenre