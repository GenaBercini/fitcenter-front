import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/users/session`, {
          credentials: "include",
          headers,
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          }
          return;
        }

        const data = await res.json();
        if (data?.data) {
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
        }
      } catch (err) {
        console.error("Error al obtener sesión:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signInWithGoogle = async (token) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/auth/google/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error con Google login");

      if (token) localStorage.setItem("token", token);
      if (result.token) localStorage.setItem("token", result.token);
      if (result.data) {
        localStorage.setItem("user", JSON.stringify(result.data));
        setUser(result.data);
      }
      return result.data;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      throw new Error("Por favor, complete todos los campos");
    }
    const res = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) {
      setLoading(false);
      throw new Error(
        result.msg || result.message || "Error al iniciar sesión",
      );
    }
    if (result.token) localStorage.setItem("token", result.token);
    if (result.data) {
      localStorage.setItem("user", JSON.stringify(result.data));
      setUser(result.data);
    }
    setLoading(false);
    return result.data;
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      if (!userData.email || !userData.password) {
        setLoading(false);
        throw new Error("Por favor, complete todos los campos");
      }
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const result = await res.json();
      if (!res.ok) {
        setLoading(false);
        throw new Error(result.message || "Error al registrarse");
      }

      if (result.token) localStorage.setItem("token", result.token);
      if (result.data) {
        localStorage.setItem("user", JSON.stringify(result.data));
        setUser(result.data);
      }
      setLoading(false);
      return result.data;
    } catch (error) {
      throw new Error(error.message || "Error al registrarse");
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
