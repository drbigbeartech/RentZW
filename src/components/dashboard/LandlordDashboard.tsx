import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Property, PropertyApplication, DashboardStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PropertyCard from "@/components/property/PropertyCard";
import LoadingSpinner, { PageLoader } from "@/components/common/LoadingSpinner";
import {
  Home,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const LandlordDashboard: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<PropertyApplication[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalApplications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Mock data - In real app, fetch from API
      const mockProperties: Property[] = [
        {
          id: "prop1",
          title: "Modern 3-bedroom house in Borrowdale",
          description: "Beautiful modern house with garden and swimming pool",
          location: { city: "Harare", suburb: "Borrowdale" },
          propertyType: "house",
          furnishingStatus: "furnished",
          priceUSD: 1500,
          priceZWL: 480000,
          bedrooms: 3,
          bathrooms: 2,
          amenities: ["Swimming Pool", "Security", "Parking", "Garden"],
          images: [
            {
              id: "img1",
              url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
              alt: "Modern house",
              isPrimary: true,
            },
          ],
          status: "available",
          landlordId: user?.id || "",
          landlord: user!,
          views: 45,
          createdAt: "2024-01-10T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        },
        {
          id: "prop2",
          title: "Luxury apartment in Mount Pleasant",
          description: "High-end apartment with city views",
          location: { city: "Harare", suburb: "Mount Pleasant" },
          propertyType: "apartment",
          furnishingStatus: "furnished",
          priceUSD: 1200,
          priceZWL: 384000,
          bedrooms: 2,
          bathrooms: 2,
          amenities: ["Security", "Parking", "Gym", "Swimming Pool"],
          images: [
            {
              id: "img2",
              url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
              alt: "Luxury apartment",
              isPrimary: true,
            },
          ],
          status: "rented",
          landlordId: user?.id || "",
          landlord: user!,
          views: 67,
          createdAt: "2024-01-05T00:00:00Z",
          updatedAt: "2024-01-05T00:00:00Z",
        },
      ];

      const mockApplications: PropertyApplication[] = [
        {
          id: "app1",
          propertyId: "prop1",
          tenantId: "tenant1",
          message:
            "I am very interested in this property. I have stable income and excellent references.",
          status: "pending",
          createdAt: "2024-01-20T14:00:00Z",
          property: mockProperties[0],
          tenant: {
            id: "tenant1",
            email: "tenant@example.com",
            fullName: "Alice Johnson",
            phoneNumber: "+263 77 555 1234",
            userType: "tenant",
            isVerified: true,
            createdAt: "2024-01-01T00:00:00Z",
          },
        },
      ];

      const mockStats: DashboardStats = {
        totalProperties: mockProperties.length,
        totalViews: mockProperties.reduce((sum, prop) => sum + prop.views, 0),
        totalInquiries: 5,
        totalApplications: mockApplications.length,
      };

      setProperties(mockProperties);
      setApplications(mockApplications);
      setStats(mockStats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationAction = async (
    applicationId: string,
    action: "approve" | "reject",
  ) => {
    try {
      // Mock API call
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: action === "approve" ? "approved" : "rejected" }
            : app,
        ),
      );

      toast.success(
        `Application ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
    } catch (error) {
      toast.error(`Failed to ${action} application`);
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

  const getPropertyStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "rented":
        return <Badge variant="secondary">Rented</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            Manage your properties and applications
          </p>
        </div>
        <Button asChild>
          <Link to="/add-property">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Properties listed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">Property views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Rental applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">Total inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Properties */}
        <TabsContent value="properties" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Properties</h2>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{properties.length} properties</Badge>
              <Button asChild>
                <Link to="/add-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>
          </div>

          {properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties listed yet
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Start by adding your first property to begin receiving
                  applications from tenants.
                </p>
                <Button asChild>
                  <Link to="/add-property">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Image */}
                      <div className="lg:w-48 flex-shrink-0">
                        <Link to={`/property/${property.id}`}>
                          <div className="aspect-[4/3] rounded-lg overflow-hidden">
                            <img
                              src={property.images[0]?.url}
                              alt={property.images[0]?.alt}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        </Link>
                      </div>

                      {/* Property Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <Link
                              to={`/property/${property.id}`}
                              className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {property.title}
                            </Link>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>
                                {property.location.suburb},{" "}
                                {property.location.city}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPropertyStatusBadge(property.status)}
                          </div>
                        </div>

                        {/* Property Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span>{property.views} views</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>
                              {
                                applications.filter(
                                  (app) => app.propertyId === property.id,
                                ).length
                              }{" "}
                              applications
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            <span>
                              {property.bedrooms} bed, {property.bathrooms} bath
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span>${property.priceUSD}/month</span>
                          </div>
                        </div>

                        {/* Property Actions */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/property/${property.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Applications (
                            {
                              applications.filter(
                                (app) => app.propertyId === property.id,
                              ).length
                            }
                            )
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Applications */}
        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Property Applications</h2>
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
                  Once tenants start applying for your properties, you'll see
                  their applications here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Application Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {application.tenant.fullName}
                          </h3>
                          <p className="text-gray-600">
                            Applied for: {application.property.title}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Applied on{" "}
                              {new Date(
                                application.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getApplicationStatusIcon(application.status)}
                          {getApplicationStatusBadge(application.status)}
                        </div>
                      </div>

                      {/* Tenant Contact Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Contact Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{application.tenant.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{application.tenant.phoneNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Application Message */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Application Message:
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {application.message}
                        </p>
                      </div>

                      {/* Actions */}
                      {application.status === "pending" && (
                        <div className="flex space-x-2 pt-4 border-t border-gray-200">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApplicationAction(application.id, "approve")
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleApplicationAction(application.id, "reject")
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact Tenant
                          </Button>
                        </div>
                      )}
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

export default LandlordDashboard;
