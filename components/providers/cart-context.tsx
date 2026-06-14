"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────
export interface CartProduct {
  id: number;
  name: string;
  price: number | string;
  image_url: string | null;
}

export interface CartItem {
  id: number; // cart_items.id
  product_id: number;
  quantity: number;
  products: CartProduct;
}

export interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  userId: number | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, newQuantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isSessionLoading } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const fetchedRef = useRef(false);

  // ── Computed ───────────────────────────────────────────────────
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => {
    const price =
      typeof item.products.price === "string"
        ? parseFloat(item.products.price)
        : item.products.price;
    return sum + price * item.quantity;
  }, 0);

  // ── Fetch cart from API ────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/carts?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.cart_items || []);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch cart when user is loaded
  useEffect(() => {
    if (!isSessionLoading && user && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchCart();
    }
    if (!isSessionLoading && !user) {
      fetchedRef.current = false;
      setTimeout(() => setItems([]), 0);
    }
  }, [user, isSessionLoading, fetchCart]);

  // ── Add to cart ────────────────────────────────────────────────
  const addToCart = useCallback(
    async (productId: number, quantity: number = 1) => {
      if (!user) {
        toast.error("Please sign in to add items to your bag", {
          action: {
            label: "SIGN IN",
            onClick: () => (window.location.href = "/login"),
          },
        });
        return;
      }

      setIsUpdating(true);
      try {
        const res = await fetch("/api/carts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            productId,
            quantity,
          }),
        });

        if (!res.ok) throw new Error("Failed to add item");

        await fetchCart();
        toast.success("Added to your bag", {
          description: "Item has been added successfully",
        });
        setIsCartOpen(true);
      } catch (err) {
        console.error("Add to cart error:", err);
        toast.error("Failed to add item to bag");
      } finally {
        setIsUpdating(false);
      }
    },
    [user, fetchCart]
  );

  // ── Update quantity ────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (cartItemId: number, newQuantity: number) => {
      setIsUpdating(true);

      // Optimistic update
      setItems((prev) =>
        newQuantity <= 0
          ? prev.filter((item) => item.id !== cartItemId)
          : prev.map((item) =>
              item.id === cartItemId
                ? { ...item, quantity: newQuantity }
                : item
            )
      );

      try {
        const res = await fetch("/api/carts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId, quantity: newQuantity }),
        });

        if (!res.ok) throw new Error("Failed to update");

        // Refetch to sync with server
        await fetchCart();
      } catch (err) {
        console.error("Update quantity error:", err);
        toast.error("Failed to update quantity");
        await fetchCart(); // Revert optimistic update
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchCart]
  );

  // ── Remove item ────────────────────────────────────────────────
  const removeItem = useCallback(
    async (cartItemId: number) => {
      setIsUpdating(true);

      // Optimistic remove
      const prevItems = items;
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));

      try {
        const res = await fetch(`/api/carts?cartItemId=${cartItemId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to remove");

        toast.success("Item removed from bag");
      } catch (err) {
        console.error("Remove item error:", err);
        toast.error("Failed to remove item");
        setItems(prevItems); // Revert
      } finally {
        setIsUpdating(false);
      }
    },
    [items]
  );

  // ── Drawer controls ────────────────────────────────────────────
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((v) => !v), []);

  const value: CartContextType = {
    items,
    cartCount,
    cartTotal,
    isCartOpen,
    isLoading,
    isUpdating,
    userId: user?.id ?? null,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeItem,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
