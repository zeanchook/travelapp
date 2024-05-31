import debug from "debug";
import * as usersAPI from "./users-api";

const log = debug("mern:utilities:users-service");

export function getToken() {
  // getItem returns null if there's no string
  const token = localStorage.getItem("token");
  if (!token) return null;
  // Obtain the payload of the token
  const payload = JSON.parse(atob(token.split(".")[1]));
  // A JWT's exp is expressed in seconds, not milliseconds, so convert
  if (payload.exp < Date.now() / 1000) {
    // Token has expired - remove it from localStorage
    localStorage.removeItem("token");
    return null;
  }
  return token;
}

export function getUser() {
  const token = getToken();
  console.log(token)
  return token ? JSON.parse(atob(token.split(".")[1])).user : null;
}

export const signUp = async (userData) => {
  log("userData: %o", userData);

  const token = await usersAPI.signUp(userData);
  log("token: %o", token);

  localStorage.setItem("token", token);
  return getUser();
};

export const logOut = () => {
  localStorage.removeItem("token");
};

export const login = async (email, password) => {
  log("%s, %s", email, password);
  const user = { email, password };

  console.log("ehrer")
  const token = await usersAPI.login(user);

  if(token.msg === undefined)
  {
    log("token: %o", token);
    localStorage.setItem("token", token);
    return getUser();
  }
  
  return token.msg
  
};

export const checkToken = async () => {
  const dateStr = await usersAPI.checkToken();
  console.log(dateStr);
  return new Date(dateStr);
};
