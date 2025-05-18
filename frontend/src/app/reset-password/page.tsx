"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/lib/api";

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const resetToken = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!resetToken) {
      setMessage("Invalid or missing reset token.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(resetToken, password);
      setMessage("Password reset successful! You can now log in.");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setMessage("Invalid or expired reset token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background via-blue-50/60 to-blue-100/80 dark:from-background dark:via-blue-950/60 dark:to-blue-900/80">
      <Card className="w-full max-w-md shadow-xl border-0 bg-gradient-to-br from-background via-white/60 to-blue-100/80 dark:from-background dark:via-blue-950/60 dark:to-blue-900/80">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          {message && (
            <div className="mt-4 text-sm text-primary">{message}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
