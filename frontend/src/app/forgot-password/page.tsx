"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetUrl("");
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
      if (res.resetUrl) setResetUrl(res.resetUrl);
    } catch {
      setMessage("No user found with that email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background via-blue-50/60 to-blue-100/80 dark:from-background dark:via-blue-950/60 dark:to-blue-900/80">
      <Card className="w-full max-w-md shadow-xl border-0 bg-gradient-to-br from-background via-white/60 to-blue-100/80 dark:from-background dark:via-blue-950/60 dark:to-blue-900/80">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          {message && (
            <div className="mt-4 text-sm text-primary">{message}</div>
          )}
          {resetUrl && (
            <div className="mt-2 text-xs break-all">
              <span className="font-bold">Reset URL (dev only):</span> <br />
              <span>{resetUrl}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
