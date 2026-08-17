const User = require('../models/users.model')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const generateToken = require('../utils/generateToken')
const generateRefreshToken = require('../utils/generateRefreshToken')
const jwt = require('jsonwebtoken')

const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, avatar } = req.body
    const user = await User.create({
        name, 
        email,
        password,
        avatar
    })

    const accessToken = generateToken(user._id, user.role)

    res.status(201).json({
        status: "success",
        accessToken: accessToken,
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar
        },
        message: "Inscription reuussie"
    })
})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password' )
    if (!user) return next(new AppError('Email incorrecte ou veuillez créer un compte', 400))
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return next(new AppError('mot de passe incorrecte', 401))
    const accessToken = generateToken(user._id, user.role)
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        message: "Connexion reussie",
        accessToken: accessToken,
        user: {
            email : user.email,
            name : user.name
        }
    })

})

const logout = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: "strict",

        })
        res.status(200).json({
            status: "succès",
            message: "Deconnexion reussie"
        })
    }

    await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: null })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    })
    res.status(200).json({
        status: "succès",
        message: "Deconnexion reussie"
    })

})

const refresh = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return next(new AppError('refresh Token manquant', 401))

    let decoded
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return next(new AppError('refresh Token non valide ou expiré', 401))
    }
    const user = await User.findById(decoded.id)
    if (!user) return next(new AppError('token non reconnu ou revoqué', 404))
    const newAccessToken = generateToken(user._id, user.role)
    const newRefreshToken = generateRefreshToken(user._id)
    user.refreshToken = newRefreshToken
    await user.save()
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.status(200).json({
        status: "success",
        accessToken: newAccessToken
    })

})

const myProfile = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        user: req.user
    })
})


module.exports = { register, login, logout, refresh, myProfile }