import { get, post } from "./client";

const register = (payload) => post("/auth/register", payload);
const login = (payload) => post("/auth/login", payload);
const getProfile = () => get("/auth/me");
const regenerateShareToken = () => post("/auth/share-token", {});

export { register, login, getProfile, regenerateShareToken };
