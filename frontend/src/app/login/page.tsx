"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useAuth } from "@/lib/auth-context"

// Form validation schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export default function Login() {
  // Default form values
  const defaultValues: Partial<LoginFormValues> = {
    email: "",
    password: "",
  }
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const { login } = useAuth();
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  })
  // Handle form submission
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setLoginError("")
    try {
      await login(data.email, data.password)
      window.location.href = "/routines"
    } catch (error) {
      setLoginError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background via-blue-50/60 to-blue-100/80 dark:from-background dark:via-blue-950/60 dark:to-blue-900/80">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background via-white/60 to-blue-100/80 dark:from-background dark:via-blue-950/60 dark:to-blue-900/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <div className="mb-4 p-3 text-sm border border-red-300 bg-red-50 text-red-600 rounded">
                {loginError}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          type="email"
                          autoComplete="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password" 
                          autoComplete="current-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
