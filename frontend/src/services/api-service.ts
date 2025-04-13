import axios from "axios";

export const auth_api = axios.create({
  baseURL: "http://localhost:3000/auth",
});

export const user_api = axios.create({
  baseURL: "http://localhost:3000/user",
});

export const activities_api = axios.create({
  baseURL: "http://localhost:3000/activities",
});
