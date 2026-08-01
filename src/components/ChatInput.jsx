import React, { useState, useRef } from 'react';
import { Mic, Paperclip, Send, X, AlertCircle } from 'lucide-react';
import QuickChips from './QuickChips';

export default function ChatInput({ inputVal, setInputVal, onSubmit }) {
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const handleChipSelect = (ingredient) => {
    setErrorMessage('');
    setInputVal((prev) => (prev ? `${prev}, ${ingredient}` : ingredient));
  };

  const recognitionRef = useRef(null);
  const inputValRef = useRef(inputVal);

  React.useEffect(() => {
    inputValRef.current = inputVal;
  }, [inputVal]);

  const handleVoiceInput = () => {
    setErrorMessage('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('🎤 Voice input is not supported in this browser.');
      setTimeout(() => setErrorMessage(''), 3500);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('🎤 Listening...');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0]?.transcript;
        if (transcript) {
          const current = inputValRef.current || '';
          const updated = current.trim() ? `${current.trim()} ${transcript.trim()}` : transcript.trim();
          setInputVal(updated);
          setErrorMessage('');
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        recognitionRef.current = null;
        if (event.error === 'not-allowed') {
          setErrorMessage('🎤 Microphone permission denied.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('🎤 No speech detected.');
        } else {
          setErrorMessage('🎤 Voice input error.');
        }
        setTimeout(() => setErrorMessage(''), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      recognitionRef.current = null;
      setErrorMessage('🎤 Could not start voice input.');
      setTimeout(() => setErrorMessage(''), 3500);
    }
  };

  const handleFileChange = (e) => {
    setErrorMessage('');
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage({ name: file.name, url: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!inputVal.trim() && !attachedImage) {
      setErrorMessage('Please enter at least one ingredient or attach a photo!');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setErrorMessage('');
    const query = attachedImage
      ? `[Photo attached: ${attachedImage.name}] ${inputVal || 'What can I cook with these ingredients?'}`
      : inputVal;

    setAttachedImage(null);
    onSubmit(query.trim());
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2.5 sm:p-4 md:p-6 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-slate-800/80 w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Error Toast alert */}
        {errorMessage && (
          <div className="mb-2 p-2.5 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/60 rounded-xl text-xs flex items-center justify-between fade-up shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage('')} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Attached Image Chip Preview */}
        {attachedImage && (
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs fade-up">
            <span className="font-semibold truncate max-w-[200px]">📷 {attachedImage.name}</span>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-md text-emerald-800 dark:text-emerald-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mobile-Optimized Input Form Container */}
        <form
          onSubmit={handleSubmitForm}
          className="w-full bg-white dark:bg-slate-800/90 rounded-2xl pl-2.5 pr-4 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2.5 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-slate-700/80 overflow-hidden box-border focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20"
        >
          {/* Voice Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-1.5 sm:p-2 rounded-xl transition-colors flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center ${
              isListening
                ? 'bg-red-100 text-red-600 animate-pulse dark:bg-red-900/60 dark:text-red-300'
                : 'hover:bg-emerald-50 dark:hover:bg-slate-700/60 text-emerald-500 dark:text-emerald-400'
            }`}
            aria-label="Voice input"
            title={isListening ? "Listening..." : "Click to speak ingredients"}
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Image Upload Button */}
          <label
            htmlFor="chat-file-input"
            className="p-1.5 sm:p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition-colors flex-shrink-0 cursor-pointer text-emerald-500 dark:text-emerald-400 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
            title="Attach food photo"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            <input
              id="chat-file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Text Input Field */}
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <input
            id="chat-input"
            type="text"
            value={inputVal}
            onChange={(e) => {
              setErrorMessage('');
              setInputVal(e.target.value);
            }}
            placeholder={isListening ? "Listening to your voice..." : "What ingredients do you have today?"}
            className="flex-1 min-w-0 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm md:text-base font-normal h-9 sm:h-10 px-1 truncate"
            autoComplete="off"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all flex-shrink-0 shadow-sm flex items-center justify-center self-center my-auto ml-1 hover:scale-105 active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
