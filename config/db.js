const mongoose = require ('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('connecté avec succès')
    } catch (error) {
        console.error('erreur lors de la connexion', error.message)
    }
}

module.exports = connectDB