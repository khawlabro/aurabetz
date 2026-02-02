import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, User, Trophy, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { getUserProfile, type UserProfile } from "@/lib/firestore";

export default function Profile() {
  const { user, loading } = useFirebaseAuth();
  const [, navigate] = useLocation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Load user profile
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const profile = await getUserProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.name || userProfile?.name || "User";
  const displayEmail = user.email || userProfile?.email || "No email";

  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const lastSignIn = userProfile?.lastSignedIn
    ? new Date(userProfile.lastSignedIn).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        {/* Profile Header */}
        <Card className="bg-card border-border/50 p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{displayName}</h2>
              <p className="text-muted-foreground">Member</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-6 border-t border-border/50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{displayEmail}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Statistics */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Account Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                  <p className="text-lg font-semibold">{joinDate}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </Card>

            <Card className="bg-card border-border/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Sign In</p>
                  <p className="text-lg font-semibold">{lastSignIn}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </Card>

            <Card className="bg-card border-border/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                  <p className="text-lg font-semibold text-orange-500">70%</p>
                </div>
                <Trophy className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </Card>

            <Card className="bg-card border-border/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Picks</p>
                  <p className="text-lg font-semibold text-orange-500">156</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </Card>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Account Settings</h3>
          <Card className="bg-card border-border/50 p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive daily pick updates</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get alerts for new picks</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Receive promotional offers</p>
              </div>
              <input type="checkbox" className="w-5 h-5 cursor-pointer" />
            </div>
          </Card>
        </div>

        {/* Danger Zone */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-destructive">Danger Zone</h3>
          <Card className="bg-card border-destructive/30 p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </Card>
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="w-full border-orange-500/30 hover:border-orange-500"
        >
          Back to Dashboard
        </Button>
      </main>
    </div>
  );
}
