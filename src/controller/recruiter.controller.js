import recruiterModel from "../model/recruiter.model.js";

class recruiterController {
  static register(req, res) {
    res.render("registrationForm", { formData: null, errorMessage: null });
  }
  static handleRegistration(req, res) {
    const { name, email, password } = req.body;
    const newUser = new recruiterModel(name, email, password);
    users.push(newUser);
    // res.send(`registration form submitted ${users.length}`)
    res.redirect("/login");
  }
  static Login(req, res) {
    res.render("loginForm", { formData: null, errorMessage: null });
  }
  static handleLogin(req, res) {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.render("loginForm", {
        errorMessage: "User not found. Please register",
        formData: req.body,
      });
    }

    if (user.password !== password) {
      return res.render("loginForm", {
        errorMessage: "Incorrect password. Please try again.",
        formData: req.body,
      });
    }

    // Create session
    req.session.user = user.name;

    res.redirect("/");
  }
  static handleLogout(req, res) {
    req.session.destroy((err) => {
      if (!err) {
        res.redirect("/login");
      }
    });
  }
}
const users = [];
export default recruiterController;
