import { useState, useCallback, useRef, useEffect } from "react";

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const recognitionRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const initSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "pl-PL";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript((prev) => prev + finalTranscript);
      retryCountRef.current = 0; // Reset retry count on success
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);

      // Handle network errors with retry
      if (event.error === "network" || event.error === "aborted") {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(
            `Retrying speech recognition (${retryCountRef.current}/${maxRetries})...`,
          );
          setTimeout(() => {
            if (recognitionRef.current && isRecording && !isPaused) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Recognition might already be running
              }
            }
          }, 1000);
        } else {
          // After max retries, just continue without showing error
          // User can still type their answer
          console.log("Speech recognition unavailable, using text input");
        }
        return;
      }

      if (event.error !== "no-speech") {
        setError(
          `Błąd rozpoznawania mowy: ${event.error}. Możesz wpisać odpowiedź ręcznie.`,
        );
      }
    };

    recognition.onend = () => {
      // Auto-restart if still recording
      if (isRecording && !isPaused && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Recognition might already be running
        }
      }
    };

    return recognition;
  }, [isRecording, isPaused]);

  const analyzeVolume = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setVolume(Math.min(100, (average / 128) * 100));

    animationFrameRef.current = requestAnimationFrame(analyzeVolume);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      setAudioBlob(null);
      setAudioUrl(null);
      setTranscript("");
      setDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);

      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      analyzeVolume();

      const recognition = initSpeechRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      }
    } catch (err) {
      setError("Nie można uzyskać dostępu do mikrofonu");
      console.error(err);
    }
  }, [analyzeVolume, initSpeechRecognition]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      setVolume(0);
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  }, [isRecording, isPaused]);

  const resetRecording = useCallback(() => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript("");
    setDuration(0);
    setError(null);
    audioChunksRef.current = [];
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const formatDuration = useCallback((secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  }, []);

  return {
    isRecording,
    isPaused,
    audioBlob,
    audioUrl,
    transcript,
    isTranscribing,
    error,
    duration,
    formattedDuration: formatDuration(duration),
    volume,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    setTranscript,
  };
}
