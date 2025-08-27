import { body, validationResult } from 'express-validator';

// Reglas de validación para el formulario de registro
export const registerValidationRules = () => {
    return [
        // La identificación no debe estar vacía y debe ser alfanumérica
        body('identificacion').notEmpty().withMessage('La identificación es obligatoria.').isAlphanumeric().withMessage('La identificación solo debe contener letras y números.'),

        // El nombre no debe estar vacío
        body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),

        // El email debe ser un correo válido
        body('email').isEmail().withMessage('Debe proporcionar un email válido.'),

        // El teléfono debe ser numérico
        body('telefono').isNumeric().withMessage('El teléfono solo debe contener números.'),

        // La contraseña debe tener al menos 6 caracteres
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),

        // El cargo no debe estar vacío
        body('cargo').notEmpty().withMessage('Debe seleccionar un cargo.'),
    ];
};

// Middleware que procesa los errores de validación
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // Si no hay errores, continúa con el siguiente middleware/controlador
    }

    // Si hay errores, los extraemos y los enviamos como respuesta
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};