import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, AuthResponse } from "@/types";
import {
  getUser,
  setUser,
  getAuthToken,
  setAuthToken,
  setRefreshToken,
  clearAuth,
} from "@/lib/auth";
import api, { endpoints } from "@/lib/api";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: "tenant" | "landlord";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!getAuthToken();

  useEffect(() => {
    // Initialize auth state from localStorage
    const initializeAuth = async () => {
      const token = getAuthToken();
      const storedUser = getUser();

      if (token && storedUser) {
        setUserState(storedUser);

        // Verify token is still valid
        try {
          const response = await api.get(endpoints.profile);
          setUserState(response.data.data);
          setUser(response.data.data);
        } catch (error) {
          // Token is invalid, clear auth
          clearAuth();
          setUserState(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>(endpoints.login, {
        email,
        password,
      });

      const { user: userData, token, refreshToken } = response.data;

      setAuthToken(token);
      setRefreshToken(refreshToken);
      setUser(userData);
      setUserState(userData);

      toast.success(`Welcome back, ${userData.fullName}!`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>(endpoints.signup, userData);

      const { user: newUser, token, refreshToken } = response.data;

      setAuthToken(token);
      setRefreshToken(refreshToken);
      setUser(newUser);
      setUserState(newUser);

      toast.success(
        "Account created successfully! Please check your email for verification.",
      );
    } catch (error: any) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
    toast.success("Logged out successfully");

    // Optional: Call logout API endpoint
    api.post(endpoints.logout).catch(() => {
      // Ignore errors as user is already logged out locally
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setUserState(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
