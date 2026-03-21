import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter(i => i._id !== itemId));
  };
  
  const decrementQty = (itemId) => {
    setCart((prev) => {
      const item = prev.find(i => i._id === itemId);
      if (item && item.qty === 1) {
        return prev.filter(i => i._id !== itemId);
      }
      return prev.map(i => 
        i._id === itemId ? { ...i, qty: i.qty - 1 } : i
      );
    });
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decrementQty, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
