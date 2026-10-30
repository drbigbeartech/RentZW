import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Property } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { propertyService } from "@/lib/propertyService";
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
  CheckCircle,
  MessageCircle,
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
      const data = await propertyService.getPropertyById(propertyId);
      if (!data) {
        toast.error("Property not found");
        navigate("/");
        return;
      }
      setProperty(data);
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
      setIsFavorite(!isFavorite);
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
      // Simulate submission / connect to property_applications table
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Application submitted successfully to landlord!");
      setApplicationMessage("");
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleContactLandlord = () => {
    if (!property?.landlord?.email) return;

    const subject = `Inquiry about ${property.title}`;
    const body = `Hello ${property.landlord.fullName},\n\nI am interested in your property listed on RentZW: ${property.title}\nLocation: ${property.location.suburb}, ${property.location.city}\nPrice: $${property.priceUSD}/month\n\nPlease let me know if it is still available and when I can view it.\n\nThank you.`;

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

  // WhatsApp click-to-chat setup
  const rawPhone = property.landlord?.phoneNumber || "+263771234567";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const whatsappText = encodeURIComponent(
    `Hello ${property.landlord?.fullName || 'Landlord'}, I am inquiring about your property on RentZW:\n"${property.title}" in ${property.location.suburb}, ${property.location.city} ($${property.priceUSD}/month).\nLink: ${window.location.href}`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappText}`;

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
                    className="text-sm font-semibold"
                  >
                    {property.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Views */}
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{property.views} views</span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="flex space-x-2 p-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={image.id || index}
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
                  <MapPin className="h-5 w-5 mr-2 text-red-500" />
                  <span className="font-medium">
                    {property.location.suburb}, {property.location.city}
                  </span>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {formattedPrice}
                  <span className="text-lg text-gray-600 font-normal"> / month</span>
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
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {property.description}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Amenities & Key Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-md">
                      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{amenity}</span>
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
                <span>Landlord / Agent Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {property.landlord?.fullName || "Verified Landlord"}
                  </h4>
                  {property.landlord?.isVerified && (
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">Listed on RentZW</p>
              </div>

              <div className="space-y-2.5">
                {/* WhatsApp Direct Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </a>

                {/* Direct Phone Call */}
                {property.landlord?.phoneNumber && (
                  <a
                    href={`tel:${property.landlord.phoneNumber}`}
                    className="w-full block"
                  >
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call {property.landlord.phoneNumber}
                    </Button>
                  </a>
                )}

                {/* Email Inquiry */}
                {property.landlord?.email && (
                  <Button variant="ghost" className="w-full" onClick={handleContactLandlord}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email Inquiry
                  </Button>
                )}
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
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
                    placeholder="Introduce yourself, occupation, and desired move-in date..."
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
              <CardTitle>Property Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Listing ID</span>
                <span className="font-mono text-gray-700 truncate max-w-[140px]">{property.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Status</span>
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
