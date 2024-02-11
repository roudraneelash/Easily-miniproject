// validation.js
import { body, validationResult } from "express-validator";

const registrationValidationRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),
];

const validateRegistration = (req, res, next) => {
  // Run rules
  Promise.all(registrationValidationRules.map((rule) => rule.run(req))).then(
    () => {
      // Show errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render("registrationForm", {
          errorMessage: errors.array()[0].msg,
          formData: req.body,
        });
      } else {
        next();
      }
    }
  );
};

export { validateRegistration };
