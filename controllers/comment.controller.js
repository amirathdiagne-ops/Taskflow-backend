const Comment = require('../models/comments.model')
const AppError = require('../utils/appError')
const asyncHandler = require('../utils/asyncHandler')
const addComment = asyncHandler(async (req, res, next) => {
    const { content } = req.body
    const comment = await Comment.create({
        content,
        author: req.user._id,
        task: req.task._id
    })
    res.status(201).json({ 
        message: "success", 
        comment: comment
    })
})

const getTaskComments = asyncHandler(async (req, res, next) => {
    const comment = await Comment.find({ task: req.task._id}).populate("author", "name")
    res.status(200).json({
        message: "success",
        comments: comment
    })
})

const modifyComment = asyncHandler(async (req, res, next) => {
    const { content } = req.body
    const comment = await Comment.findOneAndUpdate({
        _id: req.params.id,
        author: req.user._id
    },
        {
            $set: {content}
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    )
    if(!comment) return next(new AppError('introuvable ou pas autoriser', 404))
    res.status(200).json({
        message : "success",
        comment : comment
    })

})
const deleteComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findByIdAndDelete(req.params.id)
    if(!comment) return next(new AppError("commentaire introuvable", 404))
     res.status(200).json({
        status : "success",
        message : "supression reussie"
     })
})


module.exports = { addComment, getTaskComments, modifyComment, deleteComment }