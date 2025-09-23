import { useState } from 'react';
import { ANIMATION_DURATIONS } from '../config/constants';

export const useAnimation = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleMode = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Start the animation sequence
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_DURATIONS.NORMAL);
    }, ANIMATION_DURATIONS.NORMAL);
  };

  return {
    isSignUp,
    isAnimating,
    toggleMode
  };
};
