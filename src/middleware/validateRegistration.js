// validation.js
import { body, validationResult } from "express-validator";

const registrationValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
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
