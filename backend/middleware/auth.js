const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('token ', token);
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    console.log('decodedToken ', decodedToken)
    const userId = decodedToken.userId;
    console.log('userId ', userId)
    req.auth = {
           userId: userId
       };
    console.log('req.auth ', req.auth)
    next();
  } catch {
    console.log('Something else get wrong!');
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};