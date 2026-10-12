
import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

function readSavedUser() {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(readSavedUser);

  const login = (newToken, userData) => {
    if (!newToken || !userData) {
      throw new Error("Missing token or user information");
    }

    const normalizedUser = {
      ...userData,
      role: String(userData.role || "USER").toUpperCase(),
    };

    localStorage.setItem("token", newToken);
    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );

    setToken(newToken);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: Boolean(token && user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
