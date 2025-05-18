"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AuthDebugPage() {
  const { isAuthenticated, user } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<{
    token: string | null;
    user: string | null;
  }>({ token: null, user: null });
  
  // Get local storage data on mount and when it changes
  useEffect(() => {
    const checkLocalStorage = () => {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");
      setLocalStorageData({ token, user: userStr });
    };
    
    checkLocalStorage();
    
    // Check every second
    const interval = setInterval(checkLocalStorage, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Manually trigger auth change event
  const triggerAuthChange = () => {
    window.dispatchEvent(new Event("auth-change"));
  };
  
  // Clear local storage
  const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    triggerAuthChange();
  };
  
  // Force page refresh
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-lg font-medium mb-2">Auth Context State</h2>
            <div className="bg-muted p-4 rounded-md">
              <p><strong>isAuthenticated:</strong> {isAuthenticated ? "true" : "false"}</p>
              <p><strong>user:</strong> {user ? JSON.stringify(user, null, 2) : "null"}</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-lg font-medium mb-2">Local Storage</h2>
            <div className="bg-muted p-4 rounded-md">
              <p><strong>authToken:</strong> {localStorageData.token ? "exists" : "null"}</p>
              <p><strong>user:</strong> {localStorageData.user ? localStorageData.user : "null"}</p>
            </div>
          </section>
          
          <div className="flex gap-4">
            <Button onClick={triggerAuthChange}>Trigger Auth Change Event</Button>
            <Button onClick={clearAuth} variant="destructive">Clear Auth Data</Button>
            <Button onClick={refreshPage}>Refresh Page</Button>
          </div>
          
          <div className="pt-4 border-t">
            <Link href="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
