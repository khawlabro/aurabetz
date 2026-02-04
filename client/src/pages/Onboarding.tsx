import { useState } from "react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const POPULAR_SPORTS = [
  { id: "UFC", name: "UFC", icon: "🥊" },
  { id: "NBA", name: "NBA", icon: "🏀" },
  { id: "NFL", name: "NFL", icon: "🏈" },
  { id: "MLB", name: "MLB", icon: "⚾" },
  { id: "NHL", name: "NHL", icon: "🏒" },
  { id: "BOXING", name: "Boxing", icon: "🥊" },
  { id: "TENNIS", name: "Tennis", icon: "🎾" },
  { id: "SOCCER", name: "Soccer", icon: "⚽" },
  { id: "ESPORTS", name: "ESports", icon: "🎮" },
];

export default function Onboarding() {
  const { user, loading: authLoading } = useFirebaseAuth();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const toggleSport = (sportId: string) => {
    if (selected.includes(sportId)) {
      setSelected(selected.filter((s) => s !== sportId));
    } else if (selected.length < 5) {
      setSelected([...selected, sportId]);
    } else {
      toast.info("Max 5 reached — remove one to add another");
    }
  };

  const handleSave = async (wantsAll = false) => {
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.id),
        {
          preferredSports: wantsAll ? [] : selected,
          wantsAllPicks: wantsAll,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      toast.success("Preferences saved!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-3xl w-full flex flex-col items-center relative z-10 mb-32">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Which sports do you <br className="hidden md:block" /> want picks for?
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light max-w-lg mx-auto">
            Choose up to 5 — we'll prioritize these for you later. You can change this anytime.
          </p>
        </div>

        {/* Sports Selection - Hybrid Pill/Grid Layout */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-2xl">
          {POPULAR_SPORTS.map((sport) => {
            const isSelected = selected.includes(sport.id);
            return (
              <button
                key={sport.id}
                onClick={() => toggleSport(sport.id)}
                className={`
                  px-6 py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 flex items-center gap-3 border
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.3)] scale-105"
                      : "bg-[#111] text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white hover:bg-[#1a1a1a]"
                  }
                `}
              >
                <span className="text-2xl">{sport.icon}</span>
                <span>{sport.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selection Counter */}
        <div className="mt-8 text-gray-500 text-sm font-medium">
          {selected.length} of 5 selected
        </div>
      </div>

      {/* Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/95 to-transparent z-20">
        <div className="max-w-md mx-auto flex flex-col items-center gap-4">
          <Button
            onClick={() => handleSave(false)}
            disabled={selected.length === 0 || saving}
            className={`
              w-full py-7 rounded-2xl font-black text-xl transition-all duration-300
              ${
                selected.length === 0 || saving
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98]"
              }
            `}
          >
            {saving ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              `Show my picks (${selected.length}/5)`
            )}
          </Button>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="text-orange-500 hover:text-orange-400 underline text-sm font-bold transition-colors"
            >
              All picks for now
            </button>
            
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-400 text-xs font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
