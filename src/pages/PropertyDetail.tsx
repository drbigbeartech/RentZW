import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Property } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { propertyService } from "@/lib/propertyService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSpinner, { PageLoader } from "@/components/common/LoadingSpinner";
import {
  MapPin,
  Calendar,
  User,
  Heart,
  Send,
  Eye,
  ArrowLeft,
  Share,
  CheckCircle,
  Clock,
  ShieldCheck,
  Star,
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // In-app viewing request state
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [tenantName, setTenantName] = useState(user?.fullName || "");
  const [tenantPhone, setTenantPhone] = useState(user?.phoneNumber || "");
  const [tenantEmail, setTenantEmail] = useState(user?.email || "");
  const [viewingDate, setViewingDate] = useState("");
  const [viewingTimeSlot, setViewingTimeSlot] = useState("Morning (9:00 AM - 12:00 PM)");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!tenantName) setTenantName(user.fullName || "");
      if (!tenantPhone) setTenantPhone(user.phoneNumber || "");
      if (!tenantEmail) setTenantEmail(user.email || "");
    }
  }, [user]);

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

  const handleSubmitViewingRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!property) return;

    if (!tenantName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!tenantPhone.trim()) {
      toast.error("Please enter your phone number so the landlord can confirm");
      return;
    }

    try {
      setIsSubmittingInquiry(true);
      await propertyService.submitViewingRequest({
        propertyId: property.id,
        tenantId: user?.id,
        tenantName,
        tenantPhone,
        tenantEmail,
        viewingDate,
        viewingTimeSlot,
        message: message || `Hi, I would like to schedule a viewing for ${property.title}.`,
      });

      setInquirySubmitted(true);
      toast.success("Viewing request submitted securely through RentZW!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit viewing request");
    } finally {
      setIsSubmittingInquiry(false);
    }
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
                <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-gray-100">
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

                {/* Status & Featured Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.isFeatured && (
                    <Badge className="bg-amber-500 text-white font-semibold flex items-center shadow-md">
                      <Star className="h-3 w-3 mr-1 fill-white" /> FEATURED
                    </Badge>
                  )}
                  <Badge
                    variant={
                      property.status === "available" ? "default" : "secondary"
                    }
                    className="text-sm font-semibold shadow-md"
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

        {/* Sidebar: In-App Viewing & Inquiry Booking Form */}
        <div className="space-y-6">
          {/* Security & Verification Guarantee */}
          <Card className="border-blue-100 bg-blue-50/50">
            <CardContent className="p-4 flex items-start space-x-3">
              <ShieldCheck className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Verified RentZW Listing</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Direct viewing appointments are managed securely through RentZW to protect tenant deposits and prevent rental scams.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Booking / Inquiry Form */}
          <Card className="shadow-md border-t-4 border-t-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Book a Viewing / Inquire</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inquirySubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-base">Request Submitted!</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your viewing inquiry for <strong>{property.title}</strong> has been forwarded directly to the landlord's dashboard.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setInquirySubmitted(false)}
                  >
                    Send Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitViewingRequest} className="space-y-4">
                  <div>
                    <Label htmlFor="tenant-name" className="text-xs font-semibold">Your Full Name *</Label>
                    <Input
                      id="tenant-name"
                      placeholder="e.g. Tendai Moyo"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenant-phone" className="text-xs font-semibold">Your Phone / WhatsApp Number *</Label>
                    <Input
                      id="tenant-phone"
                      placeholder="e.g. +263 77 123 4567"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="viewing-date" className="text-xs font-semibold">Preferred Viewing Date</Label>
                    <Input
                      id="viewing-date"
                      type="date"
                      value={viewingDate}
                      onChange={(e) => setViewingDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Preferred Time Slot</Label>
                    <Select value={viewingTimeSlot} onValueChange={setViewingTimeSlot}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</SelectItem>
                        <SelectItem value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</SelectItem>
                        <SelectItem value="Late Afternoon (4:00 PM - 6:00 PM)">Late Afternoon (4:00 PM - 6:00 PM)</SelectItem>
                        <SelectItem value="Weekend Anytime">Weekend Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="inquiry-message" className="text-xs font-semibold">Message / Questions (Optional)</Label>
                    <Textarea
                      id="inquiry-message"
                      placeholder="e.g. Are pets allowed? When is the earliest move-in date?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="mt-1 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={isSubmittingInquiry}
                  >
                    {isSubmittingInquiry ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send In-App Viewing Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Property Reference */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Listing ID</span>
                <span className="font-mono text-gray-700">{property.id.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Listed By</span>
                <span className="font-medium text-gray-800">Verified Landlord</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <Badge variant={property.status === "available" ? "default" : "secondary"}>
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
