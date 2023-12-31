const jwt = require("jsonwebtoken");

const jwtSign = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const isAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(400).send({ message: "Token provided not valid" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(400).send("Token is not supplied");
  }
};

module.exports = { isAuth, jwtSign };
