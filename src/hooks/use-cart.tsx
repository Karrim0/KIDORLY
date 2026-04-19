"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { CartItem, CartState } from "@/types";

const STORAGE_KEY = "kidorly-cart";

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; color?: string; size?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; color?: string; size?: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

function calcTotals(items: CartItem[]): CartState {
  return {
    items,
    total: items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0),
    count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let items: CartItem[];

  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.findIndex(
        (i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
      );
      if (existing >= 0) {
        items = [...state.items];
        items[existing] = {
          ...items[existing],
          quantity: items[existing].quantity + action.payload.quantity,
        };
      } else {
        items = [...state.items, action.payload];
      }
      break;
    }
    case "REMOVE_ITEM":
      items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.color === action.payload.color &&
            i.size === action.payload.size
          )
      );
      break;
    case "UPDATE_QUANTITY":
      items = state.items
        .map((i) =>
          i.productId === action.payload.productId &&
          i.color === action.payload.color &&
          i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
      break;
    case "CLEAR":
      items = [];
      break;
    case "HYDRATE":
      items = action.payload;
      break;
    default:
      return state;
  }

  return calcTotals(items);
}

const initialState: CartState = { items: [], total: 0, count: 0 };

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  addItemAndPersist: (item: CartItem) => CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  /** true after cart has been loaded from localStorage */
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {}
    // Mark as hydrated regardless — even if localStorage was empty
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on every change (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items, isHydrated]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    setIsOpen(true);
  }, []);

  const addItemAndPersist = useCallback((item: CartItem): CartItem[] => {
    let currentItems: CartItem[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) currentItems = JSON.parse(saved);
    } catch {}

    const existing = currentItems.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.color === item.color &&
        i.size === item.size
    );

    if (existing >= 0) {
      currentItems[existing] = {
        ...currentItems[existing],
        quantity: currentItems[existing].quantity + item.quantity,
      };
    } else {
      currentItems = [...currentItems, item];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
    } catch {}

    dispatch({ type: "HYDRATE", payload: currentItems });

    return currentItems;
  }, []);

  const removeItem = useCallback((productId: string, color?: string, size?: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, color, size } });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, color?: string, size?: string) => {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, color, size, quantity } });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        addItemAndPersist,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}