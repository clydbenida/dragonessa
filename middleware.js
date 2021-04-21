module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store the urlheaders
    
    if (req.originalUrl.includes('addtocart')){
      req.session.returnTo = `/products/${req.params.productId}`;
    } else {
      req.session.returnTo = req.originalUrl;
    }
      req.flash('error', 'You must be signed in first!')
      return res.redirect('/login')
    
  }
  next();
}