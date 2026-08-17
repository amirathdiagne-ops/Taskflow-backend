const Joi = require('joi')

const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).required()
        .messages({
            'string.min': "le nom doit faire au moins deux caractères ",
            'any.required': "le nom est obligatoire "
        }),
    email: Joi.string().email().required().lowercase().trim()
        .messages({
            'string.email': "Veuillez mettre un email correct",
            'any.required': 'l\'addresse email est obligatoire'
        }),
    password: Joi.string().required().min(8).max(50)
        .messages({
            'string.min': "le mot de passe doit faire au moins 8 caractères",
            'string.max': "le mot de passe ne doit pas depasser 5O caractère",
            'any.required': "Un  mot de passe est requis"
        })
})

const loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': "Entrer un address email valide pour vous connecter ",
            'any-required': "l\'email est requis pour se connecter"
        }),
    password: Joi.string().required()
        .messages({
            'any.required': "le mot de passe est obligatvre pour se connecter "
        })
})

module.exports = { registerSchema, loginSchema }