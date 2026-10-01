"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useEffectEvent, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  restartKey?: string | number;
  onComplete?: () => void;
  showCursor?: boolean;
  className?: string;
}

export default function TypewriterText({
  text,
  speed = 28,
  delay = 0,
  restartKey,
  onComplete,
  showCursor = true,
  className,
}: TypewriterTextProps) {
  const reduceMotion = useReducedMotion();
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const complete = useEffectEvent(() => onComplete?.());

  useEffect(() => {
    if (reduceMotion) {
      const completionTimer = window.setTimeout(() => {
        setVisibleCharacters(text.length);
        complete();
      }, 0);

      return () => window.clearTimeout(completionTimer);
    }

    let characterIndex = 0;
    let characterTimer = 0;

    const typeNextCharacter = () => {
      characterIndex += 1;
      setVisibleCharacters(characterIndex);

      if (characterIndex >= text.length) {
        complete();
        return;
      }

      characterTimer = window.setTimeout(typeNextCharacter, speed);
    };

    const delayTimer = window.setTimeout(() => {
      setVisibleCharacters(0);

      if (text.length === 0) {
        complete();
        return;
      }

      typeNextCharacter();
    }, delay);

    return () => {
      window.clearTimeout(delayTimer);
      window.clearTimeout(characterTimer);
    };
  }, [delay, reduceMotion, restartKey, speed, text]);

  return (
    <span className={`inline-grid ${className ?? ""}`} aria-label={text}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {text.slice(0, visibleCharacters)}
        {showCursor && (
          <span className="ml-0.5 inline-block animate-pulse text-emerald-300">
            _
          </span>
        )}
      </span>
    </span>
  );
}