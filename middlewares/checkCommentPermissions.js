const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const Task = require('../models/tasks.model')
const Project = require('../models/projects.model')

const checkCommentPermission = asyncHandler(async (req, res, next) => {
    const {taskId} = req.params
    const {projectId} = req.params
    const task = await Task.findById(taskId).populate('project', "owner")
    if(!task) return next(new AppError('tache introuvable', 404))
    const project = await Project.findById(projectId)
    if(!project) return next(new AppError('projet introuvable', 404))
    const isProjectOwner = task.project.owner._id.equals(req.user._id)
    const isCreator = task.createdBy.equals(req.user._id)
    const isMember = project.members.some(member => member.equals(req.user._id)) 
    const canComment = isCreator || isMember || isProjectOwner
    if(!canComment) return next(new AppError('pas autoriser', 403))
    req.task = task
    next()
})
module.exports = checkCommentPermission