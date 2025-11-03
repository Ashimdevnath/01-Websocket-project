"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            console.log(errorMessages);
            let finalMessage;
            if (errorMessages.length === 1) {
                finalMessage = errorMessages[0];
            }
            else {
                finalMessage = "All fields are required";
            }
            res.status(400).json({ message: finalMessage });
            return;
        }
        next();
    };
};
exports.default = validateRequest;
