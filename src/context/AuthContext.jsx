import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/session", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("No autenticado");
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signInWithGoogle = async (token) => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:3000/users/auth/google/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Error con Google login");
    setUser(result.data);
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
    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) {
      setLoading(false);
      throw new Error(result.msg || "Error al iniciar sesión");
    }
    setUser(result.data);
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
    const res = await fetch("http://localhost:3000/users/register", {
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
    console.log(result)

    setUser(result.data);
    setLoading(false);
    return result.data;
  } catch (error) {
    throw new Error(error.message || "Error al registrarse");
  }
  };

  const signOut = async () => {
    setLoading(true);
    await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
