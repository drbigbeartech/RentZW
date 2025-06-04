import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ZIMBABWE_LOCATIONS, PROPERTY_AMENITIES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUpload from "./ImageUpload";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  MapPin,
  DollarSign,
  Home,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  city: z.string().min(1, "Please select a city"),
  suburb: z.string().min(1, "Please select a suburb"),
  propertyType: z.enum(["house", "apartment", "townhouse", "studio", "room"]),
  furnishingStatus: z.enum(["furnished", "unfurnished", "partially_furnished"]),
  priceUSD: z.number().min(1, "Price must be greater than 0"),
  bedrooms: z.number().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.number().min(0, "Bathrooms cannot be negative"),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onSubmit: (
    data: PropertyFormData & { amenities: string[]; images: any[] },
  ) => Promise<void>;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
  submitLabel?: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  initialData = {},
  isLoading = false,
  submitLabel = "Add Property",
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData,
  });

  const selectedCity = watch("city");

  React.useEffect(() => {
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

  const handleFormSubmit = async (data: PropertyFormData) => {
    try {
      setApiError("");

      if (images.length === 0) {
        setApiError("Please upload at least one image");
        return;
      }

      await onSubmit({
        ...data,
        amenities: selectedAmenities,
        images,
      });
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Failed to save property");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {apiError && (
        <Alert variant="destructive">
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Modern 3-bedroom house in Borrowdale"
                {...register("title")}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your property in detail..."
                rows={5}
                {...register("description")}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select
                  onValueChange={(value) => setValue("city", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(ZIMBABWE_LOCATIONS).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="suburb">Suburb *</Label>
                <Select
                  onValueChange={(value) => setValue("suburb", value)}
                  disabled={isLoading || !selectedCity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select suburb" />
                  </SelectTrigger>
                  <SelectContent>
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
                {errors.suburb && (
                  <p className="text-sm text-red-600">
                    {errors.suburb.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Property Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("propertyType", value as any)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="room">Room</SelectItem>
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p className="text-sm text-red-600">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="furnishingStatus">Furnishing Status *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("furnishingStatus", value as any)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furnished">Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    <SelectItem value="partially_furnished">
                      Partially Furnished
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.furnishingStatus && (
                  <p className="text-sm text-red-600">
                    {errors.furnishingStatus.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceUSD">Monthly Rent (USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="priceUSD"
                    type="number"
                    min="1"
                    placeholder="1000"
                    className="pl-10"
                    {...register("priceUSD", { valueAsNumber: true })}
                    disabled={isLoading}
                  />
                </div>
                {errors.priceUSD && (
                  <p className="text-sm text-red-600">
                    {errors.priceUSD.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  placeholder="3"
                  {...register("bedrooms", { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.bedrooms && (
                  <p className="text-sm text-red-600">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="2"
                  {...register("bathrooms", { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.bathrooms && (
                  <p className="text-sm text-red-600">
                    {errors.bathrooms.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Property Images *</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImagesChange={setImages}
              maxImages={5}
              maxSize={10}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
