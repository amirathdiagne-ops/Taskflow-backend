const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['planning', 'active', 'completed', 'archived'], default: 'active' },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
]
},{
    timestamps : true
}
)

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
