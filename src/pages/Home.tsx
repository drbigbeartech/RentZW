import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Property,
  SearchFilters,
  PaginatedResponse,
  PlatformStats,
} from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import PropertyCard from "@/components/property/PropertyCard";
import PropertySearch from "@/components/property/PropertySearch";
import LoadingSpinner, { PageLoader } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  MapPin,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
} from "lucide-react";
import { toast } from "react-hot-toast";

const Home: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<string[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalProperties: 0,
    registeredTenants: 0,
    verifiedLandlords: 0,
    citiesCovered: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Mock data - In real app, fetch from API
      const mockProperties: Property[] = [
        {
          id: "prop1",
          title: "Modern 3-bedroom house in Borrowdale",
          description:
            "Beautiful modern house with garden and swimming pool. This stunning property features contemporary design with spacious rooms, modern finishes, and excellent security.",
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
          ],
          images: [
            {
              id: "img1",
              url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
              alt: "Modern house exterior",
              isPrimary: true,
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
        },
        {
          id: "prop2",
          title: "Cozy 2-bedroom apartment in Avondale",
          description:
            "Well-maintained apartment in quiet neighborhood with easy access to amenities and public transport.",
          location: { city: "Harare", suburb: "Avondale" },
          propertyType: "apartment",
          furnishingStatus: "partially_furnished",
          priceUSD: 800,
          priceZWL: 256000,
          bedrooms: 2,
          bathrooms: 1,
          amenities: ["Security", "Parking", "Wi-Fi"],
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
            email: "mary@example.com",
            fullName: "Mary Johnson",
            phoneNumber: "+263 77 987 6543",
            userType: "landlord",
            isVerified: true,
            createdAt: "2024-01-01T00:00:00Z",
          },
          views: 87,
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "prop3",
          title: "Luxury penthouse in Mount Pleasant",
          description:
            "Exclusive penthouse with panoramic city views, premium finishes, and top-tier amenities.",
          location: { city: "Harare", suburb: "Mount Pleasant" },
          propertyType: "apartment",
          furnishingStatus: "furnished",
          priceUSD: 2500,
          priceZWL: 800000,
          bedrooms: 4,
          bathrooms: 3,
          amenities: [
            "Swimming Pool",
            "Gym",
            "Security",
            "Parking",
            "Air Conditioning",
            "Balcony",
          ],
          images: [
            {
              id: "img3",
              url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
              alt: "Luxury penthouse",
              isPrimary: true,
            },
          ],
          status: "available",
          landlordId: "landlord3",
          landlord: {
            id: "landlord3",
            email: "david@example.com",
            fullName: "David Wilson",
            phoneNumber: "+263 77 555 9999",
            userType: "landlord",
            isVerified: true,
            createdAt: "2024-01-01T00:00:00Z",
          },
          views: 203,
          createdAt: "2024-01-12T00:00:00Z",
          updatedAt: "2024-01-12T00:00:00Z",
        },
        {
          id: "prop4",
          title: "Spacious family home in Newlands",
          description:
            "Perfect family home with large garden, multiple living areas, and excellent schools nearby.",
          location: { city: "Harare", suburb: "Newlands" },
          propertyType: "house",
          furnishingStatus: "unfurnished",
          priceUSD: 1200,
          priceZWL: 384000,
          bedrooms: 4,
          bathrooms: 3,
          amenities: [
            "Garden",
            "Security",
            "Parking",
            "Laundry",
            "Pet Friendly",
          ],
          images: [
            {
              id: "img4",
              url: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800",
              alt: "Family home",
              isPrimary: true,
            },
          ],
          status: "available",
          landlordId: "landlord4",
          landlord: {
            id: "landlord4",
            email: "susan@example.com",
            fullName: "Susan Brown",
            phoneNumber: "+263 77 444 5555",
            userType: "landlord",
            isVerified: true,
            createdAt: "2024-01-01T00:00:00Z",
          },
          views: 156,
          createdAt: "2024-01-08T00:00:00Z",
          updatedAt: "2024-01-08T00:00:00Z",
        },
      ];

      const mockStats: PlatformStats = {
        totalProperties: 127,
        registeredTenants: 1543,
        verifiedLandlords: 89,
        citiesCovered: 8,
      };

      setProperties(mockProperties);
      setPlatformStats(mockStats);
      setTotalPages(Math.ceil(mockProperties.length / 10));

      // Load user's favorites if tenant
      if (user?.userType === "tenant") {
        setFavoritePropertyIds(["prop1"]); // Mock favorite
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setIsSearching(true);
      setActiveFilters(filters);
      setCurrentPage(1);

      // Mock search - In real app, send filters to API
      console.log("Searching with filters:", filters);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, just show message
      if (Object.keys(filters).length > 0) {
        toast.success("Search completed");
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = async (
    propertyId: string,
    isFavorite: boolean,
  ) => {
    if (!user || user.userType !== "tenant") return;

    try {
      if (isFavorite) {
        setFavoritePropertyIds((prev) => [...prev, propertyId]);
        toast.success("Property added to favorites");
      } else {
        setFavoritePropertyIds((prev) =>
          prev.filter((id) => id !== propertyId),
        );
        toast.success("Property removed from favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorite");
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <PageLoader text="Loading properties..." />;
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Find Your Perfect
              <span className="text-blue-600"> Home</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing rental properties across Zimbabwe. From modern
              apartments to family homes, find the perfect place to call home.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {platformStats.totalProperties}+
                </div>
                <div className="text-sm text-gray-600">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {platformStats.registeredTenants}+
                </div>
                <div className="text-sm text-gray-600">Tenants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {platformStats.verifiedLandlords}+
                </div>
                <div className="text-sm text-gray-600">Landlords</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {platformStats.citiesCovered}
                </div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4">
        <PropertySearch onSearch={handleSearch} isLoading={isSearching} />
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="text-gray-600 mt-2">
              Discover our most popular rental properties
            </p>
          </div>

          {Object.keys(activeFilters).length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Search className="h-3 w-3 mr-1" />
                Filtered Results
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveFilters({});
                  loadInitialData();
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {isSearching ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Searching properties..." />
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600 text-center">
                Try adjusting your search filters or check back later for new
                listings.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favoritePropertyIds.includes(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                  showLandlordInfo={false}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of landlords who trust RentZW to connect them with
            quality tenants. List your property today and start receiving
            applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Locations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore rental properties in Zimbabwe's most sought-after
            neighborhoods
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Borrowdale", properties: 23 },
            { name: "Avondale", properties: 18 },
            { name: "Mount Pleasant", properties: 15 },
            { name: "Newlands", properties: 12 },
            { name: "Belgravia", properties: 9 },
            { name: "Greendale", properties: 7 },
            { name: "Hillside", properties: 11 },
            { name: "Burnside", properties: 8 },
          ].map((location) => (
            <Link
              key={location.name}
              to={`/?city=Harare&suburb=${location.name}`}
              className="group"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {location.properties} properties
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
