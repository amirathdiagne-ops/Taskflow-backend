const mongoose = require('mongoose')
const Project = require('./projects.model')
const User = require('./users.model')

const taskSchema = new mongoose.Schema({
    title : {type : String, required : true},
    description : {type : String, required : true},
    project : { type : mongoose.Schema.Types.ObjectId, ref : "Project", required : true},
    assignedTo : {type : mongoose.Schema.Types.ObjectId, ref : "User", default : null},
    status : {type : String, enum : ["todo", "in_progress", "done"], default : "todo"},
    priority : {type : String, enum : ["low", "high", "medium", "urgent"], default : "medium"},
    dueDate : {type : Date},
    createdBy : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true }
},{
    timestamps : true
}
)
const Task = mongoose.model('Task', taskSchema)
module.exports = Task 