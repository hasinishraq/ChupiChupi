import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.api";
import {
  clearAuth,
  getShareLink,
  getToken,
  getUser,
  setShareLink,
  setToken,
  setUser,
} from "../utils/storage";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [shareLink, setShareLinkState] = useState(getShareLink());
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(Boolean(token));

  const syncSession = useCallback(({ user: nextUser, token: nextToken, shareLink: nextLink }) => {
    if (nextToken) {
      setToken(nextToken);
      setTokenState(nextToken);
    }

    if (nextUser) {
      setUser(nextUser);
      setUserState(nextUser);
    }

    if (nextLink) {
      setShareLink(nextLink);
      setShareLinkState(nextLink);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
    setShareLinkState(null);
    setTokenState(null);
  }, []);

  const register = useCallback(
    async (payload) => {
      const result = await authApi.register(payload);
      syncSession(result);
      return result;
    },
    [syncSession]
  );

  const login = useCallback(
    async (payload) => {
      const result = await authApi.login(payload);
      syncSession(result);
      return result;
    },
    [syncSession]
  );

  const refreshProfile = useCallback(async () => {
    const result = await authApi.getProfile();
    syncSession(result);
    return result;
  }, [syncSession]);

  const regenerateShareToken = useCallback(async () => {
    const result = await authApi.regenerateShareToken();
    syncSession(result);
    return result;
  }, [syncSession]);

  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const result = await authApi.getProfile();
        if (!ignore) {
          syncSession(result);
        }
      } catch (error) {
        if (!ignore) {
          logout();
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      ignore = true;
    };
  }, [logout, syncSession, token]);

  const value = useMemo(
    () => ({
      user,
      shareLink,
      token,
      loading,
      isAuthenticated: Boolean(token),
      register,
      login,
      logout,
      refreshProfile,
      regenerateShareToken,
    }),
    [user, shareLink, token, loading, register, login, logout, refreshProfile, regenerateShareToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
