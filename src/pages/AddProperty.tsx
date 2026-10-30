import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PropertyForm from "@/components/property/PropertyForm";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { propertyService } from "@/lib/propertyService";

const AddProperty: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      const newProp = await propertyService.createProperty({
        title: data.title,
        description: data.description,
        city: data.city,
        suburb: data.suburb,
        propertyType: data.propertyType,
        furnishingStatus: data.furnishingStatus,
        priceUSD: Number(data.priceUSD),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        amenities: data.amenities || [],
        images: data.images?.length > 0 ? data.images : [
          {
            id: 'default',
            url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            alt: data.title,
            isPrimary: true,
          },
        ],
        landlordName: user?.fullName || "Verified Landlord",
        landlordPhone: user?.phoneNumber || "+263 77 123 4567",
        landlordEmail: user?.email || "landlord@rentzw.com",
      });

      toast.success("Property published successfully to RentZW!");
      navigate(`/property/${newProp.id}`);
    } catch (error: any) {
      console.error("Failed to add property:", error);
      toast.error(error?.message || "Failed to add property");
      throw error;
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading..." />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in as a landlord to list a property.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (user.userType !== "landlord") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only landlords can list properties. Please sign in with or switch to a landlord account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          List a New Property
        </h1>
        <p className="text-gray-600">
          Fill in the details below to list your property for rent across Zimbabwe
        </p>
      </div>

      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProperty;
