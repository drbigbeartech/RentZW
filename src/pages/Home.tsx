import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Property,
  SearchFilters,
  PlatformStats,
} from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import PropertyCard from "@/components/property/PropertyCard";
import PropertySearch from "@/components/property/PropertySearch";
import LoadingSpinner, { PageLoader } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  MapPin,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { propertyService } from "@/lib/propertyService";

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
      const [res, stats] = await Promise.all([
        propertyService.getProperties({}, 1, 12),
        propertyService.getStats(),
      ]);

      setProperties(res.properties);
      setTotalPages(res.totalPages);
      setPlatformStats(stats);
    } catch (error) {
      console.error("Failed to load properties:", error);
      toast.error("Failed to load properties from database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setIsSearching(true);
      setActiveFilters(filters);
      setCurrentPage(1);

      const res = await propertyService.getProperties(filters, 1, 12);
      setProperties(res.properties);
      setTotalPages(res.totalPages);

      if (res.total > 0) {
        toast.success(`Found ${res.total} propert${res.total === 1 ? 'y' : 'ies'}`);
      } else {
        toast.info("No properties found matching your search");
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

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    try {
      setIsSearching(true);
      const res = await propertyService.getProperties(activeFilters, page, 12);
      setProperties(res.properties);
      setTotalPages(res.totalPages);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Failed to load page");
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading live properties..." />;
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
              Discover verified rental properties across Zimbabwe. From modern
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
              Discover our latest verified rental properties in Zimbabwe
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

      {/* Why Choose RentZW */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose RentZW?
            </h2>
            <p className="text-gray-600">
              The smartest and most secure way to rent in Zimbabwe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Local Expertise
              </h3>
              <p className="text-gray-600">
                Tailored for Zimbabwe's property market with local currency
                support and verified neighborhoods.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verified Users
              </h3>
              <p className="text-gray-600">
                Direct WhatsApp contact with verified landlords and genuine tenants for safe transactions.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fair Pricing
              </h3>
              <p className="text-gray-600">
                Transparent pricing with dual currency support (USD & ZWL)
                and real-time exchange rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Are You a Landlord?
            </h2>
            <p className="text-blue-100 text-lg">
              List your property on RentZW and connect with thousands of
              verified tenants across Zimbabwe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup?type=landlord">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  List Your Property
                </Button>
              </Link>
              <Link to="/signup?type=tenant">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-blue-700 font-semibold"
                >
                  Find a Rental
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
