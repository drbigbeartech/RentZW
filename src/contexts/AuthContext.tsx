import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/types";
import { supabase } from "@/lib/supabase";
import {
  getUser,
  setUser,
  clearAuth,
} from "@/lib/auth";
import { toast } from "react-hot-toast";

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: "tenant" | "landlord" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLandlord: boolean;
  isAdmin: boolean;
  isTenant: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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

  const isAuthenticated = !!user;
  const isLandlord = user?.userType === "landlord" || user?.userType === "admin";
  const isAdmin = user?.userType === "admin";
  const isTenant = user?.userType === "tenant";

  // Helper to sync Supabase user + Profile
  const fetchProfileAndSetUser = async (supabaseUser: any) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (profile) {
        const mappedUser: User = {
          id: profile.id,
          email: profile.email || supabaseUser.email || "",
          fullName: profile.full_name || supabaseUser.user_metadata?.full_name || "User",
          phoneNumber: profile.phone_number || supabaseUser.user_metadata?.phone_number || "",
          userType: profile.user_type || "tenant",
          isVerified: !!profile.is_verified,
          createdAt: profile.created_at || new Date().toISOString(),
        };
        setUserState(mappedUser);
        setUser(mappedUser);
        return mappedUser;
      } else {
        // Fallback to metadata
        const meta = supabaseUser.user_metadata || {};
        const fallbackUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          fullName: meta.full_name || "User",
          phoneNumber: meta.phone_number || "",
          userType: meta.user_type || "tenant",
          isVerified: false,
          createdAt: new Date().toISOString(),
        };

        // Upsert profile in DB
        await supabase.from("profiles").upsert({
          id: fallbackUser.id,
          email: fallbackUser.email,
          full_name: fallbackUser.fullName,
          phone_number: fallbackUser.phoneNumber,
          user_type: fallbackUser.userType,
        });

        setUserState(fallbackUser);
        setUser(fallbackUser);
        return fallbackUser;
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUserState(null);
      clearAuth();
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfileAndSetUser(session.user);
        } else {
          // Check local stored session fallback
          const localUser = getUser();
          if (localUser) {
            setUserState(localUser);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchProfileAndSetUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUserState(null);
          clearAuth();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);

      // Handle demo accounts gracefully
      if (email === "tenant@example.com" && password === "password123") {
        const demoTenant: User = {
          id: "demo-tenant-1",
          email: "tenant@example.com",
          fullName: "Demo Tenant",
          phoneNumber: "+263 77 111 2222",
          userType: "tenant",
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUserState(demoTenant);
        setUser(demoTenant);
        toast.success("Signed in with Demo Tenant account!");
        return;
      }

      if (email === "landlord@example.com" && password === "password123") {
        const demoLandlord: User = {
          id: "demo-landlord-1",
          email: "landlord@example.com",
          fullName: "Demo Landlord",
          phoneNumber: "+263 77 333 4444",
          userType: "landlord",
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUserState(demoLandlord);
        setUser(demoLandlord);
        toast.success("Signed in with Demo Landlord account!");
        return;
      }

      // Supabase Authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const profile = await fetchProfileAndSetUser(data.user);
        toast.success(`Welcome back, ${profile?.fullName || "User"}!`);
      }
    } catch (error: any) {
      const message = error.message || "Failed to sign in. Please check your credentials.";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<void> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            phone_number: userData.phoneNumber,
            user_type: userData.userType,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Automatically insert profile
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: userData.email,
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
          user_type: userData.userType,
        });

        const newUser: User = {
          id: data.user.id,
          email: userData.email,
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          userType: userData.userType,
          isVerified: false,
          createdAt: new Date().toISOString(),
        };

        setUserState(newUser);
        setUser(newUser);
        toast.success(`Account created successfully as ${userData.userType}!`);
      }
    } catch (error: any) {
      const message = error.message || "Signup failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    clearAuth();
    setUserState(null);
    toast.success("Logged out successfully");
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
    isLandlord,
    isAdmin,
    isTenant,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
