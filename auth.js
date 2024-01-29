function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login'); // Redirect to login page if not authenticated
  }
}

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    res.redirect('/panel'); // Redirect to login page if not authenticated
  } else {
    next();
  }

}

module.exports = { isAuthenticated, isLoggedIn }