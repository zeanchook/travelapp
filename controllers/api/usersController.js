const debug = require("debug")("mern:controllers:api:usersController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const { getUser } = require("../../config/checkToken");

const createJWT = (user) =>
  jwt.sign({ user }, process.env.SECRET, { expiresIn: "6h" });

const create = async (req, res) => {
  debug("body: %o", req.body);
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    // debug("user: %o", user);
    console.log("line17",user)
    const token = createJWT(user);
    res.status(201).json(token);
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user === null) {
    console.log("here?")
    res.status(401).json({ msg: "No User Found" });
    console.log("here?")
    return;
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    const token = createJWT(user);
    res.json(token);
  } else {
    res.status(401).json({ msg: "Password incorrect" });
  }
};

const checkToken = (req, res) => {
  const user = getUser(req, res); //res.locals.user;
  res.json({ user });
};

module.exports = {
  create,
  login,
  checkToken,
};
