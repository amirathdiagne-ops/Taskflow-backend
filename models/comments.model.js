const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    task: {type : String, required: true, ref : "Task"},
    author : {type: String, required: true, ref : "User"}
}, {timestamps : true})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment