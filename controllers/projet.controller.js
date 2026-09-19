const Project = require('../models/projects.model')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')
const User = require('../models/users.model')
const addProject = asyncHandler(async (req, res, next) => {
    const { name, description, status } = req.body

    const project = await Project.create({
        name,
        description,
        status,
        owner: req.user._id,
        members: [req.user._id]
    })
    if (!project) return next(new AppError('erreur lors de la creation du projet', 400))
    res.status(201).json({
        status: "success",
        project: project
    })

})

const getProjects = asyncHandler(async (req, res, next) => {
    const allProjects = await Project.find({ owner: req.user._id }).populate('owner', "name email")
    res.status(200).json({
        total: allProjects.length,
        projects: allProjects
    })
})

const getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id })
    if (!project) return next(new AppError('introuvable ou pas autoriser', 404))
    res.status(200).json({
        project: project
    })
})
const modifyProject = asyncHandler(async (req, res, next) => {
    const { name, description, status, members} = req.body

    const updates = {}
    if (name) updates.name = name
    if (description) updates.description = description
    if (status) updates.status = status
    if (members) updates.members = members
    const project = await Project.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
    )
    if (!project) return next(new AppError('impossible de modifier ou pas autoriser a modifier', 404))
    res.status(200).json({
        status: "success",
        project: project
    })
})

const deleteProject = asyncHandler(async (req, res, next) => {
    const projectToDelete = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!projectToDelete) return next(new AppError('introuvable ou non autorisé', 404))
    res.status(200).json({
        status: "success",
        message: "project supprimmé"
    })
})

const allUserProjects = asyncHandler(async (req, res, next) => {
    const allProjects = await Project.find({ _id: req.user._id }).populate('owner', "name email")
    res.status(200).json({
        total: allProjects.length,
        projects: allProjects
    })
})

const addMember = asyncHandler(async (req, res, next) => {
    const { userId } = req.body
    const { projectId } = req.params
    const userToAdd = await User.findById(userId)
    if (!userToAdd) return next(new AppError('candidat introuvable', 404))
    const project = await Project.findOne({ _id: projectId, owner: req.user._id })
    if (!project) return next(new AppError('project introuvable ou pas autoriser', 404))
    const isAlreadyMember = project.members.some(member => member.toString() === userToAdd._id.toString())
    if(isAlreadyMember)return next(new AppError(`${userToAdd.name} travaille déjà sur ce projet precis`, 409))
    project.members = [...project.members, userToAdd._id]
    await project.save()
    res.status(200).json({ project })

})

const getMembers = asyncHandler(async (req, res, next) => {
    console.log("hello les membres")
    const project = await Project.findById(req.params.id)
    console.log(project, "whaouh")
    if(!project) return next(new AppError('projet introuvable ou pas autoriser', 404))
    console.log(project.members)
    await project.populate("members", "name")
    const member =  project.members.map(m => m)
    res.status(200).json({members : member})
})



module.exports = { addProject, getProjects, getProjectById, modifyProject, deleteProject, allUserProjects, addMember, getMembers }

