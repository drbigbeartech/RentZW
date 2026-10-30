import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Property, DashboardStats } from "@/types";
import { propertyService } from "@/lib/propertyService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader } from "@/components/common/LoadingSpinner";
import {
  Home,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  TrendingUp,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Trash2,
  Shield,
  Star,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";

const LandlordDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalApplications: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const isSuperAdmin = user?.userType === "admin";
      const [myProps, myInquiries] = await Promise.all([
        propertyService.getMyProperties(user?.id || "", isSuperAdmin),
        propertyService.getInquiriesForLandlord(user?.id || "", isSuperAdmin),
      ]);

      setProperties(myProps);
      setInquiries(myInquiries);

      const totalViews = myProps.reduce((sum, prop) => sum + (prop.views || 0), 0);
      const myStats: DashboardStats = {
        totalProperties: myProps.length,
        totalViews,
        totalInquiries: myInquiries.length,
        totalApplications: myInquiries.length,
      };

      setStats(myStats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoostListing = async (propertyId: string) => {
    try {
      await propertyService.boostProperty(propertyId);
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, isFeatured: true } : p))
      );
      toast.success("Listing upgraded to Featured! It will now appear at the top of search results.");
    } catch (err) {
      toast.error("Failed to boost listing");
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this property listing?")) {
      return;
    }
    try {
      await propertyService.deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      toast.success("Property listing removed successfully");
    } catch (err) {
      toast.error("Failed to delete property listing");
    }
  };

  const handleInquiryStatus = async (inquiryId: string, status: "approved" | "rejected") => {
    try {
      await propertyService.updateInquiryStatus(inquiryId, status);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
      );
      toast.success(
        status === "approved" 
          ? "Viewing appointment confirmed! The tenant has been notified."
          : "Viewing request declined."
      );
    } catch (err) {
      toast.error("Failed to update inquiry status");
    }
  };

  const getPropertyStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="default" className="bg-green-600">Available</Badge>;
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
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.fullName}!
            </h1>
            {isAdmin && (
              <Badge className="bg-indigo-600 text-white">
                <Shield className="h-3 w-3 mr-1" /> Admin Portal
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            {isAdmin 
              ? "Administrator Overview: Viewing all platform listings & database records" 
              : "Manage your property listings, views, and in-app viewing requests"}
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
              {isAdmin ? "Total Platform Listings" : "Your Properties"}
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">Tenant visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewing Inquiries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">In-app requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 capitalize">
              {user?.userType || "Active"}
            </div>
            <p className="text-xs text-muted-foreground">Verified Member</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList>
          <TabsTrigger value="properties">
            {isAdmin ? "All Properties" : "My Properties"} ({properties.length})
          </TabsTrigger>
          <TabsTrigger value="inquiries">
            Viewing Requests ({inquiries.length})
          </TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          {properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties listed yet
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  List your property to start connecting with tenants across Zimbabwe.
                </p>
                <Button asChild>
                  <Link to="/add-property">
                    <Plus className="h-4 w-4 mr-2" />
                    List a Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <Card key={property.id} className={property.isFeatured ? "border-amber-300 bg-amber-50/20" : ""}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Image */}
                      <div className="lg:w-48 flex-shrink-0">
                        <Link to={`/property/${property.id}`}>
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative">
                            <img
                              src={property.images[0]?.url}
                              alt={property.images[0]?.alt}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                            {property.isFeatured && (
                              <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-xs">
                                <Star className="h-3 w-3 mr-1 fill-white" /> Featured
                              </Badge>
                            )}
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
                              <MapPin className="h-4 w-4 mr-1 text-red-500" />
                              <span>
                                {property.location.suburb}, {property.location.city}
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
                            <Home className="h-4 w-4 text-gray-400" />
                            <span>
                              {property.bedrooms} bed, {property.bathrooms} bath
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-gray-900">${property.priceUSD}/mo</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>ID: {property.id.slice(0, 8)}...</span>
                          </div>
                        </div>

                        {/* Property Actions & Boost Monetization */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/property/${property.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Live
                            </Link>
                          </Button>

                          {!property.isFeatured ? (
                            <Button
                              size="sm"
                              className="bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                              onClick={() => handleBoostListing(property.id)}
                            >
                              <Sparkles className="h-4 w-4 mr-1" />
                              Boost Listing (Featured Ad)
                            </Button>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300 py-1.5 px-3">
                              ⭐ Boosted / Featured
                            </Badge>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Listing
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

        {/* Viewing Requests Tab (In-App Leads) */}
        <TabsContent value="inquiries" className="space-y-6">
          {inquiries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No viewing inquiries yet
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  When prospective tenants book viewing appointments or inquire through RentZW, they will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <Card key={inq.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {inq.tenant_name || "Prospective Tenant"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Property: <strong>{inq.properties?.title || inq.property_id}</strong>
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Received {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                          {inq.viewing_date && (
                            <span className="flex items-center text-blue-600 font-medium">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              Requested Date: {inq.viewing_date} ({inq.viewing_time_slot})
                            </span>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant={
                          inq.status === "approved"
                            ? "default"
                            : inq.status === "rejected"
                            ? "destructive"
                            : "outline"
                        }
                        className={inq.status === "approved" ? "bg-emerald-600" : ""}
                      >
                        {inq.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm bg-gray-50 p-4 rounded-md mt-4">
                      <div>
                        <span className="text-xs text-gray-500">Contact Number:</span>
                        <p className="font-semibold text-gray-900">{inq.tenant_phone}</p>
                      </div>
                      {inq.tenant_email && (
                        <div>
                          <span className="text-xs text-gray-500">Email Address:</span>
                          <p className="font-medium text-gray-800">{inq.tenant_email}</p>
                        </div>
                      )}
                      {inq.message && (
                        <div className="col-span-1 md:col-span-2">
                          <span className="text-xs text-gray-500">Tenant Note:</span>
                          <p className="text-gray-700 italic mt-0.5">"{inq.message}"</p>
                        </div>
                      )}
                    </div>

                    {inq.status === "pending" && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleInquiryStatus(inq.id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm Appointment
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleInquiryStatus(inq.id, "rejected")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Account Information</span>
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
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone / WhatsApp</p>
                    <p className="font-medium">{user?.phoneNumber || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium capitalize">{user?.userType}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandlordDashboard;
