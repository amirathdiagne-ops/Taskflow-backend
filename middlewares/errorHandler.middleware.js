
const errorHandler = (err, req, res, next) => {
    if(err.isOperational === true){
        return res.status(err.statusCode).json({message : err.message})
    }
    if(err.name == "ValidationError") {
        const details = {}
        for(let field in err.errors) {
            details[field]= err.errors[field].message
        }
        return res.status(400).json({
            details : details
        })
    }
    if(err.code === 11000) {
       const fieldName = err.keyValue? Object.keys(err.keyValue)[0] : "champ"
        return res.status(409).json({
            message : `Cet ${fieldName} est déjà utilisé choississez un autre `
        })
    }
    if(err.name === "CastError") {
        const wrongValue = typeof err.value === "object" ? JSON.stringify(err.value) : err.value
        return res.status(400).json({
            message : `Cet identifiant ${wrongValue} est invalide`
        })
    }
    if(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"){
        return res.status(401).json({
            message : `${err.message}`
        })
    }

    return res.status(500).json({
        message : 'Erreur interne du serveur',
        erreur : err.message
    })
}
module.exports = errorHandler