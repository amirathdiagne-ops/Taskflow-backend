const express = require('express')
const router = express.Router()
const { register, login, logout, refresh, myProfile, showUsers } = require('../controllers/auth.controller')
const validator = require('../middlewares/auth.validator.middleware')
const { registerSchema, loginSchema } = require('../validators/auth.validator')
const projectRouter = require('../routes/project.route')
const protect = require('../middlewares/protect')
router.get('/', protect, showUsers)

router.get('/me', protect, myProfile)
router.post('/register', validator(registerSchema), register)
router.post('/login', validator(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.use('/:projectId/',protect, projectRouter)



module.exports = router


