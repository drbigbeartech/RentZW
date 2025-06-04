import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const DemoCredentials: React.FC = () => {
  return (
    <Alert className="mb-6">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Demo Mode:</strong> You can test with these credentials or
        create a new account:
        <div className="mt-2 space-y-1 text-sm">
          <div>
            <strong>Tenant:</strong> tenant@example.com / password123
          </div>
          <div>
            <strong>Landlord:</strong> landlord@example.com / password123
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DemoCredentials;
