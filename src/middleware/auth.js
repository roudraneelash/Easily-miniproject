const auth = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect("/login");
  }
};
export default auth;
