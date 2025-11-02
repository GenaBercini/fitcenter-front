import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchActiveCart = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/cart/${user.id}`);
      if (data?.data) {
        setCart(data.data);
      }
    } catch (err) {
      console.error("Error al obtener carrito:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!cart?.id) {
      console.warn("No hay carrito activo para agregar producto");
      return;
    }
    try {
      const { data } = await axios.post(`${API_URL}/cart/add/${cart.id}`, {
        productId,
      });
      setCart(data.data);
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  };

const decreaseQuantity = async (productId) => {
  if (!cart?.id) return;
  try {
    const { data } = await axios.delete(`${API_URL}/cart/remove/${cart.id}`, {
      data: {
      productId: productId,
      removeAll: false,
    }
    });
    await fetchActiveCart();
  } catch (err) {
    console.error("Error al disminuir cantidad:", err);
  }
};

const removeProductCompletely = async (productId) => {
  if (!cart?.id) return;
  try {
    console.log("hola")
    const { data } = await axios.delete(`${API_URL}/cart/remove/${cart.id}`, {
      data: {
      productId: productId,
      removeAll: true,
    }
    });
    await fetchActiveCart();
  } catch (err) {
    console.error("Error al eliminar producto:", err);
  }
};

  const checkoutCart = async () => {
    if (!cart?.id || !user?.id) return;
    try {
      const { data } = await axios.post(`${API_URL}/cart/checkout/${user.id}`, {
        cartId: cart.id,
      });
      return data.data.url;
    } catch (err) {
      console.error("Error al comprar carrito:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchActiveCart();
    } else {
      setCart(null);
    }
  }, [user?.id]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        fetchActiveCart,
        checkoutCart,
        decreaseQuantity,
        removeProductCompletely
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);


