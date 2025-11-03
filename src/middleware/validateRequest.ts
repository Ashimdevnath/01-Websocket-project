import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from "joi";

const validateRequest = (schema: Joi.ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      console.log(errorMessages);

      let finalMessage: string;

      if (errorMessages.length === 1) {
        finalMessage = errorMessages[0];
      } else {
        finalMessage = "All fields are required";
      }

      res.status(400).json({ message: finalMessage });
      return;
    }

    next();
  };
};

export default validateRequest;