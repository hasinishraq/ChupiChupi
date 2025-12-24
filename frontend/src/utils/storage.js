const TOKEN_KEY = "ngl_token";
const USER_KEY = "ngl_user";
const SHARE_LINK_KEY = "ngl_share_link";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

const getShareLink = () => localStorage.getItem(SHARE_LINK_KEY);

const setShareLink = (link) => {
  if (link) {
    localStorage.setItem(SHARE_LINK_KEY, link);
  }
};

const clearShareLink = () => {
  localStorage.removeItem(SHARE_LINK_KEY);
};

const clearAuth = () => {
  clearToken();
  clearUser();
  clearShareLink();
};

export {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
  getShareLink,
  setShareLink,
  clearShareLink,
  clearAuth,
};
