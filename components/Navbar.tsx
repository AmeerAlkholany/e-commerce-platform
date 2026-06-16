"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useLenis } from "lenis/react"
import { useCart } from "@/components/providers/cart-context"
import { useAuth } from "@/components/providers/auth-context"

export interface NavLink {
  label: string
  href: string
  isActive?: boolean
}

export interface NavbarProps {
  links?: NavLink[]
  cartCount?: number
}

export function Navbar({ links = [] }: NavbarProps) {
  const { cartCount, openCart } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileOpen])

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href) as HTMLElement;
      if (element && lenis) {
        lenis.scrollTo(element, { offset: -100 })
      }
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 border-b border-transparent py-4",
          isScrolled
            ? "bg-[#121212]/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        )}
      >
        <div className="flex justify-between items-center w-full px-6 md:px-[64px] max-w-[1440px] mx-auto">
          {/* Mobile Hamburger - Left */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="text-white hover:text-primary transition-colors focus:outline-none p-1"
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          </div>

          {/* Left: Brand Logo & Nav Links */}
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="font-black tracking-tighter text-2xl md:text-3xl transition-transform duration-300 hover:scale-[1.03] select-none"
            >
              <span className="text-white">LU</span>
              <motion.span
                className="text-primary"
                animate={{
                  textShadow: isScrolled
                    ? ["0 0 10px rgba(175,255,0,0.5)", "0 0 20px rgba(175,255,0,0.8)", "0 0 10px rgba(175,255,0,0.5)"]
                    : "none",
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                XE
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 ml-6">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  className="relative group text-sm font-medium tracking-wider text-white/80 hover:text-white transition-colors duration-300 py-1 uppercase"
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={false}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search, Wishlist, Account, Cart */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Elegant Search Bar */}
            <div
              ref={searchRef}
              className={cn(
                "relative hidden lg:flex items-center transition-all duration-300 rounded-full bg-white/5 border px-4 py-1.5",
                isSearchActive ? "w-72 border-primary/50 ring-2 ring-primary/20" : "w-52 border-white/10"
              )}
            >
              <Input
                type="text"
                placeholder="Search catalog..."
                className="bg-transparent border-none p-0 h-auto text-sm w-full focus-visible:ring-0 placeholder:text-white/30 text-white focus:outline-none"
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
              />
              <Search className="text-white/60 size-4 ml-2 cursor-pointer opacity-70 hover:opacity-100 hover:text-primary transition-colors" />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/5 hover:text-primary size-9 rounded-full transition-all duration-200 active:scale-90"
                aria-label="Favorites"
                asChild
              >
                <Link href="/products">
                  <Heart className="size-5" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/5 hover:text-primary size-9 rounded-full transition-all duration-200 active:scale-90"
                aria-label="Account"
                asChild
              >
                <Link href={isAuthenticated ? "/profile" : "/login"}>
                  <User className="size-5" />
                </Link>
              </Button>

              {/* Authenticated User Quick Menu */}
              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-2 border-l border-white/10 ml-2 pl-4">
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-[10px] font-bold text-primary tracking-tighter uppercase leading-none">
                      {user?.role === "admin" ? "ADMINISTRATOR" : "VERIFIED CLIENT"}
                    </span>
                    <span className="text-[12px] font-medium text-white/90 truncate max-w-[100px]">
                      {user?.name.split(" ")[0]}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logout()}
                    className="text-[10px] font-bold tracking-widest text-white/40 hover:text-primary hover:bg-transparent px-0 uppercase transition-colors"
                  >
                    Logout
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-white/5 hover:text-primary size-9 rounded-full transition-all duration-200 active:scale-90"
                aria-label="Shopping bag"
                onClick={openCart}
              >
                <ShoppingBag className="size-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Slider Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[80vw] max-w-sm bg-[#121212] border-r border-white/10 shadow-2xl z-50 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex justify-between items-center mb-10">
                  <span className="font-black tracking-tighter text-2xl text-white">
                    LU<span className="text-primary">XE</span>
                  </span>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="text-white hover:text-primary transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="size-6" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="relative flex items-center rounded-lg bg-white/5 border border-white/10 px-3 py-2 mb-8">
                  <Input
                    type="text"
                    placeholder="Search catalog..."
                    className="bg-transparent border-none p-0 h-auto text-sm w-full text-white focus-visible:ring-0"
                  />
                  <Search className="text-white/55 size-4" />
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-6">
                  {links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleLinkClick(link.href, e)}
                      className={cn(
                        "text-lg font-medium tracking-wider uppercase transition-colors py-1 text-white/80 hover:text-primary",
                        link.isActive && "text-primary font-bold border-l-2 border-primary pl-3"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Drawer Footer info */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <p className="text-xs text-white/50 leading-relaxed font-mono">
                  FUEL YOUR AMBITION. Experience clean, high-performance energy curated for the modern active citizen.
                </p>
                <div className="flex gap-4 text-xs font-semibold text-primary">
                  <Link href="/profile" onClick={() => setIsMobileOpen(false)}>MY ACCOUNT</Link>
                  <span>•</span>
                  <Link href="/products" onClick={() => setIsMobileOpen(false)}>CATALOGUE</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to push content down if needed, but absolute hero covers it, so a simple spacing element works */}
      <div className="h-16" />
    </>
  )
}
