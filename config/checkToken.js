const jwt = require("jsonwebtoken");

const storeUser = (req, res, user) => {
  res.locals.user = user;
  // console.log("user?",user)
};

const getUser = (req, res) => {
  return res.locals.user;
};

const checkTokenMiddleware = (req, res, next) => {
  const header = req.get("Authorization") || "";
  const token = header.replace("Bearer ", "");
  // console.log("this has always been use",header,token)
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    // console.log("18",payload.user);
    storeUser(req, res, payload.user);
    next();
  } catch (error) {
    // res.status(401).json({ error });
    storeUser(req, res, null);
    next();
  }
};

module.exports = {
  checkTokenMiddleware,
  storeUser,
  getUser,
};
