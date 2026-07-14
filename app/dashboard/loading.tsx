"use client"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ocean-deep)] via-[var(--color-ocean-medium)] to-[var(--color-ocean-light)] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        {/* Animated water ripples */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/20"
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                animation: `ripple ${3 + i * 0.5}s ease-out infinite`,
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center mb-6 mx-auto pulse-glow">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Ocean Dashboard</h2>
        <p className="text-white/60">Initializing real-time hazard monitoring...</p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full mx-auto mt-6 overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full animate-pulse"
            style={{
              animation: "loading-progress 2s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes loading-progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
