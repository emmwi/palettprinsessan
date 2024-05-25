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
  // const [sessionId, setSessionId] = useState<CartSessions[]>([]); tar troligen bort detta också

  //ska jag behålla denna, tar troligen bort denna?
  // const fetchCarts = () => {
  //   fetch("http://localhost:8080/shoppingCart")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("data från fetchcartitem", data);
  //       setSessionId(data);
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem fetching the cart:", error);
  //     });
  // };

  //klar 20240525
  const doesCartExists = () => {
    //  sätter sessionId till sessionId som finns i local storage
    let sessionId = localStorage.getItem("sessionId");
    console.log(sessionId);
    //om det inte finns ett sessionId i localstorage, sätts ett sessionId och sättes till localstorage
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
    //returnerar sessionId
  };
  //hämtar det som finns i shoppingcart, klart 20240525
  async function getCartItems() {
    try {
      //kollar om det finns en cart eller inte
      const sessionId = doesCartExists();
      if (!sessionId) {
        throw new Error("session Id  finns inte");
      }
      //skicka en get till backend och skicka med sessionId som query med params
      const response = await axios.get("http://localhost:8080/getCartItems", {
        params: { sessionId },
      });
      //sätter cartItems till den datan som finns i cart_items tabellen
      console.log(response.data, "data från get cartitems");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error vid hämtning av varukorgen:", error);
    }
  }

  //Lägga till i shoppingCart - be om hjälp på denna
  const addToCart = (item: CartItem) => {
    //kollar om varan finns i varukorgen eller inte
    const isItemInCart = cartItems.find((cartItem) => {
      return cartItem.item_id === item.item_id;
    });
    //tilldelar sessionId till det som finns när man kör doesCartExists
    const sessionId: string | undefined | null = doesCartExists();
    //om item inte finns i cart läggs den till i newCartItem
    if (!isItemInCart) {
      // const newCartItem = { ...item, quantity: 1, sessionId };
      //kör en post med newCartItem till backend och därefter uppdateras det på frontend med setCartItems
      axios
        .post("http://localhost:8080/addToCart", {
          ...item,
          quantity: 1,
          sessionId,
        })
        .then((response) => {
          console.log("AddToCart response", response.data);
          setCartItems([...cartItems, response.data]);
        })

        .catch((error) => {
          console.error("Error adding item to cart:", error);
        });
    }
    //för att kunna lägga till flera varor
    // else {
    //   const updatedCartItems = cartItems.map((cartItem) =>
    //     cartItem.item_id === item.item_id
    //       ? { ...cartItem, quantity: cartItem.quantity + 1 }
    //       : cartItem
    //   );
    //   setCartItems(updatedCartItems);
    // }
  };

  // Funkar inte, be om hjälp
  // const addToCart = (item: CartItem) => {
  //   //kollar om varan finns i varukorgen eller inte
  //   const isItemInCart = cartItems.find((cartItem) => {
  //     return cartItem.item_id === item.item_id;
  //   });
  //   //tilldelar sessionId till det som finns när man kör doesCartExists
  //   const sessionId: string | undefined | null = doesCartExists();
  //   //om item  finns i cart läggs den till i updatedCartimes
  //   if (isItemInCart) {
  //     const updatedCartItems = cartItems.map((cartItem) =>
  //       cartItem.item_id === item.item_id
  //         ? { ...cartItem, quantity: cartItem.quantity + 1 }
  //         : cartItem
  //     );
  //     setCartItems(updatedCartItems);
  //   } else {
  //     // const newCartItem = { ...item, quantity: 1, sessionId };
  //     //kör en post med newCartItem till backend och därefter uppdateras det på frontend med setCartItems
  //     axios
  //       .post("http://localhost:8080/addToCart", {
  //         ...item,
  //         quantity: 1,
  //         sessionId,
  //       })
  //       .then((response) => {
  //         console.log("AddToCart response", response.data);
  //         setCartItems([...cartItems, response.data]);
  //       })

  //       .catch((error) => {
  //         console.error("Error adding item to cart:", error);
  //       });
  //   }
  // };

  const removeFromCart = (item: CartItem) => {
    //filtererar items för att hitta det som ska tas bort
    const itemToRemove = cartItems.filter((cartItem) => {
      return cartItem.item_id !== item.item_id;
    });
    //sätter sessionId för att skicka med till backend.
    const sessionId = localStorage.getItem("sessionId");
    axios
      .post("http://localhost:8080/deleteItemFromCart", {
        item_id: item.item_id,
        sessionId: sessionId,
      })
      .then((response) => {
        console.log("deleteItemFromCart response", response.data);
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
