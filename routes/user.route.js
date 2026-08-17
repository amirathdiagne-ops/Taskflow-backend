const express = require('express')
const router = express.Router()
const { register, login, logout, refresh, myProfile } = require('../controllers/auth.controller')
const validator = require('../middlewares/auth.validator.middleware')
const { registerSchema, loginSchema } = require('../validators/auth.validator')
const protect = require('../middlewares/protect')
router.get('/me', protect, myProfile)
router.post('/register', validator(registerSchema), register)
router.post('/login', validator(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)



module.exports = router


