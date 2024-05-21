"use client";
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface CartItem {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  doesCartExists: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a contextProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    doesCartExists();
    fetch("http://localhost:8080/shoppingCart")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCartItems(data);
      })
      .catch((error) => {
        console.error("There was a problem fetching the cart:", error);
      });
  }, []);

  const addToCart = (item: CartItem) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    let sessionId: string | undefined | null = doesCartExists();

    if (sessionId === undefined) {
      sessionId = localStorage.getItem("sessionId");
    }

    if (isItemInCart) {
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCartItems);
    } else {
      const newCartItem = { ...item, quantity: 1, sessionId };
      setCartItems([...cartItems, newCartItem]);

      axios
        .post("http://localhost:8080/addToCart", newCartItem)
        .catch((error) => {
          console.error("Error adding item to cart:", error);
        });
    }
  };

  const removeFromCart = (item: CartItem) => {
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem.id !== item.id
    );
    setCartItems(newCartItems);

    axios.post("http://localhost:8080/", newCartItems).catch((error) => {
      console.error("Error adding item to cart:", error);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  //om det inte finns en cart staras det en och man får ett sessionsid  när man tycker på handlaknappen på patterns eller knitwear

  const doesCartExists = () => {
    console.log("i början av deosssjs");
    if (cartItems.length === 0) {
      let sessionId = localStorage.getItem("sessionId");
      console.log(sessionId);

      if (!sessionId) {
        console.log("hej");
        sessionId = uuidv4();
        localStorage.setItem("sessionId", sessionId);

        fetch("http://localhost:8080/createSessionAndCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        }).catch((error) => {
          console.error("Error starting session and creating cart:", error);
        });
      }
      return sessionId;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        doesCartExists,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
