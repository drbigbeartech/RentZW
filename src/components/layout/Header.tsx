import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  PlusCircle,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Building,
  DollarSign,
} from "lucide-react";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">RentZW</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath("/")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Properties</span>
            </Link>

            {isAuthenticated && user?.userType === "landlord" && (
              <Link
                to="/add-property"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath("/add-property")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Property</span>
              </Link>
            )}

            {isAuthenticated && user?.userType === "tenant" && (
              <Link
                to="/favorites"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath("/favorites")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </Link>
            )}
          </nav>

          {/* Currency Selector & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {currency}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setCurrency("USD")}
                  className={currency === "USD" ? "bg-blue-50" : ""}
                >
                  USD - US Dollar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCurrency("ZWL")}
                  className={currency === "ZWL" ? "bg-blue-50" : ""}
                >
                  ZWL - Zimbabwe Dollar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop Auth Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {user?.userType === "landlord" ? "Landlord" : "Tenant"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActivePath("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700"
                }`}
                onClick={closeMobileMenu}
              >
                <Home className="h-4 w-4" />
                <span>Properties</span>
              </Link>

              {isAuthenticated && user?.userType === "landlord" && (
                <Link
                  to="/add-property"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActivePath("/add-property")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Property</span>
                </Link>
              )}

              {isAuthenticated && user?.userType === "tenant" && (
                <Link
                  to="/favorites"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActivePath("/favorites")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActivePath("/dashboard")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/login" onClick={closeMobileMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link to="/signup" onClick={closeMobileMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Currency Selector */}
              <div className="px-3 pt-2 border-t">
                <p className="text-xs text-gray-500 mb-2">Currency</p>
                <div className="flex space-x-2">
                  <Button
                    variant={currency === "USD" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrency("USD")}
                  >
                    USD
                  </Button>
                  <Button
                    variant={currency === "ZWL" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrency("ZWL")}
                  >
                    ZWL
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
