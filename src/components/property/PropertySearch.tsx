import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SearchFilters, ZIMBABWE_LOCATIONS, PROPERTY_AMENITIES } from "@/types";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, ChevronDown, X } from "lucide-react";

interface PropertySearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  isLoading?: boolean;
}

const PropertySearch: React.FC<PropertySearchProps> = ({
  onSearch,
  initialFilters = {},
  isLoading = false,
}) => {
  const { currency } = useCurrency();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialFilters.amenities || [],
  );

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<SearchFilters>({
      defaultValues: initialFilters,
    });

  const selectedCity = watch("city");

  useEffect(() => {
    if (selectedCity) {
      setValue("suburb", "");
    }
  }, [selectedCity, setValue]);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities((prev) => {
      if (checked) {
        return [...prev, amenity];
      } else {
        return prev.filter((a) => a !== amenity);
      }
    });
  };

  const onSubmit = (data: SearchFilters) => {
    const filters: SearchFilters = {
      ...data,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    };

    // Remove empty values and "all"/"any" placeholder values
    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof SearchFilters];
      if (
        value === "" ||
        value === undefined ||
        value === null ||
        value === "all" ||
        value === "any"
      ) {
        delete filters[key as keyof SearchFilters];
      }
    });

    onSearch(filters);
  };

  const clearFilters = () => {
    reset();
    setSelectedAmenities([]);
    onSearch({});
  };

  const hasActiveFilters = () => {
    const formData = watch();
    return (
      Object.values(formData).some(
        (value) =>
          value !== "" &&
          value !== undefined &&
          value !== "all" &&
          value !== "any",
      ) || selectedAmenities.length > 0
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Search Properties</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyword">Keyword</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="keyword"
                  placeholder="Search by title or location..."
                  className="pl-10"
                  {...register("keyword")}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select
                onValueChange={(value) => setValue("city", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {Object.keys(ZIMBABWE_LOCATIONS).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb</Label>
              <Select
                onValueChange={(value) => setValue("suburb", value)}
                disabled={isLoading || !selectedCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select suburb" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suburbs</SelectItem>
                  {selectedCity &&
                    ZIMBABWE_LOCATIONS[
                      selectedCity as keyof typeof ZIMBABWE_LOCATIONS
                    ]?.map((suburb) => (
                      <SelectItem key={suburb} value={suburb}>
                        {suburb}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                onValueChange={(value) =>
                  setValue("propertyType", value as any)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {Object.keys(ZIMBABWE_LOCATIONS).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" type="button" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Min Price ({currency})</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    {...register("minPrice", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Price ({currency})</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Any"
                    {...register("maxPrice", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("bedrooms", value ? parseInt(value) : undefined)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furnishingStatus">Furnishing</Label>
                  <Select
                    onValueChange={(value) => setValue('bedrooms', (value && value !== 'any') ? parseInt(value) : undefined)}
                    disabled={isLoading}
                  >
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="furnished">Furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="partially_furnished">
                        Partially Furnished
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {PROPERTY_AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(amenity, checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={amenity}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search Properties
            </Button>

            {hasActiveFilters() && (
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertySearch;