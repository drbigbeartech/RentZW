export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userType: "tenant" | "landlord";
  isVerified: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: Location;
  propertyType: PropertyType;
  furnishingStatus: FurnishingStatus;
  priceUSD: number;
  priceZWL: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: PropertyImage[];
  status: PropertyStatus;
  landlordId: string;
  landlord: User;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Location {
  city: string;
  suburb: string;
}

export interface PropertyApplication {
  id: string;
  propertyId: string;
  tenantId: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
  property: Property;
  tenant: User;
}

export interface SavedProperty {
  id: string;
  propertyId: string;
  tenantId: string;
  createdAt: string;
  property: Property;
}

export type PropertyType =
  | "house"
  | "apartment"
  | "townhouse"
  | "studio"
  | "room";
export type FurnishingStatus =
  | "furnished"
  | "unfurnished"
  | "partially_furnished";
export type PropertyStatus = "available" | "rented" | "pending";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type Currency = "USD" | "ZWL";

export interface SearchFilters {
  keyword?: string;
  city?: string;
  suburb?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  furnishingStatus?: FurnishingStatus;
  amenities?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalProperties: number;
  totalViews: number;
  totalInquiries: number;
  totalApplications: number;
}

export interface PlatformStats {
  totalProperties: number;
  registeredTenants: number;
  verifiedLandlords: number;
  citiesCovered: number;
}

export interface ExchangeRate {
  USD: number;
  ZWL: number;
  lastUpdated: string;
}

// Zimbabwe locations
export const ZIMBABWE_LOCATIONS = {
  Harare: [
    "Avondale",
    "Borrowdale",
    "Mount Pleasant",
    "Belgravia",
    "Newlands",
    "Greendale",
    "Waterfalls",
    "Highfield",
  ],
  Bulawayo: [
    "Burnside",
    "Hillside",
    "Suburbs",
    "North End",
    "Woodville",
    "Donnington",
    "Riverside",
  ],
  Mutare: ["Murambi", "Dangamvura", "Yeovil", "Tiger Bay"],
  Gweru: ["Senga", "Northlea", "Woodlands"],
  Kwekwe: ["Mbizo", "Redcliff"],
  Masvingo: ["Rujeko", "Mucheke"],
  Chinhoyi: ["Coldstream", "Orange Grove"],
  "Victoria Falls": ["Chinotimba", "Aerodrome"],
};

export const PROPERTY_AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Security",
  "Parking",
  "Wi-Fi",
  "Air Conditioning",
  "Garden",
  "Balcony",
  "Laundry",
  "Kitchen",
  "Furnished",
  "Pet Friendly",
  "DSTV",
  "Generator",
  "Borehole",
  "Solar Power",
];
