import { useState } from "react";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const popularSports = [
  { id: "Hockey", name: "Hockey" },
  { id: "UFC", name: "UFC" },
  { id: "Basketball", name: "Basketball" },
  { id: "Football", name: "Football" },
  { id: "ESports", name: "ESports" },
  { id: "Soccer", name: "Soccer" },
  { id: "Tennis", name: "Tennis" },
  { id: "Baseball", name: "Baseball" },
  { id: "Table Tennis", name: "Table Tennis" },
];

export default function Onboarding() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useFirebaseAuth();
  const [, navigate] = useLocation();

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

    setIsLoading(true);
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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated background gradient (matching landing) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Which sports do you want picks for?
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Choose up to 5 — we'll prioritize these for you later. You can change this anytime.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-4">
          {popularSports.map((sport) => {
            const isSelected = selected.includes(sport.id);
            return (
              <button
                key={sport.id}
                onClick={() => toggleSport(sport.id)}
                className={`
                  px-6 py-3 rounded-full font-bold text-base transition-all duration-200
                  ${
                    isSelected
                      ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105"
                      : "bg-[#111] text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white"
                  }
                `}
              >
                {sport.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom fixed bar */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
        <div className="max-w-md mx-auto flex flex-col items-center gap-4">
          <button
            onClick={() => handleSave(false)}
            disabled={selected.length === 0 || isLoading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center
              ${
                selected.length === 0 || isLoading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20"
              }
            `}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              `Show my picks (${selected.length}/5)`
            )}
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="text-orange-500 hover:text-orange-400 underline text-sm font-medium transition-colors"
          >
            All picks for now
          </button>
          
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-500 hover:text-gray-400 text-xs font-light transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
