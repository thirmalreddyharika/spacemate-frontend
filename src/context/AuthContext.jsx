
import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

function readSavedUser() {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
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

    // Remove these too if older code used them.
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("isLoggedIn");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// The shared hook is intentionally exported beside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
