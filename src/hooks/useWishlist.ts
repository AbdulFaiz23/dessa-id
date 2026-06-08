"use client";

import { useState, useEffect } from "react";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Membaca dari localStorage hanya di client-side (setelah komponen mount)
    const stored = localStorage.getItem("dessa_wishlist");
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        setWishlist([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("dessa_wishlist", JSON.stringify(newWishlist));
      
      // Dispatch custom event to sync between components (e.g. Navbar counter)
      window.dispatchEvent(new Event("wishlist_updated"));
      return newWishlist;
    });
  };

  const isSaved = (id: string) => wishlist.includes(id);

  return { wishlist, toggleWishlist, isSaved, isLoaded };
}
