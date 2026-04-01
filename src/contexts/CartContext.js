import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  // Try to load cart from localStorage, otherwise start with an empty array
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  isCartOpen: false,
};

const CartContext = createContext(initialState);

// Define the reducer function to manage cart actions
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existItem = state.cartItems.find(item => item._id === newItem._id);
      const cartItems = existItem
        ? state.cartItems.map(item =>
            item._id === existItem._id ? { ...newItem, quantity: item.quantity + 1 } : item
          )
        : [...state.cartItems, { ...newItem, quantity: 1 }];
      return { ...state, cartItems };
    }
    case 'REMOVE_FROM_CART': {
      const cartItems = state.cartItems.filter(item => item._id !== action.payload._id);
      return { ...state, cartItems };
    }
    case 'UPDATE_QUANTITY': {
      const { _id, quantity } = action.payload;
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const cartItems = state.cartItems.filter(item => item._id !== _id);
        return { ...state, cartItems };
      }
      const cartItems = state.cartItems.map(item =>
        item._id === _id ? { ...item, quantity } : item
      );
      return { ...state, cartItems };
    }
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    default:
      return state;
  }
}

// Create the provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Effect to save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const value = {
    cartItems: state.cartItems,
    isCartOpen: state.isCartOpen,
    addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
    removeFromCart: (product) => dispatch({ type: 'REMOVE_FROM_CART', payload: product }),
    updateQuantity: (product, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { ...product, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  return useContext(CartContext);
};