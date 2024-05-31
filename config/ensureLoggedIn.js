const { getUser } = require("./checkToken");

module.exports = function (req, res, next) {
  console.log("5",req.body)
  const user = getUser(req, res);
  console.log(user)
  if (!user) return res.status(401).json("Unauthorized");
  next();
};
