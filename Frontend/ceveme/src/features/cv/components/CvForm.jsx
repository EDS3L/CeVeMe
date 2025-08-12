import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// LinkInput component
function LinkInput({ value, onChange, error }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-bookcloth to-kraft rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative">
        <label
          htmlFor="offer-link"
          className="block text-sm font-medium text-clouddark mb-2"
        >
          Link do oferty pracy
        </label>
        <div className="relative">
          <input
            id="offer-link"
            type="url"
            value={value}
            onChange={onChange}
            placeholder="https://example.com/job-offer"
            className={`w-full px-4 py-3 pl-12 bg-ivorylight/90 backdrop-blur-sm border-2 rounded-xl text-slatedark placeholder-clouddark transition-all duration-300 focus:outline-none focus:ring-0 ${
              error
                ? 'border-feedbackerror focus:border-feedbackerror'
                : 'border-cloudlight focus:border-feedbackfocus hover:border-cloudmedium'
            }`}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-6 h-6 bg-gradient-to-br from-bookcloth to-kraft rounded-lg flex items-center justify-center">
              <FileText className="w-3 h-3 text-basewhite" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading animation component
function LoadingAnimation() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analizuję ofertę pracy...',
    'Dostosowuję treść CV...',
    'Optymalizuję słowa kluczowe...',
    'Finalizuję dokument...',
  ];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 15));
    }, 200);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 py-8">
      {/* Animated AI Brain */}
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-bookcloth via-kraft to-manilla rounded-2xl flex items-center justify-center shadow-2xl">
          <Sparkles className="w-10 h-10 text-basewhite animate-pulse" />
        </div>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-bookcloth to-kraft rounded-full animate-ping"
            style={{
              top: `${Math.sin((i * 60 * Math.PI) / 180) * 40 + 40}px`,
              left: `${Math.cos((i * 60 * Math.PI) / 180) * 40 + 40}px`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="bg-cloudlight rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-bookcloth to-kraft rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Current step */}
      <div className="text-center">
        <p className="text-cloudmedium font-medium animate-pulse">
          {steps[currentStep]}
        </p>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-bookcloth rounded-full animate-bounce"
            style={{
              left: `${20 + i * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CvForm({
  offerLink,
  setOfferLink,
  onGenerate,
  loading,
  error,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivorymedium via-ivorylight to-ivorylight rounded-3xl opacity-50"></div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="relative space-y-8 w-full bg-ivorylight/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-basewhite/20"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-bookcloth to-kraft rounded-2xl shadow-lg mb-4">
            <FileText className="w-8 h-8 text-basewhite" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-bookcloth to-kraft bg-clip-text text-transparent">
            Generator CV
          </h2>
          <p className="text-cloudmedium">
            Stwórz idealne CV dopasowane do oferty pracy
          </p>
        </div>

        {loading ? (
          <LoadingAnimation />
        ) : (
          <>
            <LinkInput
              value={offerLink}
              onChange={(e) => setOfferLink(e.target.value)}
              error={error}
            />

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-feedbackerror/10 border border-feedbackerror/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-feedbackerror flex-shrink-0" />
                <p className="text-sm text-feedbackerror">{error}</p>
              </div>
            )}

            <button
              type="button"
              disabled={loading || !offerLink?.trim()}
              onClick={(e) => {
                e.preventDefault();
                onGenerate();
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative w-full py-4 bg-gradient-to-r from-bookcloth to-kraft text-basewhite font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-bookcloth/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-bookcloth to-manilla transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-2">
                <span>Generuj CV</span>
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovered ? 'translate-x-1' : ''
                  }`}
                />
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-basewhite/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </button>

            {/* Success message */}
            {!error && offerLink?.trim() && (
              <div className="flex items-center space-x-2 p-3 bg-bookcloth/10 border border-bookcloth/30 rounded-xl animate-fade-in">
                <CheckCircle className="w-5 h-5 text-bookcloth flex-shrink-0" />
                <p className="text-sm text-slatedark">
                  Link wygląda poprawnie - gotowe do generowania!
                </p>
              </div>
            )}
          </>
        )}

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-bookcloth to-kraft rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-kraft to-manilla rounded-full opacity-10 blur-3xl"></div>
      </form>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
