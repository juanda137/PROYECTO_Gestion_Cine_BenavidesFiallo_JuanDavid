import { body, validationResult } from 'express-validator';

export const registerValidationRules = () => {
    return [
        body('identificacion').notEmpty().withMessage('La identificación es obligatoria.').isAlphanumeric().withMessage('La identificación solo debe contener letras y números.'),

        body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),

        body('email').isEmail().withMessage('Debe proporcionar un email válido.'),

        body('telefono').isNumeric().withMessage('El teléfono solo debe contener números.'),

        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),

        body('cargo').notEmpty().withMessage('Debe seleccionar un cargo.'),
    ];
};

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};