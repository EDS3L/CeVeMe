import { Mic, Square, Pause, Play, Trash2, Loader2 } from "lucide-react";
import { useVoiceRecording } from "../../hooks/useVoiceRecording";

export default function VoiceRecorder({ onTranscript, disabled = false }) {
  const {
    isRecording,
    isPaused,
    transcript,
    error,
    formattedDuration,
    volume,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useVoiceRecording();

  const handleStop = () => {
    stopRecording();
    if (transcript) {
      onTranscript(transcript);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-ivorydark)] shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-200"
                  : "bg-gradient-to-br from-[var(--color-bookcloth)] to-[var(--color-kraft)]"
              }`}
              style={{
                transform: isRecording
                  ? `scale(${1 + volume / 200})`
                  : "scale(1)",
              }}
            >
              <Mic
                className={`w-12 h-12 text-white ${
                  isRecording ? "animate-pulse" : ""
                }`}
              />
            </div>

            {isRecording && (
              <div className="absolute -inset-4 rounded-full border-4 border-red-300 animate-ping opacity-30" />
            )}
          </div>

          <div className="text-3xl font-bold text-[var(--color-slatedark)] mb-4 font-mono">
            {formattedDuration}
          </div>

          {isRecording && (
            <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-100"
                style={{ width: `${volume}%` }}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={disabled}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[var(--color-bookcloth)] to-[var(--color-kraft)] text-white hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Mic className="w-5 h-5" />
                Rozpocznij nagrywanie
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button
                    onClick={resumeRecording}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 transition-all"
                  >
                    <Play className="w-5 h-5" />
                    Wznów
                  </button>
                ) : (
                  <button
                    onClick={pauseRecording}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-all"
                  >
                    <Pause className="w-5 h-5" />
                    Pauza
                  </button>
                )}

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  <Square className="w-5 h-5" />
                  Zakończ
                </button>

                <button
                  onClick={resetRecording}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>

      {transcript && (
        <div className="border-t border-[var(--color-ivorydark)]">
          <div className="px-6 py-3 bg-[var(--color-ivorylight)]">
            <span className="text-sm font-medium text-[var(--color-clouddark)]">
              Transkrypcja na żywo:
            </span>
          </div>
          <div className="p-4 max-h-40 overflow-y-auto">
            <p className="text-[var(--color-slatedark)]">{transcript}</p>
          </div>
        </div>
      )}
    </div>
  );
}
