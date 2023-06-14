const jwt = require("jsonwebtoken");


const verify = (req, res, next) => {
  console.log(5);
  //console.log(req.cookies.jwt-token);
  const token=req.cookies['jwt-token(google)']||req.body.token  || req.query.token || req.params.token || req.headers["x-auth-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token,  "secretKey");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verify;