import React, { memo } from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";

const ErrorAlert = memo(({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const getErrorConfig = () => {
    switch (error.type) {
      case "auth":
        return {
          icon: AlertCircle,
          color: "feedbackwarning",
          showRetry: false,
        };
      case "server":
        return {
          icon: AlertCircle,
          color: "feedbackerror",
          showRetry: true,
        };
      default:
        return {
          icon: AlertCircle,
          color: "feedbackerror",
          showRetry: true,
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`mt-6 p-4 rounded-xl border border-${config.color}/40 bg-${config.color}/10 text-${config.color} flex items-center justify-between animate-fadeIn`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{error.message}</span>
      </div>
      <div className="flex items-center gap-2">
        {config.showRetry && onRetry && (
          <button
            onClick={onRetry}
            className={`rounded-lg p-2 hover:bg-${config.color}/20 transition-colors`}
            aria-label="Spróbuj ponownie"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`rounded-lg p-2 hover:bg-${config.color}/20 transition-colors`}
            aria-label="Zamknij"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
});

ErrorAlert.displayName = "ErrorAlert";

export default ErrorAlert;
