const { getUser } = require("./checkToken");

module.exports = function (req, res, next) {
  const user = getUser(req, res);
  if (!user) return res.status(401).json("Unauthorized");
  next();
};
