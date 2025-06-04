import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SavedProperty } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const Favorites: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState<SavedProperty[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.userType === "tenant") {
      loadFavorites();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);

      // Mock data - In real app, fetch from API
      const mockFavorites: SavedProperty[] = [
        {
          id: "1",
          propertyId: "prop1",
          tenantId: user?.id || "",
          createdAt: "2024-01-15T10:00:00Z",
          property: {
            id: "prop1",
            title: "Modern 3-bedroom house in Borrowdale",
            description: "Beautiful modern house with garden",
            location: { city: "Harare", suburb: "Borrowdale" },
            propertyType: "house",
            furnishingStatus: "furnished",
            priceUSD: 1500,
            priceZWL: 480000,
            bedrooms: 3,
            bathrooms: 2,
            amenities: ["Swimming Pool", "Security", "Parking"],
            images: [
              {
                id: "img1",
                url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                alt: "Modern house",
                isPrimary: true,
              },
            ],
            status: "available",
            landlordId: "landlord1",
            landlord: {
              id: "landlord1",
              email: "landlord@example.com",
              fullName: "John Smith",
              phoneNumber: "+263 77 123 4567",
              userType: "landlord",
              isVerified: true,
              createdAt: "2024-01-01T00:00:00Z",
            },
            views: 45,
            createdAt: "2024-01-10T00:00:00Z",
            updatedAt: "2024-01-10T00:00:00Z",
          },
        },
      ];

      setFavoriteProperties(mockFavorites);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      setFavoriteProperties((prev) =>
        prev.filter((fav) => fav.propertyId !== propertyId),
      );
      toast.success("Property removed from favorites");
    } catch (error) {
      toast.error("Failed to remove from favorites");
      throw error;
    }
  };

  if (authLoading || isLoading) {
    return <PageLoader text="Loading your favorites..." />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to view your favorites.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (user.userType !== "tenant") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only tenants can save favorite properties.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Favorite Properties
        </h1>
        <p className="text-gray-600">
          Properties you've saved for easy access later
        </p>
      </div>

      {favoriteProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-16 w-16 text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-md">
              Start browsing properties and save your favorites by clicking the
              heart icon. Your saved properties will appear here for easy
              access.
            </p>
            <Button asChild>
              <Link to="/">Browse Properties</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {favoriteProperties.length} saved{" "}
              {favoriteProperties.length === 1 ? "property" : "properties"}
            </p>
            <Button variant="outline" asChild>
              <Link to="/">Browse More Properties</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProperties.map((favorite) => (
              <PropertyCard
                key={favorite.id}
                property={favorite.property}
                isFavorite={true}
                onToggleFavorite={() =>
                  handleRemoveFavorite(favorite.propertyId)
                }
                showLandlordInfo={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
