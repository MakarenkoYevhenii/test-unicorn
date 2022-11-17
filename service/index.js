const User = require("./schemas/user");

const postNewUser = async (id, password, id_type) => {
  return User.create({ id: id, password, id_type });
};
const getUserByEmail = async (id) => {
  return User.findOne({ id: id });
};
const updateUserById = async (_id, token) => {
  return User.findByIdAndUpdate({ _id }, token);
};
const updateUserByEmail = async (id, token) => {
  console.log(id, token);
  return User.findOneAndUpdate({ id: id }, { token: token });
};
const removeAllTokens = async (token) => {
  return User.updateMany({}, token);
};
const removeToken = async (token) => {
  return User.findOneAndUpdate({ token: token }, (token = ""));
};
const getUserById = async (_id) => {
  console.log(_id);
  return User.findOne({ _id: _id });
};

module.exports = {
  postNewUser,
  getUserByEmail,
  updateUserById,
  removeAllTokens,
  getUserById,
  removeToken,
  updateUserByEmail,
};
