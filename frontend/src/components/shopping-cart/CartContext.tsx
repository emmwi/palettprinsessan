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
import { error } from "console";

interface CartItem {
  image: string;
  name: string;
  price: number;
  quantity: number;
  item_id: number;
}

interface CartSessions {
  cart_id: number;
  session_id: string;
}

interface CartContextProps {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  doesCartExists: () => void;
  getCartItems: () => void;
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
  const [sessionId, setSessionId] = useState<CartSessions[]>([]);

  //hämtar om det finns carts.
  useEffect(() => {
    fetchCarts();
  }, []);

  //ska jag behålla denna?
  const fetchCarts = () => {
    fetch("http://localhost:8080/shoppingCart")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("data från fetchcartitem", data);
        setSessionId(data);
      })
      .catch((error) => {
        console.error("There was a problem fetching the cart:", error);
      });
  };

  //om det inte finns en cart staras det en och man får ett sessionsid  när man tycker på handlaknappen på patterns eller knitwear
  const doesCartExists = () => {
    //  Kollar ifall det finns varor i en varukorg
    if (cartItems.length === 0) {
      let sessionId = localStorage.getItem("sessionId");
      console.log(sessionId);

      if (!sessionId) {
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
    } else {
      return localStorage.getItem("sessionId");
    }
  };
  //hämtar det som finns i shoppingcart,
  async function getCartItems() {
    try {
      //kollar om det finns en cart eller inte
      const sessionId = doesCartExists();
      if (!sessionId) {
        throw new Error("session Id  finns inte");
      }
      console.log("session id i get cartitems", sessionId);
      const response = await axios.get("http://localhost:8080/getCartItems", {
        params: { sessionId },
      });
      console.log(response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  }
  //Lägga till i shoppingCart
  const addToCart = (item: CartItem) => {
    const isItemInCart = cartItems.find((cartItem) => {
      console.log("cartitems", cartItems);
      console.log("Current cartItem id in addtocart:", cartItem.item_id);
      console.log("Item id to check in addtocart:", item.item_id);
      return cartItem.item_id === item.item_id;
    });
    console.log(isItemInCart);
    let sessionId: string | undefined | null = doesCartExists();

    if (sessionId === undefined) {
      sessionId = localStorage.getItem("sessionId");
    }

    if (!isItemInCart) {
      const newCartItem = { ...item, quantity: 1, sessionId };

      axios
        .post("http://localhost:8080/addToCart", newCartItem)
        .then((response) => {
          console.log("svar från backend", response.data);
          //sätter setCartItems med nytt värde efter att post har gjorts till backendet.
          setCartItems([...cartItems, newCartItem]);
        })
        .catch((error) => {
          console.error("Error adding item to cart:", error);
        });
    }
    // else {
    //     const updatedCartItems = cartItems.map((cartItem) =>
    //     cartItem.id === item.id
    //       ? { ...cartItem, quantity: cartItem.quantity + 1 }
    //       : cartItem
    //   );
    //   setCartItems(updatedCartItems);
    // }
  };

  const removeFromCart = (item: CartItem) => {
    // const sessionId = localStorage.getItem("sessionId");
    console.log(cartItems);

    // if (!sessionId) {
    //   console.error("Session ID is missing or invalid");
    //   return;
    // }
    // console.log(sessionId);
    const itemToRemove = cartItems.filter((cartItem) => {
      console.log("Current cartItem id:", cartItem.item_id);
      console.log("Item id to remove:", item.item_id);
      return cartItem.item_id !== item.item_id;
    });
    console.log("vad gör denna delete", itemToRemove);

    const sessionId = localStorage.getItem("sessionId");
    axios
      .post("http://localhost:8080/deleteItemFromCart", {
        item_id: item.item_id,
        sessionId: sessionId,
      })
      .then((response) => {
        console.log("svar från backend gällande removeFromCart", response.data);
        //uppdaterar setCartItem efter att det tagits bort från databasen.
        setCartItems(itemToRemove);
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
      });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  //ger rätt summa för allt man köpt.
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price);
      // Kontrollera att price är ett giltigt nummer
      if (isNaN(price)) {
        console.error("Invalid price for item", item);
        return total;
      }
      return total + price;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        setCartItems,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        doesCartExists,
        getCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
