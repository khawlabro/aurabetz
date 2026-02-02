import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User, Heart, Users, Lock, Facebook, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { getPicksWithUserStatus, followPick, unfollowPick, type PickWithStatus } from "@/lib/firestore";
import { toast } from "sonner";
import MembershipUnlockModal from "@/components/MembershipUnlockModal";

export default function Dashboard() {
  const { user, loading, signOut } = useFirebaseAuth();
  const [, navigate] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [picks, setPicks] = useState<PickWithStatus[]>([]);
  const [picksLoading, setPicksLoading] = useState(true);
  const [followingPickId, setFollowingPickId] = useState<string | null>(null);

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Load picks when user is authenticated
  useEffect(() => {
    if (user) {
      loadPicks();
    }
  }, [user]);

  const loadPicks = async () => {
    if (!user) return;
    
    setPicksLoading(true);
    try {
      const picksData = await getPicksWithUserStatus(user.id);
      setPicks(picksData);
    } catch (error) {
      console.error("Error loading picks:", error);
      toast.error("Failed to load picks");
    } finally {
      setPicksLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  };

  const handleFollowPick = async (pickId: string) => {
    if (!user) return;
    
    setFollowingPickId(pickId);
    try {
      const result = await followPick(pickId, user.id);
      if (result.success) {
        toast.success("Pick followed!");
        await loadPicks();
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("Failed to follow pick");
    } finally {
      setFollowingPickId(null);
    }
  };

  const handleUnfollowPick = async (pickId: string) => {
    if (!user) return;
    
    setFollowingPickId(pickId);
    try {
      const result = await unfollowPick(pickId, user.id);
      if (result.success) {
        toast.success("Pick unfollowed");
        await loadPicks();
      }
    } catch (error) {
      console.error("Unfollow error:", error);
      toast.error("Failed to unfollow pick");
    } finally {
      setFollowingPickId(null);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <h1 className="text-2xl font-bold">AuraBetz</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-orange-500" />
              <span className="text-muted-foreground">{user.email}</span>
              <a
                href="https://www.facebook.com/aurabetz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-1.5 ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors hover:shadow-blue-500/30 hover:shadow-md"
                title="Follow us on Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile")}
              className="border-orange-500/30 hover:border-orange-500"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="border-orange-500/30 hover:border-orange-500"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Recent Wins & Picks</h2>
          <p className="text-muted-foreground">
            Browse our latest AI-analyzed picks. Follow the ones you want to track.
          </p>
        </div>

        {/* Unlock CTA Card */}
        <div className="mb-8 bg-gradient-to-r from-orange-900/20 to-orange-800/20 border border-orange-700/50 rounded-xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Unlock Premium Picks
            </h3>
            <p className="text-sm text-gray-300">
              Get access to all daily picks and exclusive AI analysis for just $5 this week
            </p>
          </div>
          <Button
            onClick={() => setIsUnlockModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold whitespace-nowrap"
          >
            Become a Member
          </Button>
        </div>

        {/* Horizontal Scrollable Picks */}
        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur p-2 rounded-full border border-border/50 hover:border-orange-500/50 transition-colors hidden md:flex items-center justify-center"
          >
            <span className="text-xl">←</span>
          </button>

          {/* Picks Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide flex gap-4 pb-4"
            style={{ scrollBehavior: "smooth" }}
          >
            {picksLoading ? (
              <div className="flex items-center justify-center w-full py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                  <p className="text-muted-foreground">Loading picks...</p>
                </div>
              </div>
            ) : picks.length === 0 ? (
              <div className="flex items-center justify-center w-full py-12">
                <p className="text-muted-foreground">No picks available today</p>
              </div>
            ) : (
              picks.map((pick) => (
                <Card
                  key={pick.id}
                  className="flex-shrink-0 w-80 bg-card border-border/50 hover:border-orange-500/50 transition-colors overflow-hidden"
                >
                  <div className="p-6 h-full flex flex-col justify-between space-y-4">
                    {/* Sport and Date */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                          {pick.sport}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(pick.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{pick.matchup}</h3>
                    </div>

                    {/* Pick Details */}
                    <div className="bg-background/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pick:</span>
                        <span className="font-bold text-orange-500">{pick.pick}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Odds:</span>
                        <span className="font-semibold">{pick.odds}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 transition-all"
                              style={{ width: `${pick.confidence}%` }}
                            />
                          </div>
                          <span className="font-semibold text-orange-500 text-sm">{pick.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 font-semibold">AI Analysis:</p>
                      <p className="text-sm leading-relaxed text-gray-300 line-clamp-3">
                        {pick.analysis}
                      </p>
                    </div>

                    {/* Followers Count */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>
                        <span className="font-bold text-orange-500">{pick.followerCount}</span> users
                        confirmed
                      </span>
                    </div>

                    {/* Follow Button */}
                    <Button
                      onClick={() =>
                        pick.isFollowing
                          ? handleUnfollowPick(pick.id)
                          : handleFollowPick(pick.id)
                      }
                      disabled={followingPickId === pick.id}
                      className={`w-full font-semibold transition-all ${
                        pick.isFollowing
                          ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-500 border border-orange-500/50"
                          : "bg-orange-600 hover:bg-orange-500 text-white"
                      }`}
                    >
                      {followingPickId === pick.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Heart
                          className={`w-4 h-4 mr-2 ${pick.isFollowing ? "fill-current" : ""}`}
                        />
                      )}
                      {pick.isFollowing ? "Following" : "Follow Pick"}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur p-2 rounded-full border border-border/50 hover:border-orange-500/50 transition-colors hidden md:flex items-center justify-center"
          >
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Mobile Scroll Hint */}
        <div className="md:hidden mt-4 text-center">
          <p className="text-xs text-muted-foreground">← Swipe to see more picks →</p>
        </div>
      </main>

      {/* Membership Unlock Modal */}
      <MembershipUnlockModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
      />
    </div>
  );
}
