const express = require('express')
const router = express.Router()
const { addProject, getProjects, getProjectById, modifyProject, deleteProject, allUserProjects } = require('../controllers/projet.controller')
const protect = require('../middlewares/protect')
router.get('/', allUserProjects)
router.get('/all',protect, getProjects)
router.get('/:id',protect, getProjectById)
router.post('/',protect, addProject) 
router.put('/:id',protect, modifyProject)
router.delete('/:id',protect, deleteProject)

module.exports = router