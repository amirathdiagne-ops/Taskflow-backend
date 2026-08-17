const Joi = require('joi')
const AppError = require('../utils/appError')
const validator = (schema) => (req, res, next) => {
    console.log('hello joi marche')
    try {
        const { value, error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });
        

        if (error) {
            
            const messages = error.details.map(m => m.message).join(' , ')
            console.log(messages)
            return next(new AppError(messages, 400));
        }

        req.body = value;
        next();
    } catch (err) {
        console.log('--- ERREUR DANS LE VALIDATEUR JOI ---', err);
        next(err);
    }
};
module.exports =  validator