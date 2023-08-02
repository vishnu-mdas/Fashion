const adminSession = (req, res, next) => {
  console.log("nnnnnnnnnnnnnnnnmmmmmm", req.session.adminLogin);
  if (req.session.adminLogin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};
const adminLogin = (req, res, next) => {
  if (req.session.adminLogin) {
    res.redirect("/admin");
  } else {
    next();
  }
};

const userLoginSession = (req, res, next) => {
  if (req.session.userLogin) {
    // Check if the user is blocked
    if (req.session.userLogin.isBlocked) {
      return res.render('user/login', { blockedMessage: 'User is blocked' });
    }
    // User is not blocked, redirect to the homepage or other authorized page
    return res.redirect("/");
  } else {
    // If the user is not logged in, proceed to the next middleware/route handler
    next();
  }
};


const checkBlocked = (req, res, next) => {
  // Assuming you have the user object available in req.session.user
  if (req.session.user.isBlocked) {
    // Redirect to the login page with a query parameter indicating that the user is blocked
    return res.redirect('/login?blocked=true');
  }
  // If the user is not blocked, proceed to the next middleware/route handler
  next();
};


module.exports = { adminSession,adminLogin,userLoginSession,checkBlocked}
