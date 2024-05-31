import sendRequest from "./send-request";

const BASE_URL = "/api/users";

export function signUp(userData) {
  return sendRequest("/api/myusers/signup", "POST", userData);
}

export function login(credentials) {
  return sendRequest(`/api/myusers/login`, "POST", credentials);
}

export function checkToken() {
  return sendRequest(`${BASE_URL}/check-token`);
}
