import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Property, PropertyApplication, SavedProperty } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PropertyCard from "@/components/property/PropertyCard";
import LoadingSpinner, { PageLoader } from "@/components/common/LoadingSpinner";
import {
  Heart,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TenantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState<SavedProperty[]>(
    [],
  );
  const [applications, setApplications] = useState<PropertyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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

      const mockApplications: PropertyApplication[] = [
        {
          id: "app1",
          propertyId: "prop2",
          tenantId: user?.id || "",
          message:
            "I am interested in renting this property. I have stable income and good references.",
          status: "pending",
          createdAt: "2024-01-20T14:00:00Z",
          property: {
            id: "prop2",
            title: "Cozy 2-bedroom apartment in Avondale",
            description: "Well-maintained apartment in quiet neighborhood",
            location: { city: "Harare", suburb: "Avondale" },
            propertyType: "apartment",
            furnishingStatus: "partially_furnished",
            priceUSD: 800,
            priceZWL: 256000,
            bedrooms: 2,
            bathrooms: 1,
            amenities: ["Security", "Parking"],
            images: [
              {
                id: "img2",
                url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                alt: "Apartment living room",
                isPrimary: true,
              },
            ],
            status: "available",
            landlordId: "landlord2",
            landlord: {
              id: "landlord2",
              email: "landlord2@example.com",
              fullName: "Mary Johnson",
              phoneNumber: "+263 77 987 6543",
              userType: "landlord",
              isVerified: true,
              createdAt: "2024-01-01T00:00:00Z",
            },
            views: 32,
            createdAt: "2024-01-15T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z",
          },
          tenant: user!,
        },
      ];

      setFavoriteProperties(mockFavorites);
      setApplications(mockApplications);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    try {
      // Mock API call
      setFavoriteProperties((prev) =>
        prev.filter((fav) => fav.propertyId !== propertyId),
      );
      toast.success("Property removed from favorites");
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  const getApplicationStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Manage your property searches and applications
          </p>
        </div>
        <Button asChild>
          <Link to="/">Browse Properties</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Properties
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {favoriteProperties.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Properties in your favorites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">
              Total applications submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter((app) => app.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting landlord response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="favorites" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="favorites">Saved Properties</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Saved Properties */}
        <TabsContent value="favorites" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Saved Properties</h2>
            <Badge variant="outline">
              {favoriteProperties.length} properties
            </Badge>
          </div>

          {favoriteProperties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No saved properties yet
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Start browsing properties and save your favorites for easy
                  access later.
                </p>
                <Button asChild>
                  <Link to="/">Browse Properties</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((favorite) => (
                <PropertyCard
                  key={favorite.id}
                  property={favorite.property}
                  isFavorite={true}
                  onToggleFavorite={() => removeFavorite(favorite.propertyId)}
                  showLandlordInfo={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Applications */}
        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Applications</h2>
            <Badge variant="outline">{applications.length} applications</Badge>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Find properties you like and submit applications to connect
                  with landlords.
                </p>
                <Button asChild>
                  <Link to="/">Find Properties</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Image */}
                      <div className="lg:w-48 flex-shrink-0">
                        <Link to={`/property/${application.property.id}`}>
                          <div className="aspect-[4/3] rounded-lg overflow-hidden">
                            <img
                              src={application.property.images[0]?.url}
                              alt={application.property.images[0]?.alt}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Application Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <Link
                              to={`/property/${application.property.id}`}
                              className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {application.property.title}
                            </Link>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>
                                {application.property.location.suburb},{" "}
                                {application.property.location.city}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getApplicationStatusIcon(application.status)}
                            {getApplicationStatusBadge(application.status)}
                          </div>
                        </div>

                        {/* Application Message */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Your Message:
                          </h4>
                          <p className="text-gray-700 text-sm">
                            {application.message}
                          </p>
                        </div>

                        {/* Application Footer */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            Applied on{" "}
                            {new Date(
                              application.createdAt,
                            ).toLocaleDateString()}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/property/${application.property.id}`}>
                                View Property
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{user?.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{user?.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard;
