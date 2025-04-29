import axios from "axios";

export const auth_api = axios.create({
  baseURL: "http://10.0.2.2:3000/auth",
});

export const user_api = axios.create({
  baseURL: "http://10.0.2.2:3000/user",
});

export const activities_api = axios.create({
  baseURL: "http://10.0.2.2:3000/activities",
});
