require("dotenv").config();
require("./config/database");
const { faker } = require("@faker-js/faker");

const User = require("./models/user");

const users = [
  { email: "simon@ga.co", name: faker.person.fullName(), password: "123" },
  { email: "faith@ga.co", name: faker.person.fullName(), password: "123" },
];

const main = async () => {
  await User.deleteMany({});

  await User.create(users);
};

main();
