import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/currency";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

interface PropertyCardProps {
  property: Property;
  onToggleFavorite?: (propertyId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  showLandlordInfo?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onToggleFavorite,
  isFavorite = false,
  showLandlordInfo = false,
}) => {
  const { currency, exchangeRate } = useCurrency();
  const { user, isAuthenticated } = useAuth();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const primaryImage =
    property.images.find((img) => img.isPrimary) || property.images[0];
  const formattedPrice = formatPrice(
    property.priceUSD,
    currency,
    exchangeRate.ZWL,
  );

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save properties");
      return;
    }

    if (user?.userType !== "tenant") {
      toast.error("Only tenants can save properties");
      return;
    }

    if (!onToggleFavorite) return;

    setIsTogglingFavorite(true);
    try {
      await onToggleFavorite(property.id, !isFavorite);
    } catch (error) {
      toast.error("Failed to update favorite");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "rented":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };

  const formatPropertyType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ");
  };

  const formatFurnishingStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Link to={`/property/${property.id}`}>
          <div className="aspect-[4/3] overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Square className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </Link>

        {/* Favorite Button */}
        {user?.userType === "tenant" && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-colors ${
              isFavorite ? "text-red-500" : "text-gray-600"
            }`}
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={getStatusBadgeVariant(property.status)}>
            {property.status.toUpperCase()}
          </Badge>
        </div>

        {/* Views */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{property.views || 0}</span>
        </div>
      </div>

      <CardContent className="p-4">
        <Link to={`/property/${property.id}`}>
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-blue-600">
                {formattedPrice}
              </h3>
              <Badge variant="outline" className="text-xs">
                {formatPropertyType(property.propertyType)}
              </Badge>
            </div>

            {/* Title */}
            <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h4>

            {/* Location */}
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>
                {property.location.suburb}, {property.location.city}
              </span>
            </div>

            {/* Property Details */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>
                    {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>
                    {property.bathrooms} bath
                    {property.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {formatFurnishingStatus(property.furnishingStatus)}
              </Badge>
            </div>

            {/* Amenities Preview */}
            {property.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Landlord Info */}
            {showLandlordInfo && property.landlord && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Listed by{" "}
                  <span className="font-medium">
                    {property.landlord.fullName}
                  </span>
                </p>
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
