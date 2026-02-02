import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const testimonials = [
  {
    id: 1,
    name: "Merl R.",
    profit: "Made $2,400 profit this month",
    image: "👨‍💼",
  },
  {
    id: 2,
    name: "Sarah M.",
    profit: "Up $1,800 in a week, amazing!",
    image: "👩‍🦰",
  },
  {
    id: 3,
    name: "Mike T.",
    profit: "Over $3K in profits! Thanks AuraBetz",
    image: "👨‍🦱",
  },
  {
    id: 4,
    name: "Eva L.",
    profit: "$2,700 this month alone",
    image: "👩‍🦳",
  },
];

export default function Landing() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useFirebaseAuth();
  const [location, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Redirect to dashboard if already authenticated (but not on preview route)
  useEffect(() => {
    if (!authLoading && isAuthenticated && location !== "/preview-landing") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
      </div>
    );
  }

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to AuraBetz!");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollTestimonials = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    } else {
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 justify-center">
        {/* Hero Section */}
        <section className="px-4 flex flex-col items-center justify-center">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* Logo/Brand with Glow and Purple Bar */}
            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                AuraBetz
              </h1>
              {/* Purple Bar Under Title */}
              <div className="h-1.5 w-40 mx-auto bg-gradient-to-r from-purple-700 via-purple-500 via-pink-500 to-purple-700 rounded-full shadow-lg shadow-purple-500/80 blur-sm"></div>
              <div className="h-0.5 w-40 mx-auto bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 rounded-full -mt-1.5"></div>
              <p className="text-base md:text-lg text-gray-400 font-light tracking-wide pt-1">
                AI-Powered Sports Picks
              </p>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white">
              Join 50K+ Winners Getting Daily Sports Picks
            </h2>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-400 font-light">
              Start winning with AI-analyzed picks. 70%+ win rate.
            </p>

            {/* CTA Section */}
            <div className="space-y-4 pt-4">
              <Button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full md:w-96 h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                    Starting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </Button>
              <p className="text-gray-400 text-sm font-light">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-16 md:mt-20 px-4 pb-8 md:pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              {/* Left Arrow */}
              <button
                onClick={() => scrollTestimonials("left")}
                className="flex-shrink-0 p-2 hover:bg-gray-800/50 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>

              {/* Testimonials Carousel */}
              <div className="flex-1 overflow-hidden">
                <div className="flex gap-4 transition-transform duration-300">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={`flex-shrink-0 w-full md:w-1/3 p-6 rounded-lg border border-gray-700/50 bg-gray-900/40 backdrop-blur-sm transition-all duration-300 ${
                        index === currentTestimonial ? "opacity-100 scale-100" : "opacity-60 scale-95"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{testimonial.image}</span>
                        <div className="text-left">
                          <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{testimonial.profit}</p>
                      {/* Orange dot indicator */}
                      <div className="mt-3 flex justify-center">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => scrollTestimonials("right")}
                className="flex-shrink-0 p-2 hover:bg-gray-800/50 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
