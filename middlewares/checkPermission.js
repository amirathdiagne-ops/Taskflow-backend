const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const Project = require('../models/projects.model')


const checkPermission = asyncHandler(async (req, res, next) => {
    const {projectId} = req.params
    const project = await Project.findById(projectId)
    if(!project) return next(new AppError('project introuvable', 404))
    const isOwner = req.user._id.equals(project.owner)
    const isMember = project.members.some(member => member.equals(req.user._id))
    const canAccess = isOwner || isMember
    if(!canAccess) return next(new AppError('Pas autorisé', 403))
    req.project = project
    next()
    
})

module.exports = checkPermission