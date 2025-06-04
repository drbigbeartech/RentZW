import { User, AuthResponse } from "@/types";

// Mock user database (stored in localStorage)
const USERS_STORAGE_KEY = "rentzw_mock_users";
const CURRENT_USER_KEY = "rentzw_current_user";

interface StoredUser {
  id: string;
  email: string;
  password: string; // In real app, this would be hashed
  fullName: string;
  phoneNumber: string;
  userType: "tenant" | "landlord";
  isVerified: boolean;
  createdAt: string;
}

// Get all stored users
export const getStoredUsers = (): StoredUser[] => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// Save users to storage
const saveUsers = (users: StoredUser[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Generate a simple ID
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Mock signup function
export const mockSignup = async (userData: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: "tenant" | "landlord";
}): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const users = getStoredUsers();

  // Check if user already exists
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === userData.email.toLowerCase(),
  );
  if (existingUser) {
    throw new Error("User already exists with this email address");
  }

  // Create new user
  const newUser: StoredUser = {
    id: generateId(),
    email: userData.email,
    password: userData.password, // In real app, hash this
    fullName: userData.fullName,
    phoneNumber: userData.phoneNumber,
    userType: userData.userType,
    isVerified: true, // Auto-verify for demo
    createdAt: new Date().toISOString(),
  };

  // Save user
  users.push(newUser);
  saveUsers(users);

  // Create user object (without password)
  const user: User = {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    phoneNumber: newUser.phoneNumber,
    userType: newUser.userType,
    isVerified: newUser.isVerified,
    createdAt: newUser.createdAt,
  };

  // Generate mock tokens
  const token = generateId();
  const refreshToken = generateId();

  return {
    user,
    token,
    refreshToken,
  };
};

// Mock login function
export const mockLogin = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const users = getStoredUsers();

  // Find user
  const storedUser = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password,
  );

  if (!storedUser) {
    throw new Error("Invalid email or password");
  }

  // Create user object (without password)
  const user: User = {
    id: storedUser.id,
    email: storedUser.email,
    fullName: storedUser.fullName,
    phoneNumber: storedUser.phoneNumber,
    userType: storedUser.userType,
    isVerified: storedUser.isVerified,
    createdAt: storedUser.createdAt,
  };

  // Generate mock tokens
  const token = generateId();
  const refreshToken = generateId();

  return {
    user,
    token,
    refreshToken,
  };
};

// Mock get profile function
export const mockGetProfile = async (token: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUser) {
    throw new Error("Not authenticated");
  }

  return JSON.parse(currentUser);
};

// Initialize with some sample users for testing
export const initializeMockUsers = (): void => {
  const users = getStoredUsers();

  // Only initialize if no users exist
  if (users.length === 0) {
    const sampleUsers: StoredUser[] = [
      {
        id: "user1",
        email: "tenant@example.com",
        password: "password123",
        fullName: "Alice Johnson",
        phoneNumber: "+263 77 123 4567",
        userType: "tenant",
        isVerified: true,
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "user2",
        email: "landlord@example.com",
        password: "password123",
        fullName: "John Smith",
        phoneNumber: "+263 77 987 6543",
        userType: "landlord",
        isVerified: true,
        createdAt: "2024-01-01T00:00:00Z",
      },
    ];

    saveUsers(sampleUsers);
  }
};
