import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';

interface Produce {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  farmer: {
    name: string;
    cooperative: {
      name: string;
      district: string;
    };
  };
  isActive: boolean;
  category?: string;
}

interface CartItem {
  produce: Produce;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Produce) => void;
  updateQuantity: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('agrolink-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('agrolink-cart');
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('agrolink-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (produce: Produce) => {
    const existingItem = items.find(item => item.produce.id === produce.id);
    if (existingItem) {
      if (existingItem.quantity >= produce.quantity) {
        toast.error('Cannot exceed available stock');
        return;
      }
      setItems(items.map(item => 
        item.produce.id === produce.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, { produce, quantity: 1 }]);
    }
    toast.success(`${produce.name} added to cart`);
    setIsDrawerOpen(true);
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
    } else {
      setItems(items.map(item => 
        item.produce.id === id 
          ? { ...item, quantity: Math.min(qty, item.produce.quantity) }
          : item
      ));
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.produce.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.produce.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      updateQuantity, 
      removeItem, 
      clearCart, 
      total, 
      itemCount,
      isDrawerOpen,
      setIsDrawerOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
