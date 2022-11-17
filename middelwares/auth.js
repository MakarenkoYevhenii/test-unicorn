const jwt = require("jsonwebtoken");
const { getUserById } = require("../service/index.js");
const dotenv = require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      return res.status(401).json({
        message: "Not bearer",
      });
    }

    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await getUserById(id);
    if (!user || user.token !== token) {
      return res.status(401).json({
        message: "Not user===usertoken",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = auth;
