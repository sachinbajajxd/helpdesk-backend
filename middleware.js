// Middleware to verify JWT token
module.exports.verifyToken = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ message: 'Token not provided' });
    }
  
    const token = authHeader.split(' ')[1];

    // console.log(token);
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token invalid' });
      }
    //   console.log(decoded);
      req.id = decoded.user._id;
      console.log(req.id,'Req');
      next();
    });
  }
