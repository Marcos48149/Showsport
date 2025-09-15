import { useState, useRef, useEffect } from "react";
import { Search, User, MapPin, ShoppingCart, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryAlerts } from "@/hooks/useInventoryAlerts";
import AuthModal from "@/components/AuthModal";
import LowStockNotifications from "@/components/LowStockNotifications";
import Link from "next/link";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useCart();
  const { state: authState, logout } = useAuth();
  const { getLowStockAlerts } = useInventory();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Enable inventory email alerts for admin users
  useInventoryAlerts();

  const searchSuggestions = [
    "Adidas Ultraboost",
    "Nike Air Max",
    "Puma RS-X",
    "Nike LeBron",
    "Adidas Dame",
    "Nike Pegasus",
    "zapatillas running",
    "zapatillas basketball",
    "zapatillas lifestyle",
    "Adidas",
    "Nike",
    "Puma"
  ];

  const categories = [
    { id: "running", name: "Running", icon: "🏃‍♂️", href: "/categoria/running" },
    { id: "basketball", name: "Basketball", icon: "🏀", href: "/categoria/basketball" },
    { id: "lifestyle", name: "Lifestyle", icon: "👟", href: "/categoria/lifestyle" },
  ];

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  );

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
 //
  const openCart = () => {
    dispatch({ type: 'SET_CART_OPEN', payload: true });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    // Here you would implement the actual search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      {/* Top promotional banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-medium">
        TARJETAS BANCARIAS: 3 Y 6 SIN INTERES
      </div>

      {/* Revolution banner */}
      <div className="bg-gray-900 text-white text-center py-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">Revolution</span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Stores link */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600 hover:text-orange-500 cursor-pointer">
                Sucursales
              </span>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="text-2xl font-bold text-orange-500 hover:text-orange-600">
                ShowSport
              </Link>
            </div>

            {/* Right section - Cart and Account */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Account Button */}
              {authState.user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium hidden md:block">
                      {authState.user.name}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                      <Link
                        href="/cuenta"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mi Cuenta
                      </Link>
                      {authState.user.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm hover:bg-gray-50 text-orange-600"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Panel Admin
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:block">Ingresar</span>
                </Button>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="pb-4">
            <div className="relative max-w-md mx-auto" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <Input
                  type="text"
                  placeholder="Buscar productos, marcas..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </form>

              {/* Search Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                  {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories Navigation */}
          <div className="border-t border-gray-200 py-3">
            <nav className="flex justify-center">
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Inicio
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/productos"
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Todos los Productos
                </Link>
                <Link
                  href="/devoluciones"
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Cambios/Devoluciones
                </Link>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Blog
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Low Stock Alerts for Admin */}
      {authState.user?.role === 'admin' && (
        <LowStockNotifications />
      )}
    </>
  );
}
