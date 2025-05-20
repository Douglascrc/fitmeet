import axios from "axios";

export const auth_api = axios.create({
  baseURL: "https://fitmeet.vercel.app",
});

export const user_api = axios.create({
  baseURL: "https://fitmeet.vercel.app",
});

export const activities_api = axios.create({
  baseURL: "https://fitmeet.vercel.app",
});
