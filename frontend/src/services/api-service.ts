import axios from "axios";

export const auth_api = axios.create({
  baseURL: "https://fitmeet-back.vercel.app/api/auth",
});

export const user_api = axios.create({
  baseURL: "https://fitmeet-back.vercel.app/api/user",
});

export const activities_api = axios.create({
  baseURL: "https://fitmeet-back.vercel.app/api/activities",
});
