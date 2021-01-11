
const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretstar";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {

    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    // verification and user data aquisition
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      const user = data;
      return { user };
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};