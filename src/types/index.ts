export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userType: "tenant" | "landlord" | "admin";
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
  landlord?: User;
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

export interface PlatformStats {
  totalProperties: number;
  registeredTenants: number;
  verifiedLandlords: number;
  citiesCovered: number;
}

export const ZIMBABWE_LOCATIONS = {
  Harare: [
    "Avondale",
    "Borrowdale",
    "Mount Pleasant",
    "Newlands",
    "Eastlea",
    "Belgravia",
    "Highlands",
    "Greendale",
    "Mabelreign",
    "Westgate",
    "CBD",
  ],
  Bulawayo: [
    "Kumalo",
    "Hillside",
    "Suburbs",
    "Bradfield",
    "Burnside",
    "CBD",
    "Morningside",
  ],
  Mutare: ["Murambi", "Palmerstone", "CBD", "Fairbridge Park"],
  Gweru: ["Southdowns", "Daylesford", "Lundi Park", "CBD"],
} as const;

export const PROPERTY_AMENITIES = [
  "Prolific Borehole",
  "Solar Backup / Inverter",
  "Water Tanks (5000L+)",
  "Swimming Pool",
  "Security Guard / 24/7 Security",
  "Electric Gate & Fence",
  "Wi-Fi Ready / Fibre",
  "Staff Quarters",
  "Garage / Covered Parking",
  "Air Conditioning",
  "Solar Geyser",
  "Garden / Yard",
] as const;
