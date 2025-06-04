import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PropertyForm from "@/components/property/PropertyForm";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const AddProperty: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      // Mock API call - In real app, send to backend
      console.log("Submitting property:", data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Property added successfully!");
      navigate("/dashboard");
    } catch (error) {
      throw new Error("Failed to add property");
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
            You must be logged in to add a property.
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
            Only landlords can add properties. Please create a landlord account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Property
        </h1>
        <p className="text-gray-600">
          Fill in the details below to list your property for rent
        </p>
      </div>

      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProperty;
