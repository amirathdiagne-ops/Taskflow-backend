const mongoose = require('mongoose')
const Project = require('../models/projects.model')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/appError')

const addProject = asyncHandler(async (req, res, next) => {
    const { name, description, status, owner, members } = req.body

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
    const allProjects = await Project.find({ owner: req.user._id })
    res.status(200).json({
        total: allProjects.length,
        projects: allProjects
    })
})

const getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findByOne({ _id: req.params.id, owner: req.user._id })
    if(!project) return next(new AppError('introuvable ou pas autoriser'))
    res.status(200).json({
        project: project
    })
})
const modifyProject = asyncHandler(async (req, res, next) => {
    const { name, description, status, members, owner } = req.body

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
    if (!project) return next(new AppError('impossible de modifier ou pas autoriser a modifier'))
    res.status(200).json({
        status: "success",
        project: project
    })
})

const deleteProject = asyncHandler(async (req, res, next) => {
    const projectToDelete = await Project.findOneAndDelete({_id :req.params.id, owner : req.user._id})
    if (!projectToDelete) return next(new AppError('introuvable ou non autorisé', 404))
    res.status(200).json({
        status: "success",
        message: "project supprimmé"
    })
})



module.exports = { addProject, getProjects, getProjectById, modifyProject, deleteProject }

