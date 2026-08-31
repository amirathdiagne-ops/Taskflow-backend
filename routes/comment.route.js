const express = require('express')
const commentRouter = express.Router({ mergeParams: true })
const { addComment, getTaskComments, modifyComment} = require('../controllers/comment.controller')
const protect = require('../middlewares/protect')
const checkCommentPermission = require('../middlewares/checkCommentPermissions')
commentRouter.post('/', protect,checkCommentPermission, addComment)
commentRouter.get('/', protect,checkCommentPermission, getTaskComments)
commentRouter.patch('/:id', protect, modifyComment)

module.exports = commentRouter
