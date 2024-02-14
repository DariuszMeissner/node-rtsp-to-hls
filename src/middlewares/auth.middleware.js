module.exports = function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login'); // Redirect to login page if not authenticated
  }
}