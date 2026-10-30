import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Currency } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  Shield,
} from "lucide-react";

const Header: React.FC = () => {
  const { user, isAuthenticated, isLandlord, isAdmin, logout } = useAuth();
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

            {isAuthenticated && isLandlord && (
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
                <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrency("USD")}>
                  USD ($) - United States Dollar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrency("ZWL")}>
                  ZWL (Z$) - Zimbabwe Dollar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* List Property CTA for non-landlords / guests */}
            {!isLandlord && (
              <Link to="/signup?type=landlord" className="hidden md:inline-block">
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  List a Property
                </Button>
              </Link>
            )}

            {/* User Menu */}
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
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {user?.email}
                      </p>
                      <Badge variant={isAdmin ? "default" : isLandlord ? "secondary" : "outline"} className="w-fit text-xs mt-1">
                        {isAdmin ? (
                          <span className="flex items-center">
                            <Shield className="h-3 w-3 mr-1" /> Admin
                          </span>
                        ) : isLandlord ? (
                          "Landlord"
                        ) : (
                          "Tenant"
                        )}
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
                  {isLandlord && (
                    <DropdownMenuItem asChild>
                      <Link to="/add-property" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Property
                      </Link>
                    </DropdownMenuItem>
                  )}
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
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Register</Link>
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

              {isAuthenticated && isLandlord && (
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
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 text-left w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <Button className="w-full justify-start">Register</Button>
                  </Link>
                  <Link to="/signup?type=landlord" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full justify-start text-blue-600 border-blue-200">
                      <PlusCircle className="h-4 w-4 mr-2" /> List a Property
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
