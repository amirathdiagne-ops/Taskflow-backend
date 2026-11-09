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
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 6
    const skip = (page - 1) * limit
    const filter = { owner: req.user._id }
    const projects = await Project.find(filter).skip(skip).limit(limit)
    const total = await Project.countDocuments(filter)
    res.status(200).json({
        total,
        totalPage: Math.ceil(total / limit),
        projects
    })
})

const getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id }).populate("owner", "name")
    if (!project) return next(new AppError('introuvable ou pas autoriser', 404))
    res.status(200).json({
        project: project
    })
})
const modifyProject = asyncHandler(async (req, res, next) => {
    const { name, description, status, members } = req.body

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
    if (isAlreadyMember) return next(new AppError(`${userToAdd.name} travaille déjà sur ce projet precis`, 409))
    project.members = [...project.members, userToAdd._id]
    await project.save()
    res.status(200).json({ project })

})


const getMembers = asyncHandler(async (req, res, next) => {
    console.log("hello les membres")
    const project = await Project.findById(req.params.id)
    if (!project) return next(new AppError('projet introuvable ou pas autoriser', 404))
    console.log(project.members)
    await project.populate("members", "name")
    const member = project.members.map(m => m)
    team.push(member)
    res.status(200).json({ members: member })
})

const getTeam = asyncHandler(async (req, res, next) => {
    const team = []
    const projects = await Project.find().populate("members", "name")
    const participate = projects.filter(project =>
        project.members.some(member => member._id.equals(req.user._id))
    )
    const isOwner = await Project.find({ owner: req.user._id }).populate("members", "name email")
    team.push(participate)
    team.push(isOwner)
    const reelTeam = team.flat()
    const vus = new Set()

    const sansDoublons = reelTeam.filter(project => {
        const id = project._id.toString()
        if (vus.has(id)) {
            return false
        }
        vus.add(id)
        return true
    })

    const members = new Map()
    sansDoublons.forEach(project => project.members.forEach(m => {
        const id = m._id.toString()
        if (!members.has(id)) {
            members.set(id, {
                name: m.name,
                id,
                projects: []

            })
        }
        const member = members.get(id)
        member.projects.push(project)


    }))

    const result = Array.from(members.values())
    res.status(200).json({
        result
    })
})

module.exports = { addProject, getProjects, getProjectById, modifyProject, deleteProject, allUserProjects, addMember, getMembers, getTeam }

