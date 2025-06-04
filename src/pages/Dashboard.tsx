import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import TenantDashboard from "@/components/dashboard/TenantDashboard";
import LandlordDashboard from "@/components/dashboard/LandlordDashboard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user.userType === "tenant" ? <TenantDashboard /> : <LandlordDashboard />}
    </div>
  );
};

export default Dashboard;
