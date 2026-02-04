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
  { id: "+EV", name: "+EV Picks", icon: "💰", disabled: true },
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
    const sport = POPULAR_SPORTS.find(s => s.id === sportId);
    if (sport?.disabled) {
      toast.info("+EV Picks coming soon!");
      return;
    }

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center relative z-10">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Which sports do you want picks for?
          </h1>
          <p className="text-gray-400 text-base md:text-lg font-light">
            Choose up to 5 — we'll prioritize these for you later.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl">
          {POPULAR_SPORTS.map((sport) => {
            const isSelected = selected.includes(sport.id);
            const isDisabled = sport.disabled;
            return (
              <button
                key={sport.id}
                onClick={() => toggleSport(sport.id)}
                className={`
                  px-4 py-2.5 md:px-5 md:py-3 rounded-full font-bold text-sm md:text-base transition-all duration-200 flex items-center gap-2 border
                  ${
                    isDisabled
                      ? "bg-gray-900/30 text-gray-600 border-gray-800/50 cursor-not-allowed opacity-50"
                      : isSelected
                        ? "bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-105"
                        : "bg-[#111] text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
                  }
                `}
              >
                <span className="text-lg md:text-xl">{sport.icon}</span>
                <span>{sport.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-gray-500 text-xs font-medium">
          {selected.length} of 5 selected
        </div>
      </div>

      <div className="mt-12 w-full max-w-md flex flex-col items-center gap-4 relative z-10">
        <Button
          onClick={() => handleSave(false)}
          disabled={selected.length === 0 || saving}
          className={`
            w-full py-6 rounded-xl font-bold text-lg transition-all
            ${
              selected.length === 0 || saving
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
            }
          `}
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Show my picks (${selected.length}/5)`
          )}
        </Button>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="text-orange-500 hover:text-orange-400 underline text-sm font-medium transition-colors"
          >
            All picks for now
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
