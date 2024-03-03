module.exports = function isLoggedIn(req, res, next) {
  if (req.session.user) {
    res.redirect('/panel'); // Redirect to login page if not authenticated
  } else {
    next();
  }
}
