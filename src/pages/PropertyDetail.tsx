import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Property, PropertyApplication } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingSpinner, { PageLoader } from "@/components/common/LoadingSpinner";
import {
  MapPin,
  Bed,
  Bath,
  Calendar,
  User,
  Phone,
  Mail,
  Heart,
  Send,
  Eye,
  ArrowLeft,
  Share,
  Star,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { currency, exchangeRate } = useCurrency();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);

      // Mock data - In real app, fetch from API
      const mockProperty: Property = {
        id: propertyId,
        title: "Modern 3-bedroom house in Borrowdale",
        description: `This stunning contemporary home offers the perfect blend of modern luxury and comfortable living. 
        Located in the prestigious Borrowdale neighborhood, this property features:

        ✓ Spacious open-plan living areas with high ceilings
        ✓ Modern kitchen with granite countertops and premium appliances
        ✓ Master bedroom with en-suite bathroom and walk-in closet
        ✓ Two additional bedrooms with built-in wardrobes
        ✓ Beautiful landscaped garden with mature trees
        ✓ Swimming pool perfect for entertainment
        ✓ Double garage with remote access
        ✓ 24/7 security in a gated community
        ✓ Backup generator and solar water heating
        ✓ Close to excellent schools and shopping centers

        This property is ideal for families looking for a safe, secure, and luxurious living environment in one of Harare's most sought-after suburbs.`,
        location: { city: "Harare", suburb: "Borrowdale" },
        propertyType: "house",
        furnishingStatus: "furnished",
        priceUSD: 1500,
        priceZWL: 480000,
        bedrooms: 3,
        bathrooms: 2,
        amenities: [
          "Swimming Pool",
          "Security",
          "Parking",
          "Garden",
          "Wi-Fi",
          "Air Conditioning",
          "Generator",
          "Solar Power",
          "DSTV",
          "Laundry",
          "Kitchen",
          "Balcony",
        ],
        images: [
          {
            id: "img1",
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
            alt: "Modern house exterior",
            isPrimary: true,
          },
          {
            id: "img2",
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            alt: "Spacious living room",
            isPrimary: false,
          },
          {
            id: "img3",
            url: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800",
            alt: "Modern kitchen",
            isPrimary: false,
          },
          {
            id: "img4",
            url: "https://images.unsplash.com/photo-1571508601890-de8de2873de3?w=800",
            alt: "Master bedroom",
            isPrimary: false,
          },
          {
            id: "img5",
            url: "https://images.unsplash.com/photo-1571508601891-ca5e54ce8e7d?w=800",
            alt: "Swimming pool",
            isPrimary: false,
          },
        ],
        status: "available",
        landlordId: "landlord1",
        landlord: {
          id: "landlord1",
          email: "john@example.com",
          fullName: "John Smith",
          phoneNumber: "+263 77 123 4567",
          userType: "landlord",
          isVerified: true,
          createdAt: "2024-01-01T00:00:00Z",
        },
        views: 145,
        createdAt: "2024-01-10T00:00:00Z",
        updatedAt: "2024-01-10T00:00:00Z",
      };

      setProperty(mockProperty);

      // Check if property is in user's favorites
      if (user?.userType === "tenant") {
        setIsFavorite(false); // Mock check
      }

      // Increment view count
      // In real app, this would be done on the backend
    } catch (error) {
      console.error("Failed to load property:", error);
      toast.error("Failed to load property details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save properties");
      return;
    }

    if (user?.userType !== "tenant") {
      toast.error("Only tenants can save properties");
      return;
    }

    try {
      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite
          ? "Property removed from favorites"
          : "Property added to favorites",
      );
    } catch (error) {
      toast.error("Failed to update favorite");
      setIsFavorite(!isFavorite); // Revert on error
    }
  };

  const handleSubmitApplication = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for properties");
      return;
    }

    if (user?.userType !== "tenant") {
      toast.error("Only tenants can apply for properties");
      return;
    }

    if (!applicationMessage.trim()) {
      toast.error("Please enter a message with your application");
      return;
    }

    try {
      setIsSubmittingApplication(true);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Application submitted successfully!");
      setApplicationMessage("");
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleContactLandlord = () => {
    if (!property?.landlord.email) return;

    const subject = `Inquiry about ${property.title}`;
    const body = `Hello ${property.landlord.fullName},\n\nI am interested in your property: ${property.title}\nLocation: ${property.location.suburb}, ${property.location.city}\n\nPlease let me know if it's still available and if we can arrange a viewing.\n\nThank you.`;

    window.location.href = `mailto:${property.landlord.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Property link copied to clipboard");
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading property details..." />;
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Property not found
          </h2>
          <p className="text-gray-600 mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Browse Properties</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedPrice = formatPrice(
    property.priceUSD,
    currency,
    exchangeRate.ZWL,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          {user?.userType === "tenant" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              className={isFavorite ? "text-red-500" : ""}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
              />
              {isFavorite ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-[16/10] overflow-hidden rounded-t-lg">
                  <img
                    src={property.images[currentImageIndex]?.url}
                    alt={property.images[currentImageIndex]?.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2 bg-black/50 rounded-full px-3 py-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    variant={
                      property.status === "available" ? "default" : "secondary"
                    }
                    className="text-sm"
                  >
                    {property.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Views */}
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{property.views}</span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="flex space-x-2 p-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>
                    {property.location.suburb}, {property.location.city}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {formattedPrice}
                  <span className="text-lg text-gray-600">/month</span>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.bedrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {property.propertyType.replace("_", " ")}
                  </div>
                  <div className="text-sm text-gray-600">Property Type</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {property.furnishingStatus.replace("_", " ")}
                  </div>
                  <div className="text-sm text-gray-600">Furnishing</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Landlord Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Property Owner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {property.landlord.fullName}
                  </h4>
                  {property.landlord.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">Property Owner</p>
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={handleContactLandlord}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Owner
                </Button>

                <a
                  href={`tel:${property.landlord.phoneNumber}`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    {property.landlord.phoneNumber}
                  </Button>
                </a>
              </div>

              <div className="text-xs text-gray-500">
                Listed on {new Date(property.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          {user?.userType === "tenant" && property.status === "available" && (
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="application-message">
                    Message to Landlord
                  </Label>
                  <Textarea
                    id="application-message"
                    placeholder="Tell the landlord why you're interested in this property..."
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    rows={4}
                    disabled={isSubmittingApplication}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSubmitApplication}
                  disabled={
                    isSubmittingApplication || !applicationMessage.trim()
                  }
                >
                  {isSubmittingApplication && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Property Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Property ID</span>
                <span className="text-sm font-medium">{property.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Listed Date</span>
                <span className="text-sm font-medium">
                  {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Views</span>
                <span className="text-sm font-medium">{property.views}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge
                  variant={
                    property.status === "available" ? "default" : "secondary"
                  }
                >
                  {property.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
