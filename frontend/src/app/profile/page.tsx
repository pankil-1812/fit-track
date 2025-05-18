"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { userService } from "@/lib/api"
import { User, UserSettings } from "@/lib/types"

// Expanded form validation schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  bio: z.string().max(160).optional(),
  profilePicture: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  fitnessGoal: z.string().optional(),
  fitnessGoals: z.array(z.string()).optional(),
  fitnessLevel: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  injuries: z.array(z.string()).optional(),
  activityLevel: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false)
  const [tab, setTab] = useState("profile")
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default form values from user context
  const defaultValues: Partial<ProfileFormValues> = {
    fullName: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
    gender: user?.gender || "",
    fitnessGoal: user?.fitnessGoal || "",
    fitnessGoals: user?.fitnessGoals || [],
    fitnessLevel: user?.fitnessLevel || "",
    height: user?.height ? String(user.height) : "",
    weight: user?.weight ? String(user.weight) : "",
    injuries: user?.injuries || [],
    activityLevel: user?.activityLevel || "",
  }

  // Initialize form (must be before any early return)
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Handle profile picture upload
  async function handleProfilePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("profilePicture", e.target.files[0]);
      try {
        await userService.uploadProfilePicture(formData);
        await refreshUser();
        setSuccessMsg("Profile picture updated!");
      } catch {
        setErrorMsg("Failed to update profile picture.");
      }
    }
  }

  // Handle form submission
  async function onSubmit(data: ProfileFormValues) {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const updateData = {
        name: data.fullName,
        email: data.email,
        username: data.username,
        bio: data.bio,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        fitnessGoal: data.fitnessGoal,
        fitnessGoals: data.fitnessGoals,
        fitnessLevel: data.fitnessLevel,
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        injuries: data.injuries,
        activityLevel: data.activityLevel,
      };
      await userService.updateUserProfile(updateData);
      await refreshUser();
      setIsEditing(false);
      setSuccessMsg("Profile updated successfully!");
    } catch {
      setErrorMsg("Failed to update profile. Please try again.");
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/80 dark:from-background dark:via-blue-950/60 dark:to-blue-900/80">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <div className="relative">
              <Avatar className="h-20 w-20 shadow-lg border-4 border-primary/30">
                <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 text-xs shadow"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change profile picture"
                >
                  Change
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
            <CardTitle className="text-2xl font-bold mt-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {user.name}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">{user.email}</CardDescription>
            <div className="text-xs text-muted-foreground mt-1">Role: {user.role || "user"}</div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-6 mx-auto">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                {successMsg && <div className="mb-2 p-2 rounded bg-green-100 text-green-700 text-sm">{successMsg}</div>}
                {errorMsg && <div className="mb-2 p-2 rounded bg-red-100 text-red-700 text-sm">{errorMsg}</div>}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="e.g., 5'11\"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (lbs)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="e.g., 180"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fitnessGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Fitness Goal</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your primary fitness goal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                                <SelectItem value="endurance">Improve Endurance</SelectItem>
                                <SelectItem value="strength">Build Strength</SelectItem>
                                <SelectItem value="flexibility">Increase Flexibility</SelectItem>
                                <SelectItem value="general">General Fitness</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fitnessLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fitness Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your fitness level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">Non-binary</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select activity level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sedentary">Sedentary</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="very-active">Very Active</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fitnessGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fitness Goals (multiple)</FormLabel>
                            <div className="flex flex-col gap-1">
                              {[
                                {
                                  value: "weight-loss",
                                  label: "Weight Loss"
                                },
                                {
                                  value: "muscle-gain",
                                  label: "Muscle Gain"
                                },
                                {
                                  value: "endurance",
                                  label: "Endurance"
                                },
                                {
                                  value: "strength",
                                  label: "Strength"
                                },
                                {
                                  value: "flexibility",
                                  label: "Flexibility"
                                },
                                {
                                  value: "general",
                                  label: "General Fitness"
                                }
                              ].map(option => (
                                <label key={option.value} className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    disabled={!isEditing}
                                    checked={field.value?.includes(option.value) || false}
                                    onChange={e => {
                                      if (e.target.checked) {
                                        field.onChange([...(field.value || []), option.value]);
                                      } else {
                                        field.onChange((field.value || []).filter((v: string) => v !== option.value));
                                      }
                                    }}
                                  />
                                  {option.label}
                                </label>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="injuries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Injuries (comma separated)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={!isEditing}
                                placeholder="e.g., knee, shoulder"
                                value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                                onChange={e => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      {isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          type="submit"
                          className="gap-2"
                        >
                          Save Changes
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="gap-2"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="settings">
                <SettingsTab user={user} refreshUser={refreshUser} />
              </TabsContent>
              <TabsContent value="security">
                <SecurityTab refreshUser={refreshUser} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

import React from "react";
import { useForm as useSettingsForm } from "react-hook-form";

function SettingsTab({ user, refreshUser }: { user: User, refreshUser: () => Promise<void> }) {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const settingsForm = useSettingsForm<UserSettings & { notificationsEmail: boolean; notificationsPush: boolean }>({
    defaultValues: {
      profileVisibility: (user?.privacySettings?.profileVisibility as 'public' | 'friends' | 'private') || 'public',
      activityVisibility: (user?.privacySettings?.activityVisibility as 'public' | 'friends' | 'private') || 'public',
      showInLeaderboards: user?.privacySettings?.showInLeaderboards ?? true,
      notificationsEmail: true,
      notificationsPush: false,
    },
  });

  async function onSubmit(data: UserSettings & { notificationsEmail: boolean; notificationsPush: boolean }) {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await userService.updateUserSettings({
        profileVisibility: data.profileVisibility,
        activityVisibility: data.activityVisibility,
        showInLeaderboards: data.showInLeaderboards,
        notificationsEmail: data.notificationsEmail,
        notificationsPush: data.notificationsPush,
      });
      await refreshUser();
      setSuccessMsg("Settings updated!");
    } catch {
      setErrorMsg("Failed to update settings.");
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <form onSubmit={settingsForm.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Profile Visibility</label>
          <select {...settingsForm.register("profileVisibility")} className="w-full rounded border p-2">
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Activity Visibility</label>
          <select {...settingsForm.register("activityVisibility")} className="w-full rounded border p-2">
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...settingsForm.register("showInLeaderboards")} id="showInLeaderboards" />
          <label htmlFor="showInLeaderboards">Show in Leaderboards</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...settingsForm.register("notificationsEmail")} id="notificationsEmail" />
          <label htmlFor="notificationsEmail">Email Notifications</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...settingsForm.register("notificationsPush")} id="notificationsPush" />
          <label htmlFor="notificationsPush">Push Notifications</label>
        </div>
        {successMsg && <div className="p-2 rounded bg-green-100 text-green-700 text-sm">{successMsg}</div>}
        {errorMsg && <div className="p-2 rounded bg-red-100 text-red-700 text-sm">{errorMsg}</div>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" className="gap-2">Save Settings</Button>
        </div>
      </form>
    </div>
  );
}

// --- SecurityTab ---
import { useForm as useSecurityForm } from "react-hook-form";
import { useState as useSecurityState } from "react";

function SecurityTab({ refreshUser }: { refreshUser: () => Promise<void> }) {
  const [successMsg, setSuccessMsg] = useSecurityState("");
  const [errorMsg, setErrorMsg] = useSecurityState("");
  const [loading, setLoading] = useSecurityState(false);

  const securityForm = useSecurityForm<{ currentPassword: string; newPassword: string; confirmPassword: string }>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onPasswordChange(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    setSuccessMsg("");
    setErrorMsg("");
    if (data.newPassword !== data.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await userService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccessMsg("Password updated successfully!");
      securityForm.reset();
      await refreshUser();
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setErrorMsg(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  // 2FA UI placeholder (implement actual logic if backend supports it)
  return (
    <div className="max-w-md mx-auto py-8">
      <form onSubmit={securityForm.handleSubmit(onPasswordChange)} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Current Password</label>
          <input type="password" {...securityForm.register("currentPassword")} className="w-full rounded border p-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input type="password" {...securityForm.register("newPassword")} className="w-full rounded border p-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Confirm New Password</label>
          <input type="password" {...securityForm.register("confirmPassword")} className="w-full rounded border p-2" required />
        </div>
        {successMsg && <div className="p-2 rounded bg-green-100 text-green-700 text-sm">{successMsg}</div>}
        {errorMsg && <div className="p-2 rounded bg-red-100 text-red-700 text-sm">{errorMsg}</div>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" className="gap-2" disabled={loading}>
            {loading ? "Saving..." : "Change Password"}
          </Button>
        </div>
      </form>
      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Two-Factor Authentication (2FA)</span>
          <span className="text-xs text-muted-foreground">(Coming soon)</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Protect your account with an extra layer of security. 2FA support coming soon.
        </div>
      </div>
    </div>
  );
}
