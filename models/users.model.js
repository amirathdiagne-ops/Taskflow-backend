const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim : true,
        lowercase : true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: {
        type: String,
        default: "https://dicebear.com"
    },
    refreshToken : {
        type : String,
        default : null
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'

    }
},
    {
        timestamps: true
    }
)


userSchema.pre('save', async function () {
        if (!this.isModified('password')) return
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (entredPassword) {
    return await bcrypt.compare(entredPassword, this.password)
}

const User = mongoose.model('User', userSchema)


module.exports = User