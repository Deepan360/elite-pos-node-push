function isAuthenticated(req, res, next) {
  if (!req.session || !req.session.userRole) {
    return res.redirect("/restricted"); // Redirect to login if not authenticated
  }
  next();
}

module.exports = { isAuthenticated }; // ✅ Export the middleware function
 