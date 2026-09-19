const express = require('express')
const taskRouter = express.Router({ mergeParams: true })
const { addTask, getTasks, getTasksById, modifyTask, deleteTask, assignedTask } = require('../controllers/tasks.controller')
const protect = require('../middlewares/protect')
const commentRouter = require('../routes/comment.route')
const checkPermission = require('../middlewares/checkPermission')
taskRouter.use('/:taskId/comments', commentRouter)
taskRouter.get('/', protect, checkPermission, getTasks)
taskRouter.get('/:id', protect, getTasksById)
taskRouter.patch('/:id', protect, modifyTask)
taskRouter.delete('/:id', protect, deleteTask)
taskRouter.put('/:id/assigneTo', protect, assignedTask)
taskRouter.post('/', protect, checkPermission, addTask)


module.exports = taskRouter