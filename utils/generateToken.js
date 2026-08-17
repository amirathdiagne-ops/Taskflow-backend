const jwt = require('jsonwebtoken')

const generateToken = (id, role) => {
    return token = jwt.sign(
        {id, role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRES_IN}
    )
}

module.exports = generateToken