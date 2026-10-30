import { supabase } from "./supabase";
import { Property, SearchFilters, PropertyImage } from "@/types";

// Helper to map DB row to frontend Property interface
export function mapRowToProperty(row: any): Property {
  const images: PropertyImage[] = Array.isArray(row.images) && row.images.length > 0
    ? row.images
    : [
        {
          id: "default",
          url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
          alt: row.title,
          isPrimary: true,
        },
      ];

  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    location: {
      city: row.city,
      suburb: row.suburb,
    },
    propertyType: row.property_type,
    furnishingStatus: row.furnishing_status,
    priceUSD: Number(row.price_usd),
    priceZWL: Number(row.price_zwl || 0),
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    amenities: row.amenities || [],
    images,
    status: row.status || "available",
    landlordId: row.landlord_id || "platform",
    landlord: {
      id: row.landlord_id || "platform",
      fullName: row.landlord_name || row.profiles?.full_name || "Verified Landlord",
      email: row.landlord_email || row.profiles?.email || "contact@rentzw.com",
      phoneNumber: row.landlord_phone || row.profiles?.phone_number || "+263 77 123 4567",
      userType: "landlord",
      isVerified: true,
      createdAt: row.created_at,
    },
    views: Number(row.views || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const propertyService = {
  // Fetch properties with optional search filters
  async getProperties(filters: SearchFilters = {}, page = 1, limit = 12): Promise<{
    properties: Property[];
    total: number;
    totalPages: number;
  }> {
    let query = supabase
      .from("properties")
      .select("*, profiles(full_name, email, phone_number)", { count: "exact" })
      .eq("status", "available")
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters.city) {
      query = query.ilike("city", `%${filters.city}%`);
    }
    if (filters.suburb) {
      query = query.ilike("suburb", `%${filters.suburb}%`);
    }
    if (filters.propertyType) {
      query = query.eq("property_type", filters.propertyType);
    }
    if (filters.furnishingStatus) {
      query = query.eq("furnishing_status", filters.furnishingStatus);
    }
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      query = query.gte("price_usd", filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      query = query.lte("price_usd", filters.maxPrice);
    }
    if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
      query = query.gte("bedrooms", filters.bedrooms);
    }
    if (filters.keyword) {
      query = query.or(
        `title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%,suburb.ilike.%${filters.keyword}%`
      );
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }

    const properties = (data || []).map(mapRowToProperty);
    const total = count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return { properties, total, totalPages };
  },

  // Fetch single property by ID and increment views
  async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from("properties")
      .select("*, profiles(full_name, email, phone_number)")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching property:", error);
      return null;
    }

    // Increment views in background
    supabase
      .from("properties")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", id)
      .then();

    return mapRowToProperty(data);
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Create new property listing
  async createProperty(propertyData: {
    title: string;
    description: string;
    city: string;
    suburb: string;
    propertyType: string;
    furnishingStatus: string;
    priceUSD: number;
    priceZWL?: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: { id: string; url: string; alt: string; isPrimary: boolean }[];
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
  }): Promise<Property> {
    const { data: { user } } = await supabase.auth.getUser();

    const insertPayload: any = {
      title: propertyData.title,
      description: propertyData.description,
      city: propertyData.city,
      suburb: propertyData.suburb,
      property_type: propertyData.propertyType,
      furnishing_status: propertyData.furnishingStatus,
      price_usd: propertyData.priceUSD,
      price_zwl: propertyData.priceZWL || propertyData.priceUSD * 25,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      amenities: propertyData.amenities,
      images: propertyData.images,
      status: "available",
      landlord_name: propertyData.landlordName,
      landlord_phone: propertyData.landlordPhone,
      landlord_email: propertyData.landlordEmail,
    };

    if (user?.id) {
      insertPayload.landlord_id = user.id;
    }

    const { data, error } = await supabase
      .from("properties")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Error creating property:", error);
      throw error;
    }

    return mapRowToProperty(data);
  },

  // Get platform stats
  async getStats() {
    const { count: propertyCount } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    return {
      totalProperties: propertyCount || 0,
      registeredTenants: 120, // initial benchmark
      verifiedLandlords: 45,
      citiesCovered: 4, // Harare, Bulawayo, Mutare, Gweru
    };
  },
};
