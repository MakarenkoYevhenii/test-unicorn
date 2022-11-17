const Joi = require("joi");
const service = require("../service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const newUserValidation = (data) => {
  if (!data.id) {
    return { error: { message: "409" } };
  }
  const checkId = (data) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (data.id.match(regexEmail)) {
      return { email: data.id, password: data.password };
    }
    return { phone: data.id, password: data.password };
  };
  const newData = checkId(data);
  const schema = Joi.object({
    email: Joi.string().min(2).max(255).email(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/),
    password: Joi.string().min(2).max(20).required(),
  });
  return schema.validate(newData);
};

const signup = async (req, res) => {
  const { error } = newUserValidation(req.body);
  const { SECRET_KEY } = process.env;
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const { id, password } = req.body;
  const typeOfId = id.match(regexEmail) ? "email" : "phone";
  const hashPass = async (password) => {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  };
  if (!error) {
    try {
      const result = await service.postNewUser(
        id,
        await hashPass(password),
        typeOfId
      );
      const token = jwt.sign({ _id: result._id }, SECRET_KEY, {
        expiresIn: "10m",
      });
      const tokenUpdate = await service.updateUserByEmail(id, token);
      return res.status(201).json({
        user: {
          token: token,
        },
      });
    } catch (e) {
      return res.status(409).json({
        message: e.message,
      });
    }
  }
  res
    .status(400)
    .json({ message: "Ошибка от Joi или другой библиотеки валидации" });
};

const signin = async (req, res, next) => {
  const { SECRET_KEY } = process.env;
  const { error } = newUserValidation(req.body);
  const { id, password } = req.body;
  if (!error) {
    try {
      const result = await service.getUserByEmail(id);
      if (await bcrypt.compare(password, result.password)) {
        const payload = {
          id: result._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });
        const findAndUpdate = await service.updateUserById(result._id, {
          token,
        });
        return res.status(200).json({
          token: token,
        });
      }
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    } catch (error) {
      console.log(error);
    }
  }
  return res.status(400).json({ message: error });
};
const logout = async (req, res, next) => {
  if (req.query.all) {
    try {
      await service.removeAllTokens({ token: "" });
      return res.status(204).json({});
    } catch (error) {
      return res.status(401).json({ message: error });
    }
  }

  try {
    const { token } = req.user;
    await service.removeToken(token);
    return res.status(204).json({});
  } catch (error) {
    next(error);
    return res.status(401).json({});
  }
};
const current = async (req, res, next) => {
  const { id, id_type } = req.user;
  try {
    return res.status(200).json({
      id,
      id_type,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  logout,
  current,
};
