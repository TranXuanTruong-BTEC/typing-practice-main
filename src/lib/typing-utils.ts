export interface TypingStats {
  wpm: number;
  accuracy: number;
  totalWords: number;
  correctWords: number;
  totalCharacters: number;
  correctCharacters: number;
  timeElapsed: number;
  errors: number;
}

export const calculateWPM = (correctWords: number, timeElapsed: number): number => {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60000; // Convert milliseconds to minutes
  return Math.round((correctWords / minutes) * 100) / 100;
};

export const calculateAccuracy = (correctCharacters: number, totalCharacters: number): number => {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 100);
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

export const countCharacters = (text: string): number => {
  return text.length;
};

export const compareTexts = (original: string, typed: string): {
  correctCharacters: number;
  totalCharacters: number;
  errors: number;
  correctWords: number;
  totalWords: number;
} => {
  const originalWords = original.trim().split(/\s+/);
  const typedWords = typed.trim().split(/\s+/);
  
  let correctCharacters = 0;
  const totalCharacters = original.length;
  let errors = 0;
  let correctWords = 0;
  
  // Compare character by character
  for (let i = 0; i < Math.min(original.length, typed.length); i++) {
    if (original[i] === typed[i]) {
      correctCharacters++;
    } else {
      errors++;
    }
  }
  
  // Add extra characters as errors
  if (typed.length > original.length) {
    errors += typed.length - original.length;
  }
  
  // Compare words
  for (let i = 0; i < Math.min(originalWords.length, typedWords.length); i++) {
    if (originalWords[i] === typedWords[i]) {
      correctWords++;
    }
  }
  
  return {
    correctCharacters,
    totalCharacters,
    errors,
    correctWords,
    totalWords: originalWords.length
  };
};

export const calculateStats = (
  originalText: string,
  typedText: string,
  timeElapsed: number
): TypingStats => {
  const comparison = compareTexts(originalText, typedText);
  
  return {
    wpm: calculateWPM(comparison.correctWords, timeElapsed),
    accuracy: calculateAccuracy(comparison.correctCharacters, comparison.totalCharacters),
    totalWords: comparison.totalWords,
    correctWords: comparison.correctWords,
    totalCharacters: comparison.totalCharacters,
    correctCharacters: comparison.correctCharacters,
    timeElapsed,
    errors: comparison.errors
  };
};

export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${remainingSeconds}s`;
};

export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getWPMColor = (wpm: number): string => {
  if (wpm >= 60) return 'text-green-600';
  if (wpm >= 40) return 'text-yellow-600';
  if (wpm >= 20) return 'text-orange-600';
  return 'text-red-600';
};

export const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 95) return 'text-green-600';
  if (accuracy >= 85) return 'text-yellow-600';
  if (accuracy >= 70) return 'text-orange-600';
  return 'text-red-600';
}; 