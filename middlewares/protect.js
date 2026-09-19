const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const User = require('../models/users.model')
const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return next(new AppError('Token manquant', 400))
    const token = authHeader.split(" ")[1]
    let decoded
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        return next(new AppError('token invalid', 401))
    }
    const user = await User.findById(decoded.id).select('-refreshToken -password')
    if (!user) return next(new AppError('utilisateur introuvable mtn', 404))
    req.user = user
    next()

})

module.exports = protect