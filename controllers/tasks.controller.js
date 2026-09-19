const Task = require('../models/tasks.model')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const Project = require('../models/projects.model')
const User = require('../models/users.model')
const addTask = asyncHandler(async (req, res, next) => {
    const { title, description, status, priority, dueDate, assignedTo } = req.body
    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        project: req.project._id,
        assignedTo,
        createdBy: req.user._id

    })
    res.status(201).json({
        status: "success",
        task: task
    })
})

const getTasks = asyncHandler(async (req, res, next) => {
    console.log("ca marche au calme")
    const tasks = await Task.find({ project: req.project._id }).populate("project", "members")
    res.status(200).json({
        message: "success",
        tasks: tasks
    })
})

const getTasksById = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.id).populate('project', 'owner')
    if (!task) return next(new AppError('tache introuvable', 404))
    const project = await Project.findById(task.project._id)
    if (!project) return next(new AppError('project introuvable', 404))
    const isCreator = req.user._id.equals(task.createdBy)
    const isOwner = req.user._id.equals(task.project.owner)
    const isMember = project.members.some(member => member.equals(req.user._id))
    const canAccess = isOwner || isCreator || isMember
    if (!canAccess) return next(new AppError('pas autorisé ', 403))
    res.status(200).json({
        message: "success",
        task: task
    })
})

const modifyTask = asyncHandler(async (req, res, next) => {
    const { title, description, assignedTo, status, priority, dueDate } = req.body
    const task = await Task.findById(req.params.id).populate('project', 'owner')
    if (!task) return next(new AppError('tache introuvable', 404))
    const project = await Project.findById(task.project._id)
    if (!project) return next(new AppError('project introuvable', 404))
    const isCreator = req.user._id.equals(task.createdBy)
    const isOwner = req.user._id.equals(task.project.owner)
    const isMember = project.members.some(member => member.equals(req.user._id))
    const canAccess = isOwner || isCreator || isMember
    if (!canAccess) return next(new AppError('pas autorisé ', 403))
    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (assignedTo) task.assignedTo = assignedTo
    if (status !== undefined) task.status = status
    if (priority !== undefined) task.priority = priority
    if (dueDate !== undefined) task.dueDate = dueDate
    await task.save()
    res.status(200).json({
        task: task
    })

})

const deleteTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.id).populate('project', "owner members")
    if (!task) return next(new AppError('tache introuvable', 404))
    if (!task.project) return next(new AppError('project introuvable', 404))
    const isCreator = req.user._id.equals(task.createdBy)
    const isOwner = req.user._id.equals(task.project.owner)
    const isMember = project.members.some(member => member.equals(req.user._id))
    const canAccess = isOwner || isCreator || isMember
    if (!canAccess) return next(new AppError('pas autorisé', 403))
    await task.deleteOne()
    res.status(200).json({
        status: "success",
        message: "supprimer avec success"
    })
})

const assignedTask = asyncHandler(async (req, res, next) => {
    const { userId } = req.body 
    console.log(userId, "id du membre")
    const userExist = await User.findById(userId)
    if (!userExist) return next(new AppError('utilisateur introuvable', 404))
    const task = await Task.findById(req.params.id).populate('project', "owner members")
    if (!task) return next(new AppError('tache introuvable', 404))
    console.log("tache trouvée", task)
    if (!task.project) return next(new AppError('project introuvable', 404))
    const isCreator = req.user._id.equals(task.createdBy) 
    const isOwner = req.user._id.equals(task.project.owner)
    const canAccess = isOwner || isCreator
    if (!canAccess) return next(new AppError('pas autorisé', 403))
    const userIsMember = task.project.members.some(member => member.equals(userExist._id))
    if (!userIsMember) return next(new AppError('cet utilisateur ne peut pas etre assigné au projet', 403))
    const isAlreadyAssignedTo = task.assignedTo.equals(userExist._id)
    if(isAlreadyAssignedTo) return next(new AppError("Déjà assigné a la tache ne peut plus etre assigné", 409))
    task.assignedTo = userExist._id
    await task.save()
    res.status(200).json({
        status: "success",
        task
    })
})


module.exports = { addTask, getTasks, getTasksById, modifyTask, deleteTask, assignedTask }