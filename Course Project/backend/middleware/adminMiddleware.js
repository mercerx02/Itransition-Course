const adminMiddleware = async (req, res, next) => {
  console.log('User', req.user)
    if (req.user && req.user.is_admin === true) {
      next();
    } else {
      res.status(403).json({ message: 'Error. Need admin rights' });
    }
  };

module.exports = {
  adminMiddleware
}
