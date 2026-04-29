import { Bell, Globe, Lock, Moon, Palette, Shield, Smartphone, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { data, isLoading } = useCurrentUser();
  const user = data?.user;

  if (isLoading) {
    return (
      <section className="animate-gentle-rise space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </section>
    );
  }

  return (
    <section className="animate-gentle-rise">
      <header className="mb-4 sm:mb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">Settings</h1>
        <p className="mt-1 sm:mt-2 text-base sm:text-lg md:text-xl font-bold text-muted-foreground">
          Manage your preferences
        </p>
      </header>

      <div className="space-y-3 sm:space-y-4">
        {/* Account Settings */}
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="size-5 sm:size-6 text-primary" />
              Account
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div>
                <p className="text-sm sm:text-base font-bold">Email</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{user?.email || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div>
                <p className="text-sm sm:text-base font-bold">Role</p>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize">{user?.role || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div>
                <p className="text-sm sm:text-base font-bold">Phone</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{user?.phone || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="size-5 sm:size-6 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-bold">Push Notifications</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-bold">Email Notifications</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Receive email updates</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-bold">New Listings</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Notify about new produce</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Palette className="size-5 sm:size-6 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Customize the app appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <Moon className="size-5 sm:size-6 text-primary" />
                <div>
                  <p className="text-sm sm:text-base font-bold">Dark Mode</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Enable dark theme</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <Globe className="size-5 sm:size-6 text-primary" />
                <div>
                  <p className="text-sm sm:text-base font-bold">Language</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">English (Default)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="size-5 sm:size-6 text-primary" />
              Privacy & Security
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage your privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0 space-y-3 sm:space-y-4">
            <Button variant="outline" className="w-full justify-start h-auto p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <Lock className="size-5 sm:size-6 text-primary mr-2 sm:mr-3" />
              <div className="text-left flex-1">
                <p className="text-sm sm:text-base font-bold">Change Password</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Update your password</p>
              </div>
            </Button>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-bold">Show Phone Number</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Display on listings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-bold">Show Location</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Display on profile</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="rounded-2xl sm:rounded-3xl border-2 shadow-touch">
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Smartphone className="size-5 sm:size-6 text-primary" />
              App Settings
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Configure app behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0 md:p-6 md:pt-0 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-bold">Offline Mode</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Cache data for offline use</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-bold">Auto-Refresh</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Update listings automatically</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface-leaf">
              <p className="text-sm sm:text-base font-bold mb-1">App Version</p>
              <p className="text-xs sm:text-sm text-muted-foreground">v1.0.0</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="rounded-2xl sm:rounded-3xl border-2 border-destructive/20 shadow-touch">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Settings;
