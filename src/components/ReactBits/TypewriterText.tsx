/**
 * TypewriterText - Animated typewriter effect component
 * Single Responsibility: Display text with typewriter animation
 */

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // milliseconds per character
  delay?: number; // delay before starting animation
  loop?: boolean; // whether to loop the animation
  cursor?: boolean; // show blinking cursor
  className?: string;
  onComplete?: () => void; // callback when animation completes
}

export function TypewriterText({
  text,
  speed = 100,
  delay = 0,
  loop = false,
  cursor = true,
  className = '',
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (delay > 0 && !hasStarted) {
      const delayTimer = setTimeout(() => {
        setHasStarted(true);
      }, delay);
      return () => clearTimeout(delayTimer);
    } else if (delay === 0) {
      setHasStarted(true);
    }
  }, [delay, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    // Handle instant rendering for speed = 0
    if (speed === 0) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      // Don't set complete immediately for cursor to show
      setTimeout(() => {
        setIsComplete(true);
        onComplete?.();
      }, 0);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentIndex >= text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
      if (loop) {
        setTimeout(() => {
          setDisplayText('');
          setCurrentIndex(0);
          setIsComplete(false);
        }, 2000);
      }
    }
  }, [currentIndex, text, speed, loop, onComplete, hasStarted, isComplete]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (text.length === 0 || !isComplete) && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

export default TypewriterText;