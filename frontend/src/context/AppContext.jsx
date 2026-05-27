import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUserState] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

  const setUser = (value) => {
    setUserState(value);
    if (value) localStorage.setItem('user', JSON.stringify(value));
    else localStorage.removeItem('user');
  };

  const persistCart = (value) => {
    setCart(value);
    localStorage.setItem('cart', JSON.stringify(value));
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    const next = existing
      ? cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];
    persistCart(next);
  };

  const updateQuantity = (id, quantity) => {
    persistCart(
      cart
        .map((item) => (item._id === id ? { ...item, quantity: Number(quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => persistCart(cart.filter((item) => item._id !== id));
  const clearCart = () => persistCart([]);
  const logout = () => setUser(null);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <AppContext.Provider
      value={{ user, setUser, logout, cart, addToCart, updateQuantity, removeFromCart, clearCart, total }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
